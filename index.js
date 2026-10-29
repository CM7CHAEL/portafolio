// Los textos van en los dos idiomas; cada página elige según su <html lang>. La versión en
// inglés vive en en/index.html y carga este mismo archivo.
const IDIOMA = document.documentElement.lang === 'en' ? 'en' : 'es'
// Raíz del sitio (/portafolio/), para que los enlaces internos funcionen también desde en/.
const RAIZ = ((document.currentScript && document.currentScript.src) || '/').replace(/index\.js.*$/, '')

const experienciasEs = [
  {
    title: 'CELSA',
    rol: 'Lead Full Stack Developer',
    anios: '2026 — hoy',
    description: 'Arquitectura modular con microfrontends, SSO corporativo con Keycloak, despliegues automatizados sin llaves y un Design System propio.',
    quedo: 'Un Design System que usan 18 aplicaciones de la plataforma.'
  },
  {
    title: 'StudioXperto',
    rol: 'Socio · Líder técnico y desarrollador full stack',
    anios: '2020 — 2026',
    description: 'Un pequeño equipo con clientes en Perú, Chile, España y EE. UU.: CentralWeb (CRM y marketing multiempresa), responsable de TI de AOA Chile, la migración de Aprendix y un agente de IA para la Universidad Corporativa Intercorp, levantamiento, reportes y monitoreo para Ferreyros, y soporte de WordPress, servidores y n8n para RealtyPlus e Intelligent Punks.',
    quedo: 'CentralWeb, que usa una decena de empresas, y sistemas de clientes en producción.'
  },
  {
    title: 'Intelica Consulting',
    rol: 'Analyst Developer',
    anios: '2024 — 2025',
    description: 'Coordinación de equipos de QA, desarrollo y negocio. Planificación, seguimiento y mentoría técnica.',
    quedo: 'Tableros de KPIs con los que los líderes de área toman decisiones.'
  },
  {
    title: 'BSF Almacenes del Perú',
    rol: 'Analista de sistemas',
    anios: '2023 — 2024',
    description: 'Sistemas corporativos en Chile y Perú. Desarrollo en .NET Core y Python, MVPs móviles y procesos batch.',
    quedo: 'Las integraciones con SAP que mueven los datos entre plataformas.'
  },
  {
    title: 'inLearning / IDAT',
    rol: 'Desarrollador full stack',
    anios: '2022 — 2023',
    description: 'Evolución del portal educativo EVA con Vue 3, .NET Core y SQL Server.',
    quedo: 'Los manuales técnicos del portal: base de datos, frontend y backend.'
  },
  {
    title: 'Ibrevis · Plustech · Grupo Rojas · Madison Perú · Acceso Corp',
    rol: 'Desarrollador full stack · contratos',
    anios: '2019 — 2020',
    description: 'Zappyn, gestión de ferias: caja, registro y el primer prototipo del plano web, en el equipo que firmó con StartUp Perú. Frontend en Angular para EsSalud, módulos de RRHH y proyectos con Gantt, soporte y TI en una agencia de marketing, y desarrollo sobre PostgreSQL en el sector automotriz.',
    quedo: 'La idea del plano web de ferias, que hoy Zappyn vende como producto.'
  },
  {
    title: 'Sursa Gas',
    rol: 'Practicante → Analista Programador Jr. → Proveedor del ERP',
    anios: '2016 — 2024',
    description: 'Entré para mejorar sus Excel y, por iniciativa propia, empecé su sistema de ventas en Access VBA con MySQL. Creció hasta ser su ERP: ventas, caja y producción. Desde 2018, ya fuera de la empresa, seguí como proveedor hasta 2024, y en 2023 lo migré a web con un equipo. Mejora del 70 % en tiempos de respuesta.',
    quedo: 'Un ERP que la empresa usó hasta su cierre, en 2025, y su sitio web: sursagas.com'
  }
]

const proyectosEs = [
  {
    title: 'Una suite modular con un solo login',
    description: 'Más de 15 módulos sobre una arquitectura federada: cada equipo despliega el suyo sin bloquear a los demás. Inicio de sesión centralizado con Keycloak/OIDC, despliegues automatizados sin llaves de servicio y un Design System propio que usan 18 aplicaciones.',
    link: 'blog/microfrontends-angular-native-federation-lecciones-produccion.html',
    linkText: 'Leer el artículo',
    stack: ['Native Federation', 'Keycloak/OIDC', 'Design System']
  },
  {
    title: 'Aprendix · Universidad Corporativa Intercorp',
    description: 'Modernización de la plataforma académica: de Lumen a Laravel, separada en servicios para los módulos académico, administrativo y de reportes, y desplegada en Cloud Run con Cloud SQL.',
    link: '',
    stack: ['Laravel', 'Cloud Run', 'Microservicios']
  },
  {
    title: 'Fichas pedagógicas · UGEL Padre Abad',
    description: 'Plataforma de registro y monitoreo para la Dirección Regional de Educación de Ucayali, con una app que funciona sin conexión para la supervisión en campo y comentarios pedagógicos automáticos.',
    link: 'apps-moviles.html',
    stack: ['Ionic offline', 'Nuxt', 'Azure AI']
  }
]

const experienciasEn = [
  {
    title: 'CELSA',
    rol: 'Lead Full Stack Developer',
    anios: '2026 — present',
    description: 'Modular architecture with microfrontends, corporate SSO with Keycloak, keyless automated deployments and an in-house Design System.',
    quedo: 'A Design System used by 18 applications across the platform.'
  },
  {
    title: 'StudioXperto',
    rol: 'Partner · Tech lead and full stack developer',
    anios: '2020 — 2026',
    description: 'A small team with clients in Peru, Chile, Spain and the US: CentralWeb (multi-company CRM and marketing), head of IT for AOA Chile, the Aprendix migration and an AI agent for Universidad Corporativa Intercorp, requirements, reports and monitoring for Ferreyros, and WordPress, server and n8n support for RealtyPlus and Intelligent Punks.',
    quedo: 'CentralWeb, used by about ten companies, and client systems in production.'
  },
  {
    title: 'Intelica Consulting',
    rol: 'Analyst Developer',
    anios: '2024 — 2025',
    description: 'Coordinating QA, development and business teams. Planning, follow-up and technical mentoring.',
    quedo: 'KPI dashboards that area leaders use to make decisions.'
  },
  {
    title: 'BSF Almacenes del Perú',
    rol: 'Systems Analyst',
    anios: '2023 — 2024',
    description: 'Corporate systems in Chile and Peru. Development in .NET Core and Python, mobile MVPs and batch processes.',
    quedo: 'The SAP integrations that move data between platforms.'
  },
  {
    title: 'inLearning / IDAT',
    rol: 'Full Stack Developer',
    anios: '2022 — 2023',
    description: 'Evolving the EVA learning portal with Vue 3, .NET Core and SQL Server.',
    quedo: "The portal's technical manuals: database, frontend and backend."
  },
  {
    title: 'Ibrevis · Plustech · Grupo Rojas · Madison Perú · Acceso Corp',
    rol: 'Full stack developer · contracts',
    anios: '2019 — 2020',
    description: 'Zappyn, trade fair management: cash, registration and the first prototype of the web floor plan, in the team that signed with StartUp Perú. Angular frontend for EsSalud, HR and project modules with Gantt charts, support and IT at a marketing agency, and development on PostgreSQL in the automotive sector.',
    quedo: 'The idea of the web floor plan for fairs, which Zappyn now sells as a product.'
  },
  {
    title: 'Sursa Gas',
    rol: 'Intern → Junior Programmer Analyst → ERP vendor',
    anios: '2016 — 2024',
    description: 'I joined to improve their spreadsheets and, on my own initiative, started their sales system in Access VBA with MySQL. It grew into their ERP: sales, cash and production. From 2018, after leaving the company, I stayed on as their vendor until 2024, and in 2023 moved it to the web with a team. Response times improved by 70%.',
    quedo: 'An ERP the company used until it closed in 2025, and its website: sursagas.com'
  }
]

const proyectosEn = [
  {
    title: 'A modular suite with a single login',
    description: 'More than 15 modules on a federated architecture: each team deploys its own without blocking the others. Centralized sign-in with Keycloak/OIDC, keyless automated deployments and an in-house Design System used by 18 applications.',
    link: 'blog/microfrontends-angular-native-federation-lecciones-produccion.html',
    linkText: 'Read the article (in Spanish)',
    stack: ['Native Federation', 'Keycloak/OIDC', 'Design System']
  },
  {
    title: 'Aprendix · Universidad Corporativa Intercorp',
    description: 'Modernizing the academic platform: from Lumen to Laravel, split into services for the academic, administrative and reporting modules, and deployed on Cloud Run with Cloud SQL.',
    link: '',
    stack: ['Laravel', 'Cloud Run', 'Microservices']
  },
  {
    title: 'Teaching records · UGEL Padre Abad',
    description: 'A registration and monitoring platform for the Regional Education Office of Ucayali, with an offline app for field supervision and automatic teaching feedback.',
    link: 'apps-moviles.html',
    linkText: 'See the mobile apps (in Spanish)',
    stack: ['Ionic offline', 'Nuxt', 'Azure AI']
  }
]

const TEXTOS = {
  es: { experiences: experienciasEs, projects: proyectosEs, quedo: 'Lo que dejé:', visitar: 'Visitar proyecto' },
  en: { experiences: experienciasEn, projects: proyectosEn, quedo: 'What I left:', visitar: 'Visit project' }
}[IDIOMA]

// Los enlaces internos se arman desde la raíz; los externos se abren en otra pestaña.
const enlace = (link) => /^https?:/.test(link) ? link : RAIZ + link

function renderCards(list, containerId, templateFn) {
  const container = document.getElementById(containerId)
  if (!container) return
  container.innerHTML = list.map(templateFn).join('')
}

const experienceTemplate = (item) => `
  <div class="col-12">
    <div class="track">
      <div class="track__head">
        <h3 class="track__org h5">${item.title}</h3>
        <span class="track__rol">${item.rol}</span>
        <span class="track__anios">${item.anios}</span>
      </div>
      <p class="track__desc">${item.description}</p>
      <p class="track__quedo"><span>${TEXTOS.quedo}</span> ${item.quedo}</p>
    </div>
  </div>
`

const projectTemplate = (project) => `
  <div class="col-12 col-md-6 col-lg-4 mb-4">
    <div class="card card--project h-100">
      <div class="card-body d-flex flex-column">
        <h3 class="h5">${project.title}</h3>
        <p class="card-text flex-grow-1">${project.description}</p>
        <div class="stack">
          ${project.stack.map(tag => `<span class="stack__item">${tag}</span>`).join('')}
        </div>
        ${project.link ? `<a class="card-link mt-2" href="${enlace(project.link)}"${/^https?:/.test(project.link) ? ' target="_blank" rel="noopener"' : ''}>${project.linkText || TEXTOS.visitar}</a>` : ''}
      </div>
    </div>
  </div>
`


document.addEventListener('DOMContentLoaded', () => {
  renderCards(TEXTOS.experiences, 'experience-grid', experienceTemplate)
  renderCards(TEXTOS.projects, 'projects-grid', projectTemplate)

  const navLinks = document.querySelectorAll('a.nav-link[href^="#"]')
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      const targetId = link.getAttribute('href').slice(1)
      const el = document.getElementById(targetId)
      if (el) {
        const offset = document.querySelector('.navbar')?.offsetHeight || 64
        const top = el.getBoundingClientRect().top + window.scrollY - offset + 8
        window.scrollTo({ top, behavior: 'smooth' })
      }
    })
  })

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
      }
    })
  }, { threshold: 0.2 })

  document.querySelectorAll('.reveal').forEach(section => observer.observe(section))
})
