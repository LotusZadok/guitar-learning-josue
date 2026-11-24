import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import SectionLabel from "../../../shared/SectionLabel";
import AcordeProceso from "../../../primitives/AcordeProceso/AcordeProceso";
import PlaybackButton from "../../../shared/PlaybackButton/PlaybackButton";
import { useChordPlayer } from "../../../../hooks/useChordPlayer";
import { useUIStore } from "../../../../stores/useUIStore";
import { spelledToES } from "../../../../data/notes";
import { chordSpelled } from "../../../../utils/noteCalculations";
import styles from "./AcordesSection.module.css";

// Reunión 22/11/26 (#22): el Resumen compara los tres acordes; cada uno se
// escucha arpegiado, de la raíz hacia arriba.
const NOTE_DURATION = 1.4;
const ARPEGGIO_GAP_MS = 250;

export default function AcordesSection() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  const tonic = useUIStore((s) => s.tonic);
  const chordM = useMemo(() => chordSpelled(tonic, "M"), [tonic]);
  const chordm = useMemo(() => chordSpelled(tonic, "m"), [tonic]);
  const chordDim = useMemo(() => chordSpelled(tonic, "dim"), [tonic]);

  // §1.7: la nomenclatura se ancla a la tónica global, no a una nota fija.
  const notation = useMemo(
    () => ({ sym: chordM[0].spelled, name: spelledToES(chordM[0].spelled) }),
    [chordM],
  );

  const procedure = t("t1.s07.procedure", { returnObjects: true }) as string[];

  const resumen = [
    { nombre: `${chordM[0].spelled} ${t("common.major")}`, notas: chordM },
    { nombre: `${chordm[0].spelled} ${t("common.minor")}`, notas: chordm },
    { nombre: `${chordDim[0].spelled} ${t("common.diminished")}`, notas: chordDim },
  ];
  const [sonando, setSonando] = useState<number | null>(null);
  const { playChord, at, clear } = useChordPlayer(NOTE_DURATION);
  const tocarFila = (i: number) => {
    clear();
    setSonando(i);
    const notas = resumen[i].notas;
    playChord(notas, ARPEGGIO_GAP_MS);
    at(() => setSonando(null), (notas.length - 1) * ARPEGGIO_GAP_MS + NOTE_DURATION * 1000);
  };

  return (
    <section id="s-acordes" className={styles.section}>
      <SectionLabel text={t("t1.s07.label")} />
      <h2>{t("t1.s07.title")}</h2>

      <p className={styles.text}>{t("t1.s07.intro")}</p>

      <ul className={styles.defList}>
        <li>{t("t1.s07.major_def")}</li>
        <li>{t("t1.s07.minor_def")}</li>
        <li>{t("t1.s07.diminished_def")}</li>
      </ul>

      <p className={styles.text}>{t("t1.s07.comparison")}</p>

      <h3 className={styles.subheading}>{t("t1.s07.notation_title")}</h3>
      <ul className={styles.nomList}>
        <li>{t("t1.s07.notation_major", notation)}</li>
        <li>{t("t1.s07.notation_minor", notation)}</li>
        <li>{t("t1.s07.notation_diminished", notation)}</li>
      </ul>

      <h3 className={styles.subheading}>{t("t1.s07.procedure_title")}</h3>
      <ol className={styles.steps}>
        {procedure.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ol>

      <p className={styles.text}>
        {locale === "de" ? (
          <>
            Aktive Tonika: <strong>{tonic}</strong> · folge dem Baum von der
            Tonika nach außen: wähle die kleine oder große Terz und dann eine
            erreichbare Quinte. Links liegt das Kleine/Verminderte, rechts das
            Große/Reine; je höher ein Knoten, desto näher sein Intervall. Höre
            den Akkord als Block oder arpeggiert.
          </>
        ) : (
          <>
            Tónica activa: <strong>{tonic}</strong> · recorre el árbol desde la
            tónica hacia afuera: elige la tercera menor o la mayor y luego una
            quinta alcanzable. A la izquierda queda lo menor/disminuido, a la
            derecha lo mayor/justo; cuanto más arriba está un nodo, más cercano
            es su intervalo. Escucha el acorde en bloque o arpegiado.
          </>
        )}
      </p>

      <AcordeProceso eyebrow={t("t1.s07.process_eyebrow")} />

      <h3 className={styles.subheading}>{t("t1.s07.resumen_titulo")}</h3>
      <ul className={styles.resumen}>
        {resumen.map((fila, i) => (
          <li key={fila.nombre} className={styles.resumenFila}>
            <span>{fila.nombre}</span>
            <span aria-hidden="true">=</span>
            <span>{fila.notas.map((m) => m.spelled).join("  ")}</span>
            <PlaybackButton
              mode="arpegio"
              label={t("t1.s07.resumen_play", { acorde: fila.nombre })}
              playing={sonando === i}
              onClick={() => tocarFila(i)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
