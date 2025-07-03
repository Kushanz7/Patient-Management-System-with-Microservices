import { useState } from 'react';
import { AddUserForm } from '../components/AddUserForm';
import { DoctorsList } from '../components/DoctorsList';
import { useAuth } from '../hooks/useAuth';

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
        </div>
    );
};