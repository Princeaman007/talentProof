import { Link } from 'react-router-dom';
import { FaUsers, FaCode, FaMobile, FaShoppingCart, FaLaptopCode } from 'react-icons/fa';

const Services = () => {
  const services = [
    {
      icon: <FaUsers className="text-4xl" />,
      title: 'Recrutement de Talents',
      description: 'Accédez à une base de talents tech juniors testés et validés en conditions réelles.',
      color: 'from-primary to-primary-dark',
      link: '/talents',
    },
    {
      icon: <FaLaptopCode className="text-4xl" />,
      title: 'Sites Vitrine',
      description: 'Création de sites web modernes et responsives pour présenter votre activité.',
      color: 'from-secondary to-orange-600',
      link: '/services',
    },
    {
      icon: <FaShoppingCart className="text-4xl" />,
      title: 'E-commerce',
      description: 'Développement de boutiques en ligne complètes avec système de paiement intégré.',
      color: 'from-accent to-green-600',
      link: '/services',
    },
    {
      icon: <FaMobile className="text-4xl" />,
      title: 'Applications Mobiles',
      description: 'Applications iOS et Android natives ou cross-platform pour votre entreprise.',
      color: 'from-purple-600 to-pink-600',
      link: '/services',
    },
  ];

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-4">Nos Services</h2>
          <p className="text-lg text-neutral max-w-2xl mx-auto">
            TalentProof vous accompagne dans vos projets de recrutement et de développement digital
          </p>
        </div>
        
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Link
              key={index}
              to={service.link}
              className="group"
            >
              <div className="card h-full flex flex-col items-center text-center space-y-4 group-hover:scale-105 transition-transform">
                <div className={`bg-gradient-to-br ${service.color} text-white p-6 rounded-full`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-primary group-hover:text-secondary transition-colors">
                  {service.title}
                </h3>
                <p className="text-neutral flex-grow">
                  {service.description}
                </p>
                <span className="text-secondary font-semibold flex items-center space-x-2">
                  <span>En savoir plus</span>
                  <span className="group-hover:translate-x-2 transition-transform">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
        
        {/* CTA */}
        <div className="text-center mt-12">
          <Link to="/services" className="btn-primary inline-block">
            Découvrir tous nos services
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;