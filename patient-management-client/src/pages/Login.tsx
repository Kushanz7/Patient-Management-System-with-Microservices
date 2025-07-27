// src/pages/Login.tsx
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Alert, Layout } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { AuthContext } from '../context/AuthContext';
import { login } from '../api/auth';

const { Title } = Typography;
const { Content } = Layout;

export const Login = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login: authLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (values: { email: string; password: string }) => {
        setLoading(true);
        setError('');
        try {
            const { token } = await login(values);
            localStorage.setItem('token', token);
            authLogin(token);
            navigate('/patients');
        } catch (err) {
            console.error('Login failed:', err);
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Content style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#f0f2f5'
            }}>
                <Card 
                    style={{ 
                        width: 400,
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        borderRadius: '8px'
                    }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <Title level={2} style={{ margin: 0 }}>
                            Medical System Login
                        </Title>
                        <Typography.Text type="secondary">
                            Please enter your credentials to continue
                        </Typography.Text>
                    </div>

                    {error && (
                        <Alert
                            message={error}
                            type="error"
                            showIcon
                            style={{ marginBottom: '24px' }}
                        />
                    )}

                    <Form
                        name="login"
                        onFinish={handleSubmit}
                        layout="vertical"
                        size="large"
                    >
                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: 'Please input your email!' },
                                { type: 'email', message: 'Please enter a valid email!' }
                            ]}
                        >
                            <Input 
                                prefix={<UserOutlined />} 
                                placeholder="Email"
                                autoComplete="email"
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[
                                { required: true, message: 'Please input your password!' },
                                { min: 6, message: 'Password must be at least 6 characters!' }
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Password"
                                autoComplete="current-password"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button 
                                type="primary" 
                                htmlType="submit"
                                loading={loading}
                                block
                            >
                                Log in
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Content>
        </Layout>
    );
};