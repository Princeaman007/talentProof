import ContactForm from '../components/contact/Contactform';
import ContactInfo from '../components/contact/Contactinfo';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Contactez-nous
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Une question ? Un projet ? Nous sommes là pour vous accompagner. 
              Remplissez le formulaire ci-dessous ou contactez-nous directement.
            </p>
          </div>
        </div>
      </section>

      {/* Section principale avec formulaire et infos */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Formulaire de contact (3/5 de l'espace) */}
            <div className="lg:col-span-3">
              <ContactForm />
            </div>

            {/* Informations de contact (2/5 de l'espace) */}
            <div className="lg:col-span-2">
              <ContactInfo />
            </div>
          </div>
        </div>
      </section>

      {/* Section FAQ rapide (optionnelle) */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-primary mb-12">
              Questions fréquentes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* FAQ Item 1 */}
              <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Quel est le délai de réponse ?
                </h3>
                <p className="text-gray-600 text-sm">
                  Nous nous engageons à vous répondre dans les 24 à 48 heures ouvrables.
                </p>
              </div>

              {/* FAQ Item 2 */}
              <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Comment recruter un talent ?
                </h3>
                <p className="text-gray-600 text-sm">
                  Parcourez notre catalogue de talents et cliquez sur "En savoir plus" pour nous contacter.
                </p>
              </div>

              {/* FAQ Item 3 */}
              <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Proposez-vous des devis gratuits ?
                </h3>
                <p className="text-gray-600 text-sm">
                  Oui ! Contactez-nous avec les détails de votre projet pour recevoir un devis personnalisé.
                </p>
              </div>

              {/* FAQ Item 4 */}
              <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Où êtes-vous situés ?
                </h3>
                <p className="text-gray-600 text-sm">
                  Nous sommes basés à Liège, Belgique, mais nous travaillons avec des clients partout en Europe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-secondary to-orange-600">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Prêt à démarrer votre projet ?
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              Parlons de vos besoins et trouvons ensemble la meilleure solution pour votre entreprise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/talents"
                className="bg-white text-secondary font-semibold px-8 py-4 rounded-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Voir nos talents
              </a>
              <a
                href="/services"
                className="bg-white/10 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-lg border-2 border-white hover:bg-white hover:text-secondary transition-all duration-200"
              >
                Découvrir nos services
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;