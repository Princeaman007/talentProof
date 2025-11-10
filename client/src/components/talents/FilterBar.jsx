import { useState } from 'react';
import { FaFilter, FaTimes } from 'react-icons/fa';
import { TECHNOLOGIES } from '../../utils/constants';

const FilterBar = ({ onFilterChange, selectedTechs }) => {
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const popularTechs = [
    'React.js',
    'Vue.js',
    'Angular',
    'Node.js',
    'Python',
    'JavaScript',
    'TypeScript',
    'MongoDB',
  ];

  const displayTechs = showAll ? TECHNOLOGIES : popularTechs;

  const filteredTechs = displayTechs.filter((tech) =>
    tech.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleTech = (tech) => {
    if (selectedTechs.includes(tech)) {
      onFilterChange(selectedTechs.filter((t) => t !== tech));
    } else {
      onFilterChange([...selectedTechs, tech]);
    }
  };

  const clearFilters = () => {
    onFilterChange([]);
    setSearchTerm('');
  };

  return (
    <div className="card bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 text-primary">
          <FaFilter />
          <h3 className="font-bold">Filtrer par technologies</h3>
        </div>
        {selectedTechs.length > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-red-600 hover:text-red-700 font-semibold flex items-center space-x-1"
          >
            <FaTimes />
            <span>Effacer ({selectedTechs.length})</span>
          </button>
        )}
      </div>

      {/* Barre de recherche */}
      <input
        type="text"
        placeholder="Rechercher une technologie..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-primary focus:border-transparent"
      />

      {/* Technologies */}
      <div className="flex flex-wrap gap-2 mb-4">
        {filteredTechs.map((tech) => (
          <button
            key={tech}
            onClick={() => toggleTech(tech)}
            className={`
              px-3 py-1 rounded-full text-sm font-medium transition-all
              ${
                selectedTechs.includes(tech)
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-neutral border border-gray-300 hover:border-primary'
              }
            `}
          >
            {tech}
          </button>
        ))}
      </div>

      {/* Bouton Voir plus/moins */}
      {!searchTerm && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-primary hover:text-primary-dark font-semibold"
        >
          {showAll ? '← Voir moins' : `Voir toutes les technologies (${TECHNOLOGIES.length}) →`}
        </button>
      )}

      {/* Résultats */}
      {searchTerm && filteredTechs.length === 0 && (
        <p className="text-sm text-neutral text-center py-4">
          Aucune technologie trouvée pour "{searchTerm}"
        </p>
      )}
    </div>
  );
};

export default FilterBar;