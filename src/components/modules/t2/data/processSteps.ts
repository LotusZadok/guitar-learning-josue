import type { Tonalidad } from './tonalidades';

export type NoteState = 'tonica' | 'highlighted' | 'natural' | 'neutral';

export interface CircleNoteData {
  label: string;
  state: NoteState;
}

export interface ProcessStepData {
  description: string;
  circleNotes: CircleNoteData[];
  scaleDisplay: string[];
  armaduraDisplay: string[];
  arrow?: { fromPos: number; toPos: number };
  closingText?: string;
}

const CHROMATIC = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const NOTE_TO_POS: Record<string, number> = {
  'C': 0, 'B#': 0,
  'C#': 1, 'Db': 1,
  'D': 2,
  'D#': 3, 'Eb': 3,
  'E': 4, 'Fb': 4,
  'F': 5, 'E#': 5,
  'F#': 6, 'Gb': 6,
  'G': 7,
  'G#': 8, 'Ab': 8,
  'A': 9,
  'A#': 10, 'Bb': 10,
  'B': 11, 'Cb': 11,
};

export { NOTE_TO_POS };

const HERRAMIENTA_FLATS = ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb', 'Fb'];

function makeDefaultCircle(): CircleNoteData[] {
  return CHROMATIC.map(label => ({ label, state: 'neutral' as NoteState }));
}

function setNote(circle: CircleNoteData[], name: string, state: NoteState): void {
  const pos = NOTE_TO_POS[name];
  if (pos !== undefined) {
    circle[pos] = { label: name, state };
  }
}

function tonicLetter(tonica: string): string {
  return tonica.replace('#', '').replace('b', '');
}

function naturalScaleFrom(letter: string): string[] {
  const naturals = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const idx = naturals.indexOf(letter);
  return [...naturals.slice(idx), ...naturals.slice(0, idx)];
}

export function getIdleCircle(tonalidad: Tonalidad): CircleNoteData[] {
  const circle = makeDefaultCircle();
  setNote(circle, tonalidad.tonica, 'tonica');
  return circle;
}

export function getProcessSteps(
  tonalidad: Tonalidad,
  direction: 'izq' | 'der'
): ProcessStepData[] {
  if (tonalidad.esExcepcion) return getFExceptionSteps();
  if (tonalidad.tipo === 'sostenido') {
    return direction === 'izq'
      ? getSharpsLeftSteps(tonalidad)
      : getSharpsRightSteps(tonalidad);
  }
  return direction === 'izq'
    ? getFlatsLeftSteps(tonalidad)
    : getFlatsRightSteps(tonalidad);
}

function getSharpsLeftSteps(t: Tonalidad): ProcessStepData[] {
  const letter = tonicLetter(t.tonica);
  const naturalScale = naturalScaleFrom(letter);
  const lastSharp = t.armadura[t.armadura.length - 1];

  const s1 = makeDefaultCircle();
  setNote(s1, t.tonica, 'tonica');
  setNote(s1, lastSharp, 'highlighted');

  const s2 = makeDefaultCircle();
  setNote(s2, t.tonica, 'tonica');
  t.armadura.forEach(n => setNote(s2, n, 'highlighted'));

  const s3 = makeDefaultCircle();
  naturalScale.forEach((n, i) => setNote(s3, n, i === 0 ? 'tonica' : 'natural'));

  const s4 = makeDefaultCircle();
  t.escala.forEach((n, i) => {
    if (i === 0) setNote(s4, n, 'tonica');
    else setNote(s4, n, n.includes('#') ? 'highlighted' : 'natural');
  });

  return [
    {
      description: `1. Partiendo de ${t.tonica} mayor, bajamos una 2m (1s.t.) de la tónica ${t.tonica} = ${lastSharp}`,
      circleNotes: s1, scaleDisplay: [], armaduraDisplay: [],
      arrow: { fromPos: NOTE_TO_POS[t.tonica], toPos: NOTE_TO_POS[lastSharp] },
    },
    {
      description: `2. Acumulamos los # hasta llegar a la nota que encontramos (${lastSharp}) = ${t.armadura.join(' ')}`,
      circleNotes: s2, scaleDisplay: [], armaduraDisplay: [...t.armadura],
    },
    {
      description: `3. Escribimos las 7 notas naturales comenzando en la tónica ${letter} = ${naturalScale.join(' ')}`,
      circleNotes: s3, scaleDisplay: naturalScale, armaduraDisplay: [...t.armadura],
    },
    {
      description: `4. Actualizamos dicha escala con las notas del punto 2 → ${t.escala.join(' ')}`,
      circleNotes: s4, scaleDisplay: [...t.escala], armaduraDisplay: [...t.armadura],
      closingText: `Concluimos que la armadura de ${t.tonica} mayor es ${t.armadura.join(' ')}. La escala o tonalidad (7 notas) de ${t.tonica} mayor es ${t.escala.join(' ')}`,
    },
  ];
}

function getSharpsRightSteps(t: Tonalidad): ProcessStepData[] {
  const letter = tonicLetter(t.tonica);
  const naturalScale = naturalScaleFrom(letter);
  const lastSharp = t.armadura[t.armadura.length - 1];

  const s1 = makeDefaultCircle();
  t.armadura.forEach(n => setNote(s1, n, 'highlighted'));

  const s2 = makeDefaultCircle();
  setNote(s2, lastSharp, 'highlighted');
  setNote(s2, t.tonica, 'tonica');

  const s3 = makeDefaultCircle();
  naturalScale.forEach((n, i) => setNote(s3, n, i === 0 ? 'tonica' : 'natural'));

  const s4 = makeDefaultCircle();
  t.escala.forEach((n, i) => {
    if (i === 0) setNote(s4, n, 'tonica');
    else setNote(s4, n, n.includes('#') ? 'highlighted' : 'natural');
  });

  return [
    {
      description: `1. Tenemos la armadura ${t.armadura.join(' ')}, vamos al último # de la armadura en cuestión = ${lastSharp}`,
      circleNotes: s1, scaleDisplay: [], armaduraDisplay: [...t.armadura],
    },
    {
      description: `2. Subimos una 2m (1s.t.) a ${lastSharp} = ${t.tonica}`,
      circleNotes: s2, scaleDisplay: [], armaduraDisplay: [...t.armadura],
      arrow: { fromPos: NOTE_TO_POS[lastSharp], toPos: NOTE_TO_POS[t.tonica] },
    },
    {
      description: `3. Así sabremos quién es la tónica de nuestra tonalidad, ordenamos las 7 notas naturales partiendo de la tónica ${letter}`,
      circleNotes: s3, scaleDisplay: naturalScale, armaduraDisplay: [...t.armadura],
    },
    {
      description: `4. Actualizamos dicha escala con la armadura del punto 1 → ${t.escala.join(' ')}`,
      circleNotes: s4, scaleDisplay: [...t.escala], armaduraDisplay: [...t.armadura],
      closingText: `Concluimos que la armadura de ${t.tonica} mayor es ${t.armadura.join(' ')}. La escala o tonalidad (7 notas) de ${t.tonica} mayor es ${t.escala.join(' ')}`,
    },
  ];
}

function getFlatsLeftSteps(t: Tonalidad): ProcessStepData[] {
  const letter = tonicLetter(t.tonica);
  const naturalScale = naturalScaleFrom(letter);
  const tonicaIdx = HERRAMIENTA_FLATS.indexOf(t.tonica);
  const nextFlat = HERRAMIENTA_FLATS[tonicaIdx + 1];

  const s1 = makeDefaultCircle();
  setNote(s1, t.tonica, 'tonica');

  const s2 = makeDefaultCircle();
  setNote(s2, t.tonica, 'tonica');
  t.armadura.forEach(n => setNote(s2, n, 'highlighted'));
  setNote(s2, t.tonica, 'tonica');

  const s3 = makeDefaultCircle();
  naturalScale.forEach(n => setNote(s3, n, 'natural'));

  const s4 = makeDefaultCircle();
  t.escala.forEach((n, i) => {
    if (i === 0) setNote(s4, n, 'tonica');
    else setNote(s4, n, n.includes('b') ? 'highlighted' : 'natural');
  });

  return [
    {
      description: `1. Partiendo de ${t.tonica} mayor, buscamos la tónica ${t.tonica} en la herramienta Bb Eb Ab Db Gb Cb Fb`,
      circleNotes: s1, scaleDisplay: [], armaduraDisplay: [],
    },
    {
      description: `2. Nos movemos un b más (${nextFlat}) y escribimos los b encontrados = ${t.armadura.join(' ')}`,
      circleNotes: s2, scaleDisplay: [], armaduraDisplay: [...t.armadura],
    },
    {
      description: `3. Escribimos las 7 notas naturales comenzando en la tónica ${letter} = ${naturalScale.join(' ')}`,
      circleNotes: s3, scaleDisplay: naturalScale, armaduraDisplay: [...t.armadura],
    },
    {
      description: `4. Actualizamos dicha escala con las notas del punto 2 → ${t.escala.join(' ')}`,
      circleNotes: s4, scaleDisplay: [...t.escala], armaduraDisplay: [...t.armadura],
      closingText: `Concluimos que la armadura de ${t.tonica} mayor es ${t.armadura.join(' ')}. La escala o tonalidad (7 notas) de ${t.tonica} mayor es ${t.escala.join(' ')}`,
    },
  ];
}

function getFlatsRightSteps(t: Tonalidad): ProcessStepData[] {
  const letter = tonicLetter(t.tonica);
  const naturalScale = naturalScaleFrom(letter);
  const penultimate = t.armadura[t.armadura.length - 2];

  const s1 = makeDefaultCircle();
  t.armadura.forEach(n => setNote(s1, n, 'highlighted'));

  const s2 = makeDefaultCircle();
  setNote(s2, t.tonica, 'tonica');

  const s3 = makeDefaultCircle();
  naturalScale.forEach(n => setNote(s3, n, 'natural'));

  const s4 = makeDefaultCircle();
  t.escala.forEach((n, i) => {
    if (i === 0) setNote(s4, n, 'tonica');
    else setNote(s4, n, n.includes('b') ? 'highlighted' : 'natural');
  });

  return [
    {
      description: `1. Tenemos la armadura ${t.armadura.join(' ')}, buscamos el penúltimo b de la armadura en cuestión = ${penultimate}`,
      circleNotes: s1, scaleDisplay: [], armaduraDisplay: [...t.armadura],
    },
    {
      description: `2. Esa es nuestra tónica = ${t.tonica} mayor`,
      circleNotes: s2, scaleDisplay: [], armaduraDisplay: [...t.armadura],
    },
    {
      description: `3. Sabiendo quien es la tónica de nuestra tonalidad, ordenamos las 7 notas naturales partiendo de la tónica ${letter}`,
      circleNotes: s3, scaleDisplay: naturalScale, armaduraDisplay: [...t.armadura],
    },
    {
      description: `4. Actualizamos dicha escala con la armadura del punto 1 → ${t.escala.join(' ')}`,
      circleNotes: s4, scaleDisplay: [...t.escala], armaduraDisplay: [...t.armadura],
      closingText: `Concluimos que la armadura de ${t.tonica} mayor es ${t.armadura.join(' ')}. La escala o tonalidad (7 notas) de ${t.tonica} mayor es ${t.escala.join(' ')}`,
    },
  ];
}

function getFExceptionSteps(): ProcessStepData[] {
  const s1 = makeDefaultCircle();
  setNote(s1, 'F', 'tonica');
  setNote(s1, 'Bb', 'highlighted');

  const s2 = makeDefaultCircle();
  ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'].forEach((n, i) => {
    if (i === 0) setNote(s2, n, 'tonica');
    else setNote(s2, n, n.includes('b') ? 'highlighted' : 'natural');
  });

  return [
    {
      description: 'F mayor solo cuenta con el primer b de la herramienta: Bb',
      circleNotes: s1, scaleDisplay: [], armaduraDisplay: ['Bb'],
    },
    {
      description: 'Escala: F G A Bb C D E',
      circleNotes: s2,
      scaleDisplay: ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
      armaduraDisplay: ['Bb'],
      closingText: 'Podríamos concluir que la armadura de F mayor es solo Bb, y la escala es F G A Bb C D E',
    },
  ];
}
