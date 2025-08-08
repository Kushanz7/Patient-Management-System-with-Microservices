import React, { useContext } from 'react';
import { Layout, Menu, Button } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  CalendarOutlined,
  DollarOutlined,
  UserOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { useNavigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const { Header, Content, Sider } = Layout;

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const menuItems = [
    {
      key: 'admin',
      icon: <DashboardOutlined />,
      label: 'Admin Dashboard',
      onClick: () => navigate('/adminDashboard')
    },
    {
      key: 'patients',
      icon: <TeamOutlined />,
      label: 'Patients',
      children: [
        {
          key: 'patients-list',
          icon: <UnorderedListOutlined />,
          label: 'Patient List',
          onClick: () => navigate('/patients/list')
        },
        {
          key: 'patients-add',
          icon: <PlusOutlined />,
          label: 'Add Patient',
          onClick: () => navigate('/patients/add')
        }
      ]
    },
    {
      key: 'appointments',
      icon: <CalendarOutlined />,
      label: 'Appointments',
      onClick: () => navigate('/appointments')
    },
    {
      key: 'doctor-appointments',
      icon: <UserOutlined />,
      label: 'Doctor Dashboard',
      onClick: () => navigate('/doctor/appointments')
    },
    {
      key: 'billing',
      icon: <DollarOutlined />,
      label: 'Billing',
      onClick: () => navigate('/billing')
    }
  ];

  return (
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: '0 24px',
          background: '#fff',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px'
        }}>
          <h1 style={{ margin: 0, fontSize: '18px' }}>Medical Management System</h1>
          <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={logout}
              style={{ fontSize: '16px' }}
          >
            Logout
          </Button>
        </Header>
        <Layout style={{ marginTop: '64px' }}>
          <Sider
              width={250}
              style={{
                position: 'fixed',
                left: 0,
                top: '64px',
                bottom: 0,
                zIndex: 999,
                background: '#fff',
                borderRight: '1px solid #f0f0f0',
                overflow: 'auto'
              }}
          >
            <Menu
                mode="inline"
                defaultSelectedKeys={['patients-list']}
                defaultOpenKeys={['patients']}
                style={{ height: '100%', borderRight: 0 }}
                items={menuItems}
            />
          </Sider>
          <Layout style={{ marginLeft: '250px' }}>
            <Content
                style={{
                  padding: '24px',
                  margin: 0,
                  background: '#fff',
                  borderRadius: '4px',
                  minHeight: 'calc(100vh - 64px)',
                  overflow: 'auto'
                }}
            >
              <Outlet />
            </Content>
          </Layout>
        </Layout>
      </Layout>
  );
};

export default AdminLayout;