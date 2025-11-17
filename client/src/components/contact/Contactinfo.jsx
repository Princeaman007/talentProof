import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const ContactInfo = () => {
  const contactDetails = [
    {
      icon: Mail,
      title: 'Email',
      value: 'info@princeaman.dev',
      link: 'mailto:info@princeaman.dev',
      color: 'text-primary',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Phone,
      title: 'Téléphone',
      value: '+32 467 62 08 78',
      link: 'tel:+32467620878',
      color: 'text-secondary',
      bgColor: 'bg-orange-50',
    },
    {
      icon: MapPin,
      title: 'Adresse',
      value: 'Avenue de lille 4 A52, 4020 Liège, Belgique',
      link: 'https://maps.google.com/?q=Avenue+de+lille+4+A52+4020+Liège+Belgique',
      color: 'text-accent',
      bgColor: 'bg-green-50',
    },
    {
      icon: Clock,
      title: 'Horaires',
      value: 'Lun - Ven : 9h00 - 18h00',
      link: null,
      color: 'text-neutral',
      bgColor: 'bg-gray-50',
    },
  ];

  // Section réseaux sociaux temporairement désactivée
  // Décommente et ajoute tes vrais liens quand tu veux l'activer
  /*
  const socialLinks = [
    {
      icon: Linkedin,
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/prince-aman',
      color: 'hover:text-blue-600',
    },
    {
      icon: Code,
      name: 'GitHub',
      url: 'https://github.com/princeaman',
      color: 'hover:text-gray-800',
    },
  ];
  */

  return (
    <div className="space-y-8">
      {/* Titre de section */}
      <div>
        <h2 className="text-3xl font-bold text-primary mb-3">
          Nos coordonnées
        </h2>
        <p className="text-neutral">
          Contactez-nous directement par téléphone, email ou visitez-nous à notre bureau à Liège.
        </p>
      </div>

      {/* Cards des coordonnées */}
      <div className="space-y-4">
        {contactDetails.map((detail, index) => {
          const Icon = detail.icon;
          const content = (
            <div className="flex items-start space-x-4 p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className={`${detail.bgColor} p-3 rounded-lg flex-shrink-0`}>
                <Icon className={`w-6 h-6 ${detail.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  {detail.title}
                </h3>
                <p className="text-gray-900 font-medium break-words">
                  {detail.value}
                </p>
              </div>
            </div>
          );

          return detail.link ? (
            <a
              key={index}
              href={detail.link}
              target={detail.title === 'Adresse' ? '_blank' : undefined}
              rel={detail.title === 'Adresse' ? 'noopener noreferrer' : undefined}
              className="block transform hover:scale-[1.02] transition-transform duration-200"
            >
              {content}
            </a>
          ) : (
            <div key={index}>
              {content}
            </div>
          );
        })}
      </div>

      {/* Carte Google Maps */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2528.8573985!2d5.567!3d50.633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTDCsDM3JzU4LjgiTiA1wrAzNCcwMS4yIkU!5e0!3m2!1sfr!2sbe!4v1234567890"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localisation TalentProof"
          ></iframe>
        </div>
      </div>

      {/* Section réseaux sociaux - Temporairement désactivée
      <div className="bg-gradient-to-br from-primary to-blue-700 rounded-xl shadow-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-4">Suivez-nous</h3>
        <p className="text-blue-100 mb-4">
          Restez connecté et découvrez nos dernières actualités sur les réseaux sociaux.
        </p>
        <div className="flex space-x-4">
          {socialLinks.map((social, index) => {
            const Icon = social.icon;
            return (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`bg-white/10 backdrop-blur-sm p-3 rounded-lg hover:bg-white/20 transition-all duration-200 ${social.color}`}
                title={social.name}
              >
                <Icon className="w-6 h-6" />
              </a>
            );
          })}
        </div>
      </div>
      */}

      {/* Box d'info supplémentaire */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-l-4 border-secondary rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          💡 Besoin d'aide ?
        </h3>
        <p className="text-gray-700 text-sm leading-relaxed">
          Notre équipe est disponible pour répondre à toutes vos questions concernant nos services, 
          notre catalogue de talents, ou pour discuter de votre projet. 
          N'hésitez pas à nous contacter par le moyen qui vous convient le mieux !
        </p>
      </div>
    </div>
  );
};

export default ContactInfo;