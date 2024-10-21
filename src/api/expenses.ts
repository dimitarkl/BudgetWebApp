import { db } from "@/lib/firebase"
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore"

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
    }).catch((error) => {
        console.error('Error sending data:', error);
    })
}

export {
    createExpense,
}