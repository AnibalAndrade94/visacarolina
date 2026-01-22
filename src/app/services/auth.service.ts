import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable, from, switchMap, tap, map } from 'rxjs';


import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  applyActionCode,
  User
} from 'firebase/auth';

type UserDTO = {
  id: string;
  name: string;
  email: string;
  role: string;
  whatsapp?: string;
  city?: string;
  state?: string;
  source?: string;
  interest?: string;
  coursesOwned?: string[];
  emailVerified?: boolean;
};

type SyncResponse = {
  ok: boolean;
  user?: UserDTO;
  message?: string;
  emailSent?: boolean;
  error?: string;
};

type RegisterPayload = {
  name: string;
  city: string;
  state: string;
  whatsapp: string;
  email: string;
  password: string;       // SOLO para Firebase
  acceptTerms: boolean;
  source?: string;
  interest?: string;
};

type LoginPayload = { email: string; password: string };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = `${environment.apiBaseUrl}/api/auth`;
confirmEmailFirebase(oobCode: string) {
  const auth = getAuth();
  return from(applyActionCode(auth, oobCode));
}
  constructor(private http: HttpClient) {}

  // ✅ helper para headers con Firebase token
  private withFirebaseAuthHeaders(): Observable<HttpHeaders> {
    const auth = getAuth();
    return from(auth.currentUser?.getIdToken() ?? Promise.resolve(null)).pipe(
      map((token) => {
        if (!token) throw new Error('No hay sesión activa en Firebase');
        return new HttpHeaders({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        });
      })
    );
  }

  
  private headersWithToken(token: string) {
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

register(payload: RegisterPayload, rememberMe: boolean) {
    const auth = getAuth();

    return from(createUserWithEmailAndPassword(auth, payload.email, payload.password)).pipe(
      switchMap(async ({ user }) => {
        await sendEmailVerification(user);
        const token = await user.getIdToken(true); // 👈 token real garantizado
        return { user, token };
      }),
      switchMap(({ token }) =>
        this.http.post<SyncResponse>(
          `${this.baseUrl}/sync-profile`,
          {
            name: payload.name,
            whatsapp: payload.whatsapp,
            city: payload.city,
            state: payload.state,
            acceptTerms: payload.acceptTerms,
            source: payload.source || '',
            interest: payload.interest || '',
          },
          { headers: this.headersWithToken(token) }
        )
      ),
      tap((resp) => {
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('firebase', '1');
        if (resp?.user) storage.setItem('user', JSON.stringify(resp.user));
      })
    );
  }

  login(payload: LoginPayload, rememberMe: boolean) {
    const auth = getAuth();

    return from(signInWithEmailAndPassword(auth, payload.email, payload.password)).pipe(
      switchMap(async ({ user }) => {
        const token = await user.getIdToken(true); // 👈 token real garantizado
        return token;
      }),
      switchMap((token) =>
        this.http.post<SyncResponse>(
          `${this.baseUrl}/sync-profile`,
          {}, // si tu backend lo permite vacío
          { headers: this.headersWithToken(token) }
        )
      ),
      tap((resp) => {
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('firebase', '1');
        if (resp?.user) storage.setItem('user', JSON.stringify(resp.user));
      })
    );
  }
   async logout() {
    localStorage.removeItem('firebase');
    localStorage.removeItem('user');
    sessionStorage.removeItem('firebase');
    sessionStorage.removeItem('user');
    await signOut(getAuth());
  }

  // ✅ para tu interceptor (si lo quieres)
  getFirebaseUser() {
    return getAuth().currentUser;
  }

  getUser(): any | null {
    const raw = localStorage.getItem('user') || sessionStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }

  isLoggedIn(): boolean {
    return !!getAuth().currentUser;
  }

  
}
