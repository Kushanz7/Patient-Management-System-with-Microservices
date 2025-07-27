import { Form, Input, Select, Button, message } from 'antd';
import { useState } from 'react';
import { createUser } from '../api/users';

interface AddUserFormProps {
    token: string;
    onUserAdded: () => void;
}

export const AddUserForm = ({ token, onUserAdded }: AddUserFormProps) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            await createUser(values, token);
            message.success('User created successfully');
            onUserAdded();
            form.resetFields();
        } catch (err) {
            message.error('Failed to create user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
        >
            <Form.Item
                label="Email"
                name="email"
                rules={[
                    { required: true, message: 'Please input email!' },
                    { type: 'email', message: 'Please enter a valid email!' }
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[
                    { required: true, message: 'Please input password!' },
                    { min: 6, message: 'Password must be at least 6 characters!' }
                ]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                label="Role"
                name="role"
                initialValue="DOCTOR"
            >
                <Select>
                    <Select.Option value="DOCTOR">Doctor</Select.Option>
                    <Select.Option value="ADMIN">Admin</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item
                label="Full Name"
                name="fullName"
                rules={[{ required: true, message: 'Please input full name!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Specialization"
                name="specialization"
                rules={[{ required: true, message: 'Please input specialization!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Phone Number"
                name="phoneNumber"
                rules={[{ required: true, message: 'Please input phone number!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                    Add User
                </Button>
            </Form.Item>
        </Form>
    );
};