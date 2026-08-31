const experiences = [
  {
    title: 'CELSA',
    rol: 'Lider Tecnico',
    anios: '2026 — hoy',
    description: 'Arquitectura modular con microfrontends, SSO corporativo con Keycloak, despliegues automatizados sin llaves y un Design System propio.',
    quedo: 'El Design System lo consumen cinco proyectos sin pedir permiso a nadie.'
  },
  {
    title: 'StudioXperto',
    rol: 'Fundador y socio',
    anios: '2019 — hoy',
    description: 'Empresa de software formalizada. Direccion tecnica, producto y relacion con clientes.',
    quedo: 'Opera con equipo propio y productos en produccion.'
  },
  {
    title: 'Intelica Consulting',
    rol: 'Analyst Developer',
    anios: '2024 — 2025',
    description: 'Coordinacion de equipos de QA, desarrollo y negocio. Planificacion, seguimiento y mentoria tecnica.',
    quedo: 'Tableros de KPIs que los lideres de area siguen usando para decidir.'
  },
  {
    title: 'BSF Almacenes del Peru',
    rol: 'Analista de sistemas',
    anios: '2023 — 2024',
    description: 'Sistemas corporativos en Chile y Peru. Desarrollo en .NET Core y Python, MVPs moviles y procesos batch.',
    quedo: 'Las integraciones con SAP que mueven los datos entre plataformas.'
  },
  {
    title: 'inLearning / IDAT',
    rol: 'Desarrollador full stack',
    anios: '2022 — 2023',
    description: 'Evolucion del portal educativo EVA con Vue 3, .NET Core y SQL Server.',
    quedo: 'La documentacion tecnica que permitio mantenerlo sin mi.'
  },
  {
    title: 'Sursa Gas',
    rol: 'Analista Programador',
    anios: '2016 — 2018',
    description: 'Sistemas a medida de ventas y produccion. Mejora del 70% en tiempos de respuesta de calculos, busquedas e impresiones.',
    quedo: 'El sitio que hice sigue en linea diez anos despues: sursagas.com'
  }
]

const projects = [
  {
    title: 'Una suite modular con un solo login',
    description: 'Doce modulos en produccion sobre una arquitectura federada: cada equipo despliega el suyo sin bloquear a los demas. Autenticacion centralizada con Keycloak/OIDC, despliegues automatizados sin llaves de servicio en los repositorios, y un Design System propio que consumen cinco proyectos.',
    link: '',
    stack: ['Module Federation', 'Keycloak/OIDC', 'Design System']
  },
  {
    title: 'Aprendix — Universidad Corporativa Intercorp',
    description: 'Modernizacion de la plataforma academica: de Lumen a Laravel, separada en servicios independientes para el modulo academico, administrativo y de reportes, y desplegada en Cloud Run con Cloud SQL.',
    link: '',
    stack: ['Laravel', 'Cloud Run', 'Microservicios']
  },
  {
    title: 'Fichas pedagogicas — UGEL Padre Abad',
    description: 'Plataforma de registro y monitoreo para la Direccion Regional de Educacion de Ucayali, con una app que funciona sin conexion para la supervision en campo y comentarios pedagogicos automatizados.',
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
      <p class="track__quedo"><span>Quedo funcionando:</span> ${item.quedo}</p>
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
        ${project.link ? `<a class="card-link mt-2" href="${project.link}" target="_blank" rel="noopener">Visitar proyecto</a>` : ''}
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
