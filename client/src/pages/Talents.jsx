import { useState, useEffect } from 'react';
import { FaUsers, FaSearch, FaFilter } from 'react-icons/fa';
import api from '../utils/api';
import TalentCard from '../components/talents/TalentCard';
import FilterBar from '../components/talents/FilterBar';
import ContactTalentModal from '../components/talents/ContactTalentModal';

const Talents = () => {
  const [talents, setTalents] = useState([]);
  const [filteredTalents, setFilteredTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTechs, setSelectedTechs] = useState([]);
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [showFilters, setShowFilters] = useState(true);

  // Charger tous les talents
  useEffect(() => {
    fetchTalents();
  }, []);

  // Filtrer les talents quand les filtres changent
  useEffect(() => {
    filterTalents();
  }, [selectedTechs, talents]);

  const fetchTalents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/talents');
      setTalents(response.data.data);
      setFilteredTalents(response.data.data);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des talents');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterTalents = () => {
    if (selectedTechs.length === 0) {
      setFilteredTalents(talents);
    } else {
      const filtered = talents.filter((talent) =>
        selectedTechs.some((tech) => talent.technologies?.includes(tech))
      );
      setFilteredTalents(filtered);
    }
  };

  const handleFilterChange = (techs) => {
    setSelectedTechs(techs);
  };

  const handleContact = (talent) => {
    setSelectedTalent(talent);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral">Chargement des talents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <FaUsers className="text-4xl text-primary" />
            <h1 className="text-4xl font-bold text-primary">Catalogue de Talents</h1>
          </div>
          <p className="text-lg text-neutral max-w-2xl mx-auto">
            Découvrez nos talents tech validés en conditions réelles. Tous ont réussi des tests
            pratiques sans IA.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-3xl font-bold text-primary">{talents.length}</p>
            <p className="text-neutral">Talents validés</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-3xl font-bold text-secondary">{filteredTalents.length}</p>
            <p className="text-neutral">Résultats affichés</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-3xl font-bold text-accent">95%</p>
            <p className="text-neutral">Taux de succès</p>
          </div>
        </div>

        {/* Toggle filtres mobile */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden w-full mb-4 btn-outline flex items-center justify-center space-x-2"
        >
          <FaFilter />
          <span>{showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}</span>
        </button>

        {/* Layout avec filtres */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filtres */}
          {showFilters && (
            <aside className="lg:w-1/4">
              <div className="lg:sticky lg:top-24">
                <FilterBar selectedTechs={selectedTechs} onFilterChange={handleFilterChange} />
              </div>
            </aside>
          )}

          {/* Liste des talents */}
          <main className={showFilters ? 'lg:w-3/4' : 'w-full'}>
            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {filteredTalents.length === 0 ? (
              <div className="card text-center py-12">
                <FaSearch className="text-6xl text-neutral mx-auto mb-4 opacity-50" />
                <h2 className="text-2xl font-bold text-primary mb-2">Aucun talent trouvé</h2>
                <p className="text-neutral mb-4">
                  Essayez de modifier vos filtres pour voir plus de résultats
                </p>
                {selectedTechs.length > 0 && (
                  <button onClick={() => setSelectedTechs([])} className="btn-primary">
                    Réinitialiser les filtres
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTalents.map((talent) => (
                  <TalentCard key={talent._id} talent={talent} onContact={handleContact} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modal Contact */}
      {selectedTalent && (
        <ContactTalentModal talent={selectedTalent} onClose={() => setSelectedTalent(null)} />
      )}
    </div>
  );
};

export default Talents;