// Arnés del índice lateral y la numeración de secciones.
// Se corre con `npm run verify:toc` (node --experimental-strip-types).
// Detecta lo que una renumeración rompe sin que el build se entere: una clave
// del índice que no existe, números fuera de orden o un texto que remite a
// una sección que ya no existe ("ya lo viste en 3.9").
import { readFileSync } from 'node:fs';
import { TOC_SECTIONS } from '../src/config/tocConfig.ts';
import { check, resumen } from './verify-helpers.ts';

type Json = { [k: string]: Json } | Json[] | string;

const leer = (lang: string): Json =>
  JSON.parse(readFileSync(`src/i18n/locales/${lang}.json`, 'utf8').replace(/^\uFEFF/, ''));

const valor = (d: Json, clave: string): Json | undefined =>
  clave.split('.').reduce<Json | undefined>((o, k) => (o && typeof o === 'object' && !Array.isArray(o) ? o[k] : undefined), d);

const numeroDe = (label: string) => label.split(' · ')[0];
const comoNumero = (n: string) => n.split('.').map(Number);
const menor = (a: string, b: string) => {
  const [x, y] = [comoNumero(a), comoNumero(b)];
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    if ((x[i] ?? 0) !== (y[i] ?? 0)) return (x[i] ?? 0) < (y[i] ?? 0);
  }
  return false;
};

for (const lang of ['es', 'de']) {
  const d = leer(lang);
  console.log(`\n— Índice (${lang}) —`);
  const existentes = new Set<string>();
  for (const [ruta, items] of Object.entries(TOC_SECTIONS)) {
    const modulo = ruta.slice(2);
    const labels = items.map((it) => (it.labelKey ? valor(d, it.labelKey) : it.label));
    check(`${ruta}: todas las claves existen`, labels.filter((l) => typeof l !== 'string').length, 0);
    const numeros = labels.filter((l): l is string => typeof l === 'string').map(numeroDe);
    numeros.forEach((n) => existentes.add(n));
    check(`${ruta}: los números son del módulo ${modulo}`, numeros.filter((n) => n.split('.')[0] !== modulo), []);
    check(
      `${ruta}: los números van en orden creciente`,
      numeros.filter((n, i) => i > 0 && !menor(numeros[i - 1], n)),
      [],
    );
  }

  console.log(`\n— Referencias cruzadas en los textos (${lang}) —`);
  const rotas: string[] = [];
  const recorrer = (o: Json, ruta: string) => {
    if (typeof o === 'string') {
      if (ruta.endsWith('.label')) return;
      for (const m of o.matchAll(/(?<![\d.])([1-5]\.\d{1,2})(?![\d.])/g)) {
        if (!existentes.has(m[1])) rotas.push(`${ruta}: ${m[1]}`);
      }
      return;
    }
    if (Array.isArray(o)) o.forEach((v, i) => recorrer(v, `${ruta}[${i}]`));
    else for (const [k, v] of Object.entries(o)) recorrer(v, ruta ? `${ruta}.${k}` : k);
  };
  for (const modulo of ['t2', 't3', 't4']) recorrer(valor(d, modulo) ?? {}, modulo);
  check('ninguna remite a una sección inexistente', rotas, []);
}

resumen();
