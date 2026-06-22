import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
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
import Analytics from './pages/Analytics';
import Messages from './pages/Messages';
import Meetings from './pages/Meetings';
import Pmo from './pages/Pmo';
import ExpertOpportunities from './pages/ExpertOpportunities';
import ExpertEngagements from './pages/ExpertEngagements';
import ExpertEarnings from './pages/ExpertEarnings';
import ExpertProfileBuilder from './pages/ExpertProfileBuilder';
import ExpertSettings from './pages/ExpertSettings';
import ExpertContracts from './pages/ExpertContracts';
import AdminSignUp from './pages/AdminSignUp';
import AdminDashboard from './pages/AdminDashboard';



import { AuthModalProvider } from './components/AuthModalContext';
import { ThemeProvider } from './components/ThemeContext';
import AuthModal from './components/AuthModal';

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Check if there is an auth error stored in sessionStorage by main.jsx (most reliable for initial load)
    const storedError = sessionStorage.getItem('auth_error');
    if (storedError) {
      try {
        const { message, role } = JSON.parse(storedError);
        sessionStorage.removeItem('auth_error');
        navigate(`/signin?role=${role}&error=${encodeURIComponent(message)}`);
        return;
      } catch (err) {
        console.error("Error parsing stored auth error:", err);
      }
    }

    // 2. Check current URL hash as a fallback (for in-page hash changes)
    if (window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const error = hashParams.get("error");
      const errorDescription = hashParams.get("error_description");
      const errorCode = hashParams.get("error_code");

      if (error || errorCode || errorDescription) {
        console.error("Auth error detected in hash:", { error, errorCode, errorDescription });

        // Clean up the hash from the URL so it doesn't loop or clutter the address bar
        window.history.replaceState(null, "", window.location.pathname + window.location.search);

        // Retrieve the stored logging-in role (fallback to expert if not found)
        const targetRole = localStorage.getItem('logging_in_role') || 'expert';
        localStorage.removeItem('logging_in_role');

        let friendlyMessage = errorDescription || error || "Authentication failed.";
        // Translate the error message to be more friendly and helpful
        if (errorCode === "otp_expired" || friendlyMessage.toLowerCase().includes("expired") || friendlyMessage.toLowerCase().includes("invalid")) {
          friendlyMessage = "The sign-in link has expired or has already been used. This is common if your email provider scans links for safety. Please try signing in again, or choose the OTP method for a more reliable login.";
        }

        // Redirect to the sign-in page with the correct role and the friendly error message
        navigate(`/signin?role=${targetRole}&error=${encodeURIComponent(friendlyMessage)}`);
      }
    }
  }, [navigate]);

  const showNavbar = location.pathname === '/' || location.pathname === '/privacy-policy' || location.pathname === '/terms-of-service';
  const isDashboard = location.pathname === '/company-dashboard' || location.pathname === '/expert-dashboard' || location.pathname === '/requirements' || location.pathname === '/requirements/create' || location.pathname === '/experts' || location.pathname.startsWith('/experts/') || location.pathname.startsWith('/engagements') || location.pathname === '/settings' || location.pathname.startsWith('/expert-opportunities') || location.pathname.startsWith('/expert-engagements') || location.pathname === '/expert-earnings' || location.pathname === '/expert-profile' || location.pathname === '/analytics' || location.pathname === '/pmo' || location.pathname === '/messages' || location.pathname === '/meetings' || location.pathname === '/admin-dashboard';


  return (
    <AuthModalProvider>
      <div className="app-container">
        {showNavbar && <Navbar />}
        <AuthModal />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
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
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/pmo" element={<Pmo />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/meetings" element={<Meetings />} />


            <Route path="/expert-dashboard" element={<ExpertDashboard />} />
            <Route path="/expert-opportunities" element={<ExpertOpportunities />} />
            <Route path="/expert-opportunities/:opportunityId" element={<ExpertOpportunities />} />
            <Route path="/expert-engagements" element={<ExpertEngagements />} />
            <Route path="/expert-engagements/:engagementId" element={<ExpertEngagements />} />
            <Route path="/expert-earnings" element={<ExpertEarnings />} />
            <Route path="/expert-profile" element={<ExpertProfileBuilder />} />
            <Route path="/expert-settings" element={<ExpertSettings />} />
            <Route path="/expert-contracts" element={<ExpertContracts />} />
            <Route path="/expert-contracts/:contractId" element={<ExpertContracts />} />
            <Route path="/privacy-policy" element={<PrivacyDoc />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/admin-signup" element={<AdminSignUp />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </AuthModalProvider>
  );
};

function App() {
  console.log('App mounted');
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
