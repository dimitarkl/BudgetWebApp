import { User } from "firebase/auth";
import { Navigate } from "react-router-dom";

type Props = {
    user: User | null,
    children: React.ReactNode
}

export default function AuthGuard({ user, children }: Props) {
    if (user) {
        return <Navigate to="/dashboard" replace />;
    }
    return children;
};