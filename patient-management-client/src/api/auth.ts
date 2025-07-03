import axios from 'axios';

const API_URL = 'http://localhost:4004/auth';

interface LoginCredentials {
    email: string;
    password: string;
}

interface LoginResponse {
    token: string;
}

export const login = async (credentials: LoginCredentials) => {
    try {
        const response = await axios.post<LoginResponse>(
            'http://localhost:4004/auth/login',
            credentials,
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true, // Required if using cookies
            }
        );
        console.log('Login success:', response.data); // Check if token exists
        return response.data;
    } catch (error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        console.error('Login error:', error.response?.data || error.message);
        throw error;
    }
};

export const validateToken = (token: string) => {
    return axios.get(`${API_URL}/validate`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};