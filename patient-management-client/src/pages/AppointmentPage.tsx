import BookAppointmentForm from "../components/Appointments/BookAppointmentForm";
import PatientAppointments from "../components/Appointments/PatientAppointments";

const AppointmentPage = () => {
    return (
        <div>
            <h1>Appointments</h1>
            <BookAppointmentForm />
            <hr />
            <PatientAppointments />
        </div>
    );
};

export default AppointmentPage;
