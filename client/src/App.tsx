import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import IdeaInputMultiStep from "./pages/IdeaInputMultiStep";
import GenerateProposal from "./pages/GenerateProposal";
import Explore from "./pages/Explore";
import StartupDetail from "./pages/StartupDetail";
import AuthCallback from "./pages/AuthCallback";
import { AuthProvider } from "./contexts/AuthContext";
import { StartupProvider } from "./contexts/StartupContext";

function App() {
  return (
    <AuthProvider>
      <StartupProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/startup/:id" element={<StartupDetail />} />
              <Route path="/idea-input" element={<IdeaInputMultiStep />} />
              <Route path="/generate-proposal" element={<GenerateProposal />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
            </Routes>
          </Layout>
        </Router>
      </StartupProvider>
    </AuthProvider>
  );
}

export default App;
