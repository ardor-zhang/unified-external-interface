import { User } from "../types";
import AuthProvider from "../auth_provider";
import { createClient, SupabaseClient, AuthUser } from "@supabase/supabase-js";
import {
  WeakPasswordAuthException,
  EmailAlreadyInUseAuthException,
  InvalidEmailAuthException,
  GenericAuthException,
} from "../auth_exceptions";

export default class SupabaseAuthProvider implements AuthProvider {
  supabase: SupabaseClient;

  // 单例
  static instance: SupabaseAuthProvider;
  static getInstance() {
    if (!SupabaseAuthProvider.instance) {
      SupabaseAuthProvider.instance = new SupabaseAuthProvider();
    }
    return SupabaseAuthProvider.instance;
  }

  initialize(): void {
    const options = {};
    this.supabase = createClient("", "", options);
  }

  get currentUser(): User {
    const user = this.supabase.auth.user();
    if (user !== null) {
      return {
        id: user.id,
        email: user.email!,
        isEmailVerified: false,
      };
    } else {
      throw new Error("User not found.");
    }
  }

  async createUser(email: string, password: string): Promise<User> {
    try {
      const { user, error } = await this.supabase.auth.signIn({
        email,
        password,
      });
      if (user !== null) {
        return {
          id: user?.id,
          email: user.email!,
          isEmailVerified: !!user.new_email,
        };
      } else {
        const status = error?.status;
        switch (status) {
          case 1001:
            throw new EmailAlreadyInUseAuthException();
          case 1002:
            throw new WeakPasswordAuthException();
          case 1003:
            throw new InvalidEmailAuthException();
          default:
            throw new GenericAuthException();
        }
      }
    } catch (e) {
      throw new GenericAuthException();
    }
  }

  async emailVerification(): Promise<void> {
    throw new Error("Method not implemented.");
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
