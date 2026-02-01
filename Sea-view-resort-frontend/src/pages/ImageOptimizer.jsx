import { useEffect, useMemo, useRef, useState } from 'react';

export default function ImageOptimizer() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [quality, setQuality] = useState(80); // 1-100
  const [results, setResults] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const previousObjectUrlsRef = useRef([]);

  const jpegOnlyFiles = useMemo(() => {
    return selectedFiles.filter((file) => /jpe?g$/i.test(file.name));
  }, [selectedFiles]);

  useEffect(() => {
    return () => {
      // Cleanup object URLs when unmounting
      previousObjectUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
      previousObjectUrlsRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (jpegOnlyFiles.length === 0) {
      setResults([]);
      return;
    }

    let isCancelled = false;
    const run = async () => {
      setIsProcessing(true);
      // cleanup previous urls
      previousObjectUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
      previousObjectUrlsRef.current = [];

      const newResults = [];
      for (const file of jpegOnlyFiles) {
        try {
          const conversion = await convertJpegToWebp(file, quality);
          if (isCancelled) return;
          previousObjectUrlsRef.current.push(conversion.webpUrl);
          newResults.push(conversion);
        } catch (error) {
          newResults.push({
            name: file.name,
            originalSize: file.size,
            error: error?.message || 'Error al convertir',
          });
        }
      }
      if (!isCancelled) setResults(newResults);
      setIsProcessing(false);
    };
    run();

    return () => {
      isCancelled = true;
    };
  }, [jpegOnlyFiles, quality]);

  function onSelectFiles(ev) {
    const files = Array.from(ev.target.files || []);
    setSelectedFiles(files);
  }

  async function handleDownloadAll() {
    if (!results || results.length === 0) return;
    // Fallback sin dependencias: disparar múltiples descargas .webp
    for (const res of results) {
      if (!res.webpUrl) continue;
      const a = document.createElement('a');
      a.href = res.webpUrl;
      a.download = toWebpName(res.name);
      document.body.appendChild(a);
      a.click();
      a.remove();
      // pequeña espera para evitar que el navegador bloquee múltiples descargas
      await new Promise((r) => setTimeout(r, 50));
    }
  }

  return (
    <div className="bg-resort-cream">
      <section className="section-standard bg-resort-cream py-10 md:py-12">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-resort-olive text-center mb-6">Optimizar imágenes (JPG → WebP)</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-center mb-10">
            Sube una o varias imágenes JPG y ajusta la calidad para comprimir más o menos el archivo. La conversión ocurre en tu navegador, no se suben archivos a ningún servidor.
          </p>
          <div className="mx-auto max-w-3xl bg-white rounded-xl shadow p-6 text-left">
            <div className="grid gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar imágenes JPG</label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg"
                  multiple
                  onChange={onSelectFiles}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-resort-olive file:text-white hover:file:bg-green-800 cursor-pointer"
                />
                {selectedFiles.length > 0 && (
                  <p className="mt-2 text-xs text-gray-500">{selectedFiles.length} archivo(s) seleccionado(s)</p>
                )}
              </div>

              <div>
                <label htmlFor="quality" className="block text-sm font-medium text-gray-700 mb-2">
                  Calidad WebP: {quality}
                </label>
                <input
                  id="quality"
                  type="range"
                  min={1}
                  max={100}
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Más compresión</span>
                  <span>Más calidad</span>
                </div>
              </div>

              {isProcessing && (
                <div className="text-sm text-gray-600">Convirtiendo imágenes…</div>
              )}

              {results.length > 0 && (
                <div>
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <h2 className="text-lg font-semibold text-gray-800">Resultados</h2>
                    <button
                      onClick={handleDownloadAll}
                      className="inline-flex items-center px-4 py-2 rounded-md bg-resort-olive text-white text-sm hover:bg-green-800 disabled:opacity-60"
                      disabled={!results.some((r) => r.webpUrl) || isProcessing}
                    >
                      Descargar todo
                    </button>
                  </div>
                  <ul className="grid md:grid-cols-2 gap-6">
                    {results.map((res) => (
                      <li key={res.name} className="border rounded-lg p-4">
                        <div className="mb-3">
                          <p className="font-medium text-gray-800 break-all">{res.name}</p>
                          <p className="text-xs text-gray-500">Original: {formatBytes(res.originalSize)}</p>
                          {res.webpSize != null && (
                            <p className="text-xs text-gray-500">WebP: {formatBytes(res.webpSize)} ({computeSaving(res.originalSize, res.webpSize)})</p>
                          )}
                        </div>
                        {res.error ? (
                          <p className="text-sm text-red-600">{res.error}</p>
                        ) : (
                          res.webpUrl && (
                            <img src={res.webpUrl} alt={res.name} className="w-full h-40 object-contain bg-gray-50 rounded" />
                          )
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function toWebpName(filename) {
  const idx = filename.lastIndexOf('.');
  if (idx === -1) return filename + '.webp';
  return filename.slice(0, idx) + '.webp';
}

function formatBytes(bytes) {
  if (bytes === 0 || bytes == null) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

function computeSaving(original, webp) {
  if (!original || !webp) return '';
  const delta = original - webp;
  const pct = (delta / original) * 100;
  return `↓ ${(pct).toFixed(1)}%`;
}

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ img, url });
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('No se pudo cargar la imagen'));
    };
    img.src = url;
  });
}

async function convertJpegToWebp(file, quality) {
  if (!/jpe?g$/i.test(file.name)) {
    throw new Error('Solo se admiten archivos JPG para convertir');
  }
  const q = Math.min(100, Math.max(1, quality)) / 100; // 0-1
  const { img, url } = await loadImageFromFile(file);
  try {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const webpBlob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('Conversión a WebP no soportada'))),
        'image/webp',
        q
      );
    });
    const webpUrl = URL.createObjectURL(webpBlob);
    return {
      name: file.name,
      originalSize: file.size,
      webpBlob,
      webpUrl,
      webpSize: webpBlob.size,
    };
  } finally {
    URL.revokeObjectURL(url);
  }
}



