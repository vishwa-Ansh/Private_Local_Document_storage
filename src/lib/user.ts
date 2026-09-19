import { User } from "firebase/auth";
import {
    doc,
    getDoc,
    serverTimestamp,
    setDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export const createUserDocument = async (
    user: User
) => {
    if (!user) {
        throw new Error(
            "Firebase user is not available."
        );
    }

    if (!db) {
        throw new Error(
            "Firestore database is not initialized."
        );
    }

    const userRef = doc(
        db,
        "users",
        user.uid
    );

    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
        await setDoc(userRef, {
            uid: user.uid,
            name: user.displayName || "",
            email: user.email || "",
            photoURL: user.photoURL || "",
            provider:
                user.providerData?.[0]
                    ?.providerId ||
                "password",
            plan: "free",
            createdAt: serverTimestamp(),
        });
    }
};