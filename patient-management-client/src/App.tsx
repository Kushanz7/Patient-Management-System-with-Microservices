import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './components/Auth/PrivateRoute';
import { Login } from './pages/Login';
import { Patients } from './pages/Patients';
import { PatientDetail } from './pages/PatientDetail';
import { AdminDashboard } from './pages/AdminDashboard';
import AppointmentPage from "./pages/AppointmentPage";
import DoctorDashboard from "./pages/DoctorDashboard.tsx";

export const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route element={<PrivateRoute />}>
                        <Route path="/patients" element={<Patients />} />
                        <Route path="/patients/:id" element={<PatientDetail />} />
                        <Route path="/adminDashboard" element={<AdminDashboard />} />
                        <Route path="/appointments" element={<AppointmentPage />} />
                        <Route path="/doctor/appointments" element={<DoctorDashboard />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/patients" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};