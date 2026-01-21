import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut
} from 'firebase/auth';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthFirebaseService {

  constructor() { }
  private app = initializeApp(environment.firebase);
  private auth = getAuth(this.app);

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async sendReset(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  async sendVerifyEmail() {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No hay sesión');
    return sendEmailVerification(user);
  }

  async logout() {
    return signOut(this.auth);
  }

  async getIdToken(): Promise<string | null> {
    const user = this.auth.currentUser;
    if (!user) return null;
    return user.getIdToken();
  }
}
