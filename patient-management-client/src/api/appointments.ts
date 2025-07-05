import axios from "axios";

const BASE_URL = "http://localhost:4004/api/appointments";

export const createAppointment = (data: {
    patientId: string;
    doctorId: string;
    appointmentDate: string;
    appointmentTime: string;
}) => axios.post(BASE_URL, data);

export const getAppointmentsByPatient = (patientId: string) =>
    axios.get(`${BASE_URL}/patient/${patientId}`);

export const getAppointmentsByDoctor = (doctorId: string) =>
    axios.get(`${BASE_URL}/doctor/${doctorId}`);