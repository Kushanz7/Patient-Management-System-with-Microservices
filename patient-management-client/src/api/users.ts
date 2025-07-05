import axios from 'axios';

interface CreateUserRequest {
    email: string;
    password: string;
    role: 'ADMIN' | 'DOCTOR';
    fullName: string;
    specialization: string;
    phoneNumber: string;
}

interface UserResponse {
    id: string;
    email: string;
    role: string;
    fullName: string;
    specialization: string;
    phoneNumber: string;
}

export const createUser = async (userData: CreateUserRequest, token: string) => {
    const response = await axios.post<UserResponse>(
        'http://localhost:4004/auth/api/users',
        userData,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }
    );
    return response.data;
};

export const getDoctors = async (token: string) => {
    const response = await axios.get<UserResponse[]>(
        'http://localhost:4004/auth/api/users/doctors',
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    return response.data;
};

export const getDoctorById = async (doctorId: string) => {
    return axios.get(`http://localhost:4004/auth/api/users/doctors/${doctorId}`);
};