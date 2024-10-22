import { auth, db } from "@/lib/firebase"
import { collection, doc, getDocs, query, serverTimestamp, setDoc, Timestamp, where } from "firebase/firestore"

type FetchData = {
    id: string,
    userId: string,
    createdAt: string
    //TODO change to number
    sum: number,
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
    else return new Error('User Not Logged In')
    const q = query(collection(db, 'expenses'), where('userId', '==', user));
    try {
        const querySnapshot = await getDocs(q);
        const data: FetchData = []
        querySnapshot.forEach((doc) => {
            const docRest = doc.data()
            data.push({
                id: doc.id,
                userId: docRest.userId,
                createdAt: formatServerTimestamp(docRest.createdAt),
                sum: Number(docRest.sum),
                type: docRest.type,
                description: docRest.description,
            });
        });
        return data
    } catch (error: any) {
        throw new Error(error.message)
    }
}
function formatServerTimestamp(serverTimestamp: Timestamp) {
    const date = serverTimestamp.toDate()

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export {
    createExpense,
    getExpenses
}