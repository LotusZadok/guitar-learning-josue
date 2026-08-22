let fallos = 0;

export function check(nombre: string, real: unknown, esperado: unknown) {
  const a = JSON.stringify(real);
  const b = JSON.stringify(esperado);
  if (a === b) console.log(`  ok  ${nombre}`);
  else { fallos++; console.log(`FALLA  ${nombre}\n       esperado ${b}\n       obtenido ${a}`); }
}

export function checkCasi(nombre: string, real: number, esperado: number, tol = 0.01) {
  if (Math.abs(real - esperado) <= tol) console.log(`  ok  ${nombre}`);
  else { fallos++; console.log(`FALLA  ${nombre}\n       esperado ~${esperado}\n       obtenido ${real}`); }
}

export function resumen() {
  console.log(fallos === 0 ? '\nTODO OK\n' : `\n${fallos} FALLAS\n`);
  process.exit(fallos === 0 ? 0 : 1);
}
