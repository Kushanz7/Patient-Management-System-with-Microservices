import type {ReactNode} from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

type PrivateRouteProps = {
    children?: ReactNode;
};

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const { token } = useAuth();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children ? children : <Outlet />;
};