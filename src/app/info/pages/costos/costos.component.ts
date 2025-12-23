import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ExchangeRateService } from '../../services/exchange-rate.service';
import { combineLatest, map } from 'rxjs';
type FeesJson = {
  currencyBase: 'USD';
  items: { key: string; name: string; usd: number }[];
  notes: string[];
};

@Component({
  selector: 'app-costos',
  templateUrl: './costos.component.html',
  styleUrls: ['./costos.component.scss']
})
export class CostosComponent {
 fees$ = this.http.get<FeesJson>('/assets/data/fees.json');
  rate$ = this.exchange.getUsdToMxn$();

  vm$ = combineLatest([this.fees$, this.rate$]).pipe(
    map(([fees, rate]) => ({ fees, rate }))
  );

  constructor(private http: HttpClient, private exchange: ExchangeRateService) {}
}
