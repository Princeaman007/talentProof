import Hero from '../components/home/Hero';
import ProblemSolution from '../components/home/ProblemSolution';
import Services from '../components/home/Services';
import HowItWorks from '../components/home/HowItWorks';

const Home = () => {
  return (
    <div>
      <Hero />
      <ProblemSolution />
      <Services />
      <HowItWorks />
    </div>
  );
};

export default Home;