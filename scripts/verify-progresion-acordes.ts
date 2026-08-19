// Arnés de la resolución grado → acorde sonante. Carga la cadena real
// (progresionAcordes → noteCalculations → data/notes) desde Node.
import { acordeDeGrado, armaduraPorId, etiquetaTonalidad, ARMADURAS } from '../src/utils/progresionAcordes.ts';
import { gradosDe, type GradoId, type Modo } from '../src/utils/progresionArmonica.ts';

let fallos = 0;
function check(nombre: string, real: unknown, esperado: unknown) {
  const a = JSON.stringify(real);
  const b = JSON.stringify(esperado);
  if (a === b) console.log(`  ok  ${nombre}`);
  else { fallos++; console.log(`FALLA  ${nombre}\n       esperado ${b}\n       obtenido ${a}`); }
}
const cif = (arm: string, modo: Modo, g: GradoId, sept: boolean) =>
  acordeDeGrado(armaduraPorId(arm), modo, g, sept).cifrado;

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
          const a = acordeDeGrado(arm, modo, id, sept);
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
      const a = acordeDeGrado(arm, modo, g, true);
      for (let k = 1; k < a.notas.length; k++) {
        const prev = a.notas[k - 1], cur = a.notas[k];
        if (cur.octave < prev.octave) desordenados.push(`${arm.id}/${modo}/${g}`);
      }
    }
  }
}
check('ninguna nota baja de octava respecto de la anterior', desordenados.slice(0, 12), []);

console.log(fallos === 0 ? '\nTODO OK\n' : `\n${fallos} FALLAS\n`);
process.exit(fallos === 0 ? 0 : 1);
