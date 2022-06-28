import { User } from "./types";
import AuthBase from "./auth_base";
import FirebaseAuthProvider from "./provider/firebase_auth_provider";
import SupabaseAuthProvider from "./provider/supabase_auth_provider";

const providerMap = {
  firebase: FirebaseAuthProvider.getInstance(),
  supabase: SupabaseAuthProvider.getInstance(),
} as const;

export type ProviderEnum = keyof typeof providerMap;

export default class AuthService implements AuthBase {
  constructor(private provider: AuthBase) {}

  static instance(provider: ProviderEnum) {
    return new AuthService(providerMap[provider]);
  }

  initialize(): void {
    this.provider.initialize();
  }

  get currentUser(): User {
    return this.provider.currentUser;
  }

  createUser(email: string, password: string): Promise<User> {
    return this.provider.createUser(email, password);
  }

  emailVerification(): Promise<void> {
    return this.provider.emailVerification();
  }

  loginIn(email: string, password: string): Promise<User> {
    return this.provider.loginIn(email, password);
  }

  logOut(): Promise<void> {
    return this.provider.logOut();
  }

  passwordReset(email: string): Promise<void> {
    return this.provider.passwordReset(email);
  }
}
