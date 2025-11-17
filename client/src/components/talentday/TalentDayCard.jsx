import { Calendar, MapPin, Users, Clock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils/api';

const TalentDayCard = ({ talentDay }) => {
  // Formatter la date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-BE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Badge de statut
  const getStatusBadge = (statut) => {
    const badges = {
      'inscriptions-ouvertes': {
        text: '✅ Inscriptions ouvertes',
        color: 'bg-green-100 text-green-800 border-green-300',
      },
      'complet': {
        text: '🔴 Complet',
        color: 'bg-red-100 text-red-800 border-red-300',
      },
      'a-venir': {
        text: '⏰ À venir',
        color: 'bg-blue-100 text-blue-800 border-blue-300',
      },
      'en-cours': {
        text: '🔴 En cours',
        color: 'bg-orange-100 text-orange-800 border-orange-300',
      },
      'termine': {
        text: '✔️ Terminé',
        color: 'bg-gray-100 text-gray-800 border-gray-300',
      },
      'annule': {
        text: '❌ Annulé',
        color: 'bg-red-100 text-red-800 border-red-300',
      },
    };

    const badge = badges[statut] || badges['a-venir'];
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  // Badge de type
  const getTypeBadge = (type) => {
    const types = {
      'hackathon': { emoji: '💻', text: 'Hackathon', color: 'bg-purple-100 text-purple-800' },
      'workshop': { emoji: '🎓', text: 'Workshop', color: 'bg-blue-100 text-blue-800' },
      'challenge-code': { emoji: '🏆', text: 'Challenge Code', color: 'bg-yellow-100 text-yellow-800' },
      'portfolio-day': { emoji: '📂', text: 'Portfolio Day', color: 'bg-indigo-100 text-indigo-800' },
      'entretien-groupe': { emoji: '👥', text: 'Entretien Groupe', color: 'bg-green-100 text-green-800' },
      'autre': { emoji: '🎯', text: 'Autre', color: 'bg-gray-100 text-gray-800' },
    };

    const typeInfo = types[type] || types['autre'];
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${typeInfo.color}`}>
        <span className="mr-1">{typeInfo.emoji}</span>
        {typeInfo.text}
      </span>
    );
  };

  // Icône de lieu
  const getLieuIcon = (type) => {
    if (type === 'en-ligne') return '🌐';
    if (type === 'hybride') return '🔄';
    return '📍';
  };

  // Calcul du taux de remplissage
  const tauxRemplissage = Math.round(
    ((talentDay.placesDisponibles - talentDay.placesRestantes) / talentDay.placesDisponibles) * 100
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={getImageUrl(talentDay.image)}
          alt={talentDay.titre}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        {/* Badges sur l'image */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {getStatusBadge(talentDay.statut)}
          {getTypeBadge(talentDay.typeEvenement)}
        </div>

        {/* Places restantes */}
        {talentDay.statut === 'inscriptions-ouvertes' && (
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-secondary" />
              <span className="font-bold text-gray-900">
                {talentDay.placesRestantes}/{talentDay.placesDisponibles}
              </span>
              <span className="text-gray-600">places</span>
            </div>
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-6">
        {/* Titre */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {talentDay.titre}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {talentDay.description}
        </p>

        {/* Infos */}
        <div className="space-y-3 mb-4">
          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="font-medium">{formatDate(talentDay.date)}</span>
          </div>

          {/* Heure */}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Clock className="w-4 h-4 text-primary flex-shrink-0" />
            <span>
              {talentDay.heureDebut} - {talentDay.heureFin}
            </span>
          </div>

          {/* Lieu */}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
            <span>
              {getLieuIcon(talentDay.lieu.type)}{' '}
              {talentDay.lieu.type === 'en-ligne'
                ? 'En ligne'
                : talentDay.lieu.type === 'hybride'
                ? `Hybride - ${talentDay.lieu.ville}`
                : `${talentDay.lieu.ville}`}
            </span>
          </div>
        </div>

        {/* Technologies */}
        {talentDay.technologies && talentDay.technologies.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {talentDay.technologies.slice(0, 3).map((tech, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  {tech}
                </span>
              ))}
              {talentDay.technologies.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                  +{talentDay.technologies.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Barre de progression */}
        {talentDay.statut !== 'termine' && talentDay.statut !== 'annule' && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Inscriptions</span>
              <span>{tauxRemplissage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  tauxRemplissage < 50
                    ? 'bg-green-500'
                    : tauxRemplissage < 80
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${tauxRemplissage}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Boutons */}
        <div className="flex gap-3">
          <Link
            to={`/talent-days/${talentDay._id}`}
            className="flex-1 bg-primary text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors text-center"
          >
            Voir les détails
          </Link>
          {talentDay.statut === 'inscriptions-ouvertes' && talentDay.placesRestantes > 0 && (
            <Link
              to={`/talent-days/${talentDay._id}/register`}
              className="flex-1 bg-gradient-to-r from-secondary to-orange-600 text-white font-semibold py-3 px-4 rounded-lg hover:shadow-lg transition-all text-center"
            >
              S'inscrire
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default TalentDayCard;