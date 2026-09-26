import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ExchangeRateService } from '../../services/exchange-rate.service';
import { combineLatest, map } from 'rxjs';
import { SeoService } from '../../../services/seo.service';

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
export class CostosComponent implements OnInit {
 fees$ = this.http.get<FeesJson>('/assets/data/fees.json');
  rate$ = this.exchange.getUsdToMxn$();

  vm$ = combineLatest([this.fees$, this.rate$]).pipe(
    map(([fees, rate]) => ({ fees, rate }))
  );

  constructor(private http: HttpClient, private exchange: ExchangeRateService, private seo: SeoService) {}
ngOnInit(): void {
     this.seo.update({ title: 'Costos y derechos de trámite de visa 2026 | VisaCarolina',
  description: 'Consulta los costos vigentes del trámite de visa y derechos consulares (MRV fee) actualizados.',
  path: '/info/costos' });

}

}
