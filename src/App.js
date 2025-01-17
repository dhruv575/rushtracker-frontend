import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import PresidentDashboard from './pages/PresidentDashboard';
import RCDashboard from './pages/RCDashboard';
import BrotherDashboard from './pages/BrotherDashboard';
import PublicRusheeForm from './pages/PublicRusheeForm';
import RusheeSubmissions from './components/Events/RusheeSubmissions';
import BrotherSubmissions from './components/Events/BrotherSubmissions';
import RusheeOnboardingForm from './components/Rushees/RusheeOnboardingForm';
import { getBrotherData } from './utils/auth';

const PrivateRoute = ({ children }) => {
  const brother = getBrotherData();
  if (!brother) {
    return <Navigate to="/login" />;
  }
  return children;
};

const DashboardRouter = () => {
  const brother = getBrotherData();

  switch (brother?.position) {
    case 'President':
      return <PresidentDashboard />;
    case 'Rush Chair':
      return <RCDashboard />;
    default:
      return <BrotherDashboard />;
  }
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/:fratId/rush/:eventId" element={<PublicRusheeForm />} />
        <Route path="/:fratId/rush/onboarding" element={<RusheeOnboardingForm />} />
        
        {/* Private routes */}
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardRouter />
            </PrivateRoute>
          }
        />
        <Route
          path="/:fratId/rush/:eventId/rushee-submissions"
          element={
            <PrivateRoute>
              <RusheeSubmissions />
            </PrivateRoute>
          }
        />
        <Route
          path="/:fratId/rush/:eventId/brother-submissions"
          element={
            <PrivateRoute>
              <BrotherSubmissions />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
