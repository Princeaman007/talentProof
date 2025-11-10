import { FaUserPlus, FaClipboardCheck, FaGraduationCap, FaHandshake, FaEuroSign } from 'react-icons/fa';

const HowItWorks = () => {
  const steps = [
    {
      icon: <FaUserPlus />,
      title: 'Recrutement',
      description: 'Appel à candidatures pour juniors et freelances tech',
      number: '01',
    },
    {
      icon: <FaClipboardCheck />,
      title: 'Sélection',
      description: 'Tests pratiques lors de Talent Days sans IA',
      number: '02',
    },
    {
      icon: <FaGraduationCap />,
      title: 'Formation',
      description: 'Collaboration avec Forem / Technifutur pour le perfectionnement',
      number: '03',
    },
    {
      icon: <FaHandshake />,
      title: 'Mise en relation',
      description: 'Plateforme avec profils testés et validés pour les entreprises',
      number: '04',
    },
    {
      icon: <FaEuroSign />,
      title: 'Rémunération',
      description: 'Commission sur contrat ou abonnement entreprise',
      number: '05',
    },
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">Comment ça marche ?</h2>
          <p className="text-lg text-neutral max-w-2xl mx-auto">
            Notre processus en 5 étapes pour garantir la qualité des talents
          </p>
        </div>
        
        {/* Timeline */}
        <div className="relative">
          {/* Ligne de connexion - Desktop uniquement */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent" 
               style={{ width: 'calc(100% - 8rem)', marginLeft: '4rem' }}>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center space-y-4">
                {/* Numéro */}
                <div className="text-6xl font-bold text-gray-200">
                  {step.number}
                </div>
                
                {/* Icône */}
                <div className="bg-gradient-to-br from-primary to-secondary text-white p-6 rounded-full text-3xl shadow-lg transform hover:scale-110 transition-all">
                  {step.icon}
                </div>
                
                {/* Titre */}
                <h3 className="text-xl font-bold text-primary">
                  {step.title}
                </h3>
                
                {/* Description */}
                <p className="text-neutral text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-br from-primary to-primary-dark text-white p-8 rounded-2xl shadow-xl">
            <h3 className="text-2xl font-bold mb-4">Prêt à trouver votre prochain talent ?</h3>
            <p className="mb-6 text-gray-200">
              Rejoignez les entreprises qui font confiance à TalentProof
            </p>
            <button className="btn-secondary">
              Créer un compte entreprise
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;