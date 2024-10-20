import { auth } from "../lib/firebase"
import { browserLocalPersistence, createUserWithEmailAndPassword, setPersistence, signInWithEmailAndPassword, UserCredential } from "firebase/auth"

export const register = async (email: string, password: string) => {
    try {
        console.log(auth)
        await setPersistence(auth, browserLocalPersistence)
        return await createUserWithEmailAndPassword(auth, email, password)

    } catch (err: any) {
        throw new Error(err.message)
    }

}
export const login = async (email: string, password: string): Promise<UserCredential | Error> => {

    try {
        await setPersistence(auth, browserLocalPersistence)
        return await signInWithEmailAndPassword(auth, email, password)

    } catch (err: any) {
        return err instanceof Error ? err : new Error(String(err));
    }
}