import { Component } from '@angular/core';

@Component({
  selector: 'app-landing2',
  templateUrl: './landing2.component.html',
  styleUrls: ['./landing2.component.scss']
})
export class Landing2Component {
modules = [
  {
    number: '01',
    title: 'Introducción al trámite',
    description: 'Qué es la visa B1/B2, qué permite hacer y cómo funciona el proceso general.'
  },
  {
    number: '02',
    title: 'Evaluación del perfil',
    description: 'Qué revisa un oficial consular, cómo identificar perfil fuerte, medio o de riesgo.'
  },
  {
    number: '03',
    title: 'Documentos necesarios',
    description: 'Documentos básicos, laborales, económicos, familiares y errores que no debes cometer.'
  },
  {
    number: '04',
    title: 'DS-160 paso a paso',
    description: 'Cómo llenar correctamente el formulario y evitar inconsistencias.'
  },
  {
    number: '05',
    title: 'Pago y sistema de citas',
    description: 'Perfil, pago consular, agenda de CAS y entrevista.'
  },
  {
    number: '06',
    title: 'Preparación para la cita CAS',
    description: 'Qué llevar, qué pasa durante la cita y problemas comunes.'
  },
  {
    number: '07',
    title: 'Preparación para la entrevista',
    description: 'Preguntas frecuentes, cómo responder y casos especiales.'
  },
  {
    number: '08',
    title: 'Resultados de la entrevista',
    description: 'Aprobación, negativa, proceso administrativo y uso correcto de la visa.'
  },
  {
    number: '09',
    title: 'Renovación de visa',
    description: 'Qué cambia en renovación, errores frecuentes y puntos a revisar.'
  },
  {
    number: '10',
    title: 'Ética y responsabilidad del asesor',
    description: 'Límites, protección de datos, atención al cliente y buenas prácticas.'
  }
];
}
