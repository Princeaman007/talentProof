import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { FaCheckCircle, FaUsers, FaRocket, FaLinkedin, FaEnvelope, FaUserPlus, FaChalkboardTeacher, FaCode, FaClipboardCheck, FaHandshake, FaArrowDown } from 'react-icons/fa';

const About = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const response = await api.get('/team');
      setTeam(response.data.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            À propos de TalentProof
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Nous révolutionnons le recrutement tech en Belgique grâce à des Talent Days
            innovants et une validation rigoureuse des compétences
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">Notre Mission</h2>
              <p className="text-neutral mb-4">
                TalentProof est né d'un constat simple : le recrutement tech traditionnel
                ne permet pas d'évaluer réellement les compétences des développeurs.
              </p>
              <p className="text-neutral mb-4">
                Notre mission est de <strong>connecter les meilleures entreprises belges
                avec les meilleurs talents tech</strong>, en garantissant un niveau de
                compétence validé et certifié.
              </p>
              <p className="text-neutral">
                Grâce à nos <strong>Talent Days</strong>, nous créons un pont entre les
                développeurs passionnés et les entreprises ambitieuses, avec une transparence
                totale sur les compétences réelles.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-secondary to-orange-600 rounded-xl shadow-2xl flex items-center justify-center">
                <FaRocket className="text-white text-8xl opacity-20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valeurs Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-primary text-center mb-12">
            Nos Valeurs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Excellence</h3>
              <p className="text-neutral">
                Processus de sélection exigeant : chaque talent est rigoureusement évalué via des tests techniques en conditions réelles avant certification.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-secondary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers size={32} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Transparence</h3>
              <p className="text-neutral">
                Chaque talent dispose d'un profil détaillé avec ses technologies,
                compétences et scores réels.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <FaRocket size={32} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Innovation</h3>
              <p className="text-neutral">
                Nos Talent Days révolutionnent le recrutement en créant des expériences
                immersives et authentiques.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Processus Talent Days */}
      <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">
              Comment fonctionnent nos Talent Days ?
            </h2>
            <p className="text-lg text-neutral max-w-2xl mx-auto">
              Un processus complet et transparent en 5 étapes pour connecter talents et entreprises
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Étape 1 */}
            <div className="relative">
              <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-2xl shadow-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                      <FaUserPlus className="text-white text-3xl" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      1
                    </div>
                  </div>
                </div>
                <div className="flex-1 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border-l-4 border-primary">
                  <h3 className="text-2xl font-bold text-primary mb-3">Inscription</h3>
                  <p className="text-neutral leading-relaxed">
                    Talents et entreprises s'inscrivent en ligne pour participer à l'événement. <span className="font-semibold text-secondary">Aucune pré-sélection</span>, tous les développeurs motivés sont les bienvenus.
                  </p>
                </div>
              </div>
              <div className="flex justify-center mb-8">
                <FaArrowDown className="text-primary text-3xl animate-bounce" />
              </div>
            </div>

            {/* Étape 2 */}
            <div className="relative">
              <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-secondary to-accent rounded-2xl shadow-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                      <FaChalkboardTeacher className="text-white text-3xl" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      2
                    </div>
                  </div>
                </div>
                <div className="flex-1 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border-l-4 border-secondary">
                  <h3 className="text-2xl font-bold text-primary mb-3">Présentation des besoins</h3>
                  <p className="text-neutral leading-relaxed">
                    Le jour J, les entreprises présentent leur structure, leur culture et définissent précisément leurs <span className="font-semibold text-secondary">besoins techniques</span> (technologies, frameworks, compétences spécifiques).
                  </p>
                </div>
              </div>
              <div className="flex justify-center mb-8">
                <FaArrowDown className="text-secondary text-3xl animate-bounce" />
              </div>
            </div>

            {/* Étape 3 */}
            <div className="relative">
              <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-accent to-secondary rounded-2xl shadow-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                      <FaCode className="text-white text-3xl" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      3
                    </div>
                  </div>
                </div>
                <div className="flex-1 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border-l-4 border-accent">
                  <h3 className="text-2xl font-bold text-primary mb-3">Tests personnalisés en direct</h3>
                  <p className="text-neutral leading-relaxed">
                    Les talents passent des <span className="font-semibold text-secondary">tests techniques adaptés</span> aux besoins exprimés par les entreprises, évaluant leurs compétences en conditions réelles.
                  </p>
                </div>
              </div>
              <div className="flex justify-center mb-8">
                <FaArrowDown className="text-accent text-3xl animate-bounce" />
              </div>
            </div>

            {/* Étape 4 */}
            <div className="relative">
              <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-dark to-primary rounded-2xl shadow-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                      <FaClipboardCheck className="text-white text-3xl" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      4
                    </div>
                  </div>
                </div>
                <div className="flex-1 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border-l-4 border-primary-dark">
                  <h3 className="text-2xl font-bold text-primary mb-3">Résultats instantanés</h3>
                  <p className="text-neutral leading-relaxed">
                    Dès la fin des tests, les entreprises accèdent <span className="font-semibold text-secondary">immédiatement aux résultats</span> personnalisés et identifient les profils qui correspondent exactement à leurs attentes.
                  </p>
                </div>
              </div>
              <div className="flex justify-center mb-8">
                <FaArrowDown className="text-primary-dark text-3xl animate-bounce" />
              </div>
            </div>

            {/* Étape 5 */}
            <div className="relative">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-secondary to-primary rounded-2xl shadow-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                      <FaHandshake className="text-white text-3xl" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      5
                    </div>
                  </div>
                </div>
                <div className="flex-1 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border-l-4 border-secondary">
                  <h3 className="text-2xl font-bold text-primary mb-3">Entretiens sur place</h3>
                  <p className="text-neutral leading-relaxed">
                    Les entreprises invitent directement les talents qualifiés pour des entretiens <span className="font-semibold text-secondary">le jour même</span>, favorisant un matching rapide et efficace.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to action */}
          <div className="text-center mt-16">
            <div className="inline-block bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 shadow-2xl">
              <p className="text-white text-xl font-semibold mb-4">
                Prêt à participer à notre prochain Talent Day ?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/talent-days" className="bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors duration-300">
                  Découvrir les Talent Days
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-primary text-center mb-12">
            Notre Équipe
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
              <p className="text-neutral mt-4">Chargement de l'équipe...</p>
            </div>
          ) : team.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-neutral">
                Notre équipe sera bientôt présentée ici.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member) => (
                <div
                  key={member._id}
                  className="card hover:shadow-xl transition-shadow"
                >
                  {/* Avatar */}
                  <div className="flex justify-center mb-4">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-4xl font-bold">
                      {member.nom.charAt(0)}{member.prenom.charAt(0)}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-primary">
                      {member.prenom} {member.nom}
                    </h3>
                    <p className="text-secondary font-medium mt-1">{member.poste}</p>
                  </div>

                  {/* Bio */}
                  <p className="text-neutral text-sm mb-4 text-center">
                    {member.bio}
                  </p>

                  {/* Social Links */}
                  <div className="flex justify-center gap-3 pt-4 border-t border-gray-200">
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                        title="Email"
                      >
                        <FaEnvelope size={18} />
                      </a>
                    )}
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                        title="LinkedIn"
                      >
                        <FaLinkedin size={18} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à recruter les meilleurs talents ?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Rejoignez les entreprises qui font confiance à TalentProof pour leurs
            recrutements tech
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register" className="btn-secondary">
              Créer un compte entreprise
            </a>
            <a
              href="dashboard/talents"
              className="px-8 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Découvrir les talents
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;