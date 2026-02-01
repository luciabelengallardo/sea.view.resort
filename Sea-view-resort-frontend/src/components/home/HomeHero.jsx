import SearchFilters from './SearchFilters.jsx';
import Hero from '../hero/Hero';

export default function HomeHero() {
    return (
        <Hero
            backgroundVideo="https://res.cloudinary.com/dokpk3c2l/video/upload/v1755464603/Dise%C3%B1o_sin_t%C3%ADtulo_tn9f4u.mp4"
            title="Sea View Resort"
            subtitle="Tu escape perfecto al paraíso costero"
        >
            <div className="mt-6 container mx-auto">
                <SearchFilters />
            </div>
        </Hero>
    );
}


