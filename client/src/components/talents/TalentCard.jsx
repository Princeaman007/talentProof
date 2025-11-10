import { FaCheckCircle, FaStar } from 'react-icons/fa';
import { TECH_COLORS } from '../../utils/constants';

const TalentCard = ({ talent, onContact }) => {
  const getTechColor = (tech) => {
    return TECH_COLORS[tech] || TECH_COLORS.default;
  };

  return (
    <div className="card group cursor-pointer transform transition-all duration-300 hover:scale-105">
      {/* Badge validé */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 text-accent">
          <FaCheckCircle />
          <span className="text-sm font-semibold">Validé TalentProof</span>
        </div>
        <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
          <FaStar className="text-xs" />
          <span className="text-sm font-bold">{talent.scoreTest}/100</span>
        </div>
      </div>

      {/* Photo et Prénom */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {talent.prenom?.charAt(0) || '?'}
        </div>
        <div>
          <h3 className="text-xl font-bold text-primary">{talent.prenom}</h3>
          <p className="text-sm text-neutral">
            {talent.plateforme} • {talent.anneeExperience}
          </p>
        </div>
      </div>

      {/* Technologies */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-neutral-dark mb-2">Technologies</p>
        <div className="flex flex-wrap gap-2">
          {talent.technologies?.slice(0, 4).map((tech, index) => (
            <span
              key={index}
              className={`text-xs px-2 py-1 rounded-full font-medium ${getTechColor(tech)}`}
            >
              {tech}
            </span>
          ))}
          {talent.technologies?.length > 4 && (
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
              +{talent.technologies.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Compétences */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-neutral-dark mb-1">Compétences</p>
        <p className="text-sm text-neutral line-clamp-2">{talent.competences}</p>
      </div>

      {/* Bouton */}
      <button
        onClick={() => onContact(talent)}
        className="w-full btn-primary text-sm group-hover:bg-secondary group-hover:shadow-lg"
      >
        En savoir plus
      </button>
    </div>
  );
};

export default TalentCard;