import { User } from "firebase/auth";
import { doc, DocumentReference, getFirestore, onSnapshot, setDoc, Timestamp, Unsubscribe } from "firebase/firestore";
import app from "./init";

const db = getFirestore(app);

enum UserKeys {
    Name = "name",
    Email = "email",
    DOB = "DOB",
    PhotoURL = "photoURL"
}

const userRef = (uid: string) => doc(db, "users", uid);
const setWithMerge = async (ref: DocumentReference, data: any) => await setDoc(ref, data, { merge: true});

let unsubscribe: Unsubscribe;

const setUserName = async (user: User, name: string) => {
    const ref = userRef(user.uid);
    const data = { [UserKeys.Name]: name };
    await setWithMerge(ref, data);
};

const setUserEmail = async (user: User, email: string) => {
    const ref = userRef(user.uid);
    const data = { [UserKeys.Email]: email };
    await setWithMerge(ref, data);
};

const setUserDOB = async (user: User, date: Date) => {
    const ref = userRef(user.uid);
    const data = { [UserKeys.DOB]: Timestamp.fromDate(date) };
    await setWithMerge(ref, data);
};

const setUserPhotoURL = async (user: User, photoURL: string) => {
    const ref = userRef(user.uid);
    const data = { [UserKeys.PhotoURL]: photoURL };
    await setWithMerge(ref, data);
};

const listenUserUpdate = async (user: User, callback: (userData: AppUser) => any) => {
    const ref = userRef(user.uid);
    unsubscribe = onSnapshot(ref, (document) => {
        const data = document.data();
        if (data && data.DOB) data.DOB = (data.DOB as Timestamp).toDate();
        callback(data as AppUser);
    });
}

const unSubUserUpdate = async () => {
    if (unsubscribe != undefined) {
        unsubscribe();
    }
}

export {
    setUserDOB,
    setUserEmail,
    setUserName,
    setUserPhotoURL,
    listenUserUpdate,
    unSubUserUpdate,
};
