export interface Lesson {
  titulo: string;
}

export interface Module {
  titulo: string;
  lecciones: Lesson[];
}

export interface Course {
  slug: string;
  titulo: string;
  descripcion: string;
  precio: number;
  imagen?: string;
  comprado?: boolean;
  publicado?: boolean;
  modulos: Module[];
}