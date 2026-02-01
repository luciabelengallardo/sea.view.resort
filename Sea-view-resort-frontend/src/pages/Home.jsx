import HomeHero from '../components/home/HomeHero.jsx';
import Facilities from '../components/home/Facilities.jsx';
import RoomsShowcase from '../components/home/RoomsShowcase.jsx';
import Testimonials from '../components/home/Testimonials.jsx';

export default function Home() {
  return (
    <div className="bg-resort-cream">
      <HomeHero />

      <Facilities />
      <RoomsShowcase />
      <Testimonials />
    </div>
  );
}


