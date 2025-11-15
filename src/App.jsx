import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Competitors from './pages/Competitors';
import CompetitorDetail from './pages/CompetitorDetail';
import Updates from './pages/Updates';
import Trends from './pages/Trends';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Comparison from './pages/Comparison';
import Loading from './components/Loading';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/" /> : <Register />} 
        />

        {/* Private routes */}
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="competitors" element={<Competitors />} />
          <Route path="competitors/:id" element={<CompetitorDetail />} />
          <Route path="updates" element={<Updates />} />
          <Route path="trends" element={<Trends />} />
          <Route path="comparison" element={<Comparison />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;