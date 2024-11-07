import { createContext, useState } from "react";
import { Error } from "../error/Error";

type Props = {
    children: React.ReactNode;
};

type ErrorContextType = {
    error: string | null;
    setError: (error: string | null, duration?: number) => void;
};

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

const ErrorProvider = ({ children }: Props) => {
    const [error, setErrorState] = useState<string | null>(null);

    const setError = (error: string | null, duration: number = 3000) => {
        setErrorState(error);
        if (error) {
            setTimeout(() => {
                setErrorState(null);
            }, duration);
        }
    };

    return (
        <ErrorContext.Provider value={{ error, setError }}>
            {error && <Error message={error} className="fixed top-16 left-1/2 transform bg-black -translate-x-1/2 z-50" />}
            {children}
        </ErrorContext.Provider>
    );
};

export { ErrorContext, ErrorProvider };