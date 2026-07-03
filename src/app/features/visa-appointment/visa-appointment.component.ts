import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

type FaqItem = { q: string; a: string; open?: boolean };
@Component({
  selector: 'app-visa-appointment',
  templateUrl: './visa-appointment.component.html',
  styleUrls: ['./visa-appointment.component.scss']
})
export class VisaAppointmentComponent {
 // Puedes ajustar textos/branding sin tocar el HTML
  brandName = 'VisaCarolina';
  supportCtaText = '¿Tienes dudas? Escríbenos por WhatsApp';
  // TODO: pon tu link real
  whatsappLink = 'https://wa.me/524448017241?text=Hola%20quiero%20ayuda%20para%20mi%20cita%20de%20visa';

  // Listas para render
  beforeList = [
    'Verifica fecha, hora y sede de tus citas (CAS y Consulado).',
    'Asiste primero al CAS, aunque el sistema muestre primero la cita del Consulado.',
    'Llega 30 a 60 minutos antes (tráfico + filas + seguridad).',
    'Imprime y ordena tus confirmaciones y comprobantes.',
  ];

  docsList = [
    'Pasaporte vigente.',
    'Confirmación del formulario DS-160.',
    'Confirmación de citas (CAS y Consulado).',
    'Comprobante de pago.',
    'Pasaportes anteriores (si aplica).',
  ];

  forbiddenList = [
    'Teléfonos celulares, smartwatches, tablets, laptops.',
    'Audífonos, memorias USB, tarjetas SD, discos.',
    'Cámaras o equipo de video.',
    'Encendedores y cerillos.',
    'Mochilas grandes o maletas.',
    'Armas o artículos punzocortantes.',
  ];

  presentationList = [
    'Vístete formal pero cómodo (imagen limpia y ordenada).',
    'Evita gorras y lentes oscuros dentro (si te lo piden, retíralos).',
    'Mantén una actitud tranquila y respetuosa.',
  ];

  interviewList = [
    'Escucha con atención y responde solo lo que te preguntan.',
    'Sé honesto y claro: no inventes información.',
    'No memorices un “guion”; contesta natural.',
    'La entrevista suele ser breve: es normal.',
  ];

  notesList = [
    'La decisión final depende únicamente del oficial consular.',
    'No existen “trucos” ni “contactos” que garanticen aprobación.',
    'Evita consejos de redes que sugieran mentir o falsear datos.',
  ];

  faqs: FaqItem[] = [
    {
      q: '¿Por qué debo ir primero al CAS si el sistema muestra primero el Consulado?',
      a: 'Porque el proceso requiere biométricos (foto/huellas) en el CAS antes de presentarte al Consulado. Aunque el orden visual confunda, siempre sigue el flujo: CAS → Consulado.',
      open: true,
    },
    {
      q: '¿Puedo entrar con celular si lo traigo apagado?',
      a: 'Normalmente no. Por seguridad suelen prohibir electrónicos. Lo mejor es no llevarlo o dejarlo con alguien afuera.',
    },
    {
      q: '¿Qué pasa si olvido un documento?',
      a: 'Puede retrasar tu proceso o impedirte entrar. Revisa tu carpeta la noche anterior y lleva impresos los básicos.',
    },
  ];

  toggleFaq(i: number) {
    this.faqs[i].open = !this.faqs[i].open;
  }

  printPage() {
    window.print();
  }
}
