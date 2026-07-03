import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Course } from './models/cursos.model';

@Injectable({
  providedIn: 'root'
})
export class CursoService {
  constructor(private auth: AuthService) {}

  private cursosBase: Course[] = [
    {
      slug: 'visa-americana',
      titulo: 'Curso Visa Turista B1/B2',
      descripcion: 'Aprende paso a paso cómo evaluar tu perfil, llenar el DS-160, preparar documentos y llegar listo a tu entrevista consular.',
      precio: 3500,
      imagen: 'assets/cursos/visa-americana.png',
      publicado: true,
      modulos: [
        {
          titulo: 'Módulo 1: Introducción al trámite',
          lecciones: [
            { titulo: 'Bienvenida' },
            { titulo: 'Cómo funciona el proceso general' }
          ]
        },
        {
          titulo: 'Módulo 2: Evaluación del perfil',
          lecciones: [
            { titulo: 'Qué revisa un oficial consular' },
            { titulo: 'Perfil fuerte, medio o de riesgo' }
          ]
        },
        {
          titulo: 'Módulo 3: Documentos necesarios',
          lecciones: [
            { titulo: 'Documentos básicos y laborales' },
            { titulo: 'Errores que no debes cometer' }
          ]
        },
        {
          titulo: 'Módulo 4: DS-160 paso a paso',
          lecciones: [
            { titulo: 'Cómo llenarlo correctamente' },
            { titulo: 'Cómo evitar inconsistencias' }
          ]
        },
        {
          titulo: 'Módulo 5: Pago y sistema de citas',
          lecciones: [
            { titulo: 'Perfil y pago consular' },
            { titulo: 'Agenda de CAS y entrevista' }
          ]
        },
        {
          titulo: 'Módulo 6: Preparación para la cita CAS',
          lecciones: [
            { titulo: 'Qué llevar y qué pasa durante la cita' }
          ]
        },
        {
          titulo: 'Módulo 7: Preparación para la entrevista',
          lecciones: [
            { titulo: 'Preguntas frecuentes' },
            { titulo: 'Casos especiales' }
          ]
        },
        {
          titulo: 'Módulo 8: Resultados de la entrevista',
          lecciones: [
            { titulo: 'Aprobación, negativa y proceso administrativo' }
          ]
        },
        {
          titulo: 'Módulo 9: Renovación de visa',
          lecciones: [
            { titulo: 'Qué cambia en renovación' },
            { titulo: 'Errores frecuentes' }
          ]
        },
        {
          titulo: 'Módulo 10: Ética y responsabilidad del asesor',
          lecciones: [
            { titulo: 'Buenas prácticas y atención al cliente' }
          ]
        }
      ]
    }
  ];

  private withOwnership(course: Course): Course {
    const user = this.auth.getUser();
    const owned = user?.coursesOwned || [];

    return {
      ...course,
      comprado: owned.includes(course.slug)
    };
  }

  getCursos(): Course[] {
    return this.cursosBase
      .filter(c => c.publicado)
      .map(c => this.withOwnership(c));
  }
  getCursosComprados(): Course[] {
  const user = this.auth.getUser();
  const owned = user?.coursesOwned || [];

  return this.cursosBase
    .filter(c => c.publicado && owned.includes(c.slug))
    .map(c => this.withOwnership(c));
}

  getCurso(slug: string): Course | null {
    const found = this.cursosBase.find(c => c.slug === slug);
    return found ? this.withOwnership(found) : null;
  }

  hasAccess(slug: string): boolean {
    const user = this.auth.getUser();
    const owned = user?.coursesOwned || [];
    return owned.includes(slug);
  }
  
}