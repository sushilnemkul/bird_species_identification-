import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BirdProvider } from './context/BirdContext';
import MainLayout from './layouts/MainLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Search from './pages/Search';
import History from './pages/History';
import Profile from './pages/Profile';
import AboutUs from './pages/AboutUs';

import BirdDetails from './pages/BirdDetails';
import NotFound from './pages/NotFound';
import Explore from './pages/Explore';
import ErrorBoundary from './components/ErrorBoundary';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Public Route (redirect to home if already logged in - optional, but good for login/register)
// Skipping for now to keep it simple

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <BirdProvider>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<AboutUs />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="explore" element={<Explore />} />
                <Route path="search" element={<Search />} />
                <Route path="bird-details" element={<BirdDetails />} />
              
              <Route 
                path="history" 
                element={
                  <ProtectedRoute>
                    <History />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch all - 404 page */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BirdProvider>
      </AuthProvider>
    </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
