import ContactHero from '../components/contact/ContactHero.jsx';
import ContactForm from '../components/contact/ContactForm.jsx';
import ContactMap from '../components/contact/ContactMap.jsx';

export default function Contact() {
  return (
    <div className="bg-white">
      <ContactHero />
      <ContactForm />
      <ContactMap />
    </div>
  );
}


