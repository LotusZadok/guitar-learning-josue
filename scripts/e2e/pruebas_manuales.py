"""Pruebas de las reuniones con el profesor que antes se hacían a mano.

Corre contra el servidor de desarrollo (`npm run dev`) y verifica qué suena y qué
se ve. Para saber qué suena intercepta `instrument.playNote` (src/audio): Vite
sirve ese módulo por su ruta, así que el script y la app comparten la misma
instancia. Lo que solo se juzga de oído (timbre, si algo se percibe sostenido)
sigue siendo prueba manual.

Requisitos, fuera del repo (decisión de la 45ª ola: el tooling de QA no viaja
en package.json): Python 3 y `pip install playwright`. Usa Microsoft Edge.

Uso (con `npm run dev` corriendo):
    npm run e2e
    python scripts/e2e/pruebas_manuales.py            # todas
    python scripts/e2e/pruebas_manuales.py lab tempo  # solo esas
    E2E_URL=http://localhost:5199 python scripts/e2e/pruebas_manuales.py
"""
import math
import os
import re
import sys

from playwright.sync_api import sync_playwright

URL = os.environ.get('E2E_URL', 'http://localhost:5173')
NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

# Corre dentro de la página: anota cada nota que la app manda al instrumento y
# fija tónica y octava en el store. El instrumento no suena: solo se registra.
PREPARAR = """async ({tonic, octave}) => {
  const audio = await import('/src/audio/index.ts');
  if (!window.__notas) {
    window.__notas = [];
    audio.instrument.playNote = (ctx, f, d, out) => window.__notas.push({t: performance.now(), f, g: out.gain.value});
  }
  const store = (await import('/src/stores/useUIStore.ts')).useUIStore.getState();
  store.setAudioMuted(false);
  if (tonic) store.setTonic(tonic);
  if (octave) store.setOctave(octave);
}"""


def midi(freq):
    return round(69 + 12 * math.log2(freq / 440))


def nombre(m):
    return f'{NAMES[m % 12]}{m // 12 - 1}'


def clases(midis):
    return sorted({NAMES[m % 12] for m in midis})


RESULTADOS = []


def check(prueba, ok, detalle=''):
    RESULTADOS.append(ok)
    print('PASA ' if ok else 'FALLA', prueba, '|', detalle)


class Pagina:
    def __init__(self, browser, ruta, tonic=None, octave=None):
        self.pg = browser.new_page(viewport={'width': 1400, 'height': 900})
        self.errores = []
        self.pg.on('pageerror', lambda e: self.errores.append(str(e)))
        self.pg.add_init_script("localStorage.setItem('site-unlocked','true')")
        self.pg.goto(f'{URL}/#/{ruta}')
        self.pg.wait_for_timeout(2000)
        self.pg.evaluate(PREPARAR, {'tonic': tonic, 'octave': octave})
        self.pg.wait_for_timeout(300)

    def seccion(self, id_):
        return self.pg.locator(f'#{id_}')

    def esperar(self, ms):
        self.pg.wait_for_timeout(ms)

    def limpiar(self):
        self.pg.evaluate('window.__notas = []')

    def notas(self):
        """MIDI de lo que sonó, en orden de ataque."""
        return [midi(n['f']) for n in sorted(self.pg.evaluate('window.__notas'), key=lambda n: n['t'])]

    def acordes(self, separacion_ms=60):
        """Lo que sonó agrupado por ataque: una lista de MIDI por acorde."""
        grupos, ultimo = [], None
        for n in sorted(self.pg.evaluate('window.__notas'), key=lambda n: n['t']):
            if ultimo is not None and n['t'] - ultimo < separacion_ms:
                grupos[-1].append(midi(n['f']))
            else:
                grupos.append([midi(n['f'])])
            ultimo = n['t']
        return [sorted(g) for g in grupos]

    def tocar(self, loc, ms=150):
        # Clic y foco: unos controles suenan con clic, otros (nodos SVG) con foco.
        loc.evaluate('e => { e.blur && e.blur(); e.focus(); e.click ? e.click() : e.dispatchEvent(new MouseEvent("click", {bubbles: true})); }')
        self.esperar(ms)

    def sonido_de(self, loc, ms=700):
        self.limpiar()
        self.esperar(450)
        self.tocar(loc, ms)
        return self.notas()

    def cerrar(self):
        if self.errores:
            check('sin errores de página', False, '; '.join(self.errores))
        self.pg.close()


# --- Laboratorio (§5.4) -------------------------------------------------------

def armar_lab(p, grados, tonalidad=None):
    s = p.seccion('s-t4-constructor')
    if tonalidad:
        p.tocar(s.get_by_role('button', name=tonalidad, exact=True))
    for compas, grado in enumerate(grados, 1):
        p.tocar(s.get_by_role('button', name=re.compile(rf'^Grado {re.escape(grado)}, acorde')))
        p.tocar(casilla(s, compas))
    bpm = s.get_by_role('spinbutton', name='Escribir la velocidad en pulsos por minuto')
    bpm.fill('200')
    bpm.press('Enter')
    return s


def casilla(s, compas, pulso=1):
    return s.get_by_role('button', name=re.compile(rf'^Compás {compas}, pulso {pulso},'))


def tocar_lab(p, s, acordes_esperados):
    p.limpiar()
    p.tocar(s.get_by_role('button', name=re.compile('^(Tocar|Seguir desde la pausa)$')))
    p.esperar(acordes_esperados * 1200 + 600)  # un compás de 4/4 a 200 bpm = 1,2 s
    return [clases(a) for a in p.acordes()]


I, IV, V = ['C', 'E', 'G'], ['A', 'C', 'F'], ['B', 'D', 'G']


def prueba_lab(b):
    """Reunión 19/10, pruebas 4 y 5: ficha 7, botón Séptimas y repetición."""
    p = Pagina(b, 't5')
    s = armar_lab(p, ['I', 'IV', 'V', 'I'])
    check('§5.4 I-IV-V-I sin séptimas', tocar_lab(p, s, 4)[:4] == [I, IV, V, I])

    p.tocar(s.get_by_role('button', name='7: pone o quita la séptima de un solo acorde'))
    p.tocar(casilla(s, 3))
    sono = tocar_lab(p, s, 4)[:4]
    check('§5.4 la ficha 7 sobre el V da G7 y el resto queda igual',
          'G7' in casilla(s, 3).get_attribute('aria-label') and sono == [I, IV, ['B', 'D', 'F', 'G'], I], str(sono))

    p.tocar(s.get_by_role('button', name='Séptimas', exact=True))
    sono = tocar_lab(p, s, 4)[:4]
    check('§5.4 el botón Séptimas las pone a todas', [len(a) for a in sono] == [4, 4, 4, 4], str(sono))
    p.cerrar()

    p = Pagina(b, 't5')
    s = armar_lab(p, ['I', 'IV', 'V', 'I'])
    # Al poner ‖: la app arma sola el :‖; no hay que volver a tocar la ficha.
    p.tocar(s.get_by_role('button', name='‖: inicio del tramo que se repite'))
    p.tocar(s.get_by_role('button', name='Compás 1: poner aquí el inicio de la repetición').first)
    p.tocar(s.get_by_role('button', name='Compás 2: poner aquí el final de la repetición').first)
    sono = tocar_lab(p, s, 6)
    check('§5.4 ‖: en 1 y :‖ en 2 suena I-IV-I-IV-V-I', sono[:6] == [I, IV, I, IV, V, I], str(sono))

    p.limpiar()
    p.tocar(s.get_by_role('button', name='Tocar', exact=True))
    p.esperar(2 * 1200 + 500)
    sonando = s.locator('[data-sonando=true]').evaluate_all('e => e.map(x => x.getAttribute("aria-label"))')
    p.tocar(s.get_by_role('button', name='Pausar', exact=True))
    antes = [clases(a) for a in p.acordes()]
    despues = tocar_lab(p, s, 4)
    check('§5.4 en la 2.ª vuelta el cabezal está en el compás 1; pausar y reanudar sigue desde ahí',
          antes[:3] == [I, IV, I] and all(x.startswith('Compás 1,') for x in sonando) and despues[:3] in ([I, IV, V], [IV, V, I]),
          f'sonando={sonando} antes={antes} después={despues}')

    barra = s.get_by_role('button', name=re.compile('^Repetición del compás'))
    p.tocar(barra.first)
    sono = tocar_lab(p, s, 4)
    check('§5.4 tocar la barra quita el tramo', barra.count() == 0 and sono[:4] == [I, IV, V, I], str(sono))
    p.cerrar()


def prueba_tempo(b):
    """Reunión 22/11, prueba 10: escribir el tempo y ver el término italiano."""
    p = Pagina(b, 't5')
    s = p.seccion('s-t4-constructor')
    caja = s.get_by_role('spinbutton', name='Escribir la velocidad en pulsos por minuto')
    for bpm, termino in [(50, 'Largo'), (66, 'Adagio'), (90, 'Andante'), (110, 'Moderato'),
                         (130, 'Allegro'), (180, 'Vivace'), (300, 'Vivace')]:
        caja.fill(str(bpm))
        caja.press('Enter')
        p.esperar(200)
        check(f'§5.4 tempo {bpm} → {termino}', termino in s.inner_text() and caja.input_value() == str(min(bpm, 200)),
              f'caja={caja.input_value()}')
    p.cerrar()


# --- Constructor completo (§5.1) ----------------------------------------------

def prueba_constructor(b):
    """Reunión 19/10, prueba 6: 3m → 5 → 7M arma CmMaj7."""
    p = Pagina(b, 't5')
    s = p.seccion('s-t3-constructor-completo')
    for prefijo in ('3m · ', '5 · ', '7M · '):
        nodo = next(n for n in s.locator('g[role=button]').all() if n.get_attribute('aria-label').startswith(prefijo))
        p.tocar(nodo, 300)
    check('§5.1 3m → 5 → 7M arma CmMaj7', 'CmMaj7' in s.inner_text())
    p.cerrar()


# --- T1 ------------------------------------------------------------------------

def prueba_t1(b):
    """Reunión 22/11, prueba 7: registros de §1.3, §1.4, §1.6 y §1.8, con octava 3 y 5."""
    for octava in (3, 5):
        p = Pagina(b, 't1', tonic='B', octave=octava)
        fichas = p.seccion('s-intervalos').locator('table [role=button]')
        n = fichas.count()
        tonica, septima, octava8 = (p.sonido_de(fichas.nth(i))[0] for i in (0, n - 2, n - 1))
        check(f'§1.3 Si, octava {octava}: 7M y 8J arriba de la tónica', (septima - tonica, octava8 - tonica) == (11, 12),
              f'{nombre(tonica)} {nombre(septima)} {nombre(octava8)}')

        nodos = p.seccion('s-escala').locator('g[role=button]').all()
        tonica, septima, octava8 = (p.sonido_de(nodos[i])[0] for i in (0, 6, 7))
        check(f'§1.4 Si, octava {octava}: 7M y 8J arriba de la tónica', (septima - tonica, octava8 - tonica) == (11, 12),
              f'{nombre(tonica)} {nombre(septima)} {nombre(octava8)}')
        p.cerrar()

        p = Pagina(b, 't1', tonic='G', octave=octava)
        fichas = p.seccion('s-triadas').locator('table [role=button]').all()
        letras = [f.get_attribute('aria-label').replace('Escuchar ', '') for f in fichas]
        i = next(i for i in range(len(letras) - 2) if letras[i:i + 3] == ['E', 'G', 'B'])
        celda = [p.sonido_de(fichas[i + j])[0] for j in range(3)]
        check(f'§1.6 Sol, octava {octava}: celda Mi-Sol-Si ascendente', celda == sorted(celda), ' '.join(map(nombre, celda)))
        p.cerrar()

        p = Pagina(b, 't1', tonic='E', octave=octava)
        fichas = p.seccion('s-quinta').locator('[role=button]').all()
        re_, la = p.sonido_de(fichas[0])[0], p.sonido_de(fichas[1])[0]
        check(f'§1.8 Mi, octava {octava}: Re → La ascendente', la - re_ == 7, f'{nombre(re_)} {nombre(la)}')
        p.cerrar()


def prueba_resumen_acordes(b):
    """Reunión 22/11, prueba 9: los tres play del Resumen de §1.7 suenan ascendentes."""
    for tonica in ('E', 'Bb'):
        p = Pagina(b, 't1', tonic=tonica)
        for boton in p.seccion('s-acordes').get_by_role('button', name=re.compile(r'^Escuchar .* (mayor|menor|dim\.)$')).all():
            sono = p.sonido_de(boton, 2200)
            check(f'§1.7 Resumen {tonica}: "{boton.get_attribute("aria-label")}" ascendente',
                  len(sono) >= 3 and sono == sorted(set(sono)), ' '.join(map(nombre, sono)))
        p.cerrar()


# --- T3 ------------------------------------------------------------------------

ESCALAS = {'C': ['C', 'D', 'E', 'F', 'G', 'A', 'B'], 'F': ['F', 'G', 'A', 'A#', 'C', 'D', 'E'],
           'G': ['G', 'A', 'B', 'C', 'D', 'E', 'F#'], 'Db': ['C#', 'D#', 'F', 'F#', 'G#', 'A#', 'C']}
AMBAR = """() => [...document.querySelectorAll('#s-t3-tritono circle')]
  .filter(c => (c.getAttribute('stroke') || '').includes('amber')).length"""


def prueba_tritono(b):
    """Reunión 22/11, prueba 8: 4ª+7ª, luego 3ª+8va con la 8va arriba; el ámbar acompaña."""
    for tonica, e in ESCALAS.items():
        p = Pagina(b, 't3', tonic=tonica)
        p.limpiar()
        p.tocar(p.seccion('s-t3-tritono').get_by_role('button', name='Escuchar el tritono y su resolución'))
        p.esperar(500)
        ambar = [p.pg.evaluate(AMBAR)]
        p.esperar(1700)
        ambar.append(p.pg.evaluate(AMBAR))
        p.esperar(2000)
        ambar.append(p.pg.evaluate(AMBAR))
        tritono, resolucion = (p.acordes(200) + [[], []])[:2]
        ok = (clases(tritono) == sorted({e[3], e[6]}) and clases(resolucion) == sorted({e[2], e[0]})
              and max(resolucion) > max(tritono) and ambar[0] > 0 and ambar[1] > 0 and ambar[2] == 0)
        check(f'§3.5 tritono en {tonica}', ok, f'{list(map(nombre, tritono))} → {list(map(nombre, resolucion))} ámbar={ambar}')
        p.cerrar()


# --- Conducción de voces -------------------------------------------------------

def separar_arpegios(notas):
    """Cada arpegio sube desde el bajo: un acorde nuevo empieza cuando la nota baja."""
    acordes = [[notas[0]]]
    for anterior, nota in zip(notas, notas[1:]):
        (acordes[-1].append(nota) if nota > anterior else acordes.append([nota]))
    return acordes


def revisar_conduccion(prueba, acordes, raices):
    """Ola 17 (22/11): el bajo toca la fundamental y las voces de arriba se mueven
    lo mínimo; una nota común queda a la misma altura."""
    problemas = []
    for i, acorde in enumerate(acordes):
        if NAMES[min(acorde) % 12] != raices[i]:
            problemas.append(f'acorde {i + 1}: el bajo {nombre(min(acorde))} no es {raices[i]}')
    for i in range(1, len(acordes)):
        antes, ahora = sorted(acordes[i - 1])[1:], sorted(acordes[i])[1:]
        for comun in {m % 12 for m in antes} & {m % 12 for m in ahora}:
            if not {m for m in antes if m % 12 == comun} & {m for m in ahora if m % 12 == comun}:
                problemas.append(f'{i}→{i + 1}: la nota común {NAMES[comun]} cambia de altura')
        salto = max(min(abs(x - y) for y in ahora) for x in antes)
        if salto > 5:
            problemas.append(f'{i}→{i + 1}: una voz salta {salto} semitonos')
    check(prueba, len(acordes) == len(raices) and not problemas,
          '; '.join(problemas) or ' | '.join(' '.join(map(nombre, sorted(a))) for a in acordes))


def prueba_conduccion(b):
    """Reunión 22/11, prueba 11. Si la nota común se oye sostenida sigue siendo de oído."""
    for tonalidad, raices in [('C mayor', ['C', 'A', 'F', 'G']), ('F♯ mayor', ['F#', 'D#', 'B', 'C#'])]:
        for octava in (3, 5):
            p = Pagina(b, 't5', octave=octava)
            s = armar_lab(p, ['I', 'vi', 'IV', 'V'], tonalidad)
            p.limpiar()
            p.tocar(s.get_by_role('button', name='Tocar', exact=True))
            p.esperar(4 * 1200 + 600)
            revisar_conduccion(f'§5.4 {tonalidad} I-vi-IV-V, octava {octava}', p.acordes()[:4], raices)
            p.cerrar()
    for ruta, seccion, boton_modo, boton_play, raices in [
        ('t2', 's-t2-progresiones', True, 'Reproducir progresión 4: I V vi IV', ['C', 'G', 'A', 'F']),
        ('t3', 's-t3-ii-v-i', False, None, ['D', 'G', 'C']),
    ]:
        for modo in ('Bloque', 'Arpegio'):
            p = Pagina(b, ruta)
            s = p.seccion(seccion)
            p.limpiar()
            p.tocar(s.get_by_role('button', name=modo, exact=True))  # en §3.7 el modo también es el play
            if boton_play:
                p.limpiar()
                p.tocar(s.get_by_role('button', name=boton_play))
            p.esperar(9000)
            acordes = separar_arpegios(p.notas()) if modo == 'Arpegio' else p.acordes()
            revisar_conduccion(f'{seccion} en {modo.lower()}', acordes, raices)
            p.cerrar()


PRUEBAS = {'lab': prueba_lab, 'tempo': prueba_tempo, 'constructor': prueba_constructor, 't1': prueba_t1,
           'resumen': prueba_resumen_acordes, 'tritono': prueba_tritono, 'conduccion': prueba_conduccion}

if __name__ == '__main__':
    elegidas = sys.argv[1:] or list(PRUEBAS)
    with sync_playwright() as pw:
        browser = pw.chromium.launch(channel='msedge')
        for nombre_prueba in elegidas:
            print(f'== {nombre_prueba}')
            PRUEBAS[nombre_prueba](browser)
        browser.close()
    fallas = RESULTADOS.count(False)
    print(f'\n{len(RESULTADOS) - fallas} pasan, {fallas} fallan')
    sys.exit(1 if fallas else 0)
