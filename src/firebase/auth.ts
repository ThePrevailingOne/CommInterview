import { showNotification } from "@mantine/notifications";
import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import app from "./init";

enum AuthErrorCode {
  InvalidEmail = "auth/invalid-email",
  WrongPassword = "auth/wrong-password",
  EmailTaken = "auth/email-already-exists",
  UserNotExist = "auth/user-not-found",
  TooManyRequest = "auth/too-many-requests",
}

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const registerWithEmailAndPassword = async (email: string, password: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        return user;
    } catch (e) {
        handleAuthError(e);
    }
};

const loginWithEmailAndPassword = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        return user;
    } catch (e) {
        handleAuthError(e);
    }
};

const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;
        return user;
    } catch (e) {
        handleAuthError(e);
    }
};

const logout = async () => {
    try {
        await signOut(auth);
        showNotification({ message: "Successfully Logged out!", color: "green" });
    } catch (e) {
        handleAuthError(e);
    }
};

const useWrappedAuthState = () => useAuthState(auth);

const handleAuthError = (e: any) => {
    const error: FirebaseError = e;
    console.log(error.cause);
    console.log(error.code);
    console.log(error.customData);
    console.log(error.message);
    console.log(error.name);
    console.log(error.stack);

    switch (error.code as AuthErrorCode) {
      case AuthErrorCode.EmailTaken:
        throw new Error("Email is already taken");
      case AuthErrorCode.InvalidEmail:
        throw new Error("Email is invalid");
      case AuthErrorCode.UserNotExist:
        throw new Error("User does not exist");
      case AuthErrorCode.WrongPassword:
        throw new Error("Password does not match");
    case AuthErrorCode.TooManyRequest:
        throw new Error("Too many retries. Try again later");
    }
};

export {
    registerWithEmailAndPassword,
    loginWithEmailAndPassword,
    loginWithGoogle,
    logout,
    useWrappedAuthState
}
