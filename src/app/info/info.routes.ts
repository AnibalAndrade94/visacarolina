import { Routes } from '@angular/router';
import { InfoLayoutComponent } from './info-layout/info-layout.component';

export const INFO_ROUTES: Routes = [
  {
    path: '',
    component: InfoLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'costos' },
      {
        path: 'consulados',
        loadComponent: () =>
          import('./pages/consulados/consulados.component').then(m => m.ConsuladosComponent),
      },
      {
        path: 'costos',
        loadComponent: () =>
          import('./pages/costos/costos.component').then(m => m.CostosComponent),
      },
      {
        path: 'pasaporte',
        loadComponent: () =>
          import('./pages/pasaporte/pasaporte.component').then(m => m.PasaporteComponent),
      },
      {
        path: 'mapa-pasaporte',
        loadComponent: () =>
          import('./pages/mapa-pasaporte/mapa-pasaporte.component').then(m => m.MapaPasaporteComponent),
      },
      {
        path: 'faq',
        loadComponent: () =>
          import('./pages/faq/faq.component').then(m => m.FaqComponent),
      },
    ],
  },
];
