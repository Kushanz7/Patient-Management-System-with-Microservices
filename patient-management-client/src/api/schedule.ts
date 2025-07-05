import axios from "axios";

const BASE_URL = "http://localhost:4004/api/schedule";

export const addSchedule = (schedule: { doctorId: string; date: string; arrivalTime: string }) => axios.post(BASE_URL, schedule);

export const getSchedule = (doctorId: never, date: never) =>
    axios.get(`${BASE_URL}/${doctorId}/${date}`);

export const updateArrivalTime = (doctorId: string, date: string, arrivalTime: string) =>
    axios.put(`${BASE_URL}/${doctorId}/${date}`, { arrivalTime });