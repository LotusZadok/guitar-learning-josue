"""Graba una muestra de audio de la página para mandársela al profesor.

No es una prueba: las verificaciones están en pruebas_manuales.py. Es una muestra
representativa (escala, tríadas, tritono, conducción de voces, séptimas y el
laboratorio) para que el profesor juzgue si suena musicalmente bien. Graba la
salida del propio motor de audio (el master gain), así que no entra ruido.

Requisitos: los de pruebas_manuales.py y `ffmpeg` en el PATH.

Uso (con `npm run dev` corriendo):
    python scripts/e2e/muestra_audio.py docs/muestras/muestra_2026-11-27
Deja <destino>.mp3 y <destino>_mensaje.txt con los tiempos de cada fragmento.
"""
import base64
import re
import subprocess
import sys
import tempfile

from playwright.sync_api import sync_playwright

import pruebas_manuales as pm

pm.OIR = True  # el instrumento real tiene que sonar para que haya algo que grabar

# Un fragmento por grabación: navegar mientras se graba hace que el grabador
# pierda tramos y los tiempos del mensaje dejan de coincidir con el audio.
GRABAR = """async () => {
  const audio = await import('/src/hooks/audioEngineShared.ts');
  if (!window.__destino) {
    window.__destino = audio.getAudioContext().createMediaStreamDestination();
    audio.getMasterVolumeNode().connect(window.__destino);
  }
  const partes = [];
  window.__grabacion = undefined;
  window.__grabador = new MediaRecorder(window.__destino.stream, {mimeType: 'audio/webm;codecs=opus'});
  window.__grabador.ondataavailable = (e) => partes.push(e.data);
  window.__grabador.onstop = () => {
    const lector = new FileReader();
    lector.onload = () => window.__grabacion = lector.result.split(',')[1];
    lector.readAsDataURL(new Blob(partes, {type: 'audio/webm'}));
  };
  window.__grabador.start(1000);
}"""


def esperar_silencio(p, silencio_ms=1500):
    """Espera a que la app deje de mandar notas (y a que suene la cola)."""
    p.esperar(400)
    while p.pg.evaluate(f'performance.now() - Math.max(0, ...window.__notas.map(n => n.t)) < {silencio_ms}'):
        p.esperar(200)


def ir_a(p, ruta):
    p.pg.evaluate(f"location.hash = '#/{ruta}'")
    p.esperar(1500)


def escala(p):
    for nodo in p.seccion('s-escala').locator('g[role=button]').all():
        p.tocar(nodo, 450)


def triadas(p):
    for nodo in p.seccion('s-triadas').locator('g[role=button]').all():
        p.tocar(nodo, 1800)


def tritono(p):
    p.tocar(p.seccion('s-t3-tritono').get_by_role('button', name='Escuchar el tritono y su resolución'))


def progresion_4(p):
    s = p.seccion('s-t2-progresiones')
    p.tocar(s.get_by_role('button', name='Bloque', exact=True))
    p.tocar(s.get_by_role('button', name='Reproducir progresión 4: I V vi IV'))


def ii_v_i(p):
    p.tocar(p.seccion('s-t3-ii-v-i').get_by_role('button', name='Bloque', exact=True))


def laboratorio(p):
    s = p.seccion('s-t4-constructor')
    for compas, grado in enumerate(['I', 'IV', 'V', 'I'], 1):
        p.tocar(s.get_by_role('button', name=re.compile(rf'^Grado {grado}, acorde')))
        p.tocar(pm.casilla(s, compas))
    bpm = s.get_by_role('spinbutton', name='Escribir la velocidad en pulsos por minuto')
    bpm.fill('120')
    bpm.press('Enter')
    p.tocar(s.get_by_role('button', name='‖: inicio del tramo que se repite'))
    p.tocar(s.get_by_role('button', name='Compás 1: poner aquí el inicio de la repetición').first)
    p.tocar(s.get_by_role('button', name='Compás 2: poner aquí el final de la repetición').first)
    p.pg.evaluate('window.__notas = []')
    p.tocar(s.get_by_role('button', name='Tocar', exact=True))
    # Entre acordes hay más silencio que el que mide esperar_silencio: se esperan
    # los 6 acordes (I-IV-I-IV-V-I, 4 notas cada uno con el bajo).
    p.pg.wait_for_function('window.__notas.length >= 24', timeout=30000)


FRAGMENTOS = [
    ('t1', '§1.4 La escala de Do mayor', escala),
    ('t1', '§1.6 Las 7 tríadas en arpegio', triadas),
    ('t3', '§3.5 El tritono y su resolución', tritono),
    ('t2', '§2.7 Progresión I-V-vi-IV en bloque', progresion_4),
    ('t3', '§3.7 La progresión ii-V-I con séptimas', ii_v_i),
    ('t5', '§5.4 Laboratorio a 120 bpm: I-IV-V-I con los compases 1 y 2 repetidos', laboratorio),
]


def mmss(segundos):
    s = round(segundos)
    return f'{s // 60}:{s % 60:02d}'


def grabar_fragmento(p, tocar, carpeta, i):
    """Graba un fragmento y lo deja en WAV, con 0,8 s de silencio al final."""
    p.pg.evaluate(GRABAR)
    p.esperar(300)
    tocar(p)
    esperar_silencio(p)
    p.esperar(500)
    p.pg.evaluate('window.__grabador.stop()')
    p.pg.wait_for_function('window.__grabacion !== undefined')
    webm, wav = f'{carpeta}/{i}.webm', f'{carpeta}/{i}.wav'
    with open(webm, 'wb') as f:
        f.write(base64.b64decode(p.pg.evaluate('window.__grabacion')))
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', webm, '-af', 'apad=pad_dur=0.8',
                    '-ar', '48000', '-ac', '2', wav], check=True)
    return wav


def duracion(archivo):
    salida = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', archivo],
                            capture_output=True, text=True, check=True)
    return float(salida.stdout)


def main(destino):
    carpeta = tempfile.mkdtemp()
    with sync_playwright() as pw:
        browser = pw.chromium.launch(channel='msedge', args=['--autoplay-policy=no-user-gesture-required'])
        p = pm.Pagina(browser, 't1', tonic='C', octave=3)
        # Primera pasada sin grabar: crea el AudioContext y carga las muestras de guitarra.
        escala(p)
        esperar_silencio(p, 2500)
        wavs, ruta_actual = [], 't1'
        for i, (ruta, titulo, tocar) in enumerate(FRAGMENTOS):
            if ruta != ruta_actual:
                ir_a(p, ruta)
                ruta_actual = ruta
            wavs.append(grabar_fragmento(p, tocar, carpeta, i))
        if p.errores:
            sys.exit('Errores de página: ' + '; '.join(p.errores))
        browser.close()

    lista = f'{carpeta}/lista.txt'
    with open(lista, 'w') as f:
        f.writelines(f"file '{w}'\n" for w in wavs)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', lista,
                    '-af', 'loudnorm=I=-16', '-c:a', 'libmp3lame', '-b:a', '160k', f'{destino}.mp3'], check=True)
    lineas, inicio = [], 0.0
    for wav, (_, titulo, _) in zip(wavs, FRAGMENTOS):
        lineas.append(f'{mmss(inicio)}  {titulo}')
        inicio += duracion(wav)
    mensaje = ('Profe, le mando una muestra de cómo suena la página ahora (Do mayor). '
               'Si algo no le suena bien, dígame el minuto:\n\n' + '\n'.join(lineas) + '\n')
    with open(f'{destino}_mensaje.txt', 'w', encoding='utf8') as m:
        m.write(mensaje)
    print(f'{destino}.mp3\n\n{mensaje}')


if __name__ == '__main__':
    main(sys.argv[1])
