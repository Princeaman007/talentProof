import { useState, useEffect } from 'react';
import { Building2, Mail, Phone, Globe, Calendar, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import api from '../../utils/api';
import { getCompanyDisplayName, formatDate, formatEmail, formatPhone, safeValue } from '../../utils/formatters';
import { toast } from 'react-toastify';
import { toastConfirm } from '../../utils/toastConfirm.jsx';

const AdminCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, [filter]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const statusParam = filter !== 'all' ? `?status=${filter}` : '';
      const response = await api.get(`/companies${statusParam}`);
        status: response.status,
        data: response.data,
        success: response.data.success,
        companiesCount: response.data.data?.length
      });
      
      if (response.data.success) {
        setCompanies(response.data.data);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des entreprises');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (companyId, newStatus) => {
    toastConfirm(
      `Confirmer le changement de statut vers "${newStatus}" ?`,
      async () => {
        try {
          setActionLoading(true);
          const response = await api.patch(`/companies/${companyId}/status`, { status: newStatus });
          
          if (response.data.success) {
            toast.success(`Statut mis à jour : ${newStatus}`);
            fetchCompanies();
            setSelectedCompany(null);
          }
        } catch (error) {
          toast.error('Erreur lors de la mise à jour');
        } finally {
          setActionLoading(false);
        }
      }
    );
  };

  const viewDetails = async (companyId) => {
    try {
      const response = await api.get(`/companies/${companyId}`);
      if (response.data.success) {
        setSelectedCompany(response.data.data);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des détails');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: 'En attente', color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: Clock },
      confirmed: { text: 'Confirmé', color: 'bg-green-100 text-green-800 border-green-300', icon: CheckCircle },
      rejected: { text: 'Refusé', color: 'bg-red-100 text-red-800 border-red-300', icon: XCircle },
    };
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {badge.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Inscriptions Entreprises
          </h1>
          <p className="text-gray-600">
            Gérez les inscriptions des entreprises aux TalentDays
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Toutes ({companies.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'pending'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              En attente
            </button>
            <button
              onClick={() => setFilter('confirmed')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'confirmed'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Confirmées
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'rejected'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Refusées
            </button>
          </div>
        </div>

        {/* Companies List */}
        <div className="grid grid-cols-1 gap-4">
          {companies.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucune inscription trouvée</p>
            </div>
          ) : (
            companies.map((company) => (
              <div key={company._id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-bold text-gray-900">{getCompanyDisplayName(company)}</h3>
                    {getStatusBadge(company.status)}
                  </div>
                  <p className="text-gray-600">Contact: {safeValue(company.contactPerson, 'Non spécifié')}</p>
                </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-primary" />
                    <a href={`mailto:${company.email}`} className="hover:underline">
                      {formatEmail(company.email)}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-primary" />
                    <a href={`tel:${company.phone}`} className="hover:underline">
                      {formatPhone(company.phone)}
                    </a>
                  </div>
                  {company.website && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Globe className="w-4 h-4 text-primary" />
                      <a href={company.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        Site web
                      </a>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    TalentDays d'intérêt ({company.interestedTalentDays?.length || 0}) :
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {company.interestedTalentDays?.map((td) => (
                      <span
                        key={td._id}
                        className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full"
                      >
                        {safeValue(td.titre, 'Sans titre')} - {formatDate(td.date)}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => viewDetails(company._id)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                  >
                    <Eye className="w-4 h-4" />
                    Détails
                  </button>

                  {company.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(company._id, 'confirmed')}
                        disabled={actionLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Confirmer
                      </button>
                      <button
                        onClick={() => handleStatusChange(company._id, 'rejected')}
                        disabled={actionLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" />
                        Refuser
                      </button>
                    </>
                  )}

                  {company.status === 'confirmed' && (
                    <button
                      onClick={() => handleStatusChange(company._id, 'rejected')}
                      disabled={actionLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" />
                      Annuler
                    </button>
                  )}

                  {company.status === 'rejected' && (
                    <button
                      onClick={() => handleStatusChange(company._id, 'confirmed')}
                      disabled={actionLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Confirmer
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Details Modal */}
        {selectedCompany && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Détails de l'inscription</h2>
                <button
                  onClick={() => setSelectedCompany(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-500">Entreprise</p>
                  <p className="text-lg font-bold text-gray-900">{getCompanyDisplayName(selectedCompany)}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-500">Contact</p>
                  <p className="text-gray-900">{safeValue(selectedCompany.contactPerson, 'Non spécifié')}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-500">Email</p>
                  <p className="text-gray-900">{formatEmail(selectedCompany.email)}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-500">Téléphone</p>
                  <p className="text-gray-900">{formatPhone(selectedCompany.phone)}</p>
                </div>

                {selectedCompany.website && (
                  <div>
                    <p className="text-sm font-semibold text-gray-500">Site web</p>
                    <a
                      href={selectedCompany.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {selectedCompany.website}
                    </a>
                  </div>
                )}

                {selectedCompany.notes && (
                  <div>
                    <p className="text-sm font-semibold text-gray-500">Notes</p>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedCompany.notes}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-2">Statut</p>
                  {getStatusBadge(selectedCompany.status)}
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-2">Meetings demandés</p>
                  <p className="text-gray-900">{selectedCompany.meetingRequests?.length || 0} demande(s)</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-500">Date d'inscription</p>
                  <p className="text-gray-900">
                    {formatDate(selectedCompany.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCompanies;
