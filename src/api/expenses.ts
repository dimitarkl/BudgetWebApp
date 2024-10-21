import { auth, db } from "@/lib/firebase"
import { collection, doc, getDocs, query, serverTimestamp, setDoc, Timestamp, where } from "firebase/firestore"

type FetchData = {
    id: string,
    userId: string,
    createdAt: Timestamp
    //TODO change to number
    sum: string,
    type: string,
    description?: string,
}[]

const createExpense = (userId: string, sum: string, type: string, description?: string) => {
    if (!description) description = ''
    const body = {
        userId,
        createdAt: serverTimestamp(),
        sum,
        type,
        description,
    }
    const docCol = doc(collection(db, 'expenses'))
    setDoc(docCol, body).then(() => {
        console.log('Data sent to Firebase Realtime Database!');
    }).catch((err) => {
        return err instanceof Error ? err : new Error(String(err));
    })
}

const getExpenses = async () => {
    let user: string;
    //TODO add error handling
    if (auth.currentUser?.uid) user = auth.currentUser?.uid
    else return

    const q = query(collection(db, 'expenses'), where('userId', '==', user));
    try {
        const querySnapshot = await getDocs(q);
        const data: FetchData = []
        querySnapshot.forEach((doc) => {
            const docRest = doc.data()
            data.push({
                id: doc.id,
                userId: docRest.userId,
                createdAt: docRest.createdAt,
                sum: docRest.sum,
                type: docRest.type,
                description: docRest.description,
            });
        });
        console.log(data)
        return data
    } catch (error: any) {
        throw new Error(error.message)
    }
}

export {
    createExpense,
    getExpenses
}