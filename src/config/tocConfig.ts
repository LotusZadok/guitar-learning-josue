type TocItem =
  | { id: string; labelKey: string; label?: never }
  | { id: string; label: string; labelKey?: never };

export const TOC_SECTIONS: Record<string, TocItem[]> = {
  '/t1': [
    { id: 's-notas',       labelKey: 't1.s01.label' },
    { id: 's-circulo',     labelKey: 't1.s03.label' },
    { id: 's-intervalos',  labelKey: 't1.s04.label' },
    { id: 's-escala',      labelKey: 't1.s06.label' },
    { id: 's-tension',     labelKey: 't1.s05.label' },
    { id: 's-triadas',     labelKey: 't1.s02.label' },
    { id: 's-acordes',     labelKey: 't1.s07.label' },
    { id: 's-quinta',      labelKey: 't1.s08.label' },
  ],
  '/t2': [
    { id: 's-t2-intro',        labelKey: 't2.s41.label' },
    { id: 's-t2-herramienta',  label: '2.2 · Orden de las alteraciones' },
    { id: 's-t2-sostenidos',   labelKey: 't2.s42.label' },
    { id: 's-t2-bemoles',      labelKey: 't2.s43.label' },
    { id: 's-t2-tabla',        labelKey: 't2.s45.label' },
    { id: 's-t2-grados',       labelKey: 't2.s47.label' },
    { id: 's-t2-progresiones', labelKey: 't2.s48.label' },
    { id: 's-t2-relativas',    labelKey: 't2.s49.label' },
  ],
  '/t3': [
    { id: 's-t3-septimas', labelKey: 't3.s311.label' },
    { id: 's-t3-acordes-septima', labelKey: 't3.s312.label' },
    { id: 's-t3-disminuidos', labelKey: 't3.s32.label' },
    { id: 's-t3-segunda-cuarta', labelKey: 't3.s331.label' },
    { id: 's-t3-suspendidos', labelKey: 't3.s33.label' },
    { id: 's-t3-constructor-completo', labelKey: 't3.s34.label' },
    { id: 's-t3-grado-7', labelKey: 't3.s35.label' },
  ],
};
