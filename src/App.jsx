import './App.css'

export default function App() {
  return (
    <main className="landing">
      <header className="landing__corner landing__corner--tl">
        <span className="landing__mark">Estudio · Guitarra</span>
      </header>

      <section className="landing__center">
        <p className="landing__eyebrow">MMXXVI</p>
        <h1 className="landing__title">
          Josué <em>Barquero</em>
        </h1>
        <span className="landing__rule" aria-hidden="true" />
        <p className="landing__status">
          <span className="landing__dot" aria-hidden="true" />
          en construcción
        </p>
      </section>

      <footer className="landing__corner landing__corner--br">
        <span className="landing__meta">v0.1 — landing provisional</span>
      </footer>
    </main>
  )
}
