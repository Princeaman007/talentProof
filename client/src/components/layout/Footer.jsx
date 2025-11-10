import { Link } from 'react-router-dom';
import { FaCheckCircle, FaLinkedin, FaTwitter, FaGithub, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-primary to-primary-dark text-white">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* À propos */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-white p-2 rounded-lg">
                <FaCheckCircle className="text-primary text-2xl" />
              </div>
              <span className="text-2xl font-bold">TalentProof</span>
            </div>
            <p className="text-gray-300 mb-4">
              Le label de confiance pour les talents tech juniors en Wallonie et à Bruxelles.
            </p>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-xl font-bold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-secondary transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/talents" className="text-gray-300 hover:text-secondary transition-colors">
                  Talents
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-secondary transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-secondary transition-colors">
                  À propos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <FaEnvelope className="text-secondary" />
                <a href="mailto:info@princeaman.dev" className="text-gray-300 hover:text-secondary transition-colors">
                  info@princeaman.dev
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <FaPhone className="text-secondary" />
                <a href="tel:+32467620878" className="text-gray-300 hover:text-secondary transition-colors">
                  +32 467 62 08 78
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <FaMapMarkerAlt className="text-secondary mt-1" />
                <span className="text-gray-300">
                  Avenue de lille 4 A52<br />
                  4020 Liège, Belgique
                </span>
              </li>
            </ul>
          </div>

          {/* Réseaux sociaux */}
          <div>
            <h3 className="text-xl font-bold mb-4">Suivez-nous</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-white/10 p-3 rounded-full hover:bg-secondary transition-all transform hover:scale-110"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="text-xl" />
              </a>
              <a
                href="#"
                className="bg-white/10 p-3 rounded-full hover:bg-secondary transition-all transform hover:scale-110"
                aria-label="Twitter"
              >
                <FaTwitter className="text-xl" />
              </a>
              <a
                href="#"
                className="bg-white/10 p-3 rounded-full hover:bg-secondary transition-all transform hover:scale-110"
                aria-label="GitHub"
              >
                <FaGithub className="text-xl" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/20 mt-8 pt-6 text-center text-gray-300">
          <p>&copy; {currentYear} TalentProof. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;