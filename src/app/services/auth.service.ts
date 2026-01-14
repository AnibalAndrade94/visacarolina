import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

type LoginPayload = { email: string; password: string };
type AuthResponse = {
  ok: boolean;
  token?: string;
  user?: { id: string; name: string; email: string; role: string };
  message?: string;
};
@Injectable({
  providedIn: 'root'
})
export class AuthService {

   private baseUrl = '/api/auth';

  constructor(private http: HttpClient) {}

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
