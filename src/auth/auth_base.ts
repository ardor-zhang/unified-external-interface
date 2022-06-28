import { User } from "./types";

export default abstract class AuthBase {
  abstract initialize(): void;
  abstract get currentUser(): User;
  abstract createUser(email: string, password: string): Promise<User>;
  abstract emailVerification(): Promise<void>;
  abstract loginIn(email: string, password: string): Promise<User>;
  abstract logOut(): Promise<void>;
  abstract passwordReset(email: string): Promise<void>;
}
