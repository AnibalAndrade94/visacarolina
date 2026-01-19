import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

type LoginPayload = { email: string; password: string };
type AuthResponse = {
  ok: boolean;
  token?: string;
  user?: { id: string; name: string; email: string; role: string };
  message?: string;
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
@Injectable({
  providedIn: 'root'
})
export class AuthService {

   private baseUrl = `${environment.apiBaseUrl}/api/auth`;

  constructor(private http: HttpClient) {}
verifyEmail(token: string, email: string): Observable<{ ok: boolean; error?: string }> {
  const params = new HttpParams().set('token', token).set('email', email);
  return this.http.get<{ ok: boolean; error?: string }>(`${this.baseUrl}/verify-email`, { params });
}
  login(payload: LoginPayload, rememberMe: boolean) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, payload).pipe(
      tap((resp) => {
        if (!resp?.ok || !resp?.token) return;

        const storage = rememberMe ? localStorage : sessionStorage;

        storage.setItem('token', resp.token);
        if (resp.user) storage.setItem('user', JSON.stringify(resp.user));
      })
    );
  }

  register(payload: RegisterPayload, rememberMe: boolean) {
  return this.http.post<AuthResponse>(`${this.baseUrl}/register`, payload).pipe(
    tap((resp) => {
      if (!resp?.ok || !resp?.token) return;
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('token', resp.token);
      if (resp.user) storage.setItem('user', JSON.stringify(resp.user));
    })
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

  getUser(): any | null {
    const raw = localStorage.getItem('user') || sessionStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
