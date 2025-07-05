import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store";

const PrivateRoute = () => {
    const location = useLocation();
    const access_token = useAuthStore((s) => s.access_token);

    if (!access_token) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;
