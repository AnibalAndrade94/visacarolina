export type InfoMenuItem = {
  label: string;
  path: string;
  icon?: string; // opcional
};

export const INFO_MENU: InfoMenuItem[] = [
  { label: 'Costos oficiales', path: '/info/costos' },
  { label: 'Consulados', path: '/info/consulados' },
  { label: 'Pasaporte mexicano', path: '/info/pasaporte' },
  { label: 'Mapa de oficinas SRE', path: '/info/mapa-pasaporte' },
  { label: 'Preguntas frecuentes', path: '/info/faq' },
];