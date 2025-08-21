import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ReferidosService {
  private baseUrl = 'https://visaback-production.up.railway.app';

  constructor(private http: HttpClient) {}

  validarCodigo(codigo: string) {
    return this.http.get<{ valido: boolean, descuentos: any }>(`${this.baseUrl}/referidos/${codigo}`);
  }

  enviarTramites(payload: any) {
    return this.http.post(`${this.baseUrl}/tramites`, payload);
  }
}