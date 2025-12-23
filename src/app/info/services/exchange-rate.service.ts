import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, shareReplay } from 'rxjs';

type RateResponse = { mxnPerUsd: number; source: 'api' | 'fallback'; updatedAt: string };

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {

   constructor(private http: HttpClient) {}

  // Opción A (recomendada): pegarle a TU backend en Railway para no depender del CORS/terceros en el front
  getUsdToMxn$() {
    return this.http.get<{ mxnPerUsd: number; updatedAt: string }>('/api/exchange/usd-mxn').pipe(
      map(r => ({ mxnPerUsd: r.mxnPerUsd, updatedAt: r.updatedAt, source: 'api' as const })),
      catchError(() =>
        of({
          mxnPerUsd: 17.00,
          updatedAt: new Date().toISOString(),
          source: 'fallback' as const,
        })
      ),
      shareReplay(1)
    );
  }
}
