import { FaUsers } from 'react-icons/fa';

const AdminTalents = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary flex items-center space-x-3">
          <FaUsers />
          <span>Gestion des Talents</span>
        </h1>
        <p className="text-neutral mt-2">Gérer les talents validés par TalentProof</p>
      </div>

      <div className="card text-center py-12">
        <FaUsers className="text-6xl text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-primary mb-2">Page en construction</h2>
        <p className="text-neutral">
          La gestion complète des talents sera disponible prochainement
        </p>
      </div>
    </div>
  );
};

export default AdminTalents;