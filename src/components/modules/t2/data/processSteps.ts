import type { Tonalidad } from './tonalidades';
import { formatNote } from '../../../../utils/noteCalculations';

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

export type ProcessLocale = 'es' | 'de';

export function getProcessSteps(
  tonalidad: Tonalidad,
  direction: 'izq' | 'der',
  locale: ProcessLocale = 'es'
): ProcessStepData[] {
  if (tonalidad.esExcepcion) return getFExceptionSteps(locale);
  if (tonalidad.tipo === 'sostenido') {
    return direction === 'izq'
      ? getSharpsLeftSteps(tonalidad, locale)
      : getSharpsRightSteps(tonalidad, locale);
  }
  return direction === 'izq'
    ? getFlatsLeftSteps(tonalidad, locale)
    : getFlatsRightSteps(tonalidad, locale);
}

function getSharpsLeftSteps(t: Tonalidad, locale: ProcessLocale = 'es'): ProcessStepData[] {
  const isDe = locale === 'de';
  const f = (x: string) => formatNote(x, locale);
  const fs = (xs: string[]) => xs.map(f).join(' ');
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
      description: isDe
        ? `1. Ausgehend von ${f(t.tonica)}-Dur gehen wir eine kleine Sekunde (1 Ht.) von der Tonika ${f(t.tonica)} abwärts = ${f(lastSharp)}`
        : `1. Partiendo de ${f(t.tonica)} mayor, bajamos una 2m (1s.t.) de la tónica ${f(t.tonica)} = ${f(lastSharp)}`,
      circleNotes: s1, scaleDisplay: [], armaduraDisplay: [],
      arrow: { fromPos: NOTE_TO_POS[t.tonica], toPos: NOTE_TO_POS[lastSharp] },
    },
    {
      description: isDe
        ? `2. Wir akkumulieren die ♯ bis zum ermittelten Ton (${f(lastSharp)}) = ${fs(t.armadura)}`
        : `2. Acumulamos los ♯ hasta llegar a la nota que encontramos (${f(lastSharp)}) = ${fs(t.armadura)}`,
      circleNotes: s2, scaleDisplay: [], armaduraDisplay: [...t.armadura],
    },
    {
      description: isDe
        ? `3. Wir schreiben die 7 Stammtöne beginnend mit der Tonika ${f(letter)} = ${fs(naturalScale)}`
        : `3. Escribimos las 7 notas naturales comenzando en la tónica ${f(letter)} = ${fs(naturalScale)}`,
      circleNotes: s3, scaleDisplay: naturalScale, armaduraDisplay: [...t.armadura],
    },
    {
      description: isDe
        ? `4. Wir aktualisieren diese Tonleiter mit den Tönen aus Punkt 2 → ${fs(t.escala)}`
        : `4. Actualizamos dicha escala con las notas del punto 2 → ${fs(t.escala)}`,
      circleNotes: s4, scaleDisplay: [...t.escala], armaduraDisplay: [...t.armadura],
      closingText: isDe
        ? `Wir schließen daraus: die Vorzeichen von ${f(t.tonica)}-Dur sind ${fs(t.armadura)}. Die Tonleiter (7 Töne) von ${f(t.tonica)}-Dur ist ${fs(t.escala)}`
        : `Concluimos que la armadura de ${f(t.tonica)} mayor es ${fs(t.armadura)}. La escala o tonalidad (7 notas) de ${f(t.tonica)} mayor es ${fs(t.escala)}`,
    },
  ];
}

function getSharpsRightSteps(t: Tonalidad, locale: ProcessLocale = 'es'): ProcessStepData[] {
  const isDe = locale === 'de';
  const f = (x: string) => formatNote(x, locale);
  const fs = (xs: string[]) => xs.map(f).join(' ');
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
      description: isDe
        ? `1. Wir haben die Vorzeichen ${fs(t.armadura)}; wir nehmen das letzte ♯ der jeweiligen Vorzeichen = ${f(lastSharp)}`
        : `1. Tenemos la armadura ${fs(t.armadura)}, vamos al último ♯ de la armadura en cuestión = ${f(lastSharp)}`,
      circleNotes: s1, scaleDisplay: [], armaduraDisplay: [...t.armadura],
    },
    {
      description: isDe
        ? `2. Wir gehen eine kleine Sekunde (1 Ht.) von ${f(lastSharp)} aufwärts = ${f(t.tonica)}`
        : `2. Subimos una 2m (1s.t.) a ${f(lastSharp)} = ${f(t.tonica)}`,
      circleNotes: s2, scaleDisplay: [], armaduraDisplay: [...t.armadura],
      arrow: { fromPos: NOTE_TO_POS[lastSharp], toPos: NOTE_TO_POS[t.tonica] },
    },
    {
      description: isDe
        ? `3. So kennen wir die Tonika unserer Tonart; wir ordnen die 7 Stammtöne beginnend mit der Tonika ${f(letter)}`
        : `3. Así sabremos quién es la tónica de nuestra tonalidad, ordenamos las 7 notas naturales partiendo de la tónica ${f(letter)}`,
      circleNotes: s3, scaleDisplay: naturalScale, armaduraDisplay: [...t.armadura],
    },
    {
      description: isDe
        ? `4. Wir aktualisieren diese Tonleiter mit den Vorzeichen aus Punkt 1 → ${fs(t.escala)}`
        : `4. Actualizamos dicha escala con la armadura del punto 1 → ${fs(t.escala)}`,
      circleNotes: s4, scaleDisplay: [...t.escala], armaduraDisplay: [...t.armadura],
      closingText: isDe
        ? `Wir schließen daraus: die Vorzeichen von ${f(t.tonica)}-Dur sind ${fs(t.armadura)}. Die Tonleiter (7 Töne) von ${f(t.tonica)}-Dur ist ${fs(t.escala)}`
        : `Concluimos que la armadura de ${f(t.tonica)} mayor es ${fs(t.armadura)}. La escala o tonalidad (7 notas) de ${f(t.tonica)} mayor es ${fs(t.escala)}`,
    },
  ];
}

function getFlatsLeftSteps(t: Tonalidad, locale: ProcessLocale = 'es'): ProcessStepData[] {
  const isDe = locale === 'de';
  const f = (x: string) => formatNote(x, locale);
  const fs = (xs: string[]) => xs.map(f).join(' ');
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
      description: isDe
        ? `1. Ausgehend von ${f(t.tonica)}-Dur suchen wir die Tonika ${f(t.tonica)} im Werkzeug B Es As Des Ges Ces Fes`
        : `1. Partiendo de ${f(t.tonica)} mayor, buscamos la tónica ${f(t.tonica)} en la herramienta B♭ E♭ A♭ D♭ G♭ C♭ F♭`,
      circleNotes: s1, scaleDisplay: [], armaduraDisplay: [],
    },
    {
      description: isDe
        ? `2. Wir gehen ein ♭ weiter (${f(nextFlat)}) und schreiben die gefundenen ♭ auf = ${fs(t.armadura)}`
        : `2. Nos movemos un ♭ más (${f(nextFlat)}) y escribimos los ♭ encontrados = ${fs(t.armadura)}`,
      circleNotes: s2, scaleDisplay: [], armaduraDisplay: [...t.armadura],
    },
    {
      description: isDe
        ? `3. Wir schreiben die 7 Stammtöne beginnend mit der Tonika ${f(letter)} = ${fs(naturalScale)}`
        : `3. Escribimos las 7 notas naturales comenzando en la tónica ${f(letter)} = ${fs(naturalScale)}`,
      circleNotes: s3, scaleDisplay: naturalScale, armaduraDisplay: [...t.armadura],
    },
    {
      description: isDe
        ? `4. Wir aktualisieren diese Tonleiter mit den Tönen aus Punkt 2 → ${fs(t.escala)}`
        : `4. Actualizamos dicha escala con las notas del punto 2 → ${fs(t.escala)}`,
      circleNotes: s4, scaleDisplay: [...t.escala], armaduraDisplay: [...t.armadura],
      closingText: isDe
        ? `Wir schließen daraus: die Vorzeichen von ${f(t.tonica)}-Dur sind ${fs(t.armadura)}. Die Tonleiter (7 Töne) von ${f(t.tonica)}-Dur ist ${fs(t.escala)}`
        : `Concluimos que la armadura de ${f(t.tonica)} mayor es ${fs(t.armadura)}. La escala o tonalidad (7 notas) de ${f(t.tonica)} mayor es ${fs(t.escala)}`,
    },
  ];
}

function getFlatsRightSteps(t: Tonalidad, locale: ProcessLocale = 'es'): ProcessStepData[] {
  const isDe = locale === 'de';
  const f = (x: string) => formatNote(x, locale);
  const fs = (xs: string[]) => xs.map(f).join(' ');
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
      description: isDe
        ? `1. Wir haben die Vorzeichen ${fs(t.armadura)} und suchen das vorletzte ♭ der jeweiligen Vorzeichen = ${f(penultimate)}`
        : `1. Tenemos la armadura ${fs(t.armadura)}, buscamos el penúltimo ♭ de la armadura en cuestión = ${f(penultimate)}`,
      circleNotes: s1, scaleDisplay: [], armaduraDisplay: [...t.armadura],
    },
    {
      description: isDe
        ? `2. Das ist unsere Tonika = ${f(t.tonica)}-Dur`
        : `2. Esa es nuestra tónica = ${f(t.tonica)} mayor`,
      circleNotes: s2, scaleDisplay: [], armaduraDisplay: [...t.armadura],
    },
    {
      description: isDe
        ? `3. Da wir die Tonika unserer Tonart kennen, ordnen wir die 7 Stammtöne beginnend mit der Tonika ${f(letter)}`
        : `3. Sabiendo quien es la tónica de nuestra tonalidad, ordenamos las 7 notas naturales partiendo de la tónica ${f(letter)}`,
      circleNotes: s3, scaleDisplay: naturalScale, armaduraDisplay: [...t.armadura],
    },
    {
      description: isDe
        ? `4. Wir aktualisieren diese Tonleiter mit den Vorzeichen aus Punkt 1 → ${fs(t.escala)}`
        : `4. Actualizamos dicha escala con la armadura del punto 1 → ${fs(t.escala)}`,
      circleNotes: s4, scaleDisplay: [...t.escala], armaduraDisplay: [...t.armadura],
      closingText: isDe
        ? `Wir schließen daraus: die Vorzeichen von ${f(t.tonica)}-Dur sind ${fs(t.armadura)}. Die Tonleiter (7 Töne) von ${f(t.tonica)}-Dur ist ${fs(t.escala)}`
        : `Concluimos que la armadura de ${f(t.tonica)} mayor es ${fs(t.armadura)}. La escala o tonalidad (7 notas) de ${f(t.tonica)} mayor es ${fs(t.escala)}`,
    },
  ];
}

function getFExceptionSteps(locale: ProcessLocale = 'es'): ProcessStepData[] {
  const isDe = locale === 'de';
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
      description: isDe
        ? 'F-Dur hat nur das erste ♭ des Werkzeugs: B'
        : 'F mayor solo cuenta con el primer ♭ de la herramienta: B♭',
      circleNotes: s1, scaleDisplay: [], armaduraDisplay: ['Bb'],
    },
    {
      description: isDe ? 'Tonleiter: F G A B C D E' : 'Escala: F G A B♭ C D E',
      circleNotes: s2,
      scaleDisplay: ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
      armaduraDisplay: ['Bb'],
      closingText: isDe
        ? 'Wir könnten schlussfolgern, dass die Vorzeichen von F-Dur nur B sind und die Tonleiter F G A B C D E ist'
        : 'Podríamos concluir que la armadura de F mayor es solo B♭, y la escala es F G A B♭ C D E',
    },
  ];
}
