import { useEffect, useMemo, useRef, useState } from 'react'

/* =================================================================
   DATOS REALES — Centro Agrícola Cantonal de Acosta
   dia: 0=domingo … 6=sábado (para el cálculo de la cuenta regresiva)
   ================================================================= */

const NAV = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'nosotros', label: 'Nosotros' },
  { id: 'ferias', label: 'Ferias' },
  { id: 'puestos', label: 'Puestos' },
  { id: 'contacto', label: 'Contacto' },
]

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
  { nombre: 'Raíces de Acosta', categoria: 'Verduras', icono: '🥕', desc: 'Yuca, camote, ñame y tubérculos de la zona.' },
]

const PILARES = [
  {
    num: '01',
    titulo: 'Misión',
    texto:
      'Conectar al productor de Acosta directamente con quien consume, sin intermediarios, garantizando precio justo y producto fresco.',
  },
  {
    num: '02',
    titulo: 'Visión',
    texto:
      'Ser el punto de encuentro semanal de referencia entre el campo y las familias del cantón, en San Ignacio y sus cuatro distritos.',
  },
  {
    num: '03',
    titulo: 'Valores',
    texto:
      'Trabajo directo de finca a mesa, respaldo a la agricultura familiar y fortalecimiento de la economía local de Acosta.',
  },
]

/* =================================================================
   HOOKS
   ================================================================= */

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

/** Revela un bloque con fade + slide cuando entra en pantalla (efecto suave, estilo editorial) */
function useReveal(threshold = 0.14) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return { ref, visible }
}

function Reveal({ children, delay = 0, className = '' }) {
  const { ref, visible } = useReveal()
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'reveal--visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/* =================================================================
   LOGO
   ================================================================= */

const LOGO_CANDIDATOS = [
  '/logo-cac.jpeg',
  '/logo-cac.jpg',
  '/logo-cac.JPG',
  '/logo-cac.JPEG',
  '/logo-cac.png',
  '/logo-cac.PNG',
]

function LogoCAC({ tamano = 36 }) {
  const [intento, setIntento] = useState(0)

  if (intento >= LOGO_CANDIDATOS.length) {
    return (
      <div className="logo-respaldo" style={{ width: tamano, height: tamano }}>
        CA
      </div>
    )
  }

  return (
    <img
      className="logo-img"
      src={LOGO_CANDIDATOS[intento]}
      alt="Logo del Centro Agrícola Cantonal de Acosta"
      width={tamano}
      height={tamano}
      onError={() => setIntento((i) => i + 1)}
    />
  )
}

/* =================================================================
   ICONOS (línea fina, minimalistas)
   ================================================================= */

function IconHoja() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
      <path d="M2.5 22c5-1.2 10-4.2 14-9 1-4-1-9-5-11-3 3-5 7-5 11 0 2 1 5 3 7" />
      <path d="M10 13c3-2 7-3 10-2" />
    </svg>
  )
}

function IconBrote() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
      <path d="M12 22v-8" />
      <path d="M12 14a4 4 0 0 0 4-4c0-3-3-5-4-8-1 3-4 5-4 8a4 4 0 0 0 4 4Z" />
    </svg>
  )
}

function IconCorazon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
      <path d="M12 22c4-5 7-8 7-11a7 7 0 0 0-14 0c0 3 3 6 7 11Z" />
    </svg>
  )
}

const ICONOS_PILAR = [IconBrote, IconHoja, IconCorazon]

/* =================================================================
   HEADER
   ================================================================= */

function Header({ activo, irA }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const clickNav = (id) => {
    setMenuAbierto(false)
    irA(id)
  }

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header__fila envoltura">
        <div className="header__marca">
          <LogoCAC />
          <div className="header__marca-texto">
            <span className="header__marca-linea1">CENTRO AGRÍCOLA</span>
            <span className="header__marca-linea2">CANTONAL DE ACOSTA</span>
          </div>
        </div>

        <nav className="header__nav">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => clickNav(item.id)}
              className={`header__link ${activo === item.id ? 'header__link--activo' : ''}`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="header__acciones">
          <button className="boton boton--oscuro header__cta" onClick={() => clickNav('contacto')}>
            Escribir por WhatsApp
          </button>
          <button
            className="header__hamburguesa"
            aria-label="menú"
            onClick={() => setMenuAbierto((v) => !v)}
          >
            <span className={menuAbierto ? 'linea linea--1-abierta' : 'linea'} />
            <span className={menuAbierto ? 'linea linea--2-abierta' : 'linea'} />
            <span className={menuAbierto ? 'linea linea--3-abierta' : 'linea'} />
          </button>
        </div>
      </div>

      {menuAbierto && (
        <div className="header__menu-movil">
          {NAV.map((item) => (
            <button key={item.id} onClick={() => clickNav(item.id)} className="header__menu-movil-link">
              {item.label}
            </button>
          ))}
          <button className="boton boton--oscuro" style={{ marginTop: 12 }} onClick={() => clickNav('contacto')}>
            Escribir por WhatsApp
          </button>
        </div>
      )}
    </header>
  )
}

/* =================================================================
   HERO
   ================================================================= */

function Hero({ irA }) {
  const restante = useCuentaRegresiva(6, 5) // próximo sábado, 5 a.m.

  return (
    <section id="inicio" className="hero">
      <div className="envoltura hero__grid">
        <div className="hero__col-texto">
          <Reveal>
            <span className="etiqueta-pill">
              <span className="punto-pulso" />
              Feria semanal en San Ignacio y 4 distritos
            </span>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="hero__titulo">
              La feria vive
              <br />
              en <em>Acosta</em>.
            </h1>
          </Reveal>

          <Reveal delay={180}>
            <p className="hero__texto">
              De la montaña a su mesa. Café, hortalizas y productos de finca vendidos directamente
              por quien los siembra, en San Ignacio y los cuatro distritos del cantón.
            </p>
          </Reveal>

          <Reveal delay={260}>
            <div className="hero__acciones">
              <button className="boton boton--oscuro" onClick={() => irA('ferias')}>
                Ver días de feria
              </button>
              <button className="boton boton--fantasma" onClick={() => irA('puestos')}>
                Ver puestos
              </button>
            </div>
          </Reveal>
        </div>

        <div className="hero__col-tarjeta">
          <Reveal delay={150}>
            <div className="tarjeta-cuenta">
              <div className="tarjeta-cuenta__brillo" />
              <span className="tarjeta-cuenta__etiqueta">Próxima feria en</span>
              <div className="tarjeta-cuenta__numero">
                {restante.dias}
                <span>d</span> {restante.horas}
                <span>h</span>
              </div>
              <div className="tarjeta-cuenta__linea" />
              <p className="tarjeta-cuenta__nota">
                San Ignacio abre cada sábado desde las 5:00 a.m.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* =================================================================
   NOSOTROS
   ================================================================= */

function Nosotros() {
  return (
    <section id="nosotros" className="seccion seccion--clara">
      <div className="envoltura">
        <div className="nosotros__grid">
          <div className="nosotros__col-texto">
            <Reveal>
              <span className="ojo-etiqueta">— Nuestra esencia</span>
              <h2 className="titulo-seccion">Del campo de Acosta a su mesa, sin intermediarios.</h2>
              <p className="parrafo-suave">
                El Centro Agrícola Cantonal organiza las ferias del agricultor en San Ignacio y en
                los distritos de Guaitil, Palmichal, Cangrejal y Sabanillas: un espacio semanal
                donde los productores del cantón venden directamente lo que cosechan.
              </p>
            </Reveal>
          </div>

          <div className="nosotros__col-tarjetas">
            {PILARES.map((p, i) => {
              const Icono = ICONOS_PILAR[i]
              return (
                <Reveal key={p.num} delay={i * 100}>
                  <div className="tarjeta-pilar">
                    <div className="tarjeta-pilar__cabecera">
                      <span className="tarjeta-pilar__num">{p.num}</span>
                      <span className="tarjeta-pilar__icono">
                        <Icono />
                      </span>
                    </div>
                    <h3 className="tarjeta-pilar__titulo">{p.titulo}</h3>
                    <p className="tarjeta-pilar__texto">{p.texto}</p>
                    <div className="tarjeta-pilar__linea" />
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

/* =================================================================
   FERIAS
   ================================================================= */

function pad(n) {
  return String(n).padStart(2, '0')
}

function Ferias() {
  const [activo, setActivo] = useState(FERIAS[0].id)
  const feriaActiva = useMemo(() => FERIAS.find((f) => f.id === activo), [activo])
  const restante = useCuentaRegresiva(feriaActiva.dia, 5)

  return (
    <section id="ferias" className="seccion">
      <div className="envoltura">
        <Reveal>
          <div className="cabecera-seccion">
            <div>
              <span className="ojo-etiqueta">— Calendario semanal</span>
              <h2 className="titulo-seccion">Días de feria por distrito</h2>
            </div>
            <p className="nota-seccion">Toque un distrito para ver horario, lugar y tiempo restante.</p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="pestanas-distrito" role="tablist" aria-label="Distritos con feria">
            {FERIAS.map((f) => (
              <button
                key={f.id}
                role="tab"
                aria-selected={activo === f.id}
                className={`pestana-distrito ${activo === f.id ? 'pestana-distrito--activa' : ''}`}
                onClick={() => setActivo(f.id)}
              >
                <span className="pestana-distrito__dia">{f.diaTexto}</span>
                <span className="pestana-distrito__nombre">{f.distrito}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className="panel-feria">
            <div className="panel-feria__reloj">
              <span className="panel-feria__reloj-numero">
                {restante.dias > 0
                  ? `${restante.dias}d ${pad(restante.horas)}h`
                  : `${pad(restante.horas)}:${pad(restante.min)}:${pad(restante.seg)}`}
              </span>
              <span className="panel-feria__reloj-etiqueta">Faltan</span>
            </div>
            <div className="panel-feria__info">
              <h3 className="panel-feria__titulo">
                {feriaActiva.distrito}
                {feriaActiva.principal && <span className="chip-principal">Feria principal</span>}
              </h3>
              <p className="panel-feria__meta">
                <strong>{feriaActiva.diaTexto}</strong> · {feriaActiva.horario}
              </p>
              <p className="panel-feria__meta">{feriaActiva.lugar}</p>
              <p className="panel-feria__descripcion">{feriaActiva.descripcion}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* =================================================================
   PUESTOS
   ================================================================= */

function Puestos() {
  const [filtro, setFiltro] = useState('Todos')
  const visibles = useMemo(
    () => (filtro === 'Todos' ? PUESTOS : PUESTOS.filter((p) => p.categoria === filtro)),
    [filtro]
  )

  return (
    <section id="puestos" className="seccion seccion--clara">
      <div className="envoltura">
        <Reveal>
          <div className="cabecera-seccion">
            <div>
              <span className="ojo-etiqueta">— Quién vende qué</span>
              <h2 className="titulo-seccion">Puestos de la feria</h2>
            </div>
            <p className="nota-seccion">Filtre por categoría para ubicar lo que busca.</p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="filtros" role="group" aria-label="Filtrar por categoría">
            {CATEGORIAS.map((c) => (
              <button
                key={c}
                className={`filtro ${filtro === c ? 'filtro--activo' : ''}`}
                onClick={() => setFiltro(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="rejilla-puestos">
          {visibles.map((p, i) => (
            <Reveal key={p.nombre} delay={(i % 4) * 70}>
              <article className="tarjeta-puesto">
                <span className="tarjeta-puesto__icono">{p.icono}</span>
                <h3 className="tarjeta-puesto__nombre">{p.nombre}</h3>
                <p className="tarjeta-puesto__desc">{p.desc}</p>
                <span className="tarjeta-puesto__categoria">{p.categoria}</span>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* =================================================================
   CONTACTO / CTA PRODUCTORES
   ================================================================= */

function Contacto() {
  return (
    <section id="contacto" className="seccion-cta">
      <div className="envoltura">
        <Reveal>
          <div className="cta-caja">
            <div>
              <h2 className="cta-caja__titulo">¿Usted produce en Acosta?</h2>
              <p className="cta-caja__texto">
                El Centro Agrícola Cantonal asigna espacios a productores del cantón. Escríbanos y
                le explicamos los requisitos para tener su puesto en la feria de San Ignacio o en
                las ferias distritales.
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
        </Reveal>
      </div>
    </section>
  )
}

/* =================================================================
   FOOTER
   ================================================================= */

function Pie() {
  return (
    <footer className="pie">
      <div className="envoltura pie__fila">
        <div className="pie__marca">
          <LogoCAC tamano={28} />
          <span>Centro Agrícola Cantonal de Acosta</span>
        </div>
        <div className="pie__distritos">
          {FERIAS.map((f) => (
            <span key={f.id}>{f.distrito}</span>
          ))}
        </div>
        <span className="pie__copy">© {new Date().getFullYear()} CAC Acosta</span>
      </div>
    </footer>
  )
}

/* =================================================================
   APP
   ================================================================= */

export default function App() {
  const [activo, setActivo] = useState('inicio')

  const irA = (id) => {
    setActivo(id)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="pagina">
      <Header activo={activo} irA={irA} />
      <Hero irA={irA} />
      <Nosotros />
      <Ferias />
      <Puestos />
      <Contacto />
      <Pie />
    </div>
  )
}

