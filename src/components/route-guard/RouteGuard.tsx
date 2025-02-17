import { User } from "firebase/auth";
import { Navigate } from "react-router-dom";
import { Spinner } from "../ui/spinner";

type Props = {
	user: User | null | false;
	children: React.ReactNode;
};

export default function RouteGuard({ user, children }: Props) {
	if (user == null) {
		return <Navigate to="/" replace />;
	} else if (user) return children;
	return <Spinner />;
}
