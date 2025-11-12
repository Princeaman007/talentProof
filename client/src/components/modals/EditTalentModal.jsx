import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { FaTimes, FaSave } from 'react-icons/fa';

// Constantes
const TECHNOLOGIES = [
  'React.js', 'Vue.js', 'Angular', 'Next.js', 'Node.js', 'Express', 'Python',
  'Django', 'PHP', 'Laravel', 'MongoDB', 'PostgreSQL', 'MySQL', 'JavaScript',
  'TypeScript', 'Docker', 'AWS', 'GraphQL', 'React Native', 'Flutter',
];

const PROFIL_TYPES = ['Frontend', 'Backend', 'Full-stack', 'Mobile', 'DevOps', 'Data'];
const NIVEAUX = ['Junior', 'Medior', 'Senior'];
const TYPES_CONTRAT = ['CDI', 'CDD', 'Freelance', 'Stage', 'Alternance'];
const DISPONIBILITES = ['Immédiate', '1-2 semaines', '1 mois', 'Non disponible'];
const PLATEFORMES = ['Codingame', 'HackerRank', 'LeetCode', 'CodeWars', 'Autre'];
const STATUTS = ['actif', 'inactif', 'en_mission'];
const LANGUES = ['Français', 'Anglais', 'Néerlandais', 'Allemand', 'Espagnol'];

const EditTalentModal = ({ talent, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    prenom: '',
    photo: '',
    typeProfil: 'Full-stack',
    niveau: 'Junior',
    typeContrat: 'CDI',
    anneeExperience: 0,  // ✅ SANS S
    technologies: [],
    competences: '',
    scoreTest: '',
    plateforme: 'HackerRank',
    disponibilite: 'Immédiate',
    localisation: 'Belgique',
    langues: ['Français'],
    tarifJournalier: '',
    portfolio: '',
    github: '',
    linkedin: '',
    statut: 'actif',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Charger les données du talent
  useEffect(() => {
    if (talent) {
      setFormData({
        prenom: talent.prenom || '',
        photo: talent.photo || '',
        typeProfil: talent.typeProfil || 'Full-stack',
        niveau: talent.niveau || 'Junior',
        typeContrat: talent.typeContrat || 'CDI',
        anneeExperience: talent.anneeExperience || 0,  // ✅ SANS S
        technologies: talent.technologies || [],
        competences: talent.competences || '',
        scoreTest: talent.scoreTest || '',
        plateforme: talent.plateforme || 'HackerRank',
        disponibilite: talent.disponibilite || 'Immédiate',
        localisation: talent.localisation || 'Belgique',
        langues: talent.langues || ['Français'],
        tarifJournalier: talent.tarifJournalier || '',
        portfolio: talent.portfolio || '',
        github: talent.github || '',
        linkedin: talent.linkedin || '',
        statut: talent.statut || 'actif',
      });
    }
  }, [talent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTechnologiesChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setFormData({ ...formData, technologies: selected });
  };

  const handleLanguesChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setFormData({ ...formData, langues: selected });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        scoreTest: Number(formData.scoreTest),
        anneeExperience: Number(formData.anneeExperience),  // ✅ SANS S
        tarifJournalier: formData.tarifJournalier ? Number(formData.tarifJournalier) : null,
      };

      console.log('📤 Payload envoyé:', payload);  // ✅ DEBUG

      await api.put(`/admin/talents/${talent._id}`, payload);
      onSuccess('Talent modifié avec succès !');
    } catch (error) {
      console.error('❌ Erreur modification:', error);
      setError(error.response?.data?.message || 'Erreur lors de la modification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-primary">Modifier le talent</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error */}
          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {/* Section 1: Informations de base */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary border-b pb-2">
              Informations de base
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Prénom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom *
                </label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              {/* Photo URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Photo
                </label>
                <input
                  type="url"
                  name="photo"
                  value={formData.photo}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="https://..."
                />
              </div>

              {/* Type de profil */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de profil *
                </label>
                <select
                  name="typeProfil"
                  value={formData.typeProfil}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  {PROFIL_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Niveau */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Niveau *
                </label>
                <select
                  name="niveau"
                  value={formData.niveau}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  {NIVEAUX.map(niveau => (
                    <option key={niveau} value={niveau}>{niveau}</option>
                  ))}
                </select>
              </div>

              {/* Type de contrat */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de contrat *
                </label>
                <select
                  name="typeContrat"
                  value={formData.typeContrat}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  {TYPES_CONTRAT.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Années d'expérience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Années d'expérience *
                </label>
                <input
                  type="number"
                  name="anneeExperience"  // ✅ SANS S
                  value={formData.anneeExperience}  // ✅ SANS S
                  onChange={handleChange}
                  className="input-field"
                  min="0"
                  max="50"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Compétences techniques */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary border-b pb-2">
              Compétences techniques
            </h3>

            {/* Technologies */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technologies * <span className="text-xs text-gray-500">(Ctrl+clic pour sélection multiple)</span>
              </label>
              <select
                multiple
                value={formData.technologies}
                onChange={handleTechnologiesChange}
                className="input-field h-40"
                required
              >
                {TECHNOLOGIES.map(tech => (
                  <option key={tech} value={tech}>{tech}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {formData.technologies.length} technologie(s) sélectionnée(s)
              </p>
            </div>

            {/* Compétences */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description des compétences *
              </label>
              <textarea
                name="competences"
                value={formData.competences}
                onChange={handleChange}
                className="input-field"
                rows="4"
                placeholder="Décrivez les compétences et l'expérience du talent..."
                required
              />
            </div>
          </div>

          {/* Section 3: Tests et validation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary border-b pb-2">
              Tests et validation
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Score Test */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Score Test * <span className="text-xs text-gray-500">(0-100)</span>
                </label>
                <input
                  type="number"
                  name="scoreTest"
                  value={formData.scoreTest}
                  onChange={handleChange}
                  className="input-field"
                  min="0"
                  max="100"
                  required
                />
              </div>

              {/* Plateforme */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plateforme *
                </label>
                <select
                  name="plateforme"
                  value={formData.plateforme}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  {PLATEFORMES.map(plat => (
                    <option key={plat} value={plat}>{plat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Disponibilité et localisation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary border-b pb-2">
              Disponibilité et localisation
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Disponibilité */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Disponibilité *
                </label>
                <select
                  name="disponibilite"
                  value={formData.disponibilite}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  {DISPONIBILITES.map(dispo => (
                    <option key={dispo} value={dispo}>{dispo}</option>
                  ))}
                </select>
              </div>

              {/* Localisation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localisation *
                </label>
                <input
                  type="text"
                  name="localisation"
                  value={formData.localisation}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Belgique, Liège..."
                  required
                />
              </div>

              {/* Tarif journalier (pour Freelance) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tarif journalier (€) <span className="text-xs text-gray-500">(optionnel)</span>
                </label>
                <input
                  type="number"
                  name="tarifJournalier"
                  value={formData.tarifJournalier}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="500"
                  min="0"
                />
              </div>
            </div>

            {/* Langues */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Langues parlées * <span className="text-xs text-gray-500">(Ctrl+clic pour sélection multiple)</span>
              </label>
              <select
                multiple
                value={formData.langues}
                onChange={handleLanguesChange}
                className="input-field h-24"
                required
              >
                {LANGUES.map(langue => (
                  <option key={langue} value={langue}>{langue}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {formData.langues.length} langue(s) sélectionnée(s)
              </p>
            </div>
          </div>

          {/* Section 5: Liens professionnels */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary border-b pb-2">
              Liens professionnels <span className="text-xs font-normal text-gray-500">(optionnels)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Portfolio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Portfolio
                </label>
                <input
                  type="url"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="https://..."
                />
              </div>

              {/* GitHub */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GitHub
                </label>
                <input
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="https://github.com/..."
                />
              </div>

              {/* LinkedIn */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn
                </label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
            </div>
          </div>

          {/* Statut */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              name="statut"
              value={formData.statut}
              onChange={handleChange}
              className="input-field max-w-xs"
            >
              {STATUTS.map(statut => (
                <option key={statut} value={statut}>
                  {statut === 'actif' ? 'Actif' : statut === 'inactif' ? 'Inactif' : 'En mission'}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSave className="inline mr-2" />
              {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTalentModal;