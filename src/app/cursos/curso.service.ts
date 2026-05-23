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
      titulo: 'Curso Visa Americana',
      descripcion: 'Aprende a llenar tu proceso paso a paso.',
      precio: 999,
      imagen: 'assets/cursos/visa-americana.png',
      publicado: true,
      modulos: [
        {
          titulo: 'Módulo 1: Introducción',
          lecciones: [
            { titulo: 'Bienvenida' },
            { titulo: 'Cómo funciona el trámite' }
          ]
        },
        {
          titulo: 'Módulo 2: DS-160',
          lecciones: [
            { titulo: 'Datos personales' },
            { titulo: 'Errores comunes' }
          ]
        }
      ]
    },
    {
      slug: 'visa-canadiense',
      titulo: 'Curso Visa Canadiense',
      descripcion: 'Entiende requisitos, documentos y pasos.',
      precio: 899,
      imagen: 'assets/cursos/visa-canadiense.png',
      publicado: true,
      modulos: [
        {
          titulo: 'Módulo 1: Base del trámite',
          lecciones: [
            { titulo: 'Qué necesitas' },
            { titulo: 'Cómo evitar errores' }
          ]
        }
      ]
    },
    {
      slug: 'eta-canada',
      titulo: 'Curso eTA Canadá',
      descripcion: 'Haz tu eTA sin depender de terceros.',
      precio: 499,
      imagen: 'assets/cursos/eta-canada.png',
      publicado: true,
      modulos: [
        {
          titulo: 'Módulo único',
          lecciones: [
            { titulo: 'Paso a paso' },
            { titulo: 'Errores frecuentes' }
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