import SEOHead from '../components/SEO/SEOHead';
import Hero from '../components/home/Hero';
import ProblemSolution from '../components/home/Problemsolution';
import Services from '../components/home/services';
import HowItWorks from '../components/home/Howitworks';

const Home = () => {
  // Schema.org pour la page d'accueil
  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Accueil - TalentProof",
    "description": "Plateforme de recrutement tech en Belgique - Développeurs certifiés, TalentDays, tests techniques",
    "url": "https://talentproof.be",
    "mainEntity": {
      "@type": "Organization",
      "name": "TalentProof",
       "url": "https://talentproof.be",
      "logo": "https://talentproof.be/logo.png",
      "description": "Plateforme de recrutement tech qui connecte entreprises et développeurs certifiés en Belgique",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "BE",
        "addressRegion": "Wallonie"
      }
    }
  };

  return (
    <div>
      <SEOHead
        title="TalentProof - Recrutement Développeurs Certifiés Belgique | Wallonie & Bruxelles"
        description="Recrutez les meilleurs développeurs tech en Belgique avec TalentProof. TalentDays, portfolios validés, tests techniques certifiés. Solution de recrutement #1 en Wallonie et Bruxelles."
        keywords="recrutement développeur Belgique, talents tech Wallonie, développeur certifié Bruxelles, TalentDays Belgique, tests techniques développeurs, portfolio développeur validé, recrutement IT Belgique, plateforme recrutement tech"
        canonical="/"
        schema={homeSchema}
      />
      <Hero />
      <ProblemSolution />
      <Services />
      <HowItWorks />
    </div>
  );
};

export default Home;