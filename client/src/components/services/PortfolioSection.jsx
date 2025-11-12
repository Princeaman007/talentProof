import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PortfolioSection = () => {
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categorieActive, setCategorieActive] = useState('tous');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchProjets();
  }, [categorieActive]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/portfolio/categories');
      setCategories([
        { value: 'tous', label: 'Tous les projets' },
        ...response.data.data
      ]);
    } catch (error) {
      console.error('Erreur chargement catégories:', error);
    }
  };

  const fetchProjets = async () => {
    try {
      setLoading(true);
      const params = categorieActive !== 'tous' ? { categorie: categorieActive } : {};
      const response = await axios.get('/api/portfolio', { params });
      setProjets(response.data.data);
    } catch (error) {
      console.error('Erreur chargement projets:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategorieColor = (categorie) => {
    const colors = {
      'site-vitrine': 'bg-blue-100 text-blue-800',
      'e-commerce': 'bg-purple-100 text-purple-800',
      'app-mobile': 'bg-green-100 text-green-800',
      'app-web': 'bg-orange-100 text-orange-800',
      'dashboard': 'bg-red-100 text-red-800',
      'autre': 'bg-gray-100 text-gray-800'
    };
    return colors[categorie] || 'bg-gray-100 text-gray-800';
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Notre Portfolio
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Découvrez nos réalisations et l'expertise de nos talents validés
          </p>
        </div>

        {/* Filtres par catégorie */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategorieActive(cat.value)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                categorieActive === cat.value
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grille de projets */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-slate-600">Chargement des projets...</p>
          </div>
        ) : projets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-slate-600">Aucun projet disponible pour cette catégorie</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projets.map((projet) => (
              <div
                key={projet._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Image du projet */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={`http://localhost:5000${projet.screenshot}`}
                    alt={projet.titre}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                  {projet.featured && (
                    <div className="absolute top-4 right-4 bg-accent text-white px-3 py-1 rounded-full text-sm font-medium">
                      ⭐ Featured
                    </div>
                  )}
                </div>

                {/* Contenu */}
                <div className="p-6">
                  {/* Badge catégorie */}
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${getCategorieColor(projet.categorie)}`}>
                    {projet.categorie.replace('-', ' ').toUpperCase()}
                  </span>

                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {projet.titre}
                  </h3>

                  <p className="text-slate-600 mb-4 line-clamp-2">
                    {projet.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {projet.technologies.slice(0, 3).map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                    {projet.technologies.length > 3 && (
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">
                        +{projet.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Boutons */}
                  <div className="flex gap-3">
                    <Link
                      to={`/portfolio/${projet._id}`}
                      className="flex-1 bg-primary text-white text-center py-2 rounded-lg hover:bg-blue-900 transition-colors"
                    >
                      Voir le projet
                    </Link>
                    {projet.url && (
                      <a
                        href={projet.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-blue-50 transition-colors"
                        title="Visiter le site"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        {projets.length > 0 && (
          <div className="text-center mt-12">
            <Link
              to="/services/devis"
              className="inline-block bg-secondary text-white px-8 py-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Démarrer votre projet
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default PortfolioSection;