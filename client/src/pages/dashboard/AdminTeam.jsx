import { FaUserShield } from 'react-icons/fa';

const AdminTeam = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary flex items-center space-x-3">
          <FaUserShield />
          <span>Gestion de l'Équipe</span>
        </h1>
        <p className="text-neutral mt-2">Gérer les membres de l'équipe TalentProof</p>
      </div>

      <div className="card text-center py-12">
        <FaUserShield className="text-6xl text-secondary mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-primary mb-2">Page en construction</h2>
        <p className="text-neutral">
          La gestion de l'équipe sera disponible prochainement
        </p>
      </div>
    </div>
  );
};

export default AdminTeam;