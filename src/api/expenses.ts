import { auth, db } from "@/lib/firebase"

import { collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, setDoc, Timestamp, updateDoc, where } from "firebase/firestore"

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
        console.log('Data sent ');
    }).catch((err) => {
        return err instanceof Error ? err : new Error(String(err));
    })
}

const getExpenses = async (months: number) => {
    let user: string;//TODO add error handling    
    if (auth.currentUser?.uid) user = auth.currentUser?.uid
    else return new Error('User Not Logged In')
    const monthsAgo = new Date();
    monthsAgo.setMonth(monthsAgo.getMonth() - months);
    const monthsAgoTimestamp = Timestamp.fromDate(monthsAgo);
    try {
        const q = query(
            collection(db, 'expenses'),
            where('userId', '==', user),
            where('createdAt', '>=', monthsAgoTimestamp)
        );
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
    } catch (err: any) {
        throw err instanceof Error ? err : new Error(String(err));
    }
}
const deleteExpense = async (id: string) => {
    try {
        await deleteDoc(doc(db, "expenses", id));
    } catch (err) {
        throw err instanceof Error ? err : new Error(String(err));
    }

}

const editExpense = async (id: string, userId: string, sum: string, type: string, description?: string) => {
    const body = {
        userId,
        sum,
        type,
        description,
    }
    const ref = doc(db, 'expenses', id)
    try {
        await updateDoc(ref, body)
        console.log('Data Sent')
    }
    catch (err) {
        return err instanceof Error ? err : new Error(String(err));
    }
}

function formatServerTimestamp(serverTimestamp: Timestamp) {
    const date = serverTimestamp.toDate()

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}
function savePreference(userId: string, currencyPref: string) {
    const body = {
        userId,
        currencyPref
    }
    const docCol = doc(db, 'user-preferences', userId)
    setDoc(docCol, body, { merge: true }).then(() => {
        console.log('Data sent');
        listenToUserPreference()
    }).catch((err) => {
        console.log(`Eror: ${err instanceof Error ? err : new Error(String(err))}`)
    })
}

async function listenToUserPreference() {
    let user: string;
    if (auth.currentUser?.uid) user = auth.currentUser?.uid
    else return new Error('User Not Logged In')
    try {
        const response = await getDoc(doc(db, 'user-preferences', user))
        const data = response?.data();
        return data?.currencyPref

    } catch (err) {
        throw err instanceof Error ? err : new Error(String(err));
    }
}


export {
    listenToUserPreference,
    createExpense,
    getExpenses,
    deleteExpense,
    editExpense,
    savePreference
}