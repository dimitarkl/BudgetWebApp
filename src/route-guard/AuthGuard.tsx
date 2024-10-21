import { User } from "firebase/auth";
import { Navigate } from "react-router-dom";

type Props = {
    user: User | null,
    children: React.ReactNode
}

export const AuthGuard = ({ user, children }: Props) => {
    if (user) {
        return <Navigate to="/" replace />;
    }
    return children;
};