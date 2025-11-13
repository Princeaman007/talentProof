import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import {
  FaUsers,
  FaBuilding,
  FaEnvelope,
  FaFileInvoice,
  FaCheckCircle,
  FaSpinner,
  FaTrophy,
} from 'react-icons/fa';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#1E3A8A', '#F97316', '#10B981', '#8B5CF6', '#EF4444'];

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [timeline, setTimeline] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('6m'); // 1m, 3m, 6m, 1y, all

  useEffect(() => {
    fetchStats();
    fetchTimeline();
  }, [period]);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Erreur récupération stats:', error);
    }
  };

  const fetchTimeline = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/stats/timeline?period=${period}`);
      setTimeline(response.data.timeline);
    } catch (error) {
      console.error('Erreur récupération timeline:', error);
    } finally {
      setLoading(false);
    }
  };

  // Formatter les données pour les graphiques
  const formatTimelineData = () => {
    if (!timeline) return [];

    const months = [
      'Jan',
      'Fév',
      'Mar',
      'Avr',
      'Mai',
      'Juin',
      'Juil',
      'Août',
      'Sep',
      'Oct',
      'Nov',
      'Déc',
    ];

    const dataMap = {};

    // Fusionner les données entreprises, talents et demandes
    timeline.entreprises?.forEach((item) => {
      const key = `${item._id.year}-${item._id.month}`;
      if (!dataMap[key]) {
        dataMap[key] = {
          mois: `${months[item._id.month - 1]} ${item._id.year}`,
          entreprises: 0,
          talents: 0,
          demandes: 0,
        };
      }
      dataMap[key].entreprises = item.count;
    });

    timeline.talents?.forEach((item) => {
      const key = `${item._id.year}-${item._id.month}`;
      if (!dataMap[key]) {
        dataMap[key] = {
          mois: `${months[item._id.month - 1]} ${item._id.year}`,
          entreprises: 0,
          talents: 0,
          demandes: 0,
        };
      }
      dataMap[key].talents = item.count;
    });

    timeline.contactRequests?.forEach((item) => {
      const key = `${item._id.year}-${item._id.month}`;
      if (!dataMap[key]) {
        dataMap[key] = {
          mois: `${months[item._id.month - 1]} ${item._id.year}`,
          entreprises: 0,
          talents: 0,
          demandes: 0,
        };
      }
      dataMap[key].demandes = item.count;
    });

    return Object.values(dataMap).sort((a, b) => {
      const [monthA, yearA] = a.mois.split(' ');
      const [monthB, yearB] = b.mois.split(' ');
      if (yearA !== yearB) return parseInt(yearA) - parseInt(yearB);
      return months.indexOf(monthA) - months.indexOf(monthB);
    });
  };

  if (!stats) {
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
        <h1 className="text-3xl font-bold text-primary">📊 Statistiques Avancées</h1>
        <p className="text-neutral mt-2">
          Vue d'ensemble complète de votre plateforme TalentProof
        </p>
      </div>

      {/* KPI Cards - Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Talents Totaux</p>
              <p className="text-3xl font-bold mt-1">{stats.talentsCount}</p>
              <p className="text-xs mt-2 opacity-75">
                {stats.talentsActifs} actifs
              </p>
            </div>
            <FaUsers className="text-5xl opacity-20" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Entreprises</p>
              <p className="text-3xl font-bold mt-1">{stats.entreprisesCount}</p>
              <p className="text-xs mt-2 opacity-75">
                {stats.entreprisesActives} actives
              </p>
            </div>
            <FaBuilding className="text-5xl opacity-20" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Taux de Succès</p>
              <p className="text-3xl font-bold mt-1">{stats.tauxSucces}%</p>
              <p className="text-xs mt-2 opacity-75">Demandes traitées</p>
            </div>
            <FaCheckCircle className="text-5xl opacity-20" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-orange-500 to-orange-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Demandes Contact</p>
              <p className="text-3xl font-bold mt-1">{stats.contactRequestsCount}</p>
              <p className="text-xs mt-2 opacity-75">Total reçues</p>
            </div>
            <FaEnvelope className="text-5xl opacity-20" />
          </div>
        </div>
      </div>

      {/* Stats récentes (30 jours) */}
      <div className="card">
        <h2 className="text-xl font-bold text-primary mb-4">
          📈 Activité des 30 derniers jours
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              +{stats.recentStats.newEntreprises}
            </p>
            <p className="text-sm text-neutral mt-1">Nouvelles entreprises</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              +{stats.recentStats.newTalents}
            </p>
            <p className="text-sm text-neutral mt-1">Nouveaux talents</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">
              +{stats.recentStats.newContactRequests}
            </p>
            <p className="text-sm text-neutral mt-1">Demandes de contact</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              +{stats.recentStats.newDevis}
            </p>
            <p className="text-sm text-neutral mt-1">Demandes de devis</p>
          </div>
        </div>
      </div>

      {/* Top Talents */}
      <div className="card">
        <h2 className="text-xl font-bold text-primary mb-4 flex items-center">
          <FaTrophy className="text-yellow-500 mr-2" />
          Top 5 Talents les plus demandés
        </h2>
        <div className="space-y-3">
          {stats.topTalents?.length > 0 ? (
            stats.topTalents.map((talent, index) => (
              <div
                key={talent._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-primary">{talent.prenom}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {talent.technologies?.slice(0, 3).map((tech, i) => (
                        <span
                          key={i}
                          className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-secondary">{talent.count}</p>
                  <p className="text-xs text-neutral">demandes</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-neutral text-center py-4">
              Aucune demande de contact pour le moment
            </p>
          )}
        </div>
      </div>

      {/* Graphiques - Évolution temporelle */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-primary">
            📊 Évolution dans le temps
          </h2>
          <div className="flex space-x-2">
            {['1m', '3m', '6m', '1y', 'all'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                  period === p
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-neutral hover:bg-gray-200'
                }`}
              >
                {p === 'all' ? 'Tout' : p}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-80">
            <FaSpinner className="animate-spin text-primary text-3xl" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={formatTimelineData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mois" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="entreprises"
                stroke="#1E3A8A"
                strokeWidth={2}
                name="Entreprises"
              />
              <Line
                type="monotone"
                dataKey="talents"
                stroke="#10B981"
                strokeWidth={2}
                name="Talents"
              />
              <Line
                type="monotone"
                dataKey="demandes"
                stroke="#F97316"
                strokeWidth={2}
                name="Demandes"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Actions rapides */}
      <div className="card">
        <h2 className="text-xl font-bold text-primary mb-4">🚀 Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/dashboard/admin/entreprises"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition text-center"
          >
            <FaBuilding className="text-3xl text-primary mx-auto mb-2" />
            <p className="font-semibold">Gérer Entreprises</p>
          </Link>
          <Link
            to="/dashboard/admin/contact-requests"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-secondary hover:shadow-md transition text-center"
          >
            <FaEnvelope className="text-3xl text-secondary mx-auto mb-2" />
            <p className="font-semibold">Demandes Contact</p>
          </Link>
          <Link
            to="/dashboard/admin/talents"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-accent hover:shadow-md transition text-center"
          >
            <FaUsers className="text-3xl text-accent mx-auto mb-2" />
            <p className="font-semibold">Gérer Talents</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;