import { Form, Select, DatePicker, TimePicker, Button, message, Row, Col, Card, List, Typography, Tag, Space } from 'antd';
import { useState, useEffect, useContext } from 'react';
import { createAppointment, getAppointmentsByDoctor } from "../../api/appointments";
import { getDoctors } from "../../api/users";
import { AuthContext } from '../../context/AuthContext';
import { getPatientById, searchPatients } from "../../api/patients";
import debounce from 'lodash/debounce';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

interface Doctor {
    id: string;
    fullName: string;
    specialization: string;
}

interface Patient {
    id: string;
    name: string;
    email: string;
}

interface Appointment {
    id: string;
    patientId: string;
    doctorId: string;
    appointmentDate: string;
    appointmentTime: string;
    doctorArrivalTime?: string;
    patientName?: string;
}

interface AppointmentFormValues {
    patientId: string;
    doctorId: string;
    appointmentDate: dayjs.Dayjs;
    appointmentTime: dayjs.Dayjs;
}

const BookAppointmentForm = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [fetchingDoctors, setFetchingDoctors] = useState(false);
    const [fetchingPatient, setFetchingPatient] = useState(false);
    const [patientOptions, setPatientOptions] = useState<{ label: string; value: string }[]>([]);
    const [doctorAppointments, setDoctorAppointments] = useState<Appointment[]>([]);
    const [loadingAppointments, setLoadingAppointments] = useState(false);
    const { token } = useContext(AuthContext);
    const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);

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

    const fetchPatientDetails = async (appointments: Appointment[]) => {
        if (!token) return [];

        const updatedAppointments = await Promise.all(
            appointments.map(async (appointment) => {
                try {
                    const patientResponse = await getPatientById(appointment.patientId, token);
                    return {
                        ...appointment,
                        patientName: patientResponse.data.name
                    };
                } catch (error) {
                    return {
                        ...appointment,
                        patientName: 'Unknown Patient'
                    };
                }
            })
        );
        return updatedAppointments;
    };

    const loadDoctorAppointments = async (selectedDoctorId: string) => {
        if (!selectedDoctorId || !token) return;

        setLoadingAppointments(true);
        try {
            const response = await getAppointmentsByDoctor(selectedDoctorId);
            const appointmentsWithPatients = await fetchPatientDetails(response.data);

            // Filter and sort appointments for today and future
            const now = dayjs();
            const filteredAppointments = appointmentsWithPatients
                .filter(appointment => {
                    const appointmentDate = dayjs(appointment.appointmentDate);
                    return appointmentDate.isSame(now, 'day') || appointmentDate.isAfter(now, 'day');
                })
                .sort((a, b) => {
                    const dateA = dayjs(`${a.appointmentDate} ${a.appointmentTime}`);
                    const dateB = dayjs(`${b.appointmentDate} ${b.appointmentTime}`);
                    return dateA.valueOf() - dateB.valueOf();
                });

            setDoctorAppointments(filteredAppointments);
        } catch (error) {
            message.error('Failed to load doctor appointments');
        } finally {
            setLoadingAppointments(false);
        }
    };

    const handleDoctorChange = (doctorId: string | null) => {
        setSelectedDoctor(doctorId);
        if (doctorId) {
            form.setFieldValue('doctorId', doctorId);
            loadDoctorAppointments(doctorId);
        } else {
            form.setFieldValue('doctorId', undefined);
            setDoctorAppointments([]);
        }
    };

    const handlePatientSearch = debounce(async (value: string) => {
        if (!value.trim() || !token) return;

        setFetchingPatient(true);
        try {
            const response = await searchPatients(value, token);
            const patients = response.data;
            setPatientOptions(
                patients.map(patient => ({
                    label: `${patient.name} (${patient.email})`,
                    value: patient.id
                }))
            );
        } catch (err) {
            setPatientOptions([]);
        } finally {
            setFetchingPatient(false);
        }
    }, 500);

    const handleSubmit = async (values: AppointmentFormValues) => {
        setLoading(true);
        try {
            await createAppointment({
                patientId: values.patientId,
                doctorId: values.doctorId,
                appointmentDate: values.appointmentDate.format('YYYY-MM-DD'),
                appointmentTime: values.appointmentTime.format('HH:mm'),
            });
            message.success('Appointment booked successfully!');
            loadDoctorAppointments(values.doctorId); // Refresh appointments list
            form.resetFields();
            setPatientOptions([]);
        } catch (err) {
            message.error('Failed to book appointment.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Row gutter={24}>
            <Col span={12}>
                <Form
                    form={form}
                    onFinish={handleSubmit}
                    layout="vertical"
                >
                    <Form.Item
                        label="Patient Name"
                        name="patientId"
                        rules={[{ required: true, message: 'Please select a patient!' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Enter patient Name"
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
                            onChange={handleDoctorChange}
                            allowClear
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
            </Col>

            <Col span={12}>
                <Card>
                    <Title level={4}>
                        {selectedDoctor
                            ? `Doctor's Appointments ${doctors.find(d => d.id === selectedDoctor)?.fullName || ''}`
                            : 'Select a doctor to view appointments'}
                    </Title>
                    <List
                        loading={loadingAppointments}
                        dataSource={doctorAppointments}
                        locale={{
                            emptyText: selectedDoctor
                                ? 'No appointments found'
                                : 'Please select a doctor to view their appointments'
                        }}
                        renderItem={(appointment) => (
                            <List.Item>
                                <Card size="small" style={{ width: '100%' }}>
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        <Text strong>{appointment.patientName}</Text>
                                        <Text type="secondary">
                                            Date: {dayjs(appointment.appointmentDate).format('MMM DD, YYYY')}
                                        </Text>
                                        <Text type="secondary">
                                            Time: {appointment.appointmentTime}
                                        </Text>
                                        {appointment.doctorArrivalTime && (
                                            <Tag color="success">
                                                Doctor arrived at {appointment.doctorArrivalTime}
                                            </Tag>
                                        )}
                                    </Space>
                                </Card>
                            </List.Item>
                        )}
                    />
                </Card>
            </Col>
        </Row>
    );
};

export default BookAppointmentForm;