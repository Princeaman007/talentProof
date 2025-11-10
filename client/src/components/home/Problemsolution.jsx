import { FaExclamationTriangle, FaLightbulb } from 'react-icons/fa';

const ProblemSolution = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Le Problème */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 p-3 rounded-lg">
                <FaExclamationTriangle className="text-red-600 text-2xl" />
              </div>
              <h2 className="text-3xl font-bold text-primary">Le Problème</h2>
            </div>
            
            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-4 py-2">
                <h3 className="font-bold text-lg text-neutral-dark">Marché saturé</h3>
                <p className="text-neutral">
                  Beaucoup de jeunes diplômés n'arrivent pas à décrocher leur premier emploi, 
                  faute d'expérience ou de validation de leurs compétences.
                </p>
              </div>
              
              <div className="border-l-4 border-red-500 pl-4 py-2">
                <h3 className="font-bold text-lg text-neutral-dark">Recrutement difficile</h3>
                <p className="text-neutral">
                  Les entreprises ont du mal à recruter, car les CV et diplômes ne garantissent 
                  pas le niveau réel des candidats.
                </p>
              </div>
              
              <div className="border-l-4 border-red-500 pl-4 py-2">
                <h3 className="font-bold text-lg text-neutral-dark">Écart formation-emploi</h3>
                <p className="text-neutral">
                  Il existe un écart important entre la formation théorique et les compétences 
                  pratiques attendues en entreprise.
                </p>
              </div>
            </div>
          </div>
          
          {/* La Solution */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-accent/20 p-3 rounded-lg">
                <FaLightbulb className="text-accent text-2xl" />
              </div>
              <h2 className="text-3xl font-bold text-primary">Notre Solution</h2>
            </div>
            
            <div className="space-y-4">
              <div className="border-l-4 border-accent pl-4 py-2">
                <h3 className="font-bold text-lg text-neutral-dark">Talent Days</h3>
                <p className="text-neutral">
                  Journées de tests pratiques sans IA. Chaque candidat travaille sur un vrai projet 
                  technique, dans des conditions similaires à l'entreprise.
                </p>
              </div>
              
              <div className="border-l-4 border-accent pl-4 py-2">
                <h3 className="font-bold text-lg text-neutral-dark">Certification interne</h3>
                <p className="text-neutral">
                  Les meilleurs profils obtiennent une certification "Validé par TalentProof" 
                  reconnue par nos entreprises partenaires.
                </p>
              </div>
              
              <div className="border-l-4 border-accent pl-4 py-2">
                <h3 className="font-bold text-lg text-neutral-dark">Accompagnement</h3>
                <p className="text-neutral">
                  Parcours de perfectionnement avec nos partenaires formation (Forem, Technifutur) 
                  avant la mise en relation avec les entreprises.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;