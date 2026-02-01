export default function Hero({
    backgroundImage,
    backgroundVideo,
    overlay = 'bg-black/35',
    title,
    subtitle,
    children,
    className = '',
    titleClassName = 'font-serif'
}) {
    return (
        <section className={`relative hero-standard w-full h-[80vh] flex items-center justify-center overflow-hidden ${className}`}>
            {backgroundVideo ? (
                <video
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    src={backgroundVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                />
            ) : (
                <div
                    className="absolute inset-0 bg-center bg-cover"
                    style={{ backgroundImage: backgroundImage ? `url('${backgroundImage}')` : undefined }}
                />
            )}

            {overlay && <div className={`absolute inset-0 ${overlay}`} />}

            <div className="relative z-10 text-center px-4">
                {title && (
                    <h1 className={`text-white text-4xl md:text-5xl mb-4 ${titleClassName}`}>{title}</h1>
                )}
                {subtitle && (
                    <p className="max-w-2xl mx-auto text-resort-cream/90 text-sm md:text-base leading-relaxed">{subtitle}</p>
                )}
                {children}
            </div>
        </section>
    );
}


