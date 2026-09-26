import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { environment } from '../environments/environment';
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

type RegisterPayload = {
  name: string;
  city: string;
  state: string;
  whatsapp: string;
  email: string;
  password: string;
  acceptTerms: boolean;
  source?: string;
  interest?: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterResponse = {
  ok: boolean;
  emailSent: boolean;
  message: string;
  user: UserDTO;
};

type LoginResponse = {
  ok: boolean;
  token: string;
  user: UserDTO;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
private app: any = null;
  private auth: any = null;
  private api = 'https://visaback-production-3ac4.up.railway.app/api/auth';

   constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(platformId)) {
      this.app = initializeApp(environment.firebase);
      this.auth = getAuth(this.app);
    }
  }

  register(payload: RegisterPayload, rememberMe: boolean): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.api}/register`, payload).pipe(
      tap((resp) => {
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.removeItem('token');
        storage.removeItem('user');

        if (resp?.user) {
          storage.setItem('user', JSON.stringify(resp.user));
        }
      })
    );
  }

  login(payload: LoginPayload, rememberMe: boolean): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.api}/login`, payload).pipe(
      tap((resp) => {
        const storage = rememberMe ? localStorage : sessionStorage;

        storage.setItem('token', resp.token);
        storage.setItem('user', JSON.stringify(resp.user));
      })
    );
  }

  verifyEmail(token: string, email: string) {
    return this.http.get(`${this.api}/verify-email`, {
      params: { token, email }
    });
  }

  me() {
    return this.http.get<UserDTO>(`${this.api}/me`, {
      headers: this.authHeaders()
    }).pipe(
      tap((user) => this.setUser(user))
    );
  }

   logout() {
    if (!this.isBrowser) return;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  }

   private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  getUser(): any {
    if (!this.isBrowser) return null;
    const raw = localStorage.getItem('user') || sessionStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }


  setUser(user: UserDTO) {
    if (!this.isBrowser) return;
    if (localStorage.getItem('token')) {
      localStorage.setItem('user', JSON.stringify(user));
      return;
    }
    if (sessionStorage.getItem('token')) {
      sessionStorage.setItem('user', JSON.stringify(user));
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private authHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token || ''}`,
      'Content-Type': 'application/json'
    });
  }
}