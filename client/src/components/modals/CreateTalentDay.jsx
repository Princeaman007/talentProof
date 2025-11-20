import { useState, useEffect } from 'react';
import { FaTimes, FaSpinner } from 'react-icons/fa';
import talentDayService from '../../services/talentDayService';
import { getImageUrl } from '../../utils/api';

const CreateTalentDay = ({ talentDay, isEditing, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    date: '',
    heureDebut: '',
    heureFin: '',
    lieu: {
      type: 'physique',
      adresse: '',
      ville: '',
      lienVirtuel: '',
    },
    technologies: '',
    niveauRequis: 'tous-niveaux',
    placesDisponibles: 20,
    typeEvenement: 'workshop',
    image: '',
    statut: 'inscriptions-ouvertes',
    infoEntreprises: {
      titre: 'Pourquoi participer en tant qu\'entreprise ?',
      description: '',
      avantages: '',
      profils: '',
      formats: '',
      tarif: 'Gratuit',
      placesEntreprises: 10,
      contact: {
        nom: '',
        email: '',
        telephone: '',
      },
    },
  });

  // Populate form if editing
  useEffect(() => {
    if (talentDay && isEditing) {
      const defaultLieu = {
        type: 'physique',
        adresse: '',
        ville: '',
        lienVirtuel: '',
      };
      const _defaultInfoEntreprises = {
        titre: 'Pourquoi participer en tant qu\'entreprise ?',
        description: '',
        avantages: '',
        profils: '',
        formats: '',
        tarif: 'Gratuit',
        placesEntreprises: 10,
        contact: { nom: '', email: '', telephone: '' },
      };
      setFormData({
        titre: talentDay.titre,
        description: talentDay.description,
        date: talentDay.date?.split('T')[0] || '',
        heureDebut: talentDay.heureDebut,
        heureFin: talentDay.heureFin,
        lieu: talentDay.lieu || defaultLieu,
        technologies: talentDay.technologies?.join(', ') || '',
        niveauRequis: talentDay.niveauRequis,
        placesDisponibles: talentDay.placesDisponibles,
        typeEvenement: talentDay.typeEvenement,
        image: talentDay.image || '',
        statut: talentDay.statut,
        infoEntreprises: {
          titre: talentDay.infoEntreprises?.titre || 'Pourquoi participer en tant qu\'entreprise ?',
          description: talentDay.infoEntreprises?.description || '',
          avantages: talentDay.infoEntreprises?.avantages?.join('\n') || '',
          profils: talentDay.infoEntreprises?.profils?.join('\n') || '',
          formats: talentDay.infoEntreprises?.formats?.map(f => `${f.nom}: ${f.description} (${f.duree})`).join('\n') || '',
          tarif: talentDay.infoEntreprises?.tarif || 'Gratuit',
          placesEntreprises: talentDay.infoEntreprises?.placesEntreprises || 10,
          contact: talentDay.infoEntreprises?.contact || { nom: '', email: '', telephone: '' },
        },
      });
      // Afficher l'image existante
      if (talentDay.image) {
        setImagePreview(getImageUrl(talentDay.image));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [talentDay?._id, isEditing]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validation du fichier
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, image: 'Format de fichier non valide. Utilisez JPEG, PNG, GIF ou WEBP.' }));
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Le fichier est trop volumineux. Maximum 5MB.' }));
        return;
      }
      
      // Supprimer l'erreur d'image si elle existe
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.image;
        return newErrors;
      });
      
      setImageFile(file);
      
      // Créer un aperçu
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image: '' }));
    // Réinitialiser l'input file
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.titre?.trim()) newErrors.titre = 'Le titre est requis';
    if (!formData.description?.trim()) newErrors.description = 'La description est requise';
    if (!formData.date) newErrors.date = 'La date est requise';
    if (!formData.heureDebut) newErrors.heureDebut = 'L\'heure de début est requise';
    if (!formData.heureFin) newErrors.heureFin = 'L\'heure de fin est requise';
    if (!formData.typeEvenement) newErrors.typeEvenement = 'Le type d\'événement est requis';
    if (!formData.placesDisponibles || formData.placesDisponibles < 1) {
      newErrors.placesDisponibles = 'Au minimum 1 place requise';
    }

    // Location validation
    if (formData.lieu.type === 'physique' || formData.lieu.type === 'hybride') {
      if (!formData.lieu.adresse?.trim()) newErrors.adresse = 'L\'adresse est requise';
      if (!formData.lieu.ville?.trim()) newErrors.ville = 'La ville est requise';
    }

    if (formData.lieu.type === 'en-ligne' || formData.lieu.type === 'hybride') {
      if (!formData.lieu.lienVirtuel?.trim()) newErrors.lienVirtuel = 'Le lien virtuel est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Utiliser FormData pour supporter l'upload de fichier
      const formDataToSend = new FormData();
      
      formDataToSend.append('titre', formData.titre);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('heureDebut', formData.heureDebut);
      formDataToSend.append('heureFin', formData.heureFin);
      formDataToSend.append('lieu', JSON.stringify(formData.lieu));
      formDataToSend.append('technologies', JSON.stringify(
        formData.technologies.split(',').map((t) => t.trim()).filter((t) => t)
      ));
      formDataToSend.append('niveauRequis', formData.niveauRequis);
      formDataToSend.append('placesDisponibles', parseInt(formData.placesDisponibles));
      formDataToSend.append('placesRestantes', 
        isEditing && talentDay?.placesRestantes
          ? talentDay.placesRestantes
          : parseInt(formData.placesDisponibles)
      );
      formDataToSend.append('typeEvenement', formData.typeEvenement);
      formDataToSend.append('statut', formData.statut);
      formDataToSend.append('published', true);
      
      // Informations entreprises
      const infoEntreprises = {
        titre: formData.infoEntreprises.titre,
        description: formData.infoEntreprises.description,
        avantages: formData.infoEntreprises.avantages.split('\n').map(a => a.trim()).filter(a => a),
        profils: formData.infoEntreprises.profils.split('\n').map(p => p.trim()).filter(p => p),
        formats: formData.infoEntreprises.formats.split('\n').map(f => {
          const parts = f.split(':');
          if (parts.length >= 2) {
            const nom = parts[0].trim();
            const rest = parts.slice(1).join(':');
            const descMatch = rest.match(/(.+?)\((.+?)\)/);
            return {
              nom,
              description: descMatch ? descMatch[1].trim() : rest.trim(),
              duree: descMatch ? descMatch[2].trim() : '30 min'
            };
          }
          return null;
        }).filter(f => f),
        tarif: formData.infoEntreprises.tarif,
        placesEntreprises: parseInt(formData.infoEntreprises.placesEntreprises),
        contact: formData.infoEntreprises.contact,
      };
      formDataToSend.append('infoEntreprises', JSON.stringify(infoEntreprises));
      
      // Ajouter l'image si elle existe
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      } else if (isEditing && formData.image) {
        // En mode édition sans nouveau fichier, indiquer de conserver l'image existante
        formDataToSend.append('keepExistingImage', 'true');
        formDataToSend.append('existingImageUrl', formData.image);
      }

      let response;
      if (isEditing && talentDay?._id) {
        response = await talentDayService.updateTalentDay(talentDay._id, formDataToSend);
      } else {
        response = await talentDayService.createTalentDay(formDataToSend);
      }

      if (response.data?.success) {
        alert(isEditing ? 'Événement modifié avec succès' : 'Événement créé avec succès');
        
        // Réinitialiser le formulaire après succès
        if (!isEditing) {
          setImageFile(null);
          setImagePreview(null);
          setFormData({
            titre: '',
            description: '',
            date: '',
            heureDebut: '',
            heureFin: '',
            lieu: {
              type: 'physique',
              adresse: '',
              ville: '',
              lienVirtuel: '',
            },
            technologies: '',
            niveauRequis: 'tous-niveaux',
            placesDisponibles: 20,
            typeEvenement: 'workshop',
            image: '',
            statut: 'inscriptions-ouvertes',
          });
        }
        
        onSuccess();
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Erreur lors de la sauvegarde';
      alert('Erreur: ' + errorMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('lieu.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        lieu: {
          ...prev.lieu,
          [field]: value,
        },
      }));
    } else if (name.startsWith('infoEntreprises.')) {
      const field = name.split('.')[1];
      if (field === 'contact') {
        const contactField = name.split('.')[2];
        setFormData((prev) => ({
          ...prev,
          infoEntreprises: {
            ...prev.infoEntreprises,
            contact: {
              ...prev.infoEntreprises.contact,
              [contactField]: value,
            },
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          infoEntreprises: {
            ...prev.infoEntreprises,
            [field]: value,
          },
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 my-8">
        {/* Header */}
        <div className="flex justify-between items-center border-b p-6">
          <h3 className="text-xl font-bold text-gray-800">
            {isEditing ? 'Modifier l\'événement' : 'Créer un nouvel événement'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            disabled={loading}
          >
            <FaTimes />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Titre */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Titre *</label>
            <input
              type="text"
              name="titre"
              value={formData.titre}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.titre ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-primary/30'
                }`}
              maxLength="200"
            />
            {errors.titre && <p className="text-red-500 text-sm mt-1">{errors.titre}</p>}
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.description ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-primary/30'
                }`}
              maxLength="2000"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.date ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-primary/30'
                  }`}
              />
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Heure début *</label>
              <input
                type="time"
                name="heureDebut"
                value={formData.heureDebut}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.heureDebut ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-primary/30'
                  }`}
              />
              {errors.heureDebut && <p className="text-red-500 text-sm mt-1">{errors.heureDebut}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Heure fin *</label>
              <input
                type="time"
                name="heureFin"
                value={formData.heureFin}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.heureFin ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-primary/30'
                  }`}
              />
              {errors.heureFin && <p className="text-red-500 text-sm mt-1">{errors.heureFin}</p>}
            </div>
          </div>

          {/* Event Type and Level */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Type d'événement *</label>
              <select
                name="typeEvenement"
                value={formData.typeEvenement}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="workshop">Workshop</option>
                <option value="hackathon">Hackathon</option>
                <option value="challenge-code">Challenge Code</option>
                <option value="portfolio-day">Portfolio Day</option>
                <option value="entretien-groupe">Entretien Groupe</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Niveau requis</label>
              <select
                name="niveauRequis"
                value={formData.niveauRequis}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="tous-niveaux">Tous niveaux</option>
                <option value="debutant">Débutant</option>
                <option value="intermediaire">Intermédiaire</option>
                <option value="avance">Avancé</option>
              </select>
            </div>
          </div>

          {/* Location Type */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Type de lieu *</label>
            <select
              name="lieu.type"
              value={formData.lieu.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="physique">Physique</option>
              <option value="en-ligne">En ligne</option>
              <option value="hybride">Hybride</option>
            </select>
          </div>

          {/* Location Fields */}
          {(formData.lieu.type === 'physique' || formData.lieu.type === 'hybride') && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Adresse *</label>
                <input
                  type="text"
                  name="lieu.adresse"
                  value={formData.lieu.adresse}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.adresse ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-primary/30'
                    }`}
                />
                {errors.adresse && <p className="text-red-500 text-sm mt-1">{errors.adresse}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ville *</label>
                <input
                  type="text"
                  name="lieu.ville"
                  value={formData.lieu.ville}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.ville ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-primary/30'
                    }`}
                />
                {errors.ville && <p className="text-red-500 text-sm mt-1">{errors.ville}</p>}
              </div>
            </div>
          )}

          {/* Virtual Link */}
          {(formData.lieu.type === 'en-ligne' || formData.lieu.type === 'hybride') && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Lien virtuel *</label>
              <input
                type="url"
                name="lieu.lienVirtuel"
                value={formData.lieu.lienVirtuel}
                onChange={handleChange}
                placeholder="https://..."
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.lienVirtuel ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-primary/30'
                  }`}
              />
              {errors.lienVirtuel && <p className="text-red-500 text-sm mt-1">{errors.lienVirtuel}</p>}
            </div>
          )}

          {/* Technologies */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Technologies (séparées par des virgules)
            </label>
            <input
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              placeholder="JavaScript, React, Node.js"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Places */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre de places *</label>
            <input
              type="number"
              name="placesDisponibles"
              value={formData.placesDisponibles}
              onChange={handleChange}
              min="1"
              max="100"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.placesDisponibles ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-primary/30'
                }`}
            />
            {errors.placesDisponibles && <p className="text-red-500 text-sm mt-1">{errors.placesDisponibles}</p>}
          </div>

          {/* Section Entreprises */}
          <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
            <h4 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
               Informations pour les Entreprises
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Ces informations seront affichées aux entreprises pour les encourager à s'inscrire à cet événement.
            </p>

            {/* Titre section entreprise */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Titre de la section</label>
              <input
                type="text"
                name="infoEntreprises.titre"
                value={formData.infoEntreprises.titre}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Pourquoi participer en tant qu'entreprise ?"
              />
            </div>

            {/* Description pour entreprises */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description pour les entreprises</label>
              <textarea
                name="infoEntreprises.description"
                value={formData.infoEntreprises.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Décrivez pourquoi les entreprises devraient participer..."
              />
            </div>

            {/* Avantages */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Avantages (un par ligne)</label>
              <textarea
                name="infoEntreprises.avantages"
                value={formData.infoEntreprises.avantages}
                onChange={handleChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Rencontrer des talents pré-sélectionnés\nAccès aux portfolios et projets\nMeetings individuels de 30 minutes\nÉvénement gratuit"
              />
              <p className="text-xs text-gray-500 mt-1">Chaque ligne sera affichée comme une puce</p>
            </div>

            {/* Profils recherchés */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Profils de talents présents (un par ligne)</label>
              <textarea
                name="infoEntreprises.profils"
                value={formData.infoEntreprises.profils}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Développeurs Full-stack (React/Node)\nDéveloppeurs Mobile (React Native, Flutter)\nData Scientists"
              />
            </div>

            {/* Formats de meetings */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Formats disponibles (un par ligne)</label>
              <textarea
                name="infoEntreprises.formats"
                value={formData.infoEntreprises.formats}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Meeting individuel: Entretien technique avec le talent (30 min)\nPrésentation projet: Présenter votre entreprise et vos besoins (15 min)\nQ&A informelle: Discussion ouverte autour d'un café (20 min)"
              />
              <p className="text-xs text-gray-500 mt-1">Format: Nom: Description (Durée)</p>
            </div>

            {/* Tarif et Places */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tarif</label>
                <input
                  type="text"
                  name="infoEntreprises.tarif"
                  value={formData.infoEntreprises.tarif}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Gratuit"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Places entreprises</label>
                <input
                  type="number"
                  name="infoEntreprises.placesEntreprises"
                  value={formData.infoEntreprises.placesEntreprises}
                  onChange={handleChange}
                  min="1"
                  max="50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>

            {/* Contact */}
            <div className="border-t pt-4">
              <h5 className="text-sm font-bold text-gray-700 mb-3">Contact pour les entreprises</h5>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Nom</label>
                  <input
                    type="text"
                    name="infoEntreprises.contact.nom"
                    value={formData.infoEntreprises.contact.nom}
                    onChange={handleChange}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Marie Dupont"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    name="infoEntreprises.contact.email"
                    value={formData.infoEntreprises.contact.email}
                    onChange={handleChange}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="contact@exemple.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    name="infoEntreprises.contact.telephone"
                    value={formData.infoEntreprises.contact.telephone}
                    onChange={handleChange}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="+32 2 123 4567"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Image de l'événement
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.image ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-primary/30'
              }`}
            />
            <p className="text-xs text-gray-500 mt-1">
              Formats acceptés : JPEG, PNG, GIF, WEBP (max 5MB)
            </p>
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
            
            {/* Aperçu de l'image */}
            {imagePreview && (
              <div className="mt-3">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-semibold text-gray-700">Aperçu :</p>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Supprimer l'image
                  </button>
                </div>
                <img
                  src={imagePreview}
                  alt="Aperçu"
                  className="w-full h-48 object-cover rounded-lg border border-gray-300"
                />
              </div>
            )}
          </div>

          {/* Status (only when editing) */}
          {/* Status */}
          <div className="mb-4">{}
            <label className="block text-sm font-semibold text-gray-700 mb-2">Statut *</label>
            <select
              name="statut"
              value={formData.statut}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="a-venir">À venir</option>
              <option value="inscriptions-ouvertes">Inscriptions ouvertes</option>
              <option value="complet">Complet</option>
              <option value="en-cours">En cours</option>
              <option value="termine">Terminé</option>
              <option value="annule">Annulé</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Choisissez "Inscriptions ouvertes" pour permettre aux utilisateurs de s'inscrire
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition disabled:opacity-50"
          >
            {loading && <FaSpinner className="animate-spin" />}
            {isEditing ? 'Modifier' : 'Créer'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTalentDay;
