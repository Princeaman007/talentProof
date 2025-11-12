import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPortfolio = () => {
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedProjet, setSelectedProjet] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    descriptionLongue: '',
    client: '',
    technologies: [],
    categorie: '',
    url: '',
    dateRealisation: '',
    duree: '',
    statut: 'actif',
    ordre: 0,
    featured: false,
    screenshot: null
  });

  const [techInput, setTechInput] = useState('');

  useEffect(() => {
    fetchProjets();
  }, []);

  const fetchProjets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/portfolio', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjets(response.data.data);
    } catch (error) {
      console.error('Erreur chargement projets:', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement des projets' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      screenshot: e.target.files[0]
    }));
  };

  const handleAddTech = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()]
      }));
      setTechInput('');
    }
  };

  const handleRemoveTech = (tech) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  const openModal = (projet = null) => {
    if (projet) {
      setEditMode(true);
      setSelectedProjet(projet);
      setFormData({
        titre: projet.titre,
        description: projet.description,
        descriptionLongue: projet.descriptionLongue || '',
        client: projet.client || '',
        technologies: projet.technologies,
        categorie: projet.categorie,
        url: projet.url || '',
        dateRealisation: projet.dateRealisation ? projet.dateRealisation.split('T')[0] : '',
        duree: projet.duree || '',
        statut: projet.statut,
        ordre: projet.ordre,
        featured: projet.featured,
        screenshot: null
      });
    } else {
      setEditMode(false);
      setSelectedProjet(null);
      resetForm();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditMode(false);
    setSelectedProjet(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      titre: '',
      description: '',
      descriptionLongue: '',
      client: '',
      technologies: [],
      categorie: '',
      url: '',
      dateRealisation: '',
      duree: '',
      statut: 'actif',
      ordre: 0,
      featured: false,
      screenshot: null
    });
    setTechInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    const formDataToSend = new FormData();
    
    Object.keys(formData).forEach(key => {
      if (key === 'technologies') {
        formDataToSend.append(key, JSON.stringify(formData[key]));
      } else if (key === 'screenshot' && formData[key]) {
        formDataToSend.append(key, formData[key]);
      } else if (key !== 'screenshot') {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      if (editMode) {
        await axios.put(`/api/admin/portfolio/${selectedProjet._id}`, formDataToSend, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        setMessage({ type: 'success', text: 'Projet modifié avec succès' });
      } else {
        await axios.post('/api/admin/portfolio', formDataToSend, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        setMessage({ type: 'success', text: 'Projet créé avec succès' });
      }
      
      fetchProjets();
      closeModal();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Erreur:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Une erreur est survenue' 
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/admin/portfolio/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ type: 'success', text: 'Projet supprimé avec succès' });
      fetchProjets();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Erreur suppression:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la suppression' });
    }
  };

  const categories = [
    { value: 'site-vitrine', label: 'Site Vitrine' },
    { value: 'e-commerce', label: 'E-commerce' },
    { value: 'app-mobile', label: 'Application Mobile' },
    { value: 'app-web', label: 'Application Web' },
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'autre', label: 'Autre' }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Gestion du Portfolio</h1>
          <p className="text-slate-600 mt-1">Gérez vos projets réalisés</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-900 transition-colors font-semibold"
        >
          + Ajouter un projet
        </button>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Liste des projets */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : projets.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-slate-600 text-lg">Aucun projet pour le moment</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projets.map((projet) => (
            <div key={projet._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48">
                <img
                  src={`http://localhost:5000${projet.screenshot}`}
                  alt={projet.titre}
                  className="w-full h-full object-cover"
                />
                {projet.featured && (
                  <div className="absolute top-2 right-2 bg-accent text-white px-2 py-1 rounded-full text-xs font-bold">
                    ⭐ Featured
                  </div>
                )}
                <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold ${
                  projet.statut === 'actif' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                }`}>
                  {projet.statut}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{projet.titre}</h3>
                <p className="text-sm text-slate-600 mb-3 line-clamp-2">{projet.description}</p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {projet.technologies.slice(0, 3).map((tech, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 bg-slate-100 rounded">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(projet)}
                    className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(projet._id)}
                    className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors text-sm"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {editMode ? 'Modifier le projet' : 'Nouveau projet'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Titre *
                </label>
                <input
                  type="text"
                  name="titre"
                  value={formData.titre}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description courte *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description longue
                </label>
                <textarea
                  name="descriptionLongue"
                  value={formData.descriptionLongue}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Client
                  </label>
                  <input
                    type="text"
                    name="client"
                    value={formData.client}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Catégorie *
                  </label>
                  <select
                    name="categorie"
                    value={formData.categorie}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="">Sélectionner</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Technologies
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="Ajouter une technologie"
                  />
                  <button
                    type="button"
                    onClick={handleAddTech}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-900"
                  >
                    Ajouter
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.technologies.map((tech, idx) => (
                    <span key={idx} className="bg-slate-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      {tech}
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(tech)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    URL du projet
                  </label>
                  <input
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="https://"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Date de réalisation
                  </label>
                  <input
                    type="date"
                    name="dateRealisation"
                    value={formData.dateRealisation}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Durée
                  </label>
                  <input
                    type="text"
                    name="duree"
                    value={formData.duree}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="2 mois"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Statut
                  </label>
                  <select
                    name="statut"
                    value={formData.statut}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  >
                    <option value="actif">Actif</option>
                    <option value="inactif">Inactif</option>
                    <option value="archive">Archivé</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Ordre
                  </label>
                  <input
                    type="number"
                    name="ordre"
                    value={formData.ordre}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="w-5 h-5 text-primary"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    Projet mis en avant (Featured)
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Screenshot {!editMode && '*'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  required={!editMode}
                />
                {editMode && (
                  <p className="text-xs text-slate-500 mt-1">
                    Laissez vide pour conserver l'image actuelle
                  </p>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-200 text-slate-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-blue-900 transition-colors font-semibold"
                >
                  {editMode ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPortfolio;