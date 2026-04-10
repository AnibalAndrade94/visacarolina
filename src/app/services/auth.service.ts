import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

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
  private api = 'https://visaback-production-3ac4.up.railway.app/api/auth';

  constructor(private http: HttpClient) {}

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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  }

  getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  getUser(): UserDTO | null {
    const raw = localStorage.getItem('user') || sessionStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }

  setUser(user: UserDTO) {
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