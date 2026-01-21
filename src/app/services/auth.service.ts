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

 register(payload: RegisterPayload, rememberMe: boolean) {
  const auth = getAuth();

  return from(createUserWithEmailAndPassword(auth, payload.email, payload.password)).pipe(
    switchMap(({ user }) =>
      from(
        (async () => {
          // 1) manda verificación
          await sendEmailVerification(user);

          // 2) token (FORZADO)
          const token = await user.getIdToken(true);

          return { user, token };
        })()
      )
    ),
    switchMap(({ token }) => {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      });

      return this.http.post<SyncResponse>(
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
        { headers }
      );
    }),
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
    // 1) opcional: bloquear si no verificó email
    switchMap(({ user }) => {
      if (!user.emailVerified) {
        // puedes también reenviar verificación aquí si quieres
        throw { code: 'auth/email-not-verified' };
      }
      return from(user.getIdToken(true)); // token confiable
    }),

    // 2) sync-profile con token (NO uses currentUser aquí)
    switchMap((token) => {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      });

      // 👇 OJO: si tu backend requiere campos, manda mínimo email o algo
      return this.http.post<SyncResponse>(
        `${this.baseUrl}/sync-profile`,
        {}, // si tu endpoint acepta vacío, perfecto
        { headers }
      );
    }),

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
