import { useState } from 'react';
import { createUser } from '../api/users';

interface AddUserFormProps {
    token: string;
    onUserAdded: () => void;
}

export const AddUserForm = ({ token, onUserAdded }: AddUserFormProps) => {
    const [formData, setFormData] = useState<{
        email: string;
        password: string;
        role: 'DOCTOR' | 'ADMIN';
        fullName: string;
        specialization: string;
        phoneNumber: string;
    }>({
        email: '',
        password: '',
        role: 'DOCTOR',
        fullName: '',
        specialization: '',
        phoneNumber: ''
    });

    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createUser(formData, token);
            onUserAdded();
            setFormData({
                email: '',
                password: '',
                role: 'DOCTOR',
                fullName: '',
                specialization: '',
                phoneNumber: ''
            });
        } catch (err) {
            setError('Failed to create user');
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Add New Doctor/Admin</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                    />
                </div>
                <div>
                    <label>Role:</label>
                    <select
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value as 'ADMIN' | 'DOCTOR'})}
                    >
                        <option value="DOCTOR">Doctor</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                </div>
                <div>
                    <label>Full Name:</label>
                    <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        required
                    />
                </div>
                <div>
                    <label>Specialization:</label>
                    <input
                        type="text"
                        value={formData.specialization}
                        onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                        required={formData.role === 'DOCTOR'}
                    />
                </div>
                <div>
                    <label>Phone Number:</label>
                    <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    />
                </div>
                <button type="submit">Add User</button>
            </form>
        </div>
    );
};