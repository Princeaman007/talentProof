import { FaCheckCircle, FaStar, FaBriefcase, FaMapMarkerAlt, FaClock, FaGlobe } from 'react-icons/fa';
import { TECH_COLORS } from '../../utils/constants';

const TalentCard = ({ talent, onContact }) => {
  // ✅ DEBUG temporaire
  console.log('🎴 Rendu carte:', talent.prenom, {
    anneeExperience: talent.anneeExperience,
    langues: talent.langues,
    localisation: talent.localisation,
  });

  const getTechColor = (tech) => {
    return TECH_COLORS[tech] || TECH_COLORS.default;
  };

  // ✅ Helper pour afficher l'expérience
  const getExperienceLabel = () => {
    const annees = talent.anneeExperience ?? 0;
    if (annees === 0) return 'Moins d\'1 an d\'expérience';
    if (annees === 1) return '1 an d\'expérience';
    return `${annees} ans d'expérience`;
  };

  // ✅ Badge de niveau avec couleur
  const getNiveauBadge = () => {
    const colors = {
      Junior: 'bg-green-100 text-green-700',
      Medior: 'bg-blue-100 text-blue-700',
      Senior: 'bg-purple-100 text-purple-700',
    };
    return colors[talent.niveau] || 'bg-gray-100 text-gray-700';
  };

  // ✅ Badge de disponibilité avec couleur
  const getDisponibiliteBadge = () => {
    const colors = {
      'Immédiate': 'bg-green-100 text-green-700',
      '1-2 semaines': 'bg-yellow-100 text-yellow-700',
      '1 mois': 'bg-orange-100 text-orange-700',
      'Non disponible': 'bg-red-100 text-red-700',
    };
    return colors[talent.disponibilite] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="card group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
      {/* Header: Badge validé + Score */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 text-accent">
          <FaCheckCircle />
          <span className="text-sm font-semibold">Validé TalentProof</span>
        </div>
        <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
          <FaStar className="text-xs" />
          <span className="text-sm font-bold">{talent.scoreTest}/100</span>
        </div>
      </div>

      {/* Photo et Prénom + Type de profil */}
      <div className="flex items-center space-x-4 mb-4">
        {talent.photo ? (
          <img
            src={talent.photo}
            alt={talent.prenom}
            className="w-16 h-16 rounded-full object-cover border-2 border-primary"
          />
        ) : (
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {talent.prenom?.charAt(0)?.toUpperCase() || '?'}
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-primary">{talent.prenom}</h3>
          <p className="text-sm font-medium text-secondary">
            {talent.typeProfil} {talent.niveau}
          </p>
        </div>
      </div>

      {/* Badges: Niveau + Type de contrat */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${getNiveauBadge()}`}>
          {talent.niveau}
        </span>
        <span className="text-xs px-3 py-1 rounded-full font-medium bg-blue-100 text-blue-700">
          {talent.typeContrat}
        </span>
      </div>

      {/* Infos complémentaires */}
      <div className="space-y-2 mb-4 text-sm text-neutral-dark">
        {/* Expérience */}
        <div className="flex items-center space-x-2">
          <FaBriefcase className="text-primary flex-shrink-0" />
          <span>{getExperienceLabel()}</span>
        </div>

        {/* Localisation */}
        {talent.localisation && (
          <div className="flex items-center space-x-2">
            <FaMapMarkerAlt className="text-primary flex-shrink-0" />
            <span className="truncate">{talent.localisation}</span>
          </div>
        )}

        {/* Disponibilité */}
        {talent.disponibilite && (
          <div className="flex items-center space-x-2">
            <FaClock className="text-primary flex-shrink-0" />
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getDisponibiliteBadge()}`}>
              {talent.disponibilite}
            </span>
          </div>
        )}

        {/* ✅ LANGUES - Affichage conditionnel sécurisé */}
        {talent.langues && talent.langues.length > 0 && (
          <div className="flex items-center space-x-2">
            <FaGlobe className="text-primary flex-shrink-0" />
            <span className="text-xs">
              {talent.langues.join(', ')}
            </span>
          </div>
        )}
      </div>

      {/* Technologies */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-neutral-dark mb-2">Technologies</p>
        <div className="flex flex-wrap gap-2">
          {talent.technologies?.slice(0, 5).map((tech, index) => (
            <span
              key={index}
              className={`text-xs px-2 py-1 rounded-full font-medium ${getTechColor(tech)}`}
            >
              {tech}
            </span>
          ))}
          {talent.technologies?.length > 5 && (
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
              +{talent.technologies.length - 5}
            </span>
          )}
        </div>
      </div>

      {/* Compétences (preview) */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-neutral-dark mb-1">Compétences</p>
        <p className="text-sm text-neutral line-clamp-2 leading-relaxed">
          {talent.competences || 'Aucune description disponible.'}
        </p>
      </div>

      {/* Plateforme de test */}
      {talent.plateforme && (
        <div className="mb-4 text-xs text-neutral-dark">
          <span className="font-medium">Test validé sur:</span> {talent.plateforme}
        </div>
      )}

      {/* Bouton */}
      <button
        onClick={() => onContact(talent)}
        className="w-full btn-primary text-sm py-3 group-hover:bg-secondary group-hover:shadow-lg transition-all duration-300"
      >
        Voir le profil complet
      </button>
    </div>
  );
};

export default TalentCard;