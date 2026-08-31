const experiences = [
  {
    img: './assets/image/experiences/estrategia-liderazgo.avif',
    title: 'CELSA — Lider Tecnico · 2026 a hoy',
    description: 'Arquitectura modular con microfrontends, SSO corporativo con Keycloak, CI/CD sin llaves y un Design System que consume toda la suite.'
  },
  {
    img: './assets/image/experiences/software-como-servicio-saas.webp',
    title: 'StudioXperto — Fundador y socio · 2019 a hoy',
    description: 'Empresa de software formalizada. Direccion tecnica, producto y relacion con clientes; hoy con equipo propio y productos SaaS en operacion.'
  },
  {
    img: './assets/image/experiences/desarrollo-software.jpg',
    title: 'Intelica Consulting — Analyst Developer · 2024 a 2025',
    description: 'Coordinacion de equipos de QA, desarrollo y negocio. Planificacion y seguimiento de entregas, mentoria tecnica y tableros de KPIs en Power BI.'
  },
  {
    img: './assets/image/experiences/integracion-de-apisnew.jpg',
    title: 'BSF Almacenes del Peru — Analista de sistemas · 2023 a 2024',
    description: 'Sistemas corporativos en Chile y Peru. Desarrollo en .NET Core y Python, MVPs moviles, procesos batch e integraciones con SAP.'
  },
  {
    img: './assets/image/experiences/web-site.jpg',
    title: 'inLearning / IDAT — Full stack · 2022 a 2023',
    description: 'Evolucion del portal educativo EVA con Vue 3, .NET Core y SQL Server, con documentacion tecnica para hacerlo mantenible.'
  },
  {
    img: './assets/image/experiences/soporte-remoto.png',
    title: 'Sursa Gas — Analista Programador · 2016 a 2018',
    description: 'Sistemas a medida de ventas y produccion. Mejora del 70% en tiempos de respuesta de calculos, busquedas e impresiones.'
  }
]

const projects = [
  {
    title: 'Una suite modular con un solo login',
    description: 'Doce modulos en produccion sobre una arquitectura federada: cada equipo despliega el suyo sin bloquear a los demas. Autenticacion centralizada con Keycloak/OIDC, despliegues automatizados sin llaves de servicio en los repositorios, y un Design System propio que consumen cinco proyectos.',
    link: '',
    img: './assets/image/experiences/desarrollo-software.jpg',
    stack: ['Module Federation', 'Keycloak/OIDC', 'Design System']
  },
  {
    title: 'Aprendix — Universidad Corporativa Intercorp',
    description: 'Modernizacion de la plataforma academica: de Lumen a Laravel, separada en servicios independientes para el modulo academico, administrativo y de reportes, y desplegada en Cloud Run con Cloud SQL.',
    link: '',
    img: './assets/image/experiences/software-como-servicio-saas.webp',
    stack: ['Laravel', 'Cloud Run', 'Microservicios']
  },
  {
    title: 'Fichas pedagogicas — UGEL Padre Abad',
    description: 'Plataforma de registro y monitoreo para la Direccion Regional de Educacion de Ucayali, con una app que funciona sin conexion para la supervision en campo y comentarios pedagogicos automatizados.',
    link: 'apps-moviles.html',
    img: './assets/image/projects/app.png',
    stack: ['Ionic offline', 'Nuxt', 'Azure AI']
  }
]


function renderCards(list, containerId, templateFn) {
  const container = document.getElementById(containerId)
  if (!container) return
  container.innerHTML = list.map(templateFn).join('')
}

const experienceTemplate = (item) => `
  <div class="col-12 col-md-6 col-lg-4 mb-4">
    <div class="card card--soft h-100">
      <img class="card-img-top" height="180" src="${item.img}" alt="${item.title}">
      <div class="card-body">
        <span class="badge badge-pill badge-light text-primary">${item.title}</span>
        <p class="card-text mt-2">${item.description}</p>
      </div>
    </div>
  </div>
`

const projectTemplate = (project) => `
  <div class="col-12 col-md-6 col-lg-3 mb-4">
    <div class="card card--project h-100">
      <img class="card-img-top" src="${project.img}" alt="${project.title}" height="180">
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
