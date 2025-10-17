import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Programs } from './pages/Programs';
import { ProgramDetail } from './pages/ProgramDetail';
import { SessionWorkout } from './pages/SessionWorkout';
import { SessionSummary } from './pages/SessionSummary';
import { Badges } from './pages/Badges';
import { Profile } from './pages/Profile';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Private Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/programs"
            element={
              <PrivateRoute>
                <Programs />
              </PrivateRoute>
            }
          />
          <Route
            path="/programs/:id"
            element={
              <PrivateRoute>
                <ProgramDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/session/:id"
            element={
              <PrivateRoute>
                <SessionWorkout />
              </PrivateRoute>
            }
          />
          <Route
            path="/session-summary"
            element={
              <PrivateRoute>
                <SessionSummary />
              </PrivateRoute>
            }
          />
          <Route
            path="/badges"
            element={
              <PrivateRoute>
                <Badges />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* Redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
