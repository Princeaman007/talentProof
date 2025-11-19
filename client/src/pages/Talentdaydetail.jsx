import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import talentDayService from '../services/talentDayService';
import { 
  Calendar, MapPin, Users, Clock, Zap, ArrowLeft, CheckCircle, AlertCircle, 
  Globe, Building2, Phone, Mail, User, Target, Award, TrendingUp, Briefcase 
} from 'lucide-react';
import { getImageUrl } from '../utils/api';

const TalentDayDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [talentDay, setTalentDay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showInscriptionModal, setShowInscriptionModal] = useState(false);

 useEffect(() => {
  const fetchTalentDay = async () => {
    try {
      const response = await talentDayService.getTalentDayById(id);
      if (response.data.success) {
        setTalentDay(response.data.data);
        console.log('TalentDay chargé:', response.data.data);
      }
    } catch (err) {
      console.error('Erreur récupération TalentDay:', err);
      setError('Événement non trouvé');
    } finally {
      setLoading(false);
    }
  };

  fetchTalentDay();
}, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !talentDay) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Événement non trouvé</h2>
          <p className="text-gray-600 mb-6">L'événement que vous recherchez n'existe pas ou n'est plus disponible.</p>
          <Link
            to="/talent-days"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour aux événements
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-BE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Badge de statut avec styles
  const getStatusBadge = (statut) => {
    const badges = {
      'inscriptions-ouvertes': { text: ' Inscriptions ouvertes', color: 'bg-green-100 text-green-800 border-green-300' },
      'complet': { text: ' Complet', color: 'bg-red-100 text-red-800 border-red-300' },
      'a-venir': { text: ' À venir', color: 'bg-blue-100 text-blue-800 border-blue-300' },
      'en-cours': { text: ' En cours', color: 'bg-orange-100 text-orange-800 border-orange-300' },
      'termine': { text: ' Terminé', color: 'bg-gray-100 text-gray-800 border-gray-300' },
      'annule': { text: ' Annulé', color: 'bg-red-100 text-red-800 border-red-300' },
    };
    const badge = badges[statut] || badges['a-venir'];
    return <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${badge.color}`}>{badge.text}</span>;
  };

  // Badge de type avec emoji
  const getTypeBadge = (type) => {
    const types = {
      'hackathon': { emoji: '', text: 'Hackathon', color: 'bg-purple-100 text-purple-800' },
      'workshop': { emoji: '', text: 'Workshop', color: 'bg-blue-100 text-blue-800' },
      'challenge-code': { emoji: '', text: 'Challenge Code', color: 'bg-yellow-100 text-yellow-800' },
      'portfolio-day': { emoji: '', text: 'Portfolio Day', color: 'bg-indigo-100 text-indigo-800' },
      'entretien-groupe': { emoji: '', text: 'Entretien Groupe', color: 'bg-green-100 text-green-800' },
      'autre': { emoji: '', text: 'Autre', color: 'bg-gray-100 text-gray-800' },
    };
    const typeInfo = types[type] || types['autre'];
    return (
      <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${typeInfo.color}`}>
        <span className="mr-1">{typeInfo.emoji}</span>
        {typeInfo.text}
      </span>
    );
  };

  // Badge de niveau
  const getNiveauBadge = (niveau) => {
    const niveaux = {
      'debutant': { text: ' Débutant', color: 'bg-green-50 text-green-700' },
      'intermediaire': { text: ' Intermédiaire', color: 'bg-yellow-50 text-yellow-700' },
      'avance': { text: ' Avancé', color: 'bg-red-50 text-red-700' },
      'expert': { text: ' Expert', color: 'bg-purple-50 text-purple-700' },
    };
    const niveauInfo = niveaux[niveau] || niveaux['intermediaire'];
    return <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${niveauInfo.color}`}>{niveauInfo.text}</span>;
  };

  const canRegister = talentDay?.statut === 'inscriptions-ouvertes' && talentDay?.placesRestantes > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero avec image */}
      <div className="relative h-96 bg-gradient-to-r from-primary to-blue-700 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={getImageUrl(talentDay.image)}
            alt={talentDay.titre}
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        {/* Bouton retour */}
        <div className="absolute top-8 left-8">
          <Link
            to="/talent-days"
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </Link>
        </div>

        {/* Titre et badges */}
        <div className="absolute bottom-8 left-8 right-8">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {talentDay.titre}
            </h1>
            <div className="flex flex-wrap gap-3">
              {getTypeBadge(talentDay.typeEvenement)}
              {getStatusBadge(talentDay.statut)}
              {talentDay.niveauRequis && getNiveauBadge(talentDay.niveauRequis)}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-6 h-6 text-primary" />
                À propos de l'événement
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {talentDay.description}
              </p>
            </div>

            {/* Information Entreprises Section */}
            {talentDay.infoEntreprises && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-lg p-8 border-2 border-blue-200">
                <div className="flex items-center gap-3 mb-6">
                  <Building2 className="w-8 h-8 text-blue-700" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    {talentDay.infoEntreprises.titre || 'Pourquoi participer en tant qu\'entreprise ?'}
                  </h2>
                </div>
                
                {talentDay.infoEntreprises.description && (
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {talentDay.infoEntreprises.description}
                  </p>
                )}

                {/* Avantages */}
                {talentDay.infoEntreprises.avantages && talentDay.infoEntreprises.avantages.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      Avantages
                    </h3>
                    <ul className="space-y-2">
                      {talentDay.infoEntreprises.avantages.map((avantage, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{avantage}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Profils recherchés */}
                {talentDay.infoEntreprises.profils && talentDay.infoEntreprises.profils.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-600" />
                      Profils de talents recherchés
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {talentDay.infoEntreprises.profils.map((profil, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
                          {profil}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Formats */}
                {talentDay.infoEntreprises.formats && talentDay.infoEntreprises.formats.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-blue-600" />
                      Formats de rencontre
                    </h3>
                    <div className="space-y-3">
                      {talentDay.infoEntreprises.formats.map((format, index) => (
                        <div key={index} className="bg-white/70 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-1">{format.nom}</h4>
                          <p className="text-sm text-gray-600 mb-1">{format.description}</p>
                          {format.duree && (
                            <p className="text-xs text-gray-500"> Durée : {format.duree}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tarif et Places */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {talentDay.infoEntreprises.tarif && (
                    <div className="bg-white/70 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1"> Tarif</p>
                      <p className="text-xl font-bold text-blue-700">{talentDay.infoEntreprises.tarif}</p>
                    </div>
                  )}
                  {talentDay.infoEntreprises.placesEntreprises && (
                    <div className="bg-white/70 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1"> Places entreprises</p>
                      <p className="text-xl font-bold text-blue-700">{talentDay.infoEntreprises.placesEntreprises}</p>
                    </div>
                  )}
                </div>

                {/* Contact */}
                {talentDay.infoEntreprises.contact && (
                  <div className="bg-white/70 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-3"> Contact dédié entreprises</h3>
                    <div className="space-y-2 text-sm">
                      {talentDay.infoEntreprises.contact.nom && (
                        <p className="flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">{talentDay.infoEntreprises.contact.nom}</span>
                        </p>
                      )}
                      {talentDay.infoEntreprises.contact.email && (
                        <p className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-blue-600" />
                          <a href={`mailto:${talentDay.infoEntreprises.contact.email}`} className="text-blue-600 hover:underline">
                            {talentDay.infoEntreprises.contact.email}
                          </a>
                        </p>
                      )}
                      {talentDay.infoEntreprises.contact.telephone && (
                        <p className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-blue-600" />
                          <a href={`tel:${talentDay.infoEntreprises.contact.telephone}`} className="text-blue-600 hover:underline">
                            {talentDay.infoEntreprises.contact.telephone}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* CTA Entreprise */}
                <div className="mt-6">
                  <Link
                    to="/company-registration"
                    className="block w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold py-4 px-6 rounded-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-center"
                  >
                     Inscrire mon entreprise à cet événement
                  </Link>
                </div>
              </div>
            )}

            {/* Programme */}
            {talentDay.programme && talentDay.programme.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-primary" />
                  Programme
                </h2>
                <div className="space-y-4">
                  {talentDay.programme.map((item, index) => (
                    <div key={index} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                      <div className="flex-shrink-0">
                        <div className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-lg text-sm">
                          {item.heure}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.activite}</h3>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prérequis */}
            {talentDay.prerequis && talentDay.prerequis.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Prérequis</h2>
                <ul className="space-y-2">
                  {talentDay.prerequis.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Avantages */}
            {talentDay.avantages && talentDay.avantages.length > 0 && (
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Ce que vous allez gagner</h2>
                <ul className="space-y-2">
                  {talentDay.avantages.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Zap className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Partenaires */}
            {talentDay.partenaires && talentDay.partenaires.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Entreprises partenaires</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {talentDay.partenaires.map((partenaire, index) => (
                    <a
                      key={index}
                      href={partenaire.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      {partenaire.logo ? (
                        <img
                          src={partenaire.logo}
                          alt={partenaire.nom}
                          className="max-h-12 max-w-full object-contain"
                        />
                      ) : (
                        <span className="text-gray-600 font-medium">{partenaire.nom}</span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8 space-y-6">
              {/* Informations pratiques */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Informations pratiques</h3>
                <div className="space-y-4">
                  {/* Date */}
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-semibold text-gray-900">{formatDate(talentDay.date)}</p>
                    </div>
                  </div>

                  {/* Heure */}
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Horaires</p>
                      <p className="font-semibold text-gray-900">
                        {talentDay.heureDebut} - {talentDay.heureFin}
                      </p>
                    </div>
                  </div>

                  {/* Type d'événement */}
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Type d'événement</p>
                      <p className="font-semibold text-gray-900 capitalize">
                        {talentDay.typeEvenement.replace('-', ' ')}
                      </p>
                    </div>
                  </div>

                  {/* Niveau requis */}
                  {talentDay.niveauRequis && (
                    <div className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Niveau requis</p>
                        <p className="font-semibold text-gray-900 capitalize">
                          {talentDay.niveauRequis}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Lieu */}
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Lieu</p>
                      {talentDay.lieu.type === 'en-ligne' ? (
                        <div>
                          <p className="font-semibold text-gray-900 flex items-center gap-1">
                            <Globe className="w-4 h-4" />
                            En ligne
                          </p>
                          {talentDay.lieu.lienVirtuel && (
                            <a 
                              href={talentDay.lieu.lienVirtuel} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline"
                            >
                              Lien de connexion
                            </a>
                          )}
                        </div>
                      ) : (
                        <div>
                          <p className="font-semibold text-gray-900">
                            {talentDay.lieu.adresse && `${talentDay.lieu.adresse}`}
                            {talentDay.lieu.ville && (
                              <>
                                <br />
                                {talentDay.lieu.ville}
                              </>
                            )}
                          </p>
                          {talentDay.lieu.type === 'hybride' && talentDay.lieu.lienVirtuel && (
                            <a 
                              href={talentDay.lieu.lienVirtuel} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline"
                            >
                               Également en ligne
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Places */}
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Places disponibles</p>
                      <p className="font-semibold text-gray-900">
                        {talentDay.placesRestantes}/{talentDay.placesDisponibles}
                      </p>
                      {/* Barre de progression */}
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            (talentDay.placesRestantes / talentDay.placesDisponibles) > 0.5
                              ? 'bg-green-500'
                              : (talentDay.placesRestantes / talentDay.placesDisponibles) > 0.2
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ 
                            width: `${(talentDay.placesRestantes / talentDay.placesDisponibles) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technologies */}
              {talentDay.technologies && talentDay.technologies.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {talentDay.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-50 text-blue-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Bouton inscription */}
              <div className="border-t pt-6">
                {canRegister ? (
                  <button
                    onClick={() => setShowInscriptionModal(true)}
                    className="w-full bg-gradient-to-r from-secondary to-orange-600 text-white font-semibold py-4 px-6 rounded-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    S'inscrire maintenant
                  </button>
                ) : talentDay.statut === 'complet' ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <p className="text-red-800 font-semibold">Événement complet</p>
                  </div>
                ) : (
                  <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 text-center">
                    <p className="text-gray-600 font-semibold">Inscriptions fermées</p>
                  </div>
                )}
              </div>

              {/* Contact organisateur */}
              {talentDay.organisateur && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Contact organisateur</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    {talentDay.organisateur.nom && <p className="font-medium text-gray-900">{talentDay.organisateur.nom}</p>}
                    {talentDay.organisateur.email && (
                      <p className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${talentDay.organisateur.email}`} className="text-primary hover:underline">
                          {talentDay.organisateur.email}
                        </a>
                      </p>
                    )}
                    {talentDay.organisateur.telephone && (
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <a href={`tel:${talentDay.organisateur.telephone}`} className="text-primary hover:underline">
                          {talentDay.organisateur.telephone}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Inscription */}
      {showInscriptionModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowInscriptionModal(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Bouton Fermer */}
            <button
              onClick={() => setShowInscriptionModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Fermer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Titre */}
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Choisissez votre profil
            </h3>
            <p className="text-gray-600 mb-8">
              Comment souhaitez-vous vous inscrire à cet événement ?
            </p>

            {/* Options */}
            <div className="space-y-4">
              {/* Option Talent */}
              <button
                onClick={() => {
                  setShowInscriptionModal(false);
                  navigate(`/talent-days/${id}/register`);
                }}
                className="w-full bg-gradient-to-r from-secondary to-orange-600 text-white font-semibold py-4 px-6 rounded-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
              >
                <span className="text-2xl"></span>
                <span>Je suis un talent</span>
              </button>

              {/* Option Entreprise */}
              <button
                onClick={() => {
                  setShowInscriptionModal(false);
                  navigate('/company-registration');
                }}
                className="w-full bg-white border-2 border-primary text-primary font-semibold py-4 px-6 rounded-lg hover:bg-primary hover:text-white transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
              >
                <span className="text-2xl"></span>
                <span>Je représente une entreprise</span>
              </button>
            </div>

            {/* Info complémentaire */}
            <p className="text-sm text-gray-500 text-center mt-6">
              Sélectionnez l'option qui correspond à votre situation
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TalentDayDetail;