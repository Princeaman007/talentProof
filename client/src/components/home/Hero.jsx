import { Link } from 'react-router-dom';
import { FaCheckCircle, FaRocket, FaUsers } from 'react-icons/fa';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary via-primary-dark to-primary text-white section-padding pt-32 overflow-hidden">
      {/* Cercles décoratifs en arrière-plan */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Contenu textuel */}
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <FaCheckCircle className="text-accent" />
              <span className="text-sm font-semibold">Label de confiance tech</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
              Connectez-vous aux
              <span className="text-secondary"> meilleurs talents tech</span> juniors
            </h1>
            
            <p className="text-lg md:text-xl text-gray-200">
              TalentProof détecte, évalue et valorise les jeunes développeurs via des tests en conditions réelles. 
              Accédez à des profils testés, motivés et prêts à rejoindre votre équipe.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/talents" className="btn-secondary">
                <span className="flex items-center justify-center space-x-2">
                  <FaUsers />
                  <span>Découvrir les talents</span>
                </span>
              </Link>
              
              <Link to="/services" className="btn-outline bg-white text-primary border-white hover:bg-gray-100">
                <span className="flex items-center justify-center space-x-2">
                  <FaRocket />
                  <span>Nos services</span>
                </span>
              </Link>
            </div>
            
            {/* Statistiques */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-secondary">50+</div>
                <div className="text-sm text-gray-300">Talents validés</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-accent">95%</div>
                <div className="text-sm text-gray-300">Taux de succès</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-secondary">20+</div>
                <div className="text-sm text-gray-300">Entreprises partenaires</div>
              </div>
            </div>
          </div>
          
          {/* Image/Illustration */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
              <div className="aspect-square bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center">
                <div className="text-center space-y-4">
                  <FaCheckCircle className="text-white text-8xl mx-auto animate-pulse" />
                  <p className="text-white text-xl font-bold">Talents Certifiés</p>
                  <p className="text-white/80">Tests en conditions réelles</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;