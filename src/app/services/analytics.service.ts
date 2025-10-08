import { Injectable } from '@angular/core';
declare const gtag: Function;

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  logEvent(name: string, params?: Record<string, any>) {
    try { gtag('event', name, params || {}); } catch {}
  }
}