import { guitarInstrument } from "./guitarInstrument";

// Banco activo del método. Para volver al timbre sintético basta apuntar esta
// constante a `synthInstrument`; ningún otro archivo cambia.
export const instrument = guitarInstrument;
