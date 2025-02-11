import { User } from "firebase/auth";
import { createContext } from "react";

const UserContext = createContext<User | null | false>(false);
export default UserContext;
