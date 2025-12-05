import { useState, useEffect } from 'react';
import { FaFilter, FaStar, FaCheckCircle, FaEnvelope, FaTimes, FaBriefcase, FaMapMarkerAlt, FaGlobe, FaUser, FaBuilding, FaPlus, FaSearch, FaCode } from 'react-icons/fa';
import api from '../../utils/api';
import { extractErrorMessage } from '../../utils/errorHandler';
import { TECHNOLOGIES, getTechBadgeColor } from '../../constants/technologies';

const PROFIL_TYPES = ['Frontend', 'Backend', 'Full-stack', 'Mobile', 'DevOps', 'Data'];
const NIVEAUX = ['Junior', 'Medior', 'Senior'];
const TYPES_CONTRAT = ['CDI', 'CDD', 'Freelance', 'Stage', 'Alternance'];
const DISPONIBILITES = ['Immédiate', '1-2 semaines', '1 mois', 'Non disponible'];

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
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  
  //  NOUVEAU: État pour les technologies sélectionnées (array)
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);
  const [techSearchQuery, setTechSearchQuery] = useState('');
  const [techFilterMode, setTechFilterMode] = useState('OR'); // NOUVEAU: 'OR' ou 'AND'

  const [filters, setFilters] = useState({
    typeProfil: '',
    niveau: '',
    typeContrat: '',
    disponibilite: '',
    experienceMin: '',
    experienceMax: '',
  });

  useEffect(() => {
    fetchTalents();
  }, [filters, selectedTechnologies, techFilterMode]); // Ajouter techFilterMode comme dépendance

  const fetchTalents = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value) acc[key] = value;
        return acc;
      }, {});
      
      //  NOUVEAU: Ajouter les technologies sélectionnées (séparées par virgule)
      if (selectedTechnologies.length > 0) {
        params.technologies = selectedTechnologies.join(',');
        params.techFilterMode = techFilterMode; // Ajouter le mode de filtre
      }

      console.log('[TALENTS DASHBOARD] Fetching with params:', params);
      console.log('[TALENTS DASHBOARD] Technologies sélectionnées:', selectedTechnologies);
      console.log('[TALENTS DASHBOARD] Mode de filtre:', techFilterMode);
      
      const response = await api.get('/talents/filter', { params });
      console.log('[TALENTS DASHBOARD] Response:', {
        status: response.status,
        data: response.data,
        success: response.data.success,
        talentsCount: response.data.data?.length
      });

      if (response.data.success && Array.isArray(response.data.data)) {
        setTalents(response.data.data);
        console.log('[TALENTS DASHBOARD] Loaded', response.data.data.length, 'talents');
      } else {
        setTalents([]);
        console.warn('[TALENTS DASHBOARD] No talents or invalid response');
      }
    } catch (error) {
      console.error('[TALENTS DASHBOARD] Error:', error);
      setError(extractErrorMessage(error, 'Erreur lors du chargement des talents'));
      setTalents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  // NOUVEAU: Gestion des technologies sélectionnées
  const toggleTechnology = (tech) => {
    setSelectedTechnologies(prev => {
      if (prev.includes(tech)) {
        // Retirer la technologie
        return prev.filter(t => t !== tech);
      } else {
        // Ajouter la technologie
        return [...prev, tech];
      }
    });
  };
  
  const removeTechnology = (tech) => {
    setSelectedTechnologies(prev => prev.filter(t => t !== tech));
  };

  const resetFilters = () => {
    setFilters({
      typeProfil: '',
      niveau: '',
      typeContrat: '',
      disponibilite: '',
      experienceMin: '',
      experienceMax: '',
    });
    setSelectedTechnologies([]); //  Réinitialiser aussi les technologies
    setTechSearchQuery('');
    setTechFilterMode('OR'); //  Réinitialiser le mode de filtre
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '') || selectedTechnologies.length > 0;

  const handleContact = (talent) => {
    setSelectedTalent(talent);
    setShowContactModal(true);
  };

  const closeContactModal = () => {
    setShowContactModal(false);
    setSelectedTalent(null);
  };

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
            {hasActiveFilters && (
              <span className="px-2 py-1 text-xs bg-primary text-white rounded-full">
                {selectedTechnologies.length + Object.values(filters).filter(v => v !== '').length}
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              <FaTimes />
              Réinitialiser tout
            </button>
          )}
        </div>
        
        {/*  NOUVEAU: Section Technologies avec sélection multiple */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-semibold text-gray-800">
              Technologies recherchées
            </label>
            <div className="flex items-center gap-4">
              {selectedTechnologies.length > 0 && (
                <span className="text-xs text-gray-600">
                  {selectedTechnologies.length} sélectionnée{selectedTechnologies.length > 1 ? 's' : ''}
                </span>
              )}
              
              {/*  NOUVEAU: Toggle OR/AND */}
              {selectedTechnologies.length > 1 && (
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-300">
                  <span className="text-xs font-medium text-gray-600">Mode:</span>
                  <button
                    onClick={() => setTechFilterMode('OR')}
                    className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${
                      techFilterMode === 'OR' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                    title="Au moins UNE technologie (défaut)"
                  >
                    OU
                  </button>
                  <button
                    onClick={() => setTechFilterMode('AND')}
                    className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${
                      techFilterMode === 'AND' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                    title="TOUTES les technologies"
                  >
                    ET
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Explication du mode sélectionné */}
          {selectedTechnologies.length > 1 && (
            <div className="mb-3 text-xs text-gray-600 bg-white p-2 rounded border border-gray-200">
              {techFilterMode === 'OR' ? (
                <span>Affiche les talents ayant <strong>au moins une</strong> des technologies sélectionnées</span>
              ) : (
                <span>Affiche les talents ayant <strong>toutes</strong> les technologies sélectionnées</span>
              )}
            </div>
          )}
          
          {/* Barre de recherche pour filtrer les technologies */}
          <div className="relative mb-3">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={techSearchQuery}
              onChange={(e) => setTechSearchQuery(e.target.value)}
              placeholder="Rechercher une technologie..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          {/* Technologies sélectionnées (chips avec croix) */}
          {selectedTechnologies.length > 0 && (
            <div className="mb-3 p-3 bg-white rounded-lg border border-blue-200">
              <div className="text-xs font-medium text-gray-600 mb-2">Sélectionnées :</div>
              <div className="flex flex-wrap gap-2">
                {selectedTechnologies.map(tech => (
                  <span
                    key={tech}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getTechBadgeColor(tech)} shadow-sm`}
                  >
                    <FaCheckCircle className="text-xs" />
                    {tech}
                    <button
                      onClick={() => removeTechnology(tech)}
                      className="hover:bg-black hover:bg-opacity-10 rounded-full p-0.5 transition-colors"
                      title="Retirer"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Grille de technologies disponibles */}
          <div className="flex flex-wrap gap-2">
            {TECHNOLOGIES
              .filter(tech => 
                !selectedTechnologies.includes(tech) && 
                tech.toLowerCase().includes(techSearchQuery.toLowerCase())
              )
              .map(tech => (
                <button
                  key={tech}
                  onClick={() => toggleTechnology(tech)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:scale-105 ${getTechBadgeColor(tech)} hover:shadow-md border border-transparent hover:border-current`}
                  title="Cliquer pour ajouter"
                >
                  <FaPlus className="inline text-xs mr-1" />
                  {tech}
                </button>
              ))
            }
          </div>
        </div>

        {/* Autres filtres */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

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
          <p className="text-red-700"> {error}</p>
        </div>
      )}

      {/* Stats des résultats */}
      {!loading && talents.length > 0 && (
        <div className="space-y-3">
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
          
          {/*  NOUVEAU: Affichage visuel des filtres actifs */}
          {(selectedTechnologies.length > 0 || Object.values(filters).some(v => v !== '')) && (
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-xs font-semibold text-gray-600 self-center">Filtres appliqués :</span>
              
              {selectedTechnologies.map(tech => (
                <span
                  key={tech}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getTechBadgeColor(tech)}`}
                >
                  {tech}
                  <button
                    onClick={() => removeTechnology(tech)}
                    className="hover:bg-black hover:bg-opacity-10 rounded-full p-0.5"
                  >
                    <FaTimes className="text-[10px]" />
                  </button>
                </span>
              ))}
              
              {filters.typeProfil && (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getProfilColor(filters.typeProfil)}`}>
                  {filters.typeProfil}
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, typeProfil: '' }))}
                    className="hover:bg-black hover:bg-opacity-10 rounded-full p-0.5"
                  >
                    <FaTimes className="text-[10px]" />
                  </button>
                </span>
              )}
              
              {filters.niveau && (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getNiveauColor(filters.niveau)}`}>
                  {filters.niveau}
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, niveau: '' }))}
                    className="hover:bg-black hover:bg-opacity-10 rounded-full p-0.5"
                  >
                    <FaTimes className="text-[10px]" />
                  </button>
                </span>
              )}
              
              {filters.typeContrat && (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getContratColor(filters.typeContrat)}`}>
                  {filters.typeContrat}
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, typeContrat: '' }))}
                    className="hover:bg-black hover:bg-opacity-10 rounded-full p-0.5"
                  >
                    <FaTimes className="text-[10px]" />
                  </button>
                </span>
              )}
              
              {filters.disponibilite && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  {filters.disponibilite}
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, disponibilite: '' }))}
                    className="hover:bg-black hover:bg-opacity-10 rounded-full p-0.5"
                  >
                    <FaTimes className="text-[10px]" />
                  </button>
                </span>
              )}
              
              {(filters.experienceMin || filters.experienceMax) && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                  {filters.experienceMin || '0'}+ ans
                  {filters.experienceMax && ` - ${filters.experienceMax} ans`}
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, experienceMin: '', experienceMax: '' }))}
                    className="hover:bg-black hover:bg-opacity-10 rounded-full p-0.5"
                  >
                    <FaTimes className="text-[10px]" />
                  </button>
                </span>
              )}
            </div>
          )}
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
          <div className="text-6xl mb-4"></div>
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
                      {talent.anneeExperience === 0
                        ? 'Débutant'
                        : talent.anneeExperience === 1
                          ? '1 an d\'exp.'
                          : `${talent.anneeExperience} ans d\'exp.`
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

              {/* Score & Infos */}
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

                {talent.langues && talent.langues.length > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <FaGlobe className="text-primary" />
                    <span className="text-neutral">Langues: </span>
                    <span className="font-medium text-primary">{talent.langues.join(', ')}</span>
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
                onClick={() => handleContact(talent)}
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
            <span className="text-2xl"></span>
            <div>
              <p className="font-semibold text-primary mb-1">Comment ça marche ?</p>
              <p className="text-sm text-neutral">
                Cliquez sur "Contacter ce talent" pour envoyer votre demande. Notre équipe TalentProof vous recontactera sous 24-48h pour vous transmettre le CV complet et les coordonnées du développeur.
              </p>
            </div>
          </div>
        </div>
      )}

      {/*  Modal de contact */}
      {showContactModal && selectedTalent && (
        <ContactTalentModal
          talent={selectedTalent}
          onClose={closeContactModal}
        />
      )}
    </div>
  );
};

//  Modal de contact CORRIGÉ
const ContactTalentModal = ({ talent, onClose }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  //  Récupérer les infos de l'utilisateur connecté
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserInfo(user);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      //  CORRECTION - Payload avec les bons champs
      const payload = {
  talentId: talent._id,
  recruteurNom: userInfo?.nom || 'Non renseigné',
  recruteurEmail: userInfo?.email || '',
  entreprise: userInfo?.nom || 'Non renseigné',
  message: message || 'Je suis intéressé par ce profil et souhaite en discuter.', //  56 caractères
};

        if (userInfo?.telephone && userInfo.telephone.trim() !== '') {
    payload.recruteurTel = userInfo.telephone;
  }

      console.log(' Payload envoyé:', payload);

      const response = await api.post('/talents/contact', payload);

      console.log(' Réponse:', response.data);

      setSuccess(true);

      // Fermer après 2 secondes
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error(' Erreur contact:', err.response?.data || err.message);
      setError(extractErrorMessage(err, 'Erreur lors de l\'envoi de la demande'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-primary">
              Contacter {talent.prenom} {talent.nom && talent.nom !== 'Nouveau' ? talent.nom : ''}
            </h2>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${PROFIL_COLORS[talent.typeProfil] || 'bg-gray-100 text-gray-700'}`}>
                {talent.typeProfil}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${NIVEAU_COLORS[talent.niveau] || 'bg-gray-100 text-gray-700'}`}>
                {talent.niveau}
              </span>
              {talent.anneeExperience && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-700">
                  {talent.anneeExperience} {talent.anneeExperience > 1 ? 'ans' : 'an'} d'expérience
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Contenu */}
        {success ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="text-4xl text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-2">Demande envoyée !</h3>
            <p className="text-sm text-blue-800">
              <strong>Prochaines étapes :</strong> Notre équipe vous recontactera sous 24-48h avec le CV complet et les coordonnées directes du talent pour organiser un entretien.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            {/*  Affichage des infos de l'entreprise */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-300 shadow-sm">
              <h3 className="font-bold text-primary mb-4 flex items-center gap-2 text-lg">
                <FaBuilding className="text-secondary" />
                Vos informations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <span className="text-xs text-gray-500 uppercase font-semibold">Nom</span>
                  <p className="font-semibold text-primary mt-1">{userInfo?.nom || 'Non renseigné'}</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <span className="text-xs text-gray-500 uppercase font-semibold">Email</span>
                  <p className="font-semibold text-primary mt-1 truncate">{userInfo?.email || 'Non renseigné'}</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <span className="text-xs text-gray-500 uppercase font-semibold">Entreprise</span>
                  <p className="font-semibold text-primary mt-1">{userInfo?.nom || 'Non renseigné'}</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <span className="text-xs text-gray-500 uppercase font-semibold">Taille</span>
                  <p className="font-semibold text-primary mt-1">{userInfo?.nombreEmployes || 'Non renseigné'}</p>
                </div>
              </div>
            </div>

            {/* Section Technologies maîtrisées */}
            {talent.technologies && talent.technologies.length > 0 && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-300 shadow-sm">
                <h3 className="font-bold text-primary mb-4 flex items-center gap-2 text-lg">
                  <FaCode className="text-secondary" />
                  Compétences techniques
                </h3>
                <div className="flex flex-wrap gap-2">
                  {talent.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all hover:scale-105 hover:shadow-md ${getTechBadgeColor(tech)}`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/*  Champ message */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <FaEnvelope className="text-secondary" />
                Votre message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                rows="5"
                placeholder="Décrivez votre projet, vos besoins, ou toute information complémentaire..."
              />
              <p className="text-xs text-gray-500 mt-2">
                Ce message sera transmis à notre équipe avec votre demande.
              </p>
            </div>

            {/* Info */}
            <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-primary rounded-xl shadow-sm">
              <p className="text-sm text-gray-800">
                <strong className="text-primary">Prochaines étapes :</strong> Notre équipe vous recontactera sous 24-48h avec le CV complet et les coordonnées directes du talent pour organiser un entretien.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <FaEnvelope />
                    <span>Envoyer la demande</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TalentsDashboard;