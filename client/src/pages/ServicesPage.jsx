import ServicesPricing from '../components/services/ServicesPricing';
import PortfolioSection from '../components/services/PortfolioSection';

const ServicesPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Nos Services de Développement
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
            Des solutions web et mobile développées par nos talents tech validés
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#services"
              className="bg-secondary text-white px-8 py-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors inline-block"
            >
              Découvrir nos services
            </a>
            <a
              href="#portfolio"
              className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-colors inline-block border border-white/30"
            >
              Voir le portfolio
            </a>
          </div>
        </div>
      </section>

      {/* Section Services avec Pricing */}
      <div id="services">
        <ServicesPricing />
      </div>

      {/* Section Portfolio */}
      <div id="portfolio">
        <PortfolioSection />
      </div>

      {/* Section CTA Final */}
      <section className="py-20 bg-gradient-to-br from-primary to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Prêt à Démarrer Votre Projet ?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Nos talents validés sont prêts à transformer vos idées en réalité. 
            Demandez votre devis personnalisé dès maintenant !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/services/devis"
              className="bg-secondary text-white px-8 py-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors inline-block"
            >
              Demander un Devis Gratuit
            </a>
            <a
              href="mailto:info@princeaman.dev"
              className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-colors inline-block border border-white/30"
            >
              Nous Contacter
            </a>
          </div>

          {/* Stats rapides */}
          <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-4xl font-bold text-accent mb-2">100%</div>
              <div className="text-blue-100">Satisfaction Client</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-4xl font-bold text-accent mb-2">24-48h</div>
              <div className="text-blue-100">Délai de Réponse</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-4xl font-bold text-accent mb-2">Support</div>
              <div className="text-blue-100">Inclus</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Processus */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Comment Ça Marche ?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Un processus simple et transparent pour votre projet
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Étape 1 */}
            <div className="text-center">
              <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Demande de Devis
              </h3>
              <p className="text-slate-600">
                Remplissez notre formulaire en quelques minutes
              </p>
            </div>

            {/* Étape 2 */}
            <div className="text-center">
              <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Analyse & Devis
              </h3>
              <p className="text-slate-600">
                Nous analysons votre besoin et vous envoyons un devis détaillé
              </p>
            </div>

            {/* Étape 3 */}
            <div className="text-center">
              <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Développement
              </h3>
              <p className="text-slate-600">
                Nos talents validés travaillent sur votre projet
              </p>
            </div>

            {/* Étape 4 */}
            <div className="text-center">
              <div className="bg-accent text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Livraison & Support
              </h3>
              <p className="text-slate-600">
                Livraison de votre projet avec support inclus
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Pourquoi Nous Choisir */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Pourquoi Choisir TalentProof ?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Des développeurs validés, des projets de qualité
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Avantage 1 */}
            <div className="bg-blue-50 rounded-xl p-8 border-2 border-blue-100">
              <div className="text-4xl mb-4"></div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Talents Validés
              </h3>
              <p className="text-slate-600">
                Tous nos développeurs ont été testés et validés lors de "Talent Days" en conditions réelles
              </p>
            </div>

            {/* Avantage 2 */}
            <div className="bg-orange-50 rounded-xl p-8 border-2 border-orange-100">
              <div className="text-4xl mb-4"></div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Qualité Garantie
              </h3>
              <p className="text-slate-600">
                Code propre, bonnes pratiques, tests inclus. Nous livrons du code de qualité professionnelle
              </p>
            </div>

            {/* Avantage 3 */}
            <div className="bg-green-50 rounded-xl p-8 border-2 border-green-100">
              <div className="text-4xl mb-4"></div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Support Inclus
              </h3>
              <p className="text-slate-600">
                Support et maintenance inclus pour tous nos projets. Nous restons à vos côtés après la livraison
              </p>
            </div>

            {/* Avantage 4 */}
            <div className="bg-purple-50 rounded-xl p-8 border-2 border-purple-100">
              <div className="text-4xl mb-4"></div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Tarifs Transparents
              </h3>
              <p className="text-slate-600">
                Pas de frais cachés. Devis détaillé et transparent dès le départ
              </p>
            </div>

            {/* Avantage 5 */}
            <div className="bg-pink-50 rounded-xl p-8 border-2 border-pink-100">
              <div className="text-4xl mb-4"></div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Livraison Rapide
              </h3>
              <p className="text-slate-600">
                Délais respectés et livraison rapide. Nous valorisons votre temps
              </p>
            </div>

            {/* Avantage 6 */}
            <div className="bg-cyan-50 rounded-xl p-8 border-2 border-cyan-100">
              <div className="text-4xl mb-4"></div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Approche Sur Mesure
              </h3>
              <p className="text-slate-600">
                Chaque projet est unique. Nous adaptons nos solutions à vos besoins spécifiques
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Questions Fréquentes
            </h2>
            <p className="text-xl text-slate-600">
              Vous avez des questions ? Nous avons les réponses
            </p>
          </div>

          <div className="space-y-6">
            <details className="bg-white rounded-lg p-6 shadow-md">
              <summary className="font-bold text-lg text-slate-900 cursor-pointer">
                Quels sont vos délais de livraison ?
              </summary>
              <p className="mt-4 text-slate-600">
                Les délais varient selon le type de projet : 2-4 semaines pour un site vitrine, 
                6-8 semaines pour un e-commerce, et 8-16 semaines pour une application complète. 
                Nous fournissons un planning détaillé dans notre devis.
              </p>
            </details>

            <details className="bg-white rounded-lg p-6 shadow-md">
              <summary className="font-bold text-lg text-slate-900 cursor-pointer">
                Proposez-vous un support après la livraison ?
              </summary>
              <p className="mt-4 text-slate-600">
                Oui ! Tous nos projets incluent une période de support et de maintenance. 
                La durée varie selon le forfait choisi (de 3 à 6 mois inclus).
              </p>
            </details>

            <details className="bg-white rounded-lg p-6 shadow-md">
              <summary className="font-bold text-lg text-slate-900 cursor-pointer">
                Comment se déroule le paiement ?
              </summary>
              <p className="mt-4 text-slate-600">
                Le paiement se fait généralement en 3 fois : 30% à la signature, 40% à mi-parcours, 
                et 30% à la livraison finale. Nous sommes flexibles et pouvons adapter selon vos besoins.
              </p>
            </details>

            <details className="bg-white rounded-lg p-6 shadow-md">
              <summary className="font-bold text-lg text-slate-900 cursor-pointer">
                Puis-je voir des exemples de vos réalisations ?
              </summary>
              <p className="mt-4 text-slate-600">
                Absolument ! Consultez notre section Portfolio ci-dessus pour découvrir nos projets récents. 
                Nous pouvons également vous fournir des références clients sur demande.
              </p>
            </details>

            <details className="bg-white rounded-lg p-6 shadow-md">
              <summary className="font-bold text-lg text-slate-900 cursor-pointer">
                Que se passe-t-il si je ne suis pas satisfait ?
              </summary>
              <p className="mt-4 text-slate-600">
                Votre satisfaction est notre priorité. Nous effectuons des points réguliers tout au long 
                du projet et apportons les modifications nécessaires. Nous ne considérons un projet terminé 
                que lorsque vous êtes 100% satisfait.
              </p>
            </details>

            <details className="bg-white rounded-lg p-6 shadow-md">
              <summary className="font-bold text-lg text-slate-900 cursor-pointer">
                Travaillez-vous avec des clients internationaux ?
              </summary>
              <p className="mt-4 text-slate-600">
                Oui ! Bien que nous soyons basés en Belgique, nous travaillons avec des clients partout 
                en Europe et dans le monde. Nous communiquons en français et en anglais.
              </p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;