import { User } from "firebase/auth";
import { Navigate } from "react-router-dom";

type Props = {
    user: User | null,
    children: React.ReactNode
}

export const RouteGuard = ({ user, children }: Props) => {
    if (!user) {
        return <Navigate to="/" replace />;
    }
    return children;
};