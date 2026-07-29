import { useEffect, useMemo, useRef, useState } from 'react'

/* =================================================================
   DATOS REALES — Centro Agrícola Cantonal de Acosta
   dia: 0=domingo … 6=sábado (para el cálculo de la cuenta regresiva)
   ================================================================= */

const CONTACTO = {
  telefonoDisplay: '+506 8768 0039',
  telefonoWa: '50687680039',
  telefonoTel: '+50687680039',
}

const NAV = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'nosotros', label: 'Nosotros' },
  { id: 'puestos', label: 'Puestos' },
  { id: 'servicios', label: 'Servicios' },
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
  { nombre: 'Beneficio El Cerro', categoria: 'Café', desc: 'Café de altura, tueste medio y oscuro, molido al momento.' },
  { nombre: 'Finca Los Chinchilla', categoria: 'Verduras', desc: 'Culantro, chile dulce, tomate y hortalizas de la semana.' },
  { nombre: 'Huerta Sabanillas', categoria: 'Frutas', desc: 'Piña, banano y cítricos cosechados el mismo día.' },
  { nombre: 'Lácteos Palmichal', categoria: 'Lácteos', desc: 'Queso fresco, natilla y cuajada de producción familiar.' },
  { nombre: 'Panadería Doña Flor', categoria: 'Panadería', desc: 'Pan casero, empanadas y rosquillas de horno de leña.' },
  { nombre: 'Taller Guaitil Artesanal', categoria: 'Artesanía', desc: 'Canastos de mimbre y piezas talladas por manos locales.' },
  { nombre: 'Cafetal Cangrejal', categoria: 'Café', desc: 'Café orgánico certificado, en grano o molido.' },
  { nombre: 'Raíces de Acosta', categoria: 'Verduras', desc: 'Yuca, camote, ñame y tubérculos de la zona.' },
]

const PILARES = [
  {
    num: '01',
    titulo: 'Misión',
    texto:
      'Ser una organización líder en el cantón de Acosta, cumpliendo las normativas para lo cual fue creado, primordialmente el fortalecimiento social y económico de los productores y productoras afiliados y no afiliados.',
  },
  {
    num: '02',
    titulo: 'Visión',
    texto:
      'Servir de enlace con los diferentes grupos sociales del cantón de Acosta y lugares aledaños, mediante la gestión de proyectos socio-productivos que faculten y permitan crear una estructura administrativa moderna y eficiente, que genere ingresos económicos para mejorar la calidad de vida de las familias de los afiliados y público en general.',
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
  '/Logo.png',
  '/logo.png',
  '/logo.PNG',
  '/logo-cac.jpeg',
  '/logo-cac.jpg',
  '/logo-cac.JPG',
  '/logo-cac.JPEG',
  '/logo-cac.png',
  '/logo-cac.PNG',
]

/** Botón con barrido de color al hover (detalle premium) */
function Boton({ children, className = '', as = 'button', ...props }) {
  const Etiqueta = as
  return (
    <Etiqueta className={`boton ${className}`} {...props}>
      <span className="boton__capa" />
      <span className="boton__texto">{children}</span>
    </Etiqueta>
  )
}

function LogoCAC({ tamano = 40 }) {
  const [intento, setIntento] = useState(0)

  if (intento >= LOGO_CANDIDATOS.length) {
    return (
      <div className="logo-marco" style={{ width: tamano, height: tamano }}>
        <div className="logo-respaldo">CA</div>
      </div>
    )
  }

  return (
    <div className="logo-marco" style={{ width: tamano, height: tamano }}>
      <img
        className="logo-img"
        src={LOGO_CANDIDATOS[intento]}
        alt="Logo del Centro Agrícola Cantonal de Acosta"
        onError={() => setIntento((i) => i + 1)}
      />
    </div>
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

/** Logo oficial de WhatsApp (glifo simplificado) */
function IconWhatsApp({ tamano = 18 }) {
  return (
    <svg width={tamano} height={tamano} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
      <path d="M16.02 3C9.4 3 4 8.37 4 14.98c0 2.28.63 4.42 1.73 6.26L3 29l7.98-2.66a12.9 12.9 0 0 0 5.04 1.02h.01c6.62 0 12-5.37 12-11.98C28.03 8.37 22.65 3 16.02 3Zm0 21.87h-.01a9.9 9.9 0 0 1-5.05-1.39l-.36-.21-4.73 1.58 1.58-4.6-.24-.37a9.9 9.9 0 0 1-1.53-5.3c0-5.47 4.46-9.92 9.95-9.92 2.66 0 5.15 1.03 7.03 2.9a9.86 9.86 0 0 1 2.91 7.02c0 5.48-4.46 9.29-9.55 9.29Zm5.44-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z" />
    </svg>
  )
}

/** Ícono de llamada */
function IconTelefono({ tamano = 16 }) {
  return (
    <svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M4.5 4.5c1-1 2.2-1 3 0l1.6 2.2c.5.7.4 1.6-.2 2.2l-1 1c-.3.3-.3.7-.1 1a13.4 13.4 0 0 0 5.3 5.3c.3.2.7.2 1-.1l1-1c.6-.6 1.5-.7 2.2-.2l2.2 1.6c1 .8 1 2 0 3l-.9.9c-.9.9-2.3 1.3-3.5 1-4.3-1.2-8.4-5.3-9.9-9.9-.4-1.3 0-2.6 1-3.6l.9-.9Z" />
    </svg>
  )
}

const ICONOS_CATEGORIA = {
  Café: function IconCafe() {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
        <path d="M5 9h11v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9Z" />
        <path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16" />
        <path d="M8 5.5c0-1 .8-1.2.8-2.2M11.5 5.5c0-1 .8-1.2.8-2.2" />
      </svg>
    )
  },
  Verduras: function IconVerdura() {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
        <path d="M12 21c-4.4 0-7-3-7-7 0-3.5 2.6-7 7-9 4.4 2 7 5.5 7 9 0 4-2.6 7-7 7Z" />
        <path d="M12 21V9" />
      </svg>
    )
  },
  Frutas: function IconFruta() {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
        <circle cx="12" cy="14" r="7" />
        <path d="M12 7c0-2 1-3.5 3-4" />
      </svg>
    )
  },
  Lácteos: function IconLacteo() {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
        <path d="M9 3h6l1 4-1.5 2v10a1.5 1.5 0 0 1-1.5 1.5h-2A1.5 1.5 0 0 1 9.5 19V9L8 5l1-2Z" />
        <path d="M9.5 12h5" />
      </svg>
    )
  },
  Panadería: function IconPan() {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
        <path d="M4 13c0-4 3.5-8 8-8s8 4 8 8-3 6-8 6-8-2-8-6Z" />
        <path d="M9 12c.5-1 1.5-1 2 0M13 12c.5-1 1.5-1 2 0" />
      </svg>
    )
  },
  Artesanía: function IconArtesania() {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
        <path d="M4 10h16l-1.5 9a1.5 1.5 0 0 1-1.5 1.3H7a1.5 1.5 0 0 1-1.5-1.3L4 10Z" />
        <path d="M8 10a4 4 0 0 1 8 0" />
      </svg>
    )
  },
}

function IconCategoria({ categoria }) {
  const Icono = ICONOS_CATEGORIA[categoria]
  if (!Icono) return null
  return <Icono />
}

/** Ilustración de línea genérica del agro: montaña, sol y surcos de cultivo */
function IlustracionAgro() {
  return (
    <svg viewBox="0 0 400 300" fill="none" className="ilustracion-agro" aria-hidden="true">
      <circle cx="308" cy="70" r="30" stroke="var(--dorado)" strokeWidth="1.2" />
      <g stroke="var(--dorado)" strokeWidth="1.2" strokeLinecap="round">
        <path d="M308 24v-12" />
        <path d="M308 128v-12" />
        <path d="M354 70h12" />
        <path d="M250 70h12" />
        <path d="M340 32l8-8" />
        <path d="M276 108l8-8" />
        <path d="M340 108l8 8" />
        <path d="M276 32l-8 8" />
      </g>

      <path
        d="M0 190 L70 108 L120 160 L180 84 L250 176 L300 132 L400 200 V300 H0 Z"
        fill="var(--verde)"
        opacity="0.06"
      />
      <path
        d="M0 190 L70 108 L120 160 L180 84 L250 176 L300 132 L400 200"
        stroke="var(--verde)"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />

      <g stroke="var(--dorado)" strokeWidth="1.1" opacity="0.75">
        <path d="M-10 230 Q100 210 210 230 T430 230" />
        <path d="M-10 252 Q100 232 210 252 T430 252" />
        <path d="M-10 274 Q100 254 210 274 T430 274" />
      </g>

      <g transform="translate(60 190)">
        <path
          d="M0 40c14-3 28-30 28-30s26 27 26 30-40 3-54 0Z"
          fill="var(--verde)"
          opacity="0.9"
        />
        <path d="M13 40C21 30 27 15 27 10" stroke="var(--fondo)" strokeWidth="1" opacity="0.5" />
      </g>
    </svg>
  )
}

const ICONOS_PILAR = [IconBrote, IconHoja]

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
          <Boton
            as="a"
            className="boton--oscuro header__cta"
            href={`https://wa.me/${CONTACTO.telefonoWa}`}
            target="_blank"
            rel="noreferrer"
          >
            <IconWhatsApp /> {CONTACTO.telefonoDisplay}
          </Boton>
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
          <Boton
            as="a"
            className="boton--oscuro"
            style={{ marginTop: 12 }}
            href={`https://wa.me/${CONTACTO.telefonoWa}`}
            target="_blank"
            rel="noreferrer"
          >
            <IconWhatsApp /> {CONTACTO.telefonoDisplay}
          </Boton>
          <a className="header__menu-movil-llamar" href={`tel:${CONTACTO.telefonoTel}`}>
            <IconTelefono /> {CONTACTO.telefonoDisplay}
          </a>
        </div>
      )}
    </header>
  )
}

/* =================================================================
   HERO
   ================================================================= */

const TICKER = [...FERIAS.map((f) => f.distrito), 'Café', 'Hortalizas', 'Lácteos', 'Frutas', 'Artesanía']

function Ticker() {
  const fila = [...TICKER, ...TICKER]
  return (
    <div className="ticker">
      <div className="ticker__pista">
        {fila.map((item, i) => (
          <span className="ticker__item" key={`${item}-${i}`}>
            {item}
            <span className="ticker__punto" />
          </span>
        ))}
      </div>
    </div>
  )
}

function Hero({ irA }) {
  return (
    <section id="inicio" className="hero">
      <span className="hero__palabra-fondo" aria-hidden="true">
        ACOSTA
      </span>
      <div className="envoltura hero__grid">
        <div className="hero__col-texto">
          <Reveal>
            <div className="hero__logo-fila">
              <LogoCAC tamano={58} />
              <span className="hero__logo-linea" />
            </div>
          </Reveal>

          <Reveal delay={60}>
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
              <Boton className="boton--oscuro" onClick={() => irA('servicios')}>
                Ver servicios
              </Boton>
              <Boton className="boton--fantasma" onClick={() => irA('puestos')}>
                Ver puestos
              </Boton>
            </div>
          </Reveal>
        </div>

        <div className="hero__col-tarjeta">
          <Reveal delay={150}>
            <div className="tarjeta-ilustracion">
              <div className="tarjeta-ilustracion__brillo" />
              <IlustracionAgro />
            </div>
          </Reveal>
        </div>
      </div>
      <Ticker />
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
                  <div className="tarjeta-pilar" data-num={p.num}>
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
              <article className="tarjeta-puesto" data-num={String(i + 1).padStart(2, '0')}>
                <span className="tarjeta-puesto__icono">
                  <IconCategoria categoria={p.categoria} />
                </span>
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

const BENEFICIOS_AFILIACION = [
  'Afíliese al CAC Acosta y participe en cualquier feria del país',
  'Pago de carné de afiliación',
]

/* =================================================================
   SERVICIOS — Carné de feriante + Banco de yemas
   ================================================================= */

const SERVICIOS = [
  {
    num: '01',
    titulo: 'Carné de feriante',
    texto:
      'Afíliese al CAC Acosta y participe con su puesto en cualquier feria del agricultor del país. Incluye el pago del carné de afiliación.',
    cta: 'Solicitar carné',
    pago: true,
  },
  {
    num: '02',
    titulo: 'Banco de yemas para injerto',
    texto:
      'Yemas de variedades seleccionadas disponibles para injertar árboles frutales y de café, y mejorar la productividad de su finca.',
    cta: 'Consultar disponibilidad',
  },
  {
    num: '03',
    titulo: 'Actividad registrada',
    texto: 'Cultivo de productos agrícolas en combinación con la cría de animales (explotación mixta).',
    cta: 'Más información',
  },
]

/** Pasarela de pago FICTICIA — solo para demostración visual al cliente. No procesa pagos reales. */
function ModalPago({ onCerrar }) {
  const [estado, setEstado] = useState('formulario') // formulario | procesando | exito

  const enviar = (e) => {
    e.preventDefault()
    setEstado('procesando')
    setTimeout(() => setEstado('exito'), 1400)
  }

  return (
    <div className="modal-fondo" onClick={onCerrar}>
      <div className="modal-caja" onClick={(e) => e.stopPropagation()}>
        <span className="modal-caja__demo">Vista previa · pago simulado</span>
        <button className="modal-caja__cerrar" onClick={onCerrar} aria-label="Cerrar">
          ×
        </button>

        {estado !== 'exito' ? (
          <>
            <h3 className="modal-caja__titulo">Pago del carné de feriante</h3>
            <p className="modal-caja__monto">₡5 000</p>

            <form className="form-pago" onSubmit={enviar}>
              <label className="form-pago__campo">
                Nombre en la tarjeta
                <input type="text" placeholder="Nombre completo" required />
              </label>
              <label className="form-pago__campo">
                Número de tarjeta
                <input type="text" placeholder="0000 0000 0000 0000" maxLength={19} required />
              </label>
              <div className="form-pago__fila">
                <label className="form-pago__campo">
                  Vencimiento
                  <input type="text" placeholder="MM/AA" maxLength={5} required />
                </label>
                <label className="form-pago__campo">
                  CVV
                  <input type="text" placeholder="123" maxLength={3} required />
                </label>
              </div>

              <Boton className="boton--oscuro form-pago__enviar" as="button" type="submit" disabled={estado === 'procesando'}>
                {estado === 'procesando' ? 'Procesando…' : 'Pagar ₡5 000'}
              </Boton>
            </form>
          </>
        ) : (
          <div className="modal-caja__exito">
            <span className="modal-caja__exito-icono">✓</span>
            <h3 className="modal-caja__titulo">Pago simulado exitoso</h3>
            <p className="parrafo-suave" style={{ margin: '10px auto 0', maxWidth: 260 }}>
              Esta es una demostración. Aquí se conectará la pasarela de pago real más adelante.
            </p>
            <Boton className="boton--fantasma" style={{ marginTop: 22 }} onClick={onCerrar}>
              Cerrar
            </Boton>
          </div>
        )}
      </div>
    </div>
  )
}

function Servicios() {
  const [pagoAbierto, setPagoAbierto] = useState(false)

  return (
    <section id="servicios" className="seccion seccion--clara">
      <div className="envoltura">
        <Reveal>
          <div className="cabecera-seccion">
            <div>
              <span className="ojo-etiqueta">— Para productores</span>
              <h2 className="titulo-seccion">Servicios del CAC Acosta</h2>
            </div>
            <p className="nota-seccion">Escríbanos por WhatsApp para iniciar cualquiera de estos trámites.</p>
          </div>
        </Reveal>

        <div className="rejilla-servicios">
          {SERVICIOS.map((s, i) => (
            <Reveal key={s.num} delay={i * 100}>
              <div className="tarjeta-pilar tarjeta-pilar--servicio" data-num={s.num}>
                <div className="tarjeta-pilar__cabecera">
                  <span className="tarjeta-pilar__num">{s.num}</span>
                </div>
                <h3 className="tarjeta-pilar__titulo">{s.titulo}</h3>
                <p className="tarjeta-pilar__texto">{s.texto}</p>
                <div className="tarjeta-servicio__acciones">
                  <a
                    className="tarjeta-servicio__enlace"
                    href={`https://wa.me/${CONTACTO.telefonoWa}?text=${encodeURIComponent(
                      'Hola, quisiera información sobre ' + s.titulo
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <IconWhatsApp tamano={14} /> {s.cta}
                  </a>
                  {s.pago && (
                    <button className="tarjeta-servicio__pagar" onClick={() => setPagoAbierto(true)}>
                      Pagar carné en línea
                    </button>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {pagoAbierto && <ModalPago onCerrar={() => setPagoAbierto(false)} />}
    </section>
  )
}

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
              <ul className="cta-caja__lista">
                {BENEFICIOS_AFILIACION.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
            <div className="cta-caja__acciones">
              <Boton
                as="a"
                className="boton--claro"
                href={`https://wa.me/${CONTACTO.telefonoWa}`}
                target="_blank"
                rel="noreferrer"
              >
                <IconWhatsApp /> {CONTACTO.telefonoDisplay}
              </Boton>
              <a className="cta-caja__llamar" href={`tel:${CONTACTO.telefonoTel}`}>
                <IconTelefono />
                {CONTACTO.telefonoDisplay}
              </a>
            </div>
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
      <Puestos />
      <Servicios />
      <Contacto />
      <Pie />
    </div>
  )
}
