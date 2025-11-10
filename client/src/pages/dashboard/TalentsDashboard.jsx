import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFilter, FaStar, FaCheckCircle, FaEnvelope, FaTimes, FaBriefcase, FaMapMarkerAlt } from 'react-icons/fa';

// ✅ Constantes (en attendant que le fichier constants.js soit configuré)
const TECHNOLOGIES = [
  'React.js', 'Vue.js', 'Angular', 'Svelte', 'Next.js', 'Node.js', 'Express',
  'Python', 'Django', 'PHP', 'Laravel', 'Java', 'MongoDB', 'PostgreSQL',
  'MySQL', 'JavaScript', 'TypeScript', 'Docker', 'AWS', 'GraphQL',
];

const PROFIL_TYPES = ['Frontend', 'Backend', 'Full-stack', 'Mobile', 'DevOps', 'Data'];
const NIVEAUX = ['Junior', 'Medior', 'Senior'];
const TYPES_CONTRAT = ['CDI', 'CDD', 'Freelance', 'Stage', 'Alternance'];
const DISPONIBILITES = ['Immédiate', '1-2 semaines', '1 mois', 'Non disponible'];

const TECH_COLORS = {
  'React.js': 'bg-blue-100 text-blue-700',
  'Node.js': 'bg-green-100 text-green-800',
  'Python': 'bg-yellow-100 text-yellow-700',
  'MongoDB': 'bg-green-100 text-green-700',
  'JavaScript': 'bg-yellow-100 text-yellow-700',
  'TypeScript': 'bg-blue-100 text-blue-700',
  'default': 'bg-gray-100 text-gray-700',
};

const NIVEAU_COLORS = {
  'Junior': 'bg-green-100 text-green-700',
  'Medior': 'bg-blue-100 text-blue-700',
  'Senior': 'bg-purple-100 text-purple-700',
};

const PROFIL_COLORS = {
  'Frontend': 'bg-blue-100 text-blue-700',
  'Backend': 'bg-green-100 text-green-700',
  'Full-stack': 'bg-purple-100 text-purple-700',
  'Mobile': 'bg-pink-100 text-pink-700',
  'DevOps': 'bg-orange-100 text-orange-700',
  'Data': 'bg-cyan-100 text-cyan-700',
};

const CONTRAT_COLORS = {
  'CDI': 'bg-blue-100 text-blue-700',
  'CDD': 'bg-yellow-100 text-yellow-700',
  'Freelance': 'bg-purple-100 text-purple-700',
  'Stage': 'bg-green-100 text-green-700',
  'Alternance': 'bg-orange-100 text-orange-700',
};

const TalentsDashboard = () => {
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    technologies: '',
    typeProfil: '',
    niveau: '',
    typeContrat: '',
    disponibilite: '',
    experienceMin: '',
    experienceMax: '',
  });

  useEffect(() => {
    fetchTalents();
  }, [filters]);

  const fetchTalents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Construire les params en excluant les valeurs vides
      const params = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value) acc[key] = value;
        return acc;
      }, {});
      
      const response = await axios.get('/api/talents/filter', { params });
      
      if (response.data.success && Array.isArray(response.data.data)) {
        setTalents(response.data.data);
      } else {
        setTalents([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des talents:', error);
      setError(error.response?.data?.message || 'Erreur lors du chargement des talents');
      setTalents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      technologies: '',
      typeProfil: '',
      niveau: '',
      typeContrat: '',
      disponibilite: '',
      experienceMin: '',
      experienceMax: '',
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  const handleContact = (talentId) => {
    // TODO: Ouvrir un modal de contact
    console.log('Contact talent:', talentId);
  };

  const getTechBadgeColor = (tech) => TECH_COLORS[tech] || TECH_COLORS.default;
  const getNiveauColor = (niveau) => NIVEAU_COLORS[niveau] || 'bg-gray-100 text-gray-700';
  const getProfilColor = (profil) => PROFIL_COLORS[profil] || 'bg-gray-100 text-gray-700';
  const getContratColor = (contrat) => CONTRAT_COLORS[contrat] || 'bg-gray-100 text-gray-700';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Catalogue de Talents</h1>
          <p className="text-neutral mt-2">Découvrez nos développeurs validés par TalentProof</p>
        </div>
        
        {/* Toggle Filtres Mobile */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden btn-primary"
        >
          <FaFilter className="inline mr-2" />
          Filtres
        </button>
      </div>

      {/* Filtres */}
      <div className={`card ${showFilters ? 'block' : 'hidden lg:block'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FaFilter className="text-primary text-xl" />
            <h2 className="font-bold text-lg">Filtres de recherche</h2>
          </div>
          
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              <FaTimes />
              Réinitialiser
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Technologie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Technologie
            </label>
            <select
              name="technologies"
              value={filters.technologies}
              onChange={handleFilterChange}
              className="input-field"
            >
              <option value="">Toutes</option>
              {TECHNOLOGIES.map((tech) => (
                <option key={tech} value={tech}>{tech}</option>
              ))}
            </select>
          </div>

          {/* Type de profil */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de profil
            </label>
            <select
              name="typeProfil"
              value={filters.typeProfil}
              onChange={handleFilterChange}
              className="input-field"
            >
              <option value="">Tous</option>
              {PROFIL_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Niveau */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Niveau
            </label>
            <select
              name="niveau"
              value={filters.niveau}
              onChange={handleFilterChange}
              className="input-field"
            >
              <option value="">Tous</option>
              {NIVEAUX.map((niveau) => (
                <option key={niveau} value={niveau}>{niveau}</option>
              ))}
            </select>
          </div>

          {/* Type de contrat */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de contrat
            </label>
            <select
              name="typeContrat"
              value={filters.typeContrat}
              onChange={handleFilterChange}
              className="input-field"
            >
              <option value="">Tous</option>
              {TYPES_CONTRAT.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Disponibilité */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Disponibilité
            </label>
            <select
              name="disponibilite"
              value={filters.disponibilite}
              onChange={handleFilterChange}
              className="input-field"
            >
              <option value="">Toutes</option>
              {DISPONIBILITES.map((dispo) => (
                <option key={dispo} value={dispo}>{dispo}</option>
              ))}
            </select>
          </div>

          {/* Expérience Min */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expérience min (ans)
            </label>
            <input
              type="number"
              name="experienceMin"
              value={filters.experienceMin}
              onChange={handleFilterChange}
              className="input-field"
              placeholder="0"
              min="0"
              max="50"
            />
          </div>

          {/* Expérience Max */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expérience max (ans)
            </label>
            <input
              type="number"
              name="experienceMax"
              value={filters.experienceMax}
              onChange={handleFilterChange}
              className="input-field"
              placeholder="50"
              min="0"
              max="50"
            />
          </div>
        </div>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="card bg-red-50 border border-red-200">
          <p className="text-red-700">⚠️ {error}</p>
        </div>
      )}

      {/* Stats des résultats */}
      {!loading && talents.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-bold text-2xl text-primary">{talents.length}</span>
            <span className="text-neutral">
              talent{talents.length > 1 ? 's' : ''} trouvé{talents.length > 1 ? 's' : ''}
            </span>
            {hasActiveFilters && (
              <span className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full font-medium">
                Filtres actifs
              </span>
            )}
          </div>
        </div>
      )}

      {/* Liste des talents */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-neutral mt-4">Chargement des talents...</p>
        </div>
      ) : talents.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-neutral text-lg mb-2 font-semibold">
            Aucun talent disponible
          </p>
          <p className="text-sm text-neutral mb-4">
            {hasActiveFilters 
              ? 'Aucun résultat ne correspond à vos critères. Essayez de modifier vos filtres.' 
              : 'Les talents seront bientôt ajoutés par l\'administrateur.'}
          </p>
          {hasActiveFilters && (
            <button onClick={resetFilters} className="btn-primary">
              Réinitialiser les filtres
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {talents.map((talent) => (
            <div 
              key={talent._id} 
              className="card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {talent.photo ? (
                    <img
                      src={talent.photo}
                      alt={talent.prenom}
                      className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center font-bold text-xl shadow-md">
                      {talent.prenom?.charAt(0) || 'T'}
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-primary">{talent.prenom}</h3>
                    <p className="text-sm text-neutral">
                      {talent.anneesExperience === 0 
                        ? 'Débutant' 
                        : talent.anneesExperience === 1 
                          ? '1 an d\'exp.' 
                          : `${talent.anneesExperience} ans d\'exp.`
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-accent bg-accent/10 px-2 py-1 rounded-full">
                  <FaCheckCircle className="text-xs" />
                  <span className="text-xs font-semibold">Validé</span>
                </div>
              </div>

              {/* Badges: Profil, Niveau, Contrat */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 text-xs rounded-full font-semibold ${getProfilColor(talent.typeProfil)}`}>
                  {talent.typeProfil}
                </span>
                <span className={`px-3 py-1 text-xs rounded-full font-semibold ${getNiveauColor(talent.niveau)}`}>
                  {talent.niveau}
                </span>
                <span className={`px-3 py-1 text-xs rounded-full font-semibold ${getContratColor(talent.typeContrat)}`}>
                  {talent.typeContrat}
                </span>
              </div>

              {/* Technologies */}
              {talent.technologies && talent.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {talent.technologies.slice(0, 3).map((tech, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 text-xs rounded-full font-medium ${getTechBadgeColor(tech)}`}
                    >
                      {tech}
                    </span>
                  ))}
                  {talent.technologies.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-neutral text-xs rounded-full font-medium">
                      +{talent.technologies.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Score & Localisation */}
              <div className="space-y-2 mb-4">
                {talent.scoreTest && (
                  <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-secondary/10 to-orange-100 rounded-lg">
                    <FaStar className="text-secondary" />
                    <span className="font-bold text-sm">{talent.scoreTest}/100</span>
                    {talent.plateforme && (
                      <span className="text-xs text-neutral">({talent.plateforme})</span>
                    )}
                  </div>
                )}
                
                {talent.localisation && (
                  <div className="flex items-center gap-2 text-sm text-neutral">
                    <FaMapMarkerAlt className="text-primary" />
                    <span>{talent.localisation}</span>
                  </div>
                )}

                {talent.disponibilite && (
                  <div className="flex items-center gap-2 text-sm">
                    <FaBriefcase className="text-primary" />
                    <span className="text-neutral">Disponible: </span>
                    <span className="font-medium text-accent">{talent.disponibilite}</span>
                  </div>
                )}
              </div>

              {/* Compétences */}
              {talent.competences && (
                <p className="text-sm text-neutral mb-4 line-clamp-2 leading-relaxed">
                  {talent.competences}
                </p>
              )}

              {/* Bouton contact */}
              <button
                onClick={() => handleContact(talent._id)}
                className="btn-primary w-full group"
              >
                <FaEnvelope className="inline mr-2 group-hover:scale-110 transition-transform" />
                Contacter ce talent
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      {!loading && talents.length > 0 && (
        <div className="card bg-blue-50 border border-blue-200">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="font-semibold text-primary mb-1">Comment ça marche ?</p>
              <p className="text-sm text-neutral">
                Cliquez sur "Contacter ce talent" pour envoyer une demande. Notre équipe vous mettra 
                en relation avec le développeur et vous enverra son CV complet ainsi que ses coordonnées sous 24-48h.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TalentsDashboard;