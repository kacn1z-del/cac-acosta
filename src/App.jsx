import { useEffect, useMemo, useState } from 'react'

/* ---------------------------------------------------------------
   DATOS — edite aquí la información real de cada feria distrital.
   dia: 0=domingo … 6=sábado (para el cálculo de la cuenta regresiva)
   --------------------------------------------------------------- */
const FERIAS = [
  {
    id: 'san-ignacio',
    distrito: 'San Ignacio',
    dia: 6,
    diaTexto: 'Sábado',
    horario: '5:00 a.m. – 12:00 m.d.',
    lugar: 'Plaza de deportes, San Ignacio centro',
    principal: true,
    descripcion:
      'La feria cabecera del cantón: café recién trillado, hortalizas de altura y la mayor variedad de puestos.',
  },
  {
    id: 'guaitil',
    distrito: 'Guaitil',
    dia: 6,
    diaTexto: 'Sábado',
    horario: '6:00 a.m. – 11:00 a.m.',
    lugar: 'Salón comunal de Guaitil',
    descripcion: 'Feria distrital con énfasis en hortalizas y productos lácteos de finca.',
  },
  {
    id: 'palmichal',
    distrito: 'Palmichal',
    dia: 0,
    diaTexto: 'Domingo',
    horario: '6:00 a.m. – 11:00 a.m.',
    lugar: 'Centro de Palmichal',
    descripcion: 'Punto de venta directa para productores de la zona alta del cantón.',
  },
  {
    id: 'cangrejal',
    distrito: 'Cangrejal',
    dia: 0,
    diaTexto: 'Domingo',
    horario: '6:00 a.m. – 10:00 a.m.',
    lugar: 'Centro de Cangrejal',
    descripcion: 'Feria pequeña y cercana, ideal para abastecerse sin desplazarse hasta San Ignacio.',
  },
  {
    id: 'sabanillas',
    distrito: 'Sabanillas',
    dia: 0,
    diaTexto: 'Domingo',
    horario: '6:00 a.m. – 10:00 a.m.',
    lugar: 'Centro de Sabanillas',
    descripcion: 'Productores locales ofrecen frutas de temporada y productos de panadería casera.',
  },
]

const CATEGORIAS = ['Todos', 'Café', 'Verduras', 'Frutas', 'Lácteos', 'Panadería', 'Artesanía']

const PUESTOS = [
  { nombre: 'Beneficio El Cerro', categoria: 'Café', icono: '☕', desc: 'Café de altura, tueste medio y oscuro, molido al momento.' },
  { nombre: 'Finca Los Chinchilla', categoria: 'Verduras', icono: '🥬', desc: 'Culantro, chile dulce, tomate y hortalizas de la semana.' },
  { nombre: 'Huerta Sabanillas', categoria: 'Frutas', icono: '🍍', desc: 'Piña, banano y cítricos cosechados el mismo día.' },
  { nombre: 'Lácteos Palmichal', categoria: 'Lácteos', icono: '🧀', desc: 'Queso fresco, natilla y cuajada de producción familiar.' },
  { nombre: 'Panadería Doña Flor', categoria: 'Panadería', icono: '🍞', desc: 'Pan casero, empanadas y rosquillas de horno de leña.' },
  { nombre: 'Taller Guaitil Artesanal', categoria: 'Artesanía', icono: '🧺', desc: 'Canastos de mimbre y piezas talladas por manos locales.' },
  { nombre: 'Cafetal Cangrejal', categoria: 'Café', icono: '☕', desc: 'Café orgánico certificado, en grano o molido.' },
  { nombre: 'Raíces de Acosta', categoria: 'Verduras', icono: '🥕' , desc: 'Yuca, camote, ñame y tubérculos de la zona.' },
]

function diasHastaProximo(diaObjetivo) {
  const hoy = new Date()
  const diaActual = hoy.getDay()
  let delta = diaObjetivo - diaActual
  if (delta < 0) delta += 7
  return delta
}

function useCuentaRegresiva(diaObjetivo, horaInicio = 5) {
  const [restante, setRestante] = useState({ dias: 0, horas: 0, min: 0, seg: 0 })

  useEffect(() => {
    function calcular() {
      const ahora = new Date()
      const objetivo = new Date(ahora)
      const delta = diasHastaProximo(diaObjetivo)
      objetivo.setDate(ahora.getDate() + delta)
      objetivo.setHours(horaInicio, 0, 0, 0)

      let diff = objetivo.getTime() - ahora.getTime()
      if (diff < 0) {
        objetivo.setDate(objetivo.getDate() + 7)
        diff = objetivo.getTime() - ahora.getTime()
      }

      const dias = Math.floor(diff / (1000 * 60 * 60 * 24))
      const horas = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const min = Math.floor((diff / (1000 * 60)) % 60)
      const seg = Math.floor((diff / 1000) % 60)
      setRestante({ dias, horas, min, seg })
    }
    calcular()
    const t = setInterval(calcular, 1000)
    return () => clearInterval(t)
  }, [diaObjetivo, horaInicio])

  return restante
}

function Barra() {
  return (
    <header className="barra">
      <div className="barra__marca">
        <img
          className="barra__logo"
          src="/logo-cac.jpg"
          alt="Logo del Centro Agrícola Cantonal de Acosta"
          width="40"
          height="40"
        />
        CAC ACOSTA
      </div>
      <nav className="barra__nav">
        <a href="#ferias">Ferias</a>
        <a href="#productos">Puestos</a>
        <a href="#productores">Para productores</a>
      </nav>
    </header>
  )
}

function Hero() {
  const restante = useCuentaRegresiva(6, 5) // próximo sábado, 5 a.m.
  return (
    <section className="hero">
      <div className="hero__grano" aria-hidden="true"></div>
      <div className="envoltura hero__contenido">
        <div>
          <span className="hero__eyebrow">Centro Agrícola Cantonal de Acosta</span>
          <h1 className="hero__titulo">
            LA FERIA<br />VIVE EN <em>ACOSTA</em>
          </h1>
          <p className="hero__texto">
            De la montaña a su mesa. Café, hortalizas y productos de finca vendidos
            directamente por quien los siembra, en San Ignacio y los cuatro distritos
            del cantón.
          </p>
          <div className="hero__acciones">
            <a className="boton boton--principal" href="#ferias">Ver días de feria</a>
            <a className="boton boton--fantasma" href="#productores">Quiero vender ahí</a>
          </div>
        </div>
        <div className="hero__saco" aria-label={`Próxima feria en ${restante.dias} días`}>
          <div className="hero__saco-texto">
            <strong>{restante.dias}d {restante.horas}h</strong>
            <span>Para la próxima feria</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function pad(n) {
  return String(n).padStart(2, '0')
}

function Calendario() {
  const [activo, setActivo] = useState(FERIAS[0].id)
  const feriaActiva = useMemo(() => FERIAS.find((f) => f.id === activo), [activo])
  const restante = useCuentaRegresiva(feriaActiva.dia, 5)

  return (
    <section className="seccion" id="ferias">
      <div className="envoltura">
        <div className="seccion__cabecera">
          <div>
            <p className="seccion__etiqueta">Calendario semanal</p>
            <h2 className="seccion__titulo">Días de feria por distrito</h2>
          </div>
          <p className="seccion__nota">
            Toque un distrito para ver horario, lugar y el tiempo que falta.
          </p>
        </div>

        <div className="cajones" role="tablist" aria-label="Distritos con feria">
          {FERIAS.map((f) => (
            <button
              key={f.id}
              className="cajon"
              role="tab"
              aria-pressed={activo === f.id}
              aria-selected={activo === f.id}
              onClick={() => setActivo(f.id)}
            >
              <span className="cajon__dia">{f.diaTexto}</span>
              <span className="cajon__distrito">{f.distrito}</span>
            </button>
          ))}
        </div>

        <div className="panel-dia">
          <div className="panel-dia__reloj">
            {restante.dias > 0 ? `${restante.dias}d ${pad(restante.horas)}h` : `${pad(restante.horas)}:${pad(restante.min)}:${pad(restante.seg)}`}
            <small>Faltan</small>
          </div>
          <div>
            <h3 className="panel-dia__titulo">
              {feriaActiva.distrito}{feriaActiva.principal ? ' · Feria principal' : ''}
            </h3>
            <p className="panel-dia__meta"><strong>{feriaActiva.diaTexto}</strong> · {feriaActiva.horario}</p>
            <p className="panel-dia__meta">{feriaActiva.lugar}</p>
            <p className="panel-dia__meta" style={{ opacity: 0.85 }}>{feriaActiva.descripcion}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Puestos() {
  const [filtro, setFiltro] = useState('Todos')
  const visibles = useMemo(
    () => (filtro === 'Todos' ? PUESTOS : PUESTOS.filter((p) => p.categoria === filtro)),
    [filtro]
  )

  return (
    <section className="seccion" id="productos">
      <div className="envoltura">
        <div className="seccion__cabecera">
          <div>
            <p className="seccion__etiqueta">Quién vende qué</p>
            <h2 className="seccion__titulo">Puestos de la feria</h2>
          </div>
          <p className="seccion__nota">Filtre por categoría para ubicar lo que busca.</p>
        </div>

        <div className="filtros" role="group" aria-label="Filtrar por categoría">
          {CATEGORIAS.map((c) => (
            <button
              key={c}
              className="filtro"
              aria-pressed={filtro === c}
              onClick={() => setFiltro(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="puestos">
          {visibles.map((p) => (
            <article className="puesto" key={p.nombre}>
              <span className="puesto__icono" aria-hidden="true">{p.icono}</span>
              <h3 className="puesto__nombre">{p.nombre}</h3>
              <p className="puesto__desc">{p.desc}</p>
              <span className="puesto__categoria">{p.categoria}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function ParaProductores() {
  return (
    <section className="seccion" id="productores">
      <div className="envoltura">
        <div className="cta-productor">
          <div>
            <h2 className="cta-productor__titulo">¿Usted produce en Acosta?</h2>
            <p className="cta-productor__texto">
              El Centro Agrícola Cantonal asigna espacios a productores del cantón.
              Escríbanos y le explicamos los requisitos para tener su puesto en la
              feria de San Ignacio o en las ferias distritales.
            </p>
          </div>
          <a
            className="boton boton--claro"
            href="https://wa.me/50600000000"
            target="_blank"
            rel="noreferrer"
          >
            Escribir por WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}

function Pie() {
  return (
    <footer className="pie">
      <div className="envoltura pie__filas">
        <span>© {new Date().getFullYear()} Centro Agrícola Cantonal de Acosta</span>
        <div className="pie__distritos">
          <span>San Ignacio</span>
          <span>Guaitil</span>
          <span>Palmichal</span>
          <span>Cangrejal</span>
          <span>Sabanillas</span>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <div className="pagina">
      <Barra />
      <Hero />
      <Calendario />
      <Puestos />
      <ParaProductores />
      <Pie />
    </div>
  )
}

