import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CursoService {

  // --------------------------------------------------------
  //  LISTA DE CURSOS (MVP – luego vendrá desde el backend)
  // --------------------------------------------------------
  private cursos = [
    {
      slug: 'visa-americana',
      titulo: 'Curso completo: Visa Americana B1/B2 paso a paso',
      descripcion: 'Aprende a llenar el DS-160, agendar citas, prepararte para la entrevista y evitar los errores más comunes.',
      precio: 799,
      imagen: '/assets/cursos/visa-americana.png',

      // MVP: cambiar a true/false según pruebas
      comprado: true,

      modulos: [
        {
          titulo: 'Introducción',
          lecciones: [
            {
              id: 'intro',
              titulo: 'Cómo funciona el proceso de visa americana',
              videoUrl: 'https://www.youtube.com/embed/qh3BUYK2k0E'
            }
          ]
        },
        {
          titulo: 'Formulario DS-160',
          lecciones: [
            {
              id: 'ds160-1',
              titulo: 'Crear tu cuenta DS-160',
              videoUrl: 'https://www.youtube.com/embed/qh3BUYK2k0E'
            },
            {
              id: 'ds160-2',
              titulo: 'Llenado profesional del DS-160',
              videoUrl: 'https://www.youtube.com/embed/qh3BUYK2k0E'
            }
          ]
        },
        {
          titulo: 'Citas y entrevista',
          lecciones: [
            {
              id: 'citas-1',
              titulo: 'Agendar VAC y Consulado',
              videoUrl: 'https://www.youtube.com/embed/qh3BUYK2k0E'
            },
            {
              id: 'citas-2',
              titulo: 'Preguntas más comunes en la entrevista',
              videoUrl: 'https://www.youtube.com/embed/qh3BUYK2k0E'
            }
          ]
        }
      ]
    },

    // --------------------------------------------------------
    //  CURSO 2 — VISA CANADIENSE
    // --------------------------------------------------------
    {
      slug: 'visa-canadiense',
      titulo: 'Curso completo: Visa Canadiense TRV',
      descripcion: 'Todo el proceso: portal IRCC, biométricos, evidencia económica, cuestionario y armado del expediente.',
      precio: 899,
      imagen: '/assets/cursos/visa-canadiense.png',

      comprado: false,

      modulos: [
        {
          titulo: 'Introducción al TRV',
          lecciones: [
            {
              id: 'trv-intro',
              titulo: 'Cómo funciona IRCC y qué revisan los oficiales',
              videoUrl: 'https://www.youtube.com/embed/qh3BUYK2k0E'
            }
          ]
        },
        {
          titulo: 'Llenado del IMM5257',
          lecciones: [
            {
              id: 'imm-1',
              titulo: 'Cuestionario para determinar elegibilidad',
              videoUrl: 'https://www.youtube.com/embed/qh3BUYK2k0E'
            },
            {
              id: 'imm-2',
              titulo: 'Cómo llenar el formulario IMM5257 correctamente',
              videoUrl: 'https://www.youtube.com/embed/qh3BUYK2k0E'
            }
          ]
        },
        {
          titulo: 'Biométricos y resultados',
          lecciones: [
            {
              id: 'bio-1',
              titulo: 'Qué hacer después de enviar tu solicitud',
              videoUrl: 'https://www.youtube.com/embed/qh3BUYK2k0E'
            },
            {
              id: 'bio-2',
              titulo: 'Carta de aprobación, passport request y tiempos',
              videoUrl: 'https://www.youtube.com/embed/qh3BUYK2k0E'
            }
          ]
        }
      ]
    },

    // --------------------------------------------------------
    //  CURSO 3 — eTA CANADIENSE
    // --------------------------------------------------------
    {
      slug: 'eta-canadiense',
      titulo: 'Curso express: eTA Canadiense sin errores',
      descripcion: 'Aprende a llenar la eTA correctamente, qué datos revisar del pasaporte y qué hacer si entra en revisión o la rechazan.',
      precio: 399,
      imagen: '/assets/cursos/eta-canadiense.png',

      comprado: true,

      modulos: [
        {
          titulo: 'Introducción a la eTA',
          lecciones: [
            {
              id: 'eta-1',
              titulo: 'Qué es la eTA y cómo funciona',
              videoUrl: 'https://www.youtube.com/embed/qh3BUYK2k0E'
            }
          ]
        },
        {
          titulo: 'Formulario eTA',
          lecciones: [
            {
              id: 'eta-2',
              titulo: 'Llenado paso a paso',
              videoUrl: 'https://www.youtube.com/embed/qh3BUYK2k0E'
            },
            {
              id: 'eta-3',
              titulo: 'Errores comunes del pasaporte que causan rechazo',
              videoUrl: 'https://www.youtube.com/embed/qh3BUYK2k0E'
            }
          ]
        },
        {
          titulo: 'Revisión y respuesta',
          lecciones: [
            {
              id: 'eta-4',
              titulo: 'Qué hacer si se va a revisión o es rechazada',
              videoUrl: 'https://www.youtube.com/embed/qh3BUYK2k0E'
            }
          ]
        }
      ]
    }
  ];

  // -------------------------------------------------------
  //   MÉTODOS PÚBLICOS
  // -------------------------------------------------------

  getCursos() {
    return this.cursos;
  }

  getCurso(slug: string) {
    return this.cursos.find(c => c.slug === slug);
  }

  // MVP: simula cursos comprados hasta que tengamos login real
  getCursosComprados() {
    return this.cursos.filter(c => c.comprado);
  }
}
