import { useState } from 'react';
import { AddUserForm } from '../components/AddUserForm';
import { DoctorsList } from '../components/DoctorsList';
import { useAuth } from '../hooks/useAuth';
import ScheduleForm from "../components/ScheduleForm.tsx";
import UpdateArrivalForm from "../components/UpdateArrivalForm.tsx";

export const AdminDashboard = () => {
    const { token } = useAuth();
    const [refreshKey, setRefreshKey] = useState(0);

    if (!token) return <div>Unauthorized</div>;

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <AddUserForm
                token={token}
                onUserAdded={() => setRefreshKey(prev => prev + 1)}
            />
            <DoctorsList key={refreshKey} token={token} />
            <h3>Add Schedule</h3>
            <ScheduleForm />
            <h3>Update Arrival Time</h3>
            <UpdateArrivalForm />
        </div>
    );
};