import axios from 'axios';

const API_URL = 'http://localhost:4004/api';

export interface Patient {
    id: string;
    name: string;
    email: string;
    address?: string;
    dateOfBirth?: string;
}

// src/api/patients.ts
export const getPatients = async () => {
    const token = localStorage.getItem('token'); // Retrieve token
    if (!token) throw new Error('No token found');

    const response = await axios.get<Patient[]>(
        'http://localhost:4004/api/patients',
        {
            headers: {
                Authorization: `Bearer ${token}`, // Attach token
            },
        }
    );
    return response.data;
};

export const getPatientById = (id: string, token: string) => {
    return axios.get<Patient>(`${API_URL}/patients/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const createPatient = (patient: Omit<Patient, 'id'>, token: string) => {
    return axios.post<Patient>(`${API_URL}/patients`, patient, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const updatePatient = (id: string, patient: Partial<Patient>, token: string) => {
    return axios.put<Patient>(`${API_URL}/patients/${id}`, patient, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const deletePatient = (id: string, token: string) => {
    return axios.delete(`${API_URL}/patients/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const searchPatients = (query: string, token: string) => {
    return axios.get<Patient[]>(`${API_URL}/patients/search?query=${query}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};