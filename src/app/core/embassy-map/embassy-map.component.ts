import { AfterViewInit, Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type LocationPin = {
  name: string;
  city: string;
  lat: number;
  lng: number;
  type: 'Embajada' | 'Consulado';
};

@Component({
  selector: 'app-embassy-map',
  templateUrl: './embassy-map.component.html',
  styleUrls: ['./embassy-map.component.scss']
})
export class EmbassyMapComponent implements AfterViewInit{
constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // Embajada + 9 consulados (por ciudad; coords aprox. al centro)
  private pins: LocationPin[] = [
    { name: 'Embajada de EE.UU.', city: 'Ciudad de México', lat: 19.4326, lng: -99.1332, type: 'Embajada' },
    { name: 'Consulado', city: 'Ciudad Juárez', lat: 31.6904, lng: -106.4245, type: 'Consulado' },
    { name: 'Consulado', city: 'Guadalajara', lat: 20.6597, lng: -103.3496, type: 'Consulado' },
    { name: 'Consulado', city: 'Hermosillo', lat: 29.0729, lng: -110.9559, type: 'Consulado' },
    { name: 'Consulado', city: 'Matamoros', lat: 25.8690, lng: -97.5027, type: 'Consulado' },
    { name: 'Consulado', city: 'Mérida', lat: 20.9674, lng: -89.5926, type: 'Consulado' },
    { name: 'Consulado', city: 'Monterrey', lat: 25.6866, lng: -100.3161, type: 'Consulado' },
    { name: 'Consulado', city: 'Nogales', lat: 31.3012, lng: -110.9381, type: 'Consulado' },
    { name: 'Consulado', city: 'Nuevo Laredo', lat: 27.4779, lng: -99.5496, type: 'Consulado' },
    { name: 'Consulado', city: 'Tijuana', lat: 32.5149, lng: -117.0382, type: 'Consulado' },
  ];

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return; // importante si usas SSR

    const L = await import('leaflet');

    const map = L.map('usEmbassyMap', { scrollWheelZoom: false }).setView([23.7, -102.5], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const officialLink = 'https://mx.usembassy.gov/find-your-consular-location/'; // página oficial
    this.pins.forEach(p => {
      L.marker([p.lat, p.lng])
        .addTo(map)
        .bindPopup(`
          <b>${p.type} (${p.city})</b><br/>
          ${p.name}<br/>
          <a href="${officialLink}" target="_blank" rel="noopener">Ver ubicación oficial</a>
        `);
    });
  }
}
