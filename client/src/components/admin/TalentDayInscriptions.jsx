import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { FaSpinner, FaEnvelope, FaPhone, FaCalendar, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';

const TalentDayInscriptions = ({ talentDayId, onClose }) => {
  const [inscriptions, setInscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInscriptions();
    // eslint-disable-next-line
  }, [talentDayId]);

  const fetchInscriptions = async () => {
    try {
      setLoading(true);
      console.log(' Fetching inscriptions for TalentDay:', talentDayId);
      
      const response = await api.get(`/talent-days/${talentDayId}/inscriptions`);
      
      console.log(' Réponse API:', response.data);
      console.log(' Nombre d\'inscriptions:', response.data.count);
      
      if (response.data.success) {
        setInscriptions(response.data.data);
        console.log(' Inscriptions chargées:', response.data.data.length);
      } else {
        console.error(' Success = false:', response.data.message);
      }
    } catch (err) {
      console.error(' Erreur complète:', err.response?.data || err.message);
      setError('Erreur lors du chargement des inscriptions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatut = async (inscriptionIndex, newStatut) => {
    try {
      const inscription = inscriptions[inscriptionIndex];
      console.log(' Mise à jour statut:', { inscriptionIndex, newStatut, talentDayId });
      
      const response = await api.put(
        `/talent-days/${talentDayId}/inscriptions/${inscriptionIndex}`,
        { statut: newStatut }
      );
      
      console.log(' Statut mis à jour:', response.data);
      
      // Rafraîchir la liste
      await fetchInscriptions();
      
      // Message personnalisé avec emoji
      const statutEmoji = {
        'accepte': '',
        'refuse': '',
        'en-attente': '',
        'liste-attente': ''
      };
      
      const message = response.data.message || `${statutEmoji[newStatut]} ${inscription.nom} - ${newStatut.replace('-', ' ')}`;
      
      // Afficher une notification plus visible
      if (response.data.emailEnvoye) {
        alert(`${message}\n\n Un email de notification a été envoyé à ${inscription.email}`);
      } else {
        alert(message);
      }
    } catch (err) {
      console.error(' Erreur mise à jour statut:', err.response?.data || err.message);
      alert('Erreur lors de la mise à jour du statut: ' + (err.response?.data?.message || err.message));
    }
  };

  const exportCSV = () => {
    const csv = [
      ['Nom', 'Email', 'Téléphone', 'Motivation', 'Date inscription', 'Statut'],
      ...inscriptions.map(i => [
        i.nom,
        i.email,
        i.telephone || '',
        i.motivation,
        new Date(i.dateInscription).toLocaleString('fr-BE'),
        i.statut
      ])
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inscriptions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <FaSpinner className="animate-spin text-primary text-4xl mx-auto" />
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl my-8">
        {/* Header */}
        <div className="flex justify-between items-center border-b p-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              Inscriptions ({inscriptions.length})
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Gérez les inscriptions à votre événement
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Actions */}
        <div className="border-b p-4 bg-gray-50 flex justify-between items-center">
          <div className="flex gap-4 text-sm">
            <span className="flex items-center gap-2">
              <FaClock className="text-yellow-500" />
              En attente: {inscriptions.filter(i => i.statut === 'en-attente').length}
            </span>
            <span className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500" />
              Acceptés: {inscriptions.filter(i => i.statut === 'accepte').length}
            </span>
            <span className="flex items-center gap-2">
              <FaTimesCircle className="text-red-500" />
              Refusés: {inscriptions.filter(i => i.statut === 'refuse').length}
            </span>
          </div>
          <button
            onClick={exportCSV}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-green-700 transition text-sm font-semibold"
          >
             Exporter CSV
          </button>
        </div>

        {/* Liste des inscriptions */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {inscriptions.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-lg">Aucune inscription pour le moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {inscriptions.map((inscription, index) => (
                <div
                  key={inscription._id || index}
                  className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">
                        {inscription.nom}
                      </h4>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                        <a
                          href={`mailto:${inscription.email}`}
                          className="flex items-center gap-2 hover:text-primary"
                        >
                          <FaEnvelope className="text-primary" />
                          {inscription.email}
                        </a>
                        {inscription.telephone && (
                          <a
                            href={`tel:${inscription.telephone}`}
                            className="flex items-center gap-2 hover:text-primary"
                          >
                            <FaPhone className="text-primary" />
                            {inscription.telephone}
                          </a>
                        )}
                        <span className="flex items-center gap-2">
                          <FaCalendar className="text-primary" />
                          {new Date(inscription.dateInscription).toLocaleDateString('fr-BE', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Statut */}
                    <select
                      value={inscription.statut}
                      onChange={(e) => updateStatut(index, e.target.value)}
                      className={`px-3 py-2 rounded-lg font-semibold text-sm border-2 ${
                        inscription.statut === 'accepte'
                          ? 'bg-green-100 text-green-800 border-green-300'
                          : inscription.statut === 'refuse'
                          ? 'bg-red-100 text-red-800 border-red-300'
                          : 'bg-yellow-100 text-yellow-800 border-yellow-300'
                      }`}
                    >
                      <option value="en-attente"> En attente</option>
                      <option value="accepte"> Accepté</option>
                      <option value="refuse"> Refusé</option>
                      <option value="liste-attente"> Liste d'attente</option>
                    </select>
                  </div>

                  {/* Motivation */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                       Motivation :
                    </p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg italic">
                      {inscription.motivation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default TalentDayInscriptions;