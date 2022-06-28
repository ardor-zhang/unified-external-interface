import { User } from "../types";
import AuthProvider from "../auth_provider";
import { initializeApp } from "firebase/app";
import {
  Auth,
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import {
  WeakPasswordAuthException,
  EmailAlreadyInUseAuthException,
  InvalidEmailAuthException,
  GenericAuthException,
} from "../auth_exceptions";

export default class FirebaseAuthProvider implements AuthProvider {
  auth: Auth;
  // 单例
  static instance: FirebaseAuthProvider;
  static getInstance() {
    if (!FirebaseAuthProvider.instance) {
      FirebaseAuthProvider.instance = new FirebaseAuthProvider();
    }
    return FirebaseAuthProvider.instance;
  }

  initialize(): void {
    const firebaseConfig = {};
    const app = initializeApp(firebaseConfig);
    this.auth = getAuth(app);
  }

  get currentUser(): User {
    const user = this.auth.currentUser;
    if (user !== null) {
      return {
        id: user.uid,
        email: user.email!,
        isEmailVerified: user.emailVerified,
      };
    } else {
      throw new Error("User not found.");
    }
  }

  async createUser(email: string, password: string): Promise<User> {
    try {
      const { user } = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return {
        id: user.uid,
        email: user.email!,
        isEmailVerified: user.emailVerified,
      };
    } catch (e) {
      if (e.code == "email-already-in-use") {
        throw new EmailAlreadyInUseAuthException();
      } else if (e.code == "weak-password") {
        throw new WeakPasswordAuthException();
      } else if (e.code == "invalid-email") {
        throw new InvalidEmailAuthException();
      } else {
        throw new GenericAuthException();
      }
    }
  }

  async emailVerification(): Promise<void> {
    try {
      const user = this.auth.currentUser;
      if (user !== null) {
        await sendEmailVerification(user);
      } else {
        throw new Error("User not found.");
      }
    } catch (error) {}
  }

  async loginIn(email: string, password: string): Promise<User> {
    throw new Error("Method not implemented.");
  }

  async logOut(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async passwordReset(email: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
