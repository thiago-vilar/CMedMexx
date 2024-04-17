// C:\Projetos\CMedMexx\frontend\src\components\Utils\PrivateRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children, role }) => {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || (role && user.role !== role)) {
        // Redirecionar para SignIn se o usuário não estiver autenticado ou não tiver o papel necessário
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    return children;
};

export default PrivateRoute;