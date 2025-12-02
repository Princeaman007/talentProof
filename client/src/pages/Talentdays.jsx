import { useState, useEffect } from 'react';
import TalentDayCard from '../components/talentday/TalentDayCard';
import { Calendar, Users, Award, TrendingUp, Filter, UserCheck, Building2, Coffee, ClipboardCheck, Briefcase } from 'lucide-react';
import talentDayService from '../services/talentDayService';

const TalentDays = () => {
  const [talentDays, setTalentDays] = useState([]);
  const [filteredTalentDays, setFilteredTalentDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming'); // upcoming, all, past
  const [filters, setFilters] = useState({
    technologies: [], // Changé en tableau pour sélection multiple
    type: '',
  });

  // Récupérer les statistiques
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await talentDayService.getStatsGeneral();
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error('Erreur récupération stats:', error);
      }
    };
    fetchStats();
  }, []);

  // Récupérer les TalentDays selon l'onglet actif
  useEffect(() => {
    const fetchTalentDays = async () => {
      setLoading(true);
      try {
        let response;
        
        if (activeTab === 'upcoming') {
          response = await talentDayService.getUpcomingTalentDays();
        } else if (activeTab === 'past') {
          response = await talentDayService.getPastTalentDays();
        } else {
          response = await talentDayService.getAllTalentDays();
        }

        if (response.data.success) {
          setTalentDays(response.data.data);
          setFilteredTalentDays(response.data.data);
        }
      } catch (error) {
        console.error('Erreur récupération TalentDays:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTalentDays();
  }, [activeTab]);

  // Appliquer les filtres
  useEffect(() => {
    let filtered = [...talentDays];

    // Filtre par technologies (sélection multiple)
    if (filters.technologies.length > 0) {
      filtered = filtered.filter(td =>
        td.technologies?.some(tech =>
          filters.technologies.includes(tech)
        )
      );
    }

    if (filters.type) {
      filtered = filtered.filter(td => td.typeEvenement === filters.type);
    }

    setFilteredTalentDays(filtered);
  }, [filters, talentDays]);

  // Fonctions pour gérer les technologies
  const toggleTechnology = (tech) => {
    setFilters(prev => ({
      ...prev,
      technologies: prev.technologies.includes(tech)
        ? prev.technologies.filter(t => t !== tech)
        : [...prev.technologies, tech]
    }));
  };

  const removeTechnology = (tech) => {
    setFilters(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  // Technologies uniques pour le filtre
  const uniqueTechnologies = [...new Set(
    talentDays.flatMap(td => td.technologies || [])
  )].sort();

  // Types d'événements
  const eventTypes = [
    { value: '', label: 'Tous les types' },
    { value: 'hackathon', label: ' Hackathon' },
    { value: 'workshop', label: ' Workshop' },
    { value: 'challenge-code', label: ' Challenge Code' },
    { value: 'portfolio-day', label: ' Portfolio Day' },
    { value: 'entretien-groupe', label: ' Entretien Groupe' },
    { value: 'autre', label: ' Autre' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              TalentDays
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              Prouvez votre talent en conditions réelles et décrochez des opportunités auprès d'entreprises partenaires
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#prochains-evenements"
                className="bg-white text-primary font-semibold px-8 py-4 rounded-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Voir les prochains événements
              </a>
              <a
                href="#comment-ca-marche"
                className="bg-white/10 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-lg border-2 border-white hover:bg-white hover:text-primary transition-all duration-200"
              >
                Comment ça marche ?
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Onglets et Filtres */}
      <section id="prochains-evenements" className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Onglets */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'upcoming'
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                 Prochains événements
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'all'
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                 Tous les événements
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'past'
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                 Événements passés
              </button>
            </div>

            {/* Filtres */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Filter className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Filtres de recherche</h3>
                    <p className="text-sm text-gray-500">Affinez votre recherche d'événements</p>
                  </div>
                </div>
                {(filters.technologies.length > 0 || filters.type) && (
                  <button
                    onClick={() => setFilters({ technologies: [], type: '' })}
                    className="text-sm font-medium text-primary hover:text-primary-dark hover:underline transition-colors flex items-center gap-1"
                  >
                    <span>Réinitialiser</span>
                  </button>
                )}
              </div>

              {/* Filtre Technologies - Sélection multiple */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-800 mb-3">
                  Technologies {filters.technologies.length > 0 && (
                    <span className="text-primary">({filters.technologies.length} sélectionnée{filters.technologies.length > 1 ? 's' : ''})</span>
                  )}
                </label>
                
                {/* Technologies sélectionnées */}
                {filters.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4 p-4 bg-primary/5 rounded-xl border border-primary/20">
                    {filters.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-full text-sm font-semibold shadow-sm"
                      >
                        {tech}
                        <button
                          onClick={() => removeTechnology(tech)}
                          className="hover:bg-white/20 rounded-full p-1 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Grille de technologies disponibles */}
                <div className="flex flex-wrap gap-2">
                  {uniqueTechnologies.map((tech) => (
                    <button
                      key={tech}
                      onClick={() => toggleTechnology(tech)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 border-2 ${
                        filters.technologies.includes(tech)
                          ? 'bg-primary text-white border-primary shadow-md'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'
                      }`}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtre Type */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-3">
                  Type d'événement
                </label>
                <div className="relative">
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all appearance-none cursor-pointer font-medium text-gray-700 hover:border-primary"
                  >
                    {eventTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Résumé des filtres actifs */}
              {(filters.technologies.length > 0 || filters.type) && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Résumé des filtres</p>
                  <div className="flex flex-wrap gap-2">
                    {filters.technologies.length > 0 && (
                      <span className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium">
                        {filters.technologies.length} technologie{filters.technologies.length > 1 ? 's' : ''}
                      </span>
                    )}
                    {filters.type && (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary/10 text-secondary rounded-lg text-sm font-medium">
                        {eventTypes.find(t => t.value === filters.type)?.label}
                        <button
                          onClick={() => setFilters({ ...filters, type: '' })}
                          className="hover:bg-secondary/20 rounded-full p-0.5 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Liste des événements */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-gray-600">Chargement des événements...</p>
              </div>
            ) : filteredTalentDays.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-md">
                <p className="text-xl text-gray-600 mb-4">
                  {activeTab === 'upcoming'
                    ? 'Aucun événement à venir pour le moment'
                    : activeTab === 'past'
                    ? 'Aucun événement passé'
                    : 'Aucun événement trouvé'}
                </p>
                <p className="text-gray-500">
                  Revenez bientôt pour découvrir nos prochains TalentDays !
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTalentDays.map((talentDay) => (
                  <TalentDayCard key={talentDay._id} talentDay={talentDay} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="comment-ca-marche" className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-primary mb-4">
              Comment participer à un TalentDay ?
            </h2>
            <p className="text-center text-gray-600 mb-16 text-lg">
              Un processus clair et transparent pour talents et entreprises
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* COLONNE TALENTS */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-secondary">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-full mb-4">
                    <UserCheck className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-secondary mb-2">POUR LES TALENTS</h3>
                  <p className="text-gray-600">Développeurs, montrez vos compétences</p>
                </div>

                <div className="space-y-6">
                  {/* Talent Étape 1 */}
                  <div className="flex gap-4 items-start group">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-secondary to-accent text-white rounded-full flex items-center justify-center font-bold shadow-lg group-hover:scale-110 transition-transform">
                        1
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900 mb-1">
                        Inscrivez-vous gratuitement
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        Sélectionnez un TalentDay dans notre calendrier et inscrivez-vous en ligne. <span className="font-semibold text-secondary">Aucune pré-sélection requise.</span>
                      </p>
                    </div>
                  </div>

                  {/* Talent Étape 2 */}
                  <div className="flex gap-4 items-start group">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-secondary to-accent text-white rounded-full flex items-center justify-center font-bold shadow-lg group-hover:scale-110 transition-transform">
                        2
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900 mb-1">
                        Découvrez les entreprises
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        Assistez aux présentations des entreprises participantes et identifiez celles qui correspondent à vos aspirations.
                      </p>
                    </div>
                  </div>

                  {/* Talent Étape 3 */}
                  <div className="flex gap-4 items-start group">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-secondary to-accent text-white rounded-full flex items-center justify-center font-bold shadow-lg group-hover:scale-110 transition-transform">
                        3
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900 mb-1">
                        Démontrez vos compétences
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        Passez des <span className="font-semibold text-secondary">tests techniques en ligne</span> adaptés aux besoins des recruteurs présents.
                      </p>
                    </div>
                  </div>

                  {/* Talent Étape 4 */}
                  <div className="flex gap-4 items-start group">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-secondary to-accent text-white rounded-full flex items-center justify-center font-bold shadow-lg group-hover:scale-110 transition-transform">
                        4
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900 mb-1">
                        Entretiens sur place
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        Les entreprises intéressées vous invitent directement en entretien. <span className="font-semibold text-secondary">Opportunités immédiates !</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* COLONNE ENTREPRISES */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-primary">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-full mb-4">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-2">POUR LES ENTREPRISES</h3>
                  <p className="text-gray-600">Recruteurs, trouvez vos talents</p>
                </div>

                <div className="space-y-6">
                  {/* Entreprise Étape 1 */}
                  <div className="flex gap-4 items-start group">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark text-white rounded-full flex items-center justify-center font-bold shadow-lg group-hover:scale-110 transition-transform">
                        1
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900 mb-1">
                        Inscrivez-vous à l'événement
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        Réservez votre place et préparez votre présentation d'entreprise et vos besoins en recrutement.
                      </p>
                    </div>
                  </div>

                  {/* Entreprise Étape 2 */}
                  <div className="flex gap-4 items-start group">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark text-white rounded-full flex items-center justify-center font-bold shadow-lg group-hover:scale-110 transition-transform">
                        2
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900 mb-1">
                        Présentez votre entreprise
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        Pitchez votre structure, votre culture et les profils recherchés devant les talents présents.
                      </p>
                    </div>
                  </div>

                  {/* Entreprise Étape 3 */}
                  <div className="flex gap-4 items-start group">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark text-white rounded-full flex items-center justify-center font-bold shadow-lg group-hover:scale-110 transition-transform">
                        3
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900 mb-1">
                        Networking & café
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        Moment d'échange convivial avec les autres recruteurs et <span className="font-semibold text-primary">premiers contacts informels</span> avec les talents.
                      </p>
                    </div>
                  </div>

                  {/* Entreprise Étape 4 */}
                  <div className="flex gap-4 items-start group">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark text-white rounded-full flex items-center justify-center font-bold shadow-lg group-hover:scale-110 transition-transform">
                        4
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900 mb-1">
                        Accédez aux résultats en temps réel
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        Consultez <span className="font-semibold text-primary">instantanément</span> les performances des talents sur vos critères spécifiques.
                      </p>
                    </div>
                  </div>

                  {/* Entreprise Étape 5 */}
                  <div className="flex gap-4 items-start group">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark text-white rounded-full flex items-center justify-center font-bold shadow-lg group-hover:scale-110 transition-transform">
                        5
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900 mb-1">
                        Recrutez sur place
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        Organisez des entretiens avec les candidats qualifiés le jour même. <span className="font-semibold text-primary">Efficace et humain.</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Note informative */}
            <div className="mt-12 text-center">
              <div className="inline-block bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl px-8 py-4">
                <p className="text-gray-700 font-medium">
                  <span className="text-primary font-bold">Participation gratuite</span> pour les talents • 
                  <span className="text-secondary font-bold"> Frais de recrutement</span> uniquement en cas d'embauche
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-r from-secondary to-orange-600">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-4">
              Prêt à prouver votre talent ?
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              Inscrivez-vous à notre prochain TalentDay et montrez ce dont vous êtes capable !
            </p>
            <a
              href="#prochains-evenements"
              className="inline-block bg-white text-secondary font-semibold px-8 py-4 rounded-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Voir les événements disponibles
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TalentDays;