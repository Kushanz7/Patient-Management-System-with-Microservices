// src/components/PatientForm.tsx
import { useState } from 'react';
import { Form, Input, DatePicker, Button, Alert, Space } from 'antd';
import { createPatient, type Patient } from '../../api/patients.ts';
import dayjs from 'dayjs';

type PatientFormProps = {
    token: string;
    setPatients: (patient: Patient) => void;
};

export const PatientForm = ({ token, setPatients }: PatientFormProps) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (values: any) => {
        setLoading(true);
        setError('');
        setSuccess('');
        
        try {
            const formData = {
                ...values,
                dateOfBirth: values.dateOfBirth.format('YYYY-MM-DD'),
                registeredDate: dayjs().format('YYYY-MM-DD')
            };

            const res = await createPatient(formData, token);
            setSuccess('Patient added successfully!');
            setPatients(res.data);
            form.resetFields();
        } catch (err) {
            setError('Failed to create patient. Please check your inputs and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {error && (
                <Alert
                    message="Error"
                    description={error}
                    type="error"
                    showIcon
                    closable
                    onClose={() => setError('')}
                />
            )}

            {success && (
                <Alert
                    message="Success"
                    description={success}
                    type="success"
                    showIcon
                    closable
                    onClose={() => setSuccess('')}
                />
            )}

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                style={{ maxWidth: 600 }}
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                        { required: true, message: 'Please input patient name!' },
                        { min: 2, message: 'Name must be at least 2 characters!' }
                    ]}
                >
                    <Input placeholder="John Doe" />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Please input patient email!' },
                        { type: 'email', message: 'Please enter a valid email!' }
                    ]}
                >
                    <Input placeholder="john.doe@example.com" />
                </Form.Item>

                <Form.Item
                    label="Address"
                    name="address"
                    rules={[
                        { required: true, message: 'Please input patient address!' },
                        { min: 5, message: 'Address must be at least 5 characters!' }
                    ]}
                >
                    <Input.TextArea 
                        placeholder="123 Main St, Anytown" 
                        autoSize={{ minRows: 2, maxRows: 4 }}
                    />
                </Form.Item>

                <Form.Item
                    label="Date of Birth"
                    name="dateOfBirth"
                    rules={[
                        { required: true, message: 'Please select date of birth!' },
                        {
                            validator: (_, value) => {
                                if (value && value.isAfter(dayjs())) {
                                    return Promise.reject('Date of birth cannot be in the future!');
                                }
                                return Promise.resolve();
                            }
                        }
                    ]}
                >
                    <DatePicker 
                        style={{ width: '100%' }}
                        disabledDate={current => current && current.isAfter(dayjs())}
                    />
                </Form.Item>

                <Form.Item
                    label="Registration Date"
                    name="registeredDate"
                    initialValue={dayjs()}
                >
                    <DatePicker 
                        style={{ width: '100%' }}
                        disabled
                    />
                </Form.Item>

                <Form.Item>
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        loading={loading}
                        block
                    >
                        {loading ? 'Adding Patient...' : 'Add Patient'}
                    </Button>
                </Form.Item>
            </Form>
        </Space>
    );
};