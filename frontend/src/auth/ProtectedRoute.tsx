import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/Authcontext"
import Navbar from "../components/Navbar";


const ProtectedRoute = () => {
    const { loading, token } = useAuth();

    if (loading) return null;

    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    )
};

export default ProtectedRoute;