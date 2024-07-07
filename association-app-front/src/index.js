import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "./index.css";

import HomePage from './pages/HomePage';
import NoPage from './pages/NoPage';
import AdherentsPage from './pages/AdherentsPage';
import AdherentPage from './pages/AdherentPage';
import AdherentUpdatePage from './pages/AdherentUpdatePage';
import AdministrateurLoginPage from './pages/AdministrateurLoginPage';
import AdministrateurDashboardPage from './pages/AdministrateurDashboardPage';
import AdherentLoginPage from './pages/AdherentLoginPage';
import EvenementsPage from "./pages/EvenementsPage";
import EvenementPage from './pages/EvenementPage';
import EvenementUpdatePage from './pages/EvenementUpdatePage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdministrateurDashboardPage />} />
        <Route path="/adherents" element={<AdherentsPage />} />
        <Route path="/adherents/:id" element={<AdherentPage />} />
        <Route path="/adherents/update/:id" element={<AdherentUpdatePage />} />
        <Route path="/admin/login" element={<AdministrateurLoginPage />} />
        <Route path="/evenements" element={<EvenementsPage />} />
        <Route path="/evenements/:id" element={<EvenementPage />} />
        <Route path="/evenements/update/:id" element={<EvenementUpdatePage />} />
        <Route path="/admin/dashboard" element={<AdministrateurDashboardPage />} />
        <Route path="/login" element={<AdherentLoginPage />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
