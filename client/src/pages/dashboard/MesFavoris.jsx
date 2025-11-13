import { useState, useEffect } from 'react';
import api from '../../utils/api';
import {
  FaStar,
  FaTrash,
  FaEdit,
  FaSpinner,
  FaHeart,
  FaEnvelope,
  FaCheckCircle,
} from 'react-icons/fa';
import { TECH_COLORS } from '../../utils/constants';

const MesFavoris = () => {
  const [favoris, setFavoris] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState(null);
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    fetchFavoris();
  }, []);

  const fetchFavoris = async () => {
    try {
      setLoading(true);
      const response = await api.get('/entreprise/favoris');
      setFavoris(response.data.favoris);
    } catch (error) {
      console.error('Erreur récupération favoris:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavori = async (talentId) => {
    if (!confirm('Retirer ce talent de vos favoris ?')) return;

    try {
      await api.delete(`/entreprise/favoris/${talentId}`);
      setFavoris(favoris.filter((f) => f.talent._id !== talentId));
    } catch (error) {
      console.error('Erreur suppression favori:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleUpdateNote = async (talentId) => {
    try {
      await api.put(`/entreprise/favoris/${talentId}/note`, {
        note: noteText,
      });
      
      // Mettre à jour localement
      setFavoris(
        favoris.map((f) =>
          f.talent._id === talentId ? { ...f, note: noteText } : f
        )
      );
      
      setEditingNote(null);
      setNoteText('');
    } catch (error) {
      console.error('Erreur mise à jour note:', error);
      alert('Erreur lors de la mise à jour de la note');
    }
  };

  const getTechColor = (tech) => {
    return TECH_COLORS[tech] || TECH_COLORS.default;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <FaSpinner className="animate-spin text-primary text-4xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary flex items-center">
          <FaStar className="text-yellow-500 mr-3" />
          Mes Talents Favoris
        </h1>
        <p className="text-neutral mt-2">
          Gérez votre liste de talents shortlistés avec vos notes personnelles
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-gradient-to-br from-yellow-400 to-yellow-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Favoris</p>
              <p className="text-3xl font-bold mt-1">{favoris.length}</p>
            </div>
            <FaStar className="text-5xl opacity-20" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-blue-400 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Avec notes</p>
              <p className="text-3xl font-bold mt-1">
                {favoris.filter((f) => f.note).length}
              </p>
            </div>
            <FaEdit className="text-5xl opacity-20" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-green-400 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Derniers ajouts</p>
              <p className="text-3xl font-bold mt-1">
                {favoris.filter((f) => {
                  const dayAgo = new Date();
                  dayAgo.setDate(dayAgo.getDate() - 7);
                  return new Date(f.createdAt) > dayAgo;
                }).length}
              </p>
            </div>
            <FaHeart className="text-5xl opacity-20" />
          </div>
        </div>
      </div>

      {/* Liste des favoris */}
      {favoris.length === 0 ? (
        <div className="card text-center py-12">
          <FaStar className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-neutral mb-2">
            Aucun favori pour le moment
          </h3>
          <p className="text-neutral mb-4">
            Parcourez les talents et ajoutez-les à vos favoris en cliquant sur l'étoile
          </p>
          <a
            href="/dashboard/talents"
            className="inline-block btn-primary"
          >
            Découvrir les talents
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {favoris.map((favori) => {
            const talent = favori.talent;
            
            return (
              <div
                key={favori._id}
                className="card hover:shadow-lg transition group"
              >
                {/* Header avec actions */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {talent.photo ? (
                      <img
                        src={talent.photo}
                        alt={talent.prenom}
                        className="w-14 h-14 rounded-full object-cover border-2 border-primary"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {talent.prenom?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-bold text-primary">
                        {talent.prenom}
                      </h3>
                      <p className="text-sm text-neutral">
                        {talent.typeProfil} {talent.niveau}
                      </p>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleRemoveFavori(talent._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Retirer des favoris"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                    {talent.typeContrat}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                    {talent.disponibilite}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 font-medium flex items-center">
                    <FaCheckCircle className="mr-1" />
                    Score: {talent.scoreTest}/100
                  </span>
                </div>

                {/* Technologies */}
                <div className="mb-3">
                  <div className="flex flex-wrap gap-2">
                    {talent.technologies?.slice(0, 4).map((tech, i) => (
                      <span
                        key={i}
                        className={`text-xs px-2 py-1 rounded-full font-medium ${getTechColor(tech)}`}
                      >
                        {tech}
                      </span>
                    ))}
                    {talent.technologies?.length > 4 && (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                        +{talent.technologies.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Note personnelle */}
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-yellow-800 flex items-center">
                      <FaEdit className="mr-1" />
                      Ma note personnelle
                    </p>
                    {editingNote !== favori._id && (
                      <button
                        onClick={() => {
                          setEditingNote(favori._id);
                          setNoteText(favori.note || '');
                        }}
                        className="text-xs text-primary hover:text-primary-dark"
                      >
                        Modifier
                      </button>
                    )}
                  </div>
                  
                  {editingNote === favori._id ? (
                    <div>
                      <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Ajoutez une note sur ce talent..."
                        className="w-full px-3 py-2 border border-yellow-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-yellow-500"
                        rows="3"
                      />
                      <div className="flex justify-end space-x-2 mt-2">
                        <button
                          onClick={() => {
                            setEditingNote(null);
                            setNoteText('');
                          }}
                          className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={() => handleUpdateNote(talent._id)}
                          className="px-3 py-1 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                        >
                          Enregistrer
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-neutral italic">
                      {favori.note || 'Aucune note pour le moment'}
                    </p>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-3 text-xs text-neutral flex items-center justify-between">
                  <span>Ajouté le {formatDate(favori.createdAt)}</span>
                  <a
                    href={`/dashboard/talents?id=${talent._id}`}
                    className="text-primary hover:text-primary-dark font-medium"
                  >
                    Voir le profil →
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Astuce */}
      {favoris.length > 0 && (
        <div className="card bg-blue-50 border border-blue-200">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div className="flex-1">
              <h3 className="font-semibold text-primary mb-2">Astuce</h3>
              <p className="text-neutral text-sm">
                Utilisez les notes personnelles pour garder une trace de vos impressions
                sur chaque talent. Cela vous aidera à prendre une décision éclairée !
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MesFavoris;