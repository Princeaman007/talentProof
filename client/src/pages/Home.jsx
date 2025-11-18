import Hero from '../components/home/Hero';
import ProblemSolution from '../components/home/Problemsolution';
import Services from '../components/home/services';
import HowItWorks from '../components/home/Howitworks';

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