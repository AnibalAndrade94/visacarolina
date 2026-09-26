import { AfterViewInit, Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SeoService } from '../../services/seo.service';

type LocationPin = {
  name: string;
  city: string;
  lat: number;
  lng: number;
  type: 'Embajada' | 'Consulado';
  address: string;
  phoneMx: string;
  phoneUs?: string;
  email: string;
  website: string;
};

@Component({
  selector: 'app-embassy-map',
  templateUrl: './embassy-map.component.html',
  styleUrls: ['./embassy-map.component.scss']
})
export class EmbassyMapComponent implements AfterViewInit,OnInit{


constructor(@Inject(PLATFORM_ID) private platformId: Object,private seo: SeoService) {}
ngOnInit(): void {
     this.seo.update({ title: 'Consulados y embajadas americanas en México | VisaCarolina',
  description: 'Usa el buscador de embajadas y consulados americanos, donde podrás encontrar toda la información de cada uno.',
  path: '/servicios/etabritanica' });

}
  // Embajada + 9 consulados (por ciudad; coords aprox. al centro)
  private markerMap = new Map<string, any>();
  private pins: LocationPin[] = [
  {
    name: 'Embajada de Estados Unidos',
    city: 'Ciudad de México',
    lat: 19.4326,
    lng: -99.1332,
    type: 'Embajada',
    address: 'Presa Angostura 225, Col. Irrigación, Miguel Hidalgo, CDMX, C.P. 11500',
    phoneMx: '55-8526-2561',
    phoneUs: '844-528-6611',
    email: 'ACSMexicoCity@state.gov',
    website: 'https://mx.usembassy.gov/es/visas-es/u-s-embassy-mexico-city-es/'
  },
  {
    name: 'Consulado General',
    city: 'Ciudad Juárez',
    lat: 31.6904,
    lng: -106.4245,
    type: 'Consulado',
    address: 'Paseo de la Victoria #3650, Fracc. Partido Senecú, Ciudad Juárez, Chihuahua, C.P. 32543',
    phoneMx: '656-344-3032',
    phoneUs: '1-844-528-6611',
    email: 'CDJSCS@state.gov',
    website: 'https://mx.usembassy.gov/es/visas-es/u-s-embassy-mexico-city-es/u-s-consulate-general-ciudad-juarez-es/'
  },
  {
    name: 'Consulado General',
    city: 'Guadalajara',
    lat: 20.6597,
    lng: -103.3496,
    type: 'Consulado',
    address: 'Progreso 175, Col. Americana, Guadalajara, Jalisco, C.P. 44160',
    phoneMx: '334-624-2102',
    email: 'ACSGDL@state.gov',
    website: 'https://mx.usembassy.gov/es/visas-es/u-s-embassy-mexico-city-es/u-s-consulate-general-guadalajara-es/'
  },
  {
    name: 'Consulado General',
    city: 'Hermosillo',
    lat: 29.0729,
    lng: -110.9559,
    type: 'Consulado',
    address: 'Monterrey 141, Col. Esqueda, Hermosillo, Sonora, C.P. 83000',
    phoneMx: '662-690-3262',
    email: 'HermoACS@state.gov',
    website: 'https://mx.usembassy.gov/es/visas-es/u-s-embassy-mexico-city-es/u-s-consulate-general-hermosillo-es/'
  },
  {
    name: 'Consulado General',
    city: 'Matamoros',
    lat: 25.8690,
    lng: -97.5027,
    type: 'Consulado',
    address: 'Calle Constitución No. 1, Col. Jardín, Matamoros, Tamaulipas, C.P. 87330',
    phoneMx: '868-206-1076',
    email: 'MatamorosACS@state.gov',
    website: 'https://mx.usembassy.gov/es/visas-es/u-s-embassy-mexico-city-es/u-s-consulate-general-matamoros-es/'
  },
  {
    name: 'Consulado General',
    city: 'Mérida',
    lat: 20.9674,
    lng: -89.5926,
    type: 'Consulado',
    address: 'Calle 60 No. 338-K x 29 y 31, Col. Alcalá Martín, Mérida, Yucatán, C.P. 97050',
    phoneMx: '999-316-7168',
    email: 'AskMeridaACS@state.gov',
    website: 'https://mx.usembassy.gov/es/visas-es/u-s-embassy-mexico-city-es/u-s-consulate-general-merida-es/'
  },
  {
    name: 'Consulado General',
    city: 'Monterrey',
    lat: 25.6866,
    lng: -100.3161,
    type: 'Consulado',
    address: 'Ave. Alfonso Reyes #150, Col. Valle del Poniente, Santa Catarina, Nuevo León, C.P. 66196',
    phoneMx: '814-160-5512',
    email: 'MonterreyACS@state.gov',
    website: 'https://mx.usembassy.gov/es/visas-es/u-s-embassy-mexico-city-es/u-s-consulate-general-monterrey-es/'
  },
  {
    name: 'Consulado General',
    city: 'Nogales',
    lat: 31.3012,
    lng: -110.9381,
    type: 'Consulado',
    address: 'Calle San José s/n, Fracc. Los Álamos, Nogales, Sonora, C.P. 84065',
    phoneMx: '631-980-0522',
    email: 'NogalesACS@state.gov',
    website: 'https://mx.usembassy.gov/es/visas-es/u-s-embassy-mexico-city-es/u-s-consulate-general-nogales-es/'
  },
  {
    name: 'Consulado General',
    city: 'Nuevo Laredo',
    lat: 27.4779,
    lng: -99.5496,
    type: 'Consulado',
    address: 'Col. Madero, Nuevo Laredo, Tamaulipas, C.P. 88260',
    phoneMx: '867-233-0557',
    email: 'NuevoLaredo-ACS@state.gov',
    website: 'https://mx.usembassy.gov/es/visas-es/u-s-embassy-mexico-city-es/u-s-consulate-general-nuevo-laredo-es/'
  },
  {
    name: 'Consulado General',
    city: 'Tijuana',
    lat: 32.5149,
    lng: -117.0382,
    type: 'Consulado',
    address: 'Paseo de las Culturas s/n, Mesa de Otay, Tijuana, Baja California, C.P. 22425',
    phoneMx: '664-748-0129',
    email: 'ACSTijuana@state.gov',
    website: 'https://mx.usembassy.gov/es/visas-es/u-s-embassy-mexico-city-es/u-s-consulate-general-tijuana-es/'
  }
];

  async ngAfterViewInit() {
  if (!isPlatformBrowser(this.platformId)) return;

  const L = await import('leaflet');

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
    iconUrl: 'assets/leaflet/marker-icon.png',
    shadowUrl: 'assets/leaflet/marker-shadow.png',
  });

  // ICONOS
  const embassyIcon = L.icon({
    iconUrl: 'assets/icons/embassy-marker.svg',
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -40],
  });

  const consulateIcon = L.icon({
    iconUrl: 'assets/icons/consulate-marker.svg',
    iconSize: [26, 38],
    iconAnchor: [13, 38],
    popupAnchor: [0, -36],
  });

  // MAPA
  const map = L.map('usEmbassyMap', {
    scrollWheelZoom: false
  }).setView([23.7, -102.5], 5);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  // MARKERS
  this.pins.forEach(p => {
     const icon = p.type === 'Embajada' ? embassyIcon : consulateIcon;

  const marker = L.marker([p.lat, p.lng], { icon })
    .addTo(map)
      .bindPopup(`
  <div class="popup">
    <h5>${p.type} – ${p.city}</h5>

    <p class="popup-name">${p.name}</p>

    <p>
      <strong>Dirección:</strong><br>
      ${p.address}
    </p>

    <p>
      <strong>Teléfono:</strong><br>
      ${p.phoneMx}
      ${p.phoneUs ? `<br>EUA: ${p.phoneUs}` : ''}
    </p>

    <p>
      <strong>Correo:</strong><br>
      <a href="mailto:${p.email}">${p.email}</a>
    </p>

    <div class="popup-actions">
      <a href="${p.website}" target="_blank" rel="noopener">
        Sitio oficial
      </a>
      <a href="https://www.google.com/maps?q=${p.lat},${p.lng}" target="_blank">
        Cómo llegar
      </a>
    </div>
  </div>
`);
this.markerMap.set(p.city, marker);
  });

  // GEOLOCALIZACIÓN (YA CON MAPA EXISTENTE)
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(pos => {
      const userLat = pos.coords.latitude;
      const userLng = pos.coords.longitude;

      const closest = this.pins.reduce((prev, curr) => {
  const prevDist = Math.hypot(prev.lat - userLat, prev.lng - userLng);
  const currDist = Math.hypot(curr.lat - userLat, curr.lng - userLng);
  return currDist < prevDist ? curr : prev;
});

map.setView([closest.lat, closest.lng], 9);

const marker = this.markerMap.get(closest.city);
marker?.openPopup();
    });
  }
}
}
