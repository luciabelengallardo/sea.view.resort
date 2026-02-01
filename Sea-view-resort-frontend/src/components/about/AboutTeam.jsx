const team = [
  // Para agregar una imagen, añade la propiedad "photo" con una ruta válida
  // (por ejemplo, un archivo en public/team: "/team/elena.jpg").
  { name: 'Lucia Gallardo', photo: 'https://res.cloudinary.com/dokpk3c2l/image/upload/v1755713773/IMG-20250820-WA0299_bz1mve.jpg' },
  { name: 'Santiago Nieva Glembocki', photo: 'https://res.cloudinary.com/dokpk3c2l/image/upload/v1755713732/IMG-20250820-WA0301_rwuxyp.jpg' },
  { name: 'Nelson Juarez Rivas', photo: 'https://res.cloudinary.com/dokpk3c2l/image/upload/v1755713732/IMG-20250820-WA0296_h7adbl.jpg' },
  { name: 'Natividad Rodriguez', photo: 'https://res.cloudinary.com/dokpk3c2l/image/upload/v1755713767/20250820_151504_cq2grs.jpg' },
  { name: 'Jose Maria Perez', photo: 'https://res.cloudinary.com/dokpk3c2l/image/upload/v1755715508/IMG-20250820-WA0308_som6cv.jpg' }
];

function getFaceThumbUrl(url) {
  if (!url) return url;
  try {
    const marker = '/image/upload/';
    const idx = url.indexOf(marker);
    if (idx === -1) return url;
    const prefix = url.slice(0, idx + marker.length);
    const rest = url.slice(idx + marker.length);
    const transform = 'f_auto,q_auto:good,c_thumb,g_face,r_max,w_192,h_192';
    // Inserta la transformación antes del resto de la ruta (versión y nombre del archivo)
    return `${prefix}${transform}/${rest}`;
  } catch {
    return url;
  }
}

export default function AboutTeam() {
  return (
    <section className="bg-white py-12">
      <div className="container">
        <h2 className="text-2xl font-serif text-resort-olive mb-6">Nuestro equipo</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {team.map((member) => (
            <div key={member.name} className="text-center">
              <div className="w-28 h-28 mx-auto rounded-full overflow-hidden bg-resort-cream mb-3">
                {member.photo ? (
                  <img
                    src={getFaceThumbUrl(member.photo)}
                    alt={`Foto de ${member.name}`}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full" />
                )}
              </div>
              <div className="font-medium text-gray-900">{member.name}</div>
              {member.role && (
                <div className="text-sm text-resort-slate">{member.role}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


