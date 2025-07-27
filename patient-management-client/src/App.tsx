// src/App.tsx
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './components/Auth/PrivateRoute';
import { Login } from './pages/Login';
import PatientListPage from './pages/PatientListPage';
import AddPatientPage from './pages/AddPatientPage';
import { PatientDetail } from './pages/PatientDetail';
import { AdminDashboard } from './pages/AdminDashboard';
import AppointmentPage from "./pages/AppointmentPage";
import DoctorDashboard from "./pages/DoctorDashboard.tsx";
import BillingPage from "./pages/BillingPage.tsx";
import AdminLayout from './layout/layout';

export const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<PrivateRoute />}>
                        <Route path="/" element={<AdminLayout />}>
                            <Route path="patients">
                                <Route path="list" element={<PatientListPage />} />
                                <Route path="add" element={<AddPatientPage />} />
                                <Route path=":id" element={<PatientDetail />} />
                            </Route>
                            <Route path="adminDashboard" element={<AdminDashboard />} />
                            <Route path="appointments" element={<AppointmentPage />} />
                            <Route path="doctor/appointments" element={<DoctorDashboard />} />
                            <Route path="billing" element={<BillingPage />} />
                            <Route path="" element={<Navigate to="/patients/list" replace />} />
                        </Route>
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
};