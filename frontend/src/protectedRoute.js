import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const userRole = localStorage.getItem('role');

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();


    useEffect(() => {
        console.log(userRole);
        if (userRole !== 'admin') {
            navigate('/not-authorized'); // or wherever you want to redirect non-admin users
        }
    }, [userRole, navigate]);

    return userRole === 'admin' ? children : null;
};

export default ProtectedRoute;