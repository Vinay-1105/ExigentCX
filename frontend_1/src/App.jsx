import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import JoinCompany from './pages/JoinCompany';
import JoinExpert from './pages/JoinExpert';
import SignIn from './pages/SignIn';
import PrivacyDoc from './pages/PrivacyDoc';
import TermsOfService from './pages/TermsOfService';
import CompanyDashboard from './pages/CompanyDashboard';
import ExpertDashboard from './pages/ExpertDashboard';
import Requirements from './pages/Requirements';
import CreateRequirement from './pages/CreateRequirement';
import ExpertDiscovery from './pages/ExpertDiscovery';
import ExpertProfile from './pages/ExpertProfile';
import EngagementWorkspace from './pages/EngagementWorkspace';
import Contracts from './pages/Contracts';
import Payments from './pages/Payments';
import Settings from './pages/Settings';
import ExpertOpportunities from './pages/ExpertOpportunities';
import ExpertEngagements from './pages/ExpertEngagements';
import ExpertEarnings from './pages/ExpertEarnings';
import ExpertProfileBuilder from './pages/ExpertProfileBuilder';



import { AuthModalProvider } from './components/AuthModalContext';
import AuthModal from './components/AuthModal';

const AppContent = () => {
  const location = useLocation();
  const showNavbar = location.pathname === '/' || location.pathname === '/privacy-policy' || location.pathname === '/terms-of-service';
  const isDashboard = location.pathname === '/company-dashboard' || location.pathname === '/expert-dashboard' || location.pathname === '/requirements' || location.pathname === '/requirements/create' || location.pathname === '/experts' || location.pathname.startsWith('/experts/') || location.pathname.startsWith('/engagements') || location.pathname === '/settings' || location.pathname.startsWith('/expert-opportunities') || location.pathname.startsWith('/expert-engagements') || location.pathname === '/expert-earnings' || location.pathname === '/expert-profile';


  return (
    <AuthModalProvider>
      <div className="app-container">
        {showNavbar && <Navbar />}
        <AuthModal />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/join-company" element={<JoinCompany />} />
            <Route path="/join-expert" element={<JoinExpert />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/company-dashboard" element={<CompanyDashboard />} />
            <Route path="/requirements" element={<Requirements />} />
            <Route path="/requirements/create" element={<CreateRequirement />} />
            <Route path="/experts" element={<ExpertDiscovery />} />
            <Route path="/experts/:expertId" element={<ExpertProfile />} />
            <Route path="/engagements/:engagementId" element={<EngagementWorkspace />} />
            <Route path="/engagements" element={<EngagementWorkspace />} />
            <Route path="/contracts" element={<Contracts />} />
            <Route path="/contracts/:contractId" element={<Contracts />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/settings" element={<Settings />} />



            <Route path="/expert-dashboard" element={<ExpertDashboard />} />
            <Route path="/expert-opportunities" element={<ExpertOpportunities />} />
            <Route path="/expert-opportunities/:opportunityId" element={<ExpertOpportunities />} />
            <Route path="/expert-engagements" element={<ExpertEngagements />} />
            <Route path="/expert-engagements/:engagementId" element={<ExpertEngagements />} />
            <Route path="/expert-earnings" element={<ExpertEarnings />} />
            <Route path="/expert-profile" element={<ExpertProfileBuilder />} />
            <Route path="/privacy-policy" element={<PrivacyDoc />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
          </Routes>
        </main>
      </div>
    </AuthModalProvider>
  );
};

function App() {
  console.log('App mounted');
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
