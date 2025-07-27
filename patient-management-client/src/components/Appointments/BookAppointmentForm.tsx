import { Form, Select, DatePicker, TimePicker, Button, message } from 'antd';
import { useState, useEffect, useContext } from 'react';
import { createAppointment } from "../../api/appointments";
import { getDoctors } from "../../api/users";
import { getPatientById } from "../../api/patients";
import { AuthContext } from '../../context/AuthContext';
import debounce from 'lodash/debounce';
import dayjs from 'dayjs';

interface Doctor {
    id: string;
    fullName: string;
    specialization: string;
}

const BookAppointmentForm = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [fetchingDoctors, setFetchingDoctors] = useState(false);
    const [fetchingPatient, setFetchingPatient] = useState(false);
    const [patientOptions, setPatientOptions] = useState<{ label: string; value: string }[]>([]);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const fetchDoctors = async () => {
            if (!token) return;
            
            setFetchingDoctors(true);
            try {
                const doctorsData = await getDoctors(token);
                setDoctors(doctorsData);
            } catch (err) {
                message.error('Failed to fetch doctors list');
            } finally {
                setFetchingDoctors(false);
            }
        };

        fetchDoctors();
    }, [token]);

    const handlePatientSearch = debounce(async (value: string) => {
        if (!value.trim() || !token) return;

        setFetchingPatient(true);
        try {
            const response = await getPatientById(value, token);
            const patient = response.data;
            setPatientOptions([{
                label: `${patient.name} (${patient.email})`,
                value: patient.id
            }]);
        } catch (err) {
            setPatientOptions([]);
        } finally {
            setFetchingPatient(false);
        }
    }, 500);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            await createAppointment({
                patientId: values.patientId,
                doctorId: values.doctorId,
                appointmentDate: values.appointmentDate.format('YYYY-MM-DD'),
                appointmentTime: values.appointmentTime.format('HH:mm'),
            });
            message.success('Appointment booked successfully!');
            form.resetFields();
            setPatientOptions([]); // Clear patient options after successful submission
        } catch (err) {
            message.error('Failed to book appointment.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            style={{ maxWidth: 600 }}
        >
            <Form.Item
                label="Patient ID"
                name="patientId"
                rules={[{ required: true, message: 'Please select a patient!' }]}
            >
                <Select
                    showSearch
                    placeholder="Enter patient ID"
                    loading={fetchingPatient}
                    onSearch={handlePatientSearch}
                    options={patientOptions}
                    filterOption={false}
                    notFoundContent={fetchingPatient ? 'Searching...' : 'No patient found'}
                    allowClear
                    onClear={() => setPatientOptions([])}
                />
            </Form.Item>

            <Form.Item
                label="Doctor"
                name="doctorId"
                rules={[{ required: true, message: 'Please select a doctor!' }]}
            >
                <Select
                    placeholder="Select doctor"
                    loading={fetchingDoctors}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={doctors.map(doctor => ({
                        value: doctor.id,
                        label: `${doctor.fullName} (${doctor.specialization})`,
                    }))}
                />
            </Form.Item>

            <Form.Item
                label="Appointment Date"
                name="appointmentDate"
                rules={[{ required: true, message: 'Please select a date!' }]}
            >
                <DatePicker 
                    style={{ width: '100%' }}
                    disabledDate={current => current && current.isBefore(dayjs().startOf('day'))}
                />
            </Form.Item>

            <Form.Item
                label="Appointment Time"
                name="appointmentTime"
                rules={[{ required: true, message: 'Please select a time!' }]}
            >
                <TimePicker 
                    style={{ width: '100%' }} 
                    format="HH:mm"
                    minuteStep={15}
                />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                    Book Appointment
                </Button>
            </Form.Item>
        </Form>
    );
};

export default BookAppointmentForm;