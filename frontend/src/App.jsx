import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import InstitutionListing from './pages/InstitutionListing';
import Menu from './pages/Menu';
import Wallet from './pages/Wallet';
import OrderHistory from './pages/OrderHistory';
import PlatformAdminDashboard from './pages/admin/PlatformAdminDashboard';
import InstitutionAdminDashboard from './pages/admin/InstitutionAdminDashboard';
import RegisterInstitution from './pages/RegisterInstitution';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-gray-700 border-t-white rounded-full animate-spin"></div>
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-950 text-white selection:bg-white selection:text-black">
          <Navbar />
          <main className="flex-1 container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/explore" element={
                <ProtectedRoute allowedRoles={['User']}>
                  <InstitutionListing />
                </ProtectedRoute>
              } />
              <Route path="/explore/:id" element={
                <ProtectedRoute allowedRoles={['User']}>
                  <Menu />
                </ProtectedRoute>
              } />
              
              <Route path="/wallet" element={
                <ProtectedRoute>
                  <Wallet />
                </ProtectedRoute>
              } />
              
              <Route path="/orders" element={
                <ProtectedRoute>
                  <OrderHistory />
                </ProtectedRoute>
              } />

              <Route path="/register-institution" element={
                <ProtectedRoute allowedRoles={['InstitutionAdmin']}>
                  <RegisterInstitution />
                </ProtectedRoute>
              } />

              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['PlatformAdmin']}>
                  <PlatformAdminDashboard />
                </ProtectedRoute>
              } />

              <Route path="/institution-admin" element={
                <ProtectedRoute allowedRoles={['InstitutionAdmin']}>
                  <InstitutionAdminDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
