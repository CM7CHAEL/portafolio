const experiences = [
  {
    title: 'CELSA',
    rol: 'Lead Full Stack Developer',
    anios: '2026 — hoy',
    description: 'Arquitectura modular con microfrontends, SSO corporativo con Keycloak, despliegues automatizados sin llaves y un Design System propio.',
    quedo: 'Un Design System que usan 17 aplicaciones de la plataforma.'
  },
  {
    title: 'StudioXperto',
    rol: 'Analista Desarrollador',
    anios: '2026',
    description: 'Proyectos para Ferreyros, la Universidad Corporativa Intercorp y la UGEL Padre Abad: monitoreo en Google Cloud, migración de Lumen a Laravel en Cloud Run y una plataforma educativa con app sin conexión.',
    quedo: 'Aprendix en Cloud Run, con un servicio por módulo.'
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
    title: 'Independiente → StudioXperto',
    rol: 'Desarrollador full stack',
    anios: '2019 — 2022',
    description: 'Proyectos a medida para clientes de distintos sectores; desde 2021, bajo StudioXperto. Análisis, desarrollo y coordinación de un equipo pequeño.',
    quedo: 'Sitios y sistemas de clientes que siguen en producción.'
  },
  {
    title: 'Sursa Gas',
    rol: 'Practicante → Analista Programador Jr.',
    anios: '2016 — 2018',
    description: 'Sistemas a medida de ventas y producción. Mejora del 70 % en tiempos de respuesta de cálculos, búsquedas e impresiones.',
    quedo: 'El sitio web de la empresa, que sigue en línea hasta hoy: sursagas.com'
  }
]

const projects = [
  {
    title: 'Una suite modular con un solo login',
    description: 'Más de 15 módulos sobre una arquitectura federada: cada equipo despliega el suyo sin bloquear a los demás. Inicio de sesión centralizado con Keycloak/OIDC, despliegues automatizados sin llaves de servicio y un Design System propio que usan 17 aplicaciones.',
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


function renderCards(list, containerId, templateFn) {
  const container = document.getElementById(containerId)
  if (!container) return
  container.innerHTML = list.map(templateFn).join('')
}

const experienceTemplate = (item) => `
  <div class="col-12">
    <div class="track">
      <div class="track__head">
        <h5 class="track__org">${item.title}</h5>
        <span class="track__rol">${item.rol}</span>
        <span class="track__anios">${item.anios}</span>
      </div>
      <p class="track__desc">${item.description}</p>
      <p class="track__quedo"><span>Lo que dejé:</span> ${item.quedo}</p>
    </div>
  </div>
`

const projectTemplate = (project) => `
  <div class="col-12 col-md-6 col-lg-4 mb-4">
    <div class="card card--project h-100">
      <div class="card-body d-flex flex-column">
        <h5>${project.title}</h5>
        <p class="card-text flex-grow-1">${project.description}</p>
        <div class="stack">
          ${project.stack.map(tag => `<span class="stack__item">${tag}</span>`).join('')}
        </div>
        ${project.link ? `<a class="card-link mt-2" href="${project.link}"${/^https?:/.test(project.link) ? ' target="_blank" rel="noopener"' : ''}>${project.linkText || 'Visitar proyecto'}</a>` : ''}
      </div>
    </div>
  </div>
`


document.addEventListener('DOMContentLoaded', () => {
  renderCards(experiences, 'experience-grid', experienceTemplate)
  renderCards(projects, 'projects-grid', projectTemplate)

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
