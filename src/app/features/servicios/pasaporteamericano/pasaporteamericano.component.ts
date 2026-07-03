import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
type TipoPasaporte = 'DS-11' | 'DS-82';
@Component({
  selector: 'app-pasaporteamericano',
  templateUrl: './pasaporteamericano.component.html',
  styleUrls: ['./pasaporteamericano.component.scss']
})
export class PasaporteamericanoComponent {
 // Valor seleccionado en el <select>
  selectedType: TipoPasaporte = 'DS-11';

  // Opcional: lista para usar en *ngFor si la necesitas
  readonly tipos: TipoPasaporte[] = ['DS-11', 'DS-82'];

  // Teléfono y mensajes (edítalos si cambia el número o texto)
  private readonly whatsappBase = 'https://wa.me/524448017241';
  private readonly mensajeWA = 'Hola VisaCarolina, quiero asesoría para pasaporte';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Lee ?tipo=DS-11|DS-82 para preseleccionar
    const tipo = (this.route.snapshot.queryParamMap.get('tipo') || '').toUpperCase();
    if (tipo === 'DS-11' || tipo === 'DS-82') {
      this.selectedType = tipo as TipoPasaporte;
    }
  }

  // Href para WhatsApp con el tipo incluido
  get whatsappHref(): string {
    const text = `${this.mensajeWA} (${this.selectedType})`;
    const query = `?text=${encodeURIComponent(text)}`;
    return `${this.whatsappBase}${query}`;
  }

  // Href para tu formulario unificado
  get formHref(): string {
    return `/servicios/formpasaporte?tipo=${encodeURIComponent(this.selectedType)}`;
  }

  // (Opcional) Si prefieres manejar (change) del <select>
  onTipoChange(valor: string): void {
    const v = (valor || '').toUpperCase();
    if (v === 'DS-11' || v === 'DS-82') {
      this.selectedType = v as TipoPasaporte;
    }
  }
}
