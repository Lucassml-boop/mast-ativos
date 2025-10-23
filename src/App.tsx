import Layout from './components/Layout';
import UserForm from './components/UserForm';
import AdminUsers from './pages/AdminUsers';
import AtivosList from './pages/AtivosList';
import ProtectedRoute from './components/ProtectedRoute';
import { Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <Layout>
      <div style={{ width: '100%' }}>
        <Routes>
          <Route path="/" element={<div className="card"><UserForm /></div>} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminUsers />
              </ProtectedRoute>
            } />
            <Route path="/ativos" element={
              <ProtectedRoute>
                <AtivosList />
              </ProtectedRoute>
            } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Layout>
  );
}

export default App;
