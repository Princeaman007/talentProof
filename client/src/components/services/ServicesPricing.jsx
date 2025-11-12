import { Link } from 'react-router-dom';

const ServicesPricing = () => {
  const services = [
    {
      id: 1,
      nom: 'Site Vitrine',
      description: 'Site web professionnel pour présenter votre entreprise',
      icon: '🌐',
      prix: 'À partir de 2000€',
      duree: '2-4 semaines',
      features: [
        'Design moderne et responsive',
        'Jusqu\'à 5 pages',
        'Optimisation SEO basique',
        'Formulaire de contact',
        'Hébergement 1 an inclus',
        'Formation à la gestion'
      ],
      color: 'blue',
      popular: false
    },
    {
      id: 2,
      nom: 'Site E-commerce',
      description: 'Boutique en ligne complète pour vendre vos produits',
      icon: '🛒',
      prix: 'À partir de 5000€',
      duree: '6-8 semaines',
      features: [
        'Design personnalisé',
        'Gestion produits illimitée',
        'Paiement en ligne sécurisé',
        'Système de gestion des commandes',
        'Intégration livraison',
        'Tableau de bord analytics',
        'Support 3 mois'
      ],
      color: 'purple',
      popular: true
    },
    {
      id: 3,
      nom: 'Application Web',
      description: 'Plateforme web sur mesure pour votre activité',
      icon: '💻',
      prix: 'À partir de 8000€',
      duree: '8-12 semaines',
      features: [
        'Développement sur mesure',
        'Interface utilisateur avancée',
        'Base de données sécurisée',
        'API REST personnalisée',
        'Authentification utilisateurs',
        'Dashboard admin complet',
        'Support 6 mois'
      ],
      color: 'orange',
      popular: false
    },
    {
      id: 4,
      nom: 'Application Mobile',
      description: 'Application iOS et Android native ou hybride',
      icon: '📱',
      prix: 'À partir de 10000€',
      duree: '10-16 semaines',
      features: [
        'iOS et/ou Android',
        'Design UI/UX natif',
        'Intégration API',
        'Notifications push',
        'Mode hors ligne',
        'Publication sur stores',
        'Maintenance 6 mois'
      ],
      color: 'green',
      popular: false
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-800',
        button: 'bg-blue-600 hover:bg-blue-700',
        icon: 'bg-blue-100'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-800',
        button: 'bg-purple-600 hover:bg-purple-700',
        icon: 'bg-purple-100'
      },
      orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        text: 'text-orange-800',
        button: 'bg-orange-600 hover:bg-orange-700',
        icon: 'bg-orange-100'
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-800',
        button: 'bg-green-600 hover:bg-green-700',
        icon: 'bg-green-100'
      }
    };
    return colors[color] || colors.blue;
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Nos Services de Développement
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Des solutions web et mobile adaptées à vos besoins, développées par nos talents validés
          </p>
        </div>

        {/* Grille des services */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {services.map((service) => {
            const colors = getColorClasses(service.color);
            
            return (
              <div
                key={service.id}
                className={`relative bg-white rounded-xl shadow-lg overflow-hidden border-2 ${colors.border} hover:shadow-2xl transition-all duration-300 ${
                  service.popular ? 'transform scale-105' : ''
                }`}
              >
                {/* Badge "Plus populaire" */}
                {service.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-secondary to-orange-500 text-white px-4 py-1 text-sm font-semibold">
                    ⭐ Populaire
                  </div>
                )}

                <div className="p-6">
                  {/* Icon */}
                  <div className={`w-16 h-16 ${colors.icon} rounded-full flex items-center justify-center text-3xl mb-4`}>
                    {service.icon}
                  </div>

                  {/* Nom et description */}
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    {service.nom}
                  </h3>
                  <p className="text-slate-600 mb-4 text-sm">
                    {service.description}
                  </p>

                  {/* Prix */}
                  <div className="mb-4">
                    <p className={`text-2xl font-bold ${colors.text}`}>
                      {service.prix}
                    </p>
                    <p className="text-sm text-slate-500">
                      ⏱️ {service.duree}
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm text-slate-700">
                        <svg className="w-5 h-5 text-accent mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Bouton */}
                  <Link
                    to="/services/devis"
                    state={{ servicePreselect: service.nom }}
                    className={`block w-full text-center text-white py-3 rounded-lg font-semibold ${colors.button} transition-colors`}
                  >
                    Obtenir un devis
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section Technologies */}
        <div className={`bg-gradient-to-r from-primary to-blue-700 rounded-2xl p-8 text-white text-center`}>
          <h3 className="text-2xl font-bold mb-4">Technologies que nous maîtrisons</h3>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {['React', 'Node.js', 'MongoDB', 'Express', 'React Native', 'TypeScript', 'Next.js', 'Tailwind CSS', 'PostgreSQL', 'Firebase'].map((tech) => (
              <span key={tech} className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-medium">
                {tech}
              </span>
            ))}
          </div>
          <p className="text-lg opacity-90">
            Et bien d'autres technologies selon vos besoins !
          </p>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h3 className="text-3xl font-bold text-slate-900 mb-4">
            Projet sur mesure ?
          </h3>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Vous avez un projet spécifique qui ne correspond pas à nos offres ? 
            Contactez-nous pour un devis personnalisé !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/services/devis"
              className="bg-secondary text-white px-8 py-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Demander un devis
            </Link>
            <a
              href="mailto:info@princeaman.dev"
              className="bg-white border-2 border-primary text-primary px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Nous contacter
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesPricing;