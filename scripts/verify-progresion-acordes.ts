// Arnés de la resolución grado → acorde sonante. Carga la cadena real
// (progresionAcordes → noteCalculations → data/notes) desde Node.
import { acordeDeGrado, acordeDeSlot, armaduraPorId, etiquetaTonalidad, ARMADURAS } from '../src/utils/progresionAcordes.ts';
import { gradosDe, type GradoId, type Modo } from '../src/utils/progresionArmonica.ts';
import { conducirVoces, type Disposicion } from '../src/utils/conduccionVoces.ts';
import { ALL } from '../src/data/notes.ts';
import type { ChromaticNote } from '../src/types/music';
import { check, resumen } from './verify-helpers.ts';

const cif = (arm: string, modo: Modo, g: GradoId, sept: boolean) =>
  acordeDeGrado({ armadura: armaduraPorId(arm), modo, id: g, septimas: sept }).cifrado;

console.log('\n— Do mayor, triadas —');
check('I',    cif('C', 'mayor', 'I', false),    'C');
check('ii',   cif('C', 'mayor', 'ii', false),   'Dm');
check('iii',  cif('C', 'mayor', 'iii', false),  'Em');
check('IV',   cif('C', 'mayor', 'IV', false),   'F');
check('V',    cif('C', 'mayor', 'V', false),    'G');
check('vi',   cif('C', 'mayor', 'vi', false),   'Am');
check('vii°', cif('C', 'mayor', 'vii°', false), 'Bdim');

console.log('\n— Do mayor, septimas —');
check('Imaj7',  cif('C', 'mayor', 'I', true),    'Cmaj7');
check('ii7',    cif('C', 'mayor', 'ii', true),   'Dm7');
check('V7',     cif('C', 'mayor', 'V', true),    'G7');
check('vii m7b5', cif('C', 'mayor', 'vii°', true), 'Bm7♭5');

console.log('\n— Tonizaciones en Do mayor —');
// La dominante secundaria SIEMPRE lleva 7ma, aunque el banco este en triadas:
// sin la 7ma es solo un acorde mayor y pierde el punto (decision del spec §2).
check('V/ii en triadas sigue siendo dominante', cif('C', 'mayor', 'V/ii', false), 'A7');
check('V/ii', cif('C', 'mayor', 'V/ii', true), 'A7');
check('V/iii', cif('C', 'mayor', 'V/iii', true), 'B7');
check('V/IV', cif('C', 'mayor', 'V/IV', true), 'C7');
check('V/V', cif('C', 'mayor', 'V/V', true), 'D7');
check('V/vi', cif('C', 'mayor', 'V/vi', true), 'E7');
// El ii de x toma su calidad del destino: destino mayor → m7, destino menor →
// m7b5. Son los dos escenarios de §3.8.
check('ii/ii (destino menor) es semidisminuido', cif('C', 'mayor', 'ii/ii', true), 'Em7♭5');
check('ii/vi (destino menor) es semidisminuido', cif('C', 'mayor', 'ii/vi', true), 'Bm7♭5');
check('ii/IV (destino mayor) es menor', cif('C', 'mayor', 'ii/IV', true), 'Gm7');
check('ii/V (destino mayor) es menor', cif('C', 'mayor', 'ii/V', true), 'Am7');

console.log('\n— Fa# menor (relativa de La mayor) —');
check('i',    cif('A', 'menor', 'i', true),    'F♯m7');
check('ii°',  cif('A', 'menor', 'ii°', true),  'G♯m7♭5');
check('♭III', cif('A', 'menor', '♭III', true), 'Amaj7');
check('iv',   cif('A', 'menor', 'iv', true),   'Bm7');
check('v',    cif('A', 'menor', 'v', true),    'C♯m7');
check('♭VI',  cif('A', 'menor', '♭VI', true),  'Dmaj7');
check('♭VII', cif('A', 'menor', '♭VII', true), 'E7');
check('V/iv', cif('A', 'menor', 'V/iv', true), 'F♯7');

console.log('\n— Armadura con bemoles —');
check('Mib mayor I',  cif('Eb', 'mayor', 'I', true),  'E♭maj7');
check('Mib mayor IV', cif('Eb', 'mayor', 'IV', true), 'A♭maj7');
check('Mib mayor V',  cif('Eb', 'mayor', 'V', true),  'B♭7');

console.log('\n— Doble sostenido: convencion x, no dos sostenidos —');
// noteCalculations fija 'x' para el doble sostenido (diff === 2 → "x", y lo
// documenta en ChordMember como "Cx"). Do♯ mayor (7♯) es la unica armadura
// seleccionable que lo alcanza, via las tonizaciones ii/iii y ii/v.
check('C♯ mayor ii/iii triada',  cif('C#', 'mayor', 'ii/iii', false), 'Fxdim');
check('C♯ mayor ii/iii septima', cif('C#', 'mayor', 'ii/iii', true),  'Fxm7♭5');
check('C♯ menor ii/v triada',    cif('C#', 'menor', 'ii/v', false),   'Fxdim');
check('C♯ menor ii/v septima',   cif('C#', 'menor', 'ii/v', true),    'Fxm7♭5');

console.log('\n— Barrido: ningun cifrado usa ♯♯ ni ♭♭ —');
const dobles: string[] = [];
for (const arm of ARMADURAS) {
  for (const modo of ['mayor', 'menor'] as Modo[]) {
    const gs = gradosDe(modo);
    for (let i = 0; i < gs.length; i++) {
      const ids: GradoId[] = [gs[i], `V/${gs[i]}`, `ii/${gs[i]}`];
      for (const id of ids) {
        for (const sept of [false, true]) {
          const c = acordeDeGrado({ armadura: arm, modo, id, septimas: sept }).cifrado;
          if (c.includes('♯♯')) dobles.push(`${arm.id}/${modo}/${id} -> ${c}`);
        }
      }
    }
  }
}
check('ninguna combinacion escribe el doble sostenido como ♯♯', dobles.slice(0, 12), []);

console.log('\n— Etiquetas de tonalidad —');
check('3♯ mayor', etiquetaTonalidad(armaduraPorId('A'), 'mayor'), 'A');
check('3♯ menor', etiquetaTonalidad(armaduraPorId('A'), 'menor'), 'F♯m');
check('0♯ menor', etiquetaTonalidad(armaduraPorId('C'), 'menor'), 'Am');

console.log('\n— Barrido: ningun grado de ninguna armadura produce un acorde vacio —');
const rotos: string[] = [];
for (const arm of ARMADURAS) {
  for (const modo of ['mayor', 'menor'] as Modo[]) {
    const gs = gradosDe(modo);
    for (let i = 0; i < gs.length; i++) {
      const ids: GradoId[] = [gs[i], `V/${gs[i]}`, `ii/${gs[i]}`];
      for (const id of ids) {
        for (const sept of [false, true]) {
          const a = acordeDeGrado({ armadura: arm, modo, id, septimas: sept });
          if (a.notas.length < 3 || a.notas.some((n) => !n.chromatic)) {
            rotos.push(`${arm.id}/${modo}/${id}/${sept ? '7' : '3'}`);
          }
        }
      }
    }
  }
}
check('todas las combinaciones producen un acorde con notas', rotos.slice(0, 12), []);

console.log('\n— Barrido: las notas siempre ascienden desde la raiz —');
const desordenados: string[] = [];
for (const arm of ARMADURAS) {
  for (const modo of ['mayor', 'menor'] as Modo[]) {
    for (const g of gradosDe(modo)) {
      const a = acordeDeGrado({ armadura: arm, modo, id: g, septimas: true });
      for (let k = 1; k < a.notas.length; k++) {
        const prev = a.notas[k - 1], cur = a.notas[k];
        if (cur.octave < prev.octave) desordenados.push(`${arm.id}/${modo}/${g}`);
      }
    }
  }
}
check('ninguna nota baja de octava respecto de la anterior', desordenados.slice(0, 12), []);

console.log('\n— Cada casilla suena en su tonalidad (reunión 19/10/26) —');
const iEnDo = { degree: 'I' as const, tonalidad: { armaduraId: 'C', modo: 'mayor' as const } };
const iEnSol = { degree: 'I' as const, tonalidad: { armaduraId: 'G', modo: 'mayor' as const } };
check('el I colocado en Do sigue siendo C aunque después se module', acordeDeSlot(iEnDo).cifrado, 'C');
check('el I colocado en Sol es G', acordeDeSlot(iEnSol).cifrado, 'G');
check('el V7 en Sol con séptimas', acordeDeSlot({ degree: 'V', tonalidad: iEnSol.tonalidad, septima: true }).cifrado, 'D7');
check('cada casilla decide su séptima', acordeDeSlot({ degree: 'V', tonalidad: iEnSol.tonalidad, septima: false }).cifrado, 'D');
check('séptima y sus4 juntas', acordeDeSlot({ degree: 'V', tonalidad: iEnSol.tonalidad, septima: true, sus: 'sus4' }).cifrado, 'D7sus4');

console.log('\n— Banco menor: V y vii° de la menor armónica (reunión 19/10/26) —');
const enLa = (g: GradoId, sept: boolean) => cif('C', 'menor', g, sept);
check('V en La menor', enLa('V', false), 'E');
check('V7 en La menor', enLa('V', true), 'E7');
check('vii° en La menor', enLa('vii°', false), 'G♯dim');
check('vii°7 en La menor (disminuido completo)', enLa('vii°', true), 'G♯dim7');
check(
  'el V7 lleva la sensible elevada',
  acordeDeGrado({ armadura: armaduraPorId('C'), modo: 'menor', id: 'V', septimas: true }).notas.map((n) => n.chromatic),
  ['E', 'G#', 'B', 'D'],
);
check('V/V en La menor (dominante del V)', enLa('V/V', true), 'B7');
check('ii/V en La menor (el V es mayor: su ii es menor)', enLa('ii/V', true), 'F♯m7');
check('el v natural no cambia', enLa('v', true), 'Em7');

console.log('\n— sus2 y sus4 (reunión 19/10/26) —');
const conSus = (g: GradoId, sept: boolean, sus: 'sus2' | 'sus4') =>
  acordeDeGrado({ armadura: armaduraPorId('C'), modo: 'mayor', id: g, septimas: sept, sus });
const notasDe = (a: { notas: { chromatic: string }[] }) => a.notas.map((n) => n.chromatic);
check('V + sus4 + 7 en Do: G C D F', notasDe(conSus('V', true, 'sus4')), ['G', 'C', 'D', 'F']);
check('V + sus4 + 7 se escribe G7sus4', conSus('V', true, 'sus4').cifrado, 'G7sus4');
check('V + sus2 + 7 en Do: G A D F', notasDe(conSus('V', true, 'sus2')), ['G', 'A', 'D', 'F']);
check('ii + sus4 + 7 no queda mudo: D G A C', notasDe(conSus('ii', true, 'sus4')), ['D', 'G', 'A', 'C']);
check('sin tercera no hay calidad: Dm7 + sus4 = D7sus4', conSus('ii', true, 'sus4').cifrado, 'D7sus4');
check('tríada Gsus2: G A D', notasDe(conSus('V', false, 'sus2')), ['G', 'A', 'D']);
check('tríada Gsus2 se escribe Gsus2', conSus('V', false, 'sus2').cifrado, 'Gsus2');
check('Imaj7 + sus4 = Cmaj7sus4 (conserva la 7M)', conSus('I', true, 'sus4').cifrado, 'Cmaj7sus4');
check('Imaj7 + sus4 suena C F G B', notasDe(conSus('I', true, 'sus4')), ['C', 'F', 'G', 'B']);
check(
  'una tonización también: V/ii + sus4 = A7sus4',
  conSus('V/ii', true, 'sus4').cifrado,
  'A7sus4',
);

console.log('\n— Conducción de voces (ola 17, mensaje del profesor del 24/11/26) —');
// Valores esperados de la armonía de teclado, no del código: bajo en la
// fundamental una octava abajo y las voces de arriba con el menor movimiento.
const escribir = (d: Disposicion) =>
  `${d.bajo.chromatic}${d.bajo.octave} | ${d.voces.map((v) => `${v.chromatic}${v.octave}`).join(' ')}`;
const conducir = (acordes: ChromaticNote[][]) => conducirVoces(acordes, 4).map(escribir);
check(
  'I–IV–V–I en Do: la nota común Do se queda y el V baja a B3 D4 G4',
  conducir([['C', 'E', 'G'], ['F', 'A', 'C'], ['G', 'B', 'D'], ['C', 'E', 'G']]),
  ['C3 | C4 E4 G4', 'F3 | C4 F4 A4', 'G3 | B3 D4 G4', 'C3 | C4 E4 G4'],
);
check(
  'ii7–V7–Imaj7 en Do con tétradas: Re y Fa se quedan',
  conducir([['D', 'F', 'A', 'C'], ['G', 'B', 'D', 'F'], ['C', 'E', 'G', 'B']]),
  ['D3 | D4 F4 A4 C5', 'G3 | D4 F4 G4 B4', 'C3 | C4 E4 G4 B4'],
);
check('el primer acorde va en posición fundamental', conducir([['G', 'B', 'D']]), ['G3 | G4 B4 D5']);
const midi = (n: { chromatic: ChromaticNote; octave: number }) => (n.octave + 1) * 12 + ALL.indexOf(n.chromatic);
const fallasDeRango: string[] = [];
for (const arm of ['C', 'F#', 'Db', 'B']) {
  const grados: GradoId[] = ['I', 'vi', 'IV', 'V', 'iii', 'ii', 'vii°', 'V/ii', 'ii', 'V', 'I'];
  for (const septimas of [false, true]) {
    const acordes = grados.map((g) => acordeDeGrado({ armadura: armaduraPorId(arm), modo: 'mayor', id: g, septimas }).notas.map((n) => n.chromatic));
    conducirVoces(acordes, 4).forEach((d, i) => {
      const bajo = midi(d.bajo);
      const voces = d.voces.map(midi);
      if (voces.some((v) => v <= bajo)) fallasDeRango.push(`${arm} ${grados[i]}: voz bajo el bajo`);
      if (d.bajo.chromatic !== acordes[i][0] || d.bajo.octave !== 3) fallasDeRango.push(`${arm} ${grados[i]}: bajo ${escribir(d)}`);
      if (voces.length !== acordes[i].length) fallasDeRango.push(`${arm} ${grados[i]}: faltan voces`);
      if (Math.max(...voces) - Math.min(...voces) > 12) fallasDeRango.push(`${arm} ${grados[i]}: voces abiertas ${escribir(d)}`);
    });
  }
}
check('en Do, Fa♯, Re♭ y Si: voces por encima del bajo, bajo en la fundamental (oct. 3), posición cerrada', fallasDeRango, []);

resumen();
