// Medicion de cm7chael.github.io, con el mismo patron que los clientes de StudioXperto
// (studio/web/plugins/analytics-consent.js y pageview-tracker.js):
//
//   1. Google Analytics 4 con Consent Mode v2. La analitica arranca CONCEDIDA y el aviso es
//      de rechazo. No es descuido: con analytics_storage en 'denied' GA4 solo guarda el hit
//      para su modelado, que exige miles de eventos al dia. Con pocas visitas no aparece en
//      ningun informe; asi estuvo muerta la medicion de studioxperto.com en julio y agosto
//      de 2026. La publicidad (ad_*) queda DENEGADA siempre: aca no hay remarketing.
//   2. El contador propio de CentralWeb (sin cookies), el mismo que mide a los demas
//      clientes. Manda cada vista con `engaged`, que separa a una persona de los escaneres
//      de correo que abren la pagina y se van en un segundo.
//
// Eventos (en los dos lados):
//   clic_cv · contacto (method: correo|telefono|whatsapp) · clic_salida (link_domain)
//   seccion_vista (section) · leyo_articulo (article) — ver data-medir en el blog.
// GA4 ya mide solo el scroll al 90 % y los clics de salida (medicion mejorada).
//
// En local no se mide nada, salvo que se pida con ?sx_track=1 para probar.

(function () {
  var GA_ID = 'G-P3ZB5WSK8D' // propiedad "cm7chael" en la cuenta GA4 de StudioXperto (a334398199), flujo 15872315347
  var COMPANY_ID = '6abc25f782f610ad9bd58921' // empresa CM7CHAEL en CentralWeb (Configuracion > Empresas)
  var CRM = 'https://centralweb.studioxperto.com/api/'
  var CONSENT_KEY = 'cm7chael-cookie-consent'
  var ESPERA_MS = 3000
  // Raiz del sitio (/portafolio/), sacada de donde se cargo este mismo archivo.
  var RAIZ = ((document.currentScript && document.currentScript.src) || '/').replace(/medicion\.js.*$/, '')

  // file:// tambien es local: es como se abre cv.html para generar el PDF.
  var esLocal = location.protocol === 'file:' || /^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/i.test(location.hostname)
  if (esLocal && location.search.indexOf('sx_track=1') === -1) return

  var guardado = null
  try { guardado = localStorage.getItem(CONSENT_KEY) } catch (e) { guardado = null }

  // ---------------------------------------------------------------- GA4
  var DENEGADO = { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied' }
  var POR_DEFECTO = { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted' }

  window.dataLayer = window.dataLayer || []
  function gtag () { window.dataLayer.push(arguments) }
  window.gtag = gtag

  if (GA_ID) {
    // El 'consent default' tiene que ir ANTES de que llegue gtag.js.
    gtag('consent', 'default', guardado === 'rejected' ? DENEGADO : POR_DEFECTO)
    gtag('set', 'ads_data_redaction', true)
    gtag('set', 'url_passthrough', true)
    gtag('js', new Date())
    gtag('config', GA_ID) // sitio estatico: cada carga es una vista, no hace falta page_view a mano
    var s = document.createElement('script')
    s.async = true
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID
    document.head.appendChild(s)
  }

  // ---------------------------------------------------------------- CentralWeb
  function contexto () {
    var p = new URLSearchParams(location.search)
    return {
      companyId: COMPANY_ID,
      path: location.pathname,
      title: document.title,
      fullUrl: location.href,
      domain: location.hostname,
      referrer: document.referrer,
      source: p.get('utm_source') || p.get('ref') || null,
      medium: p.get('utm_medium') || null,
      campaign: p.get('utm_campaign') || null,
      screen: window.screen ? screen.width + 'x' + screen.height : null,
      language: navigator.language || null,
      userAgent: navigator.userAgent
    }
  }

  function alContador (ruta, datos) {
    if (!COMPANY_ID) return
    var url = CRM + ruta
    var cuerpo = JSON.stringify(datos)
    try { if (navigator.sendBeacon && navigator.sendBeacon(url, cuerpo)) return } catch (e) { /* sigue fetch */ }
    try { fetch(url, { method: 'POST', body: cuerpo, keepalive: true, mode: 'no-cors' }) } catch (e) { /* nunca rompe la pagina */ }
  }

  // Una vista por carga: se manda con la primera interaccion, a los 3 s, o al irse.
  var inicio = Date.now()
  var enviada = false
  var interacciones = ['scroll', 'pointerdown', 'keydown', 'touchstart', 'wheel']
  function despachar (conInteraccion) {
    if (enviada) return
    enviada = true
    clearTimeout(temporizador)
    interacciones.forEach(function (n) { window.removeEventListener(n, alInteractuar, true) })
    var d = contexto()
    d.engaged = Boolean(conInteraccion)
    d.dwellMs = Date.now() - inicio
    alContador('public/analytics/pageview', d)
  }
  function alInteractuar () { despachar(true) }
  interacciones.forEach(function (n) {
    window.addEventListener(n, alInteractuar, { capture: true, once: true, passive: true })
  })
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') despachar(false)
  })
  window.addEventListener('pagehide', function () { despachar(false) })
  var temporizador = setTimeout(function () { despachar(false) }, ESPERA_MS)

  // ---------------------------------------------------------------- Eventos
  function evento (nombre, datos) {
    datos = datos || {}
    try { if (GA_ID) gtag('event', nombre, datos) } catch (e) { /* silencio */ }
    var d = contexto()
    d.eventName = nombre
    d.eventData = datos
    alContador('public/analytics/event', d)
  }
  window.medir = evento

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]')
    if (!a) return
    var href = a.getAttribute('href') || ''
    if (a.classList.contains('cv-link')) return evento('clic_cv')
    if (href.indexOf('mailto:') === 0) return evento('contacto', { method: 'correo' })
    if (href.indexOf('tel:') === 0) return evento('contacto', { method: 'telefono' })
    if (href.indexOf('wa.me') !== -1) return evento('contacto', { method: 'whatsapp' })
    try {
      var host = new URL(href, location.href).hostname.replace(/^www\./, '')
      if (host && host !== location.hostname) evento('clic_salida', { link_domain: host })
    } catch (err) { /* enlace raro, no se mide */ }
  })

  // Hasta donde leyo: secciones de la portada y el final de cada articulo.
  var vistos = {}
  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (en) {
      if (!en.isIntersecting) return
      var el = en.target
      var clave = el.dataset.medir || el.id
      if (!clave || vistos[clave]) return
      vistos[clave] = true
      if (el.dataset.medir) evento('leyo_articulo', { article: el.dataset.medir })
      else evento('seccion_vista', { section: el.id })
    })
  }, { threshold: 0.4 })
  document.querySelectorAll('section[id], [data-medir]').forEach(function (el) { observador.observe(el) })
  // Para lo que se pinta despues (el articulo llega de CentralWeb): blog.js lo registra aca.
  window.medirObservar = function (el) { observador.observe(el) }

  // ---------------------------------------------------------------- Aviso de cookies
  // Aviso de rechazo, como en studioxperto.com. Sale una vez; la decision se recuerda.
  if (GA_ID && !guardado) {
    var aviso = document.createElement('div')
    aviso.className = 'aviso-cookies'
    aviso.setAttribute('role', 'region')
    aviso.setAttribute('aria-label', 'Aviso de cookies')
    aviso.innerHTML = '<p>Uso Google Analytics para saber qué artículos se leen. Sin publicidad ni remarketing. ' +
      '<a href="' + RAIZ + 'privacidad.html">Más detalle</a></p>' +
      '<div><button type="button" class="btn btn-sm btn-outline-secondary" data-r="rejected">Rechazar</button>' +
      '<button type="button" class="btn btn-sm btn-primary ml-2" data-r="accepted">Entendido</button></div>'
    aviso.addEventListener('click', function (e) {
      var r = e.target.getAttribute && e.target.getAttribute('data-r')
      if (!r) return
      try { localStorage.setItem(CONSENT_KEY, r) } catch (err) { /* sin storage se vuelve a preguntar */ }
      if (r === 'rejected') gtag('consent', 'update', DENEGADO)
      aviso.remove()
    })
    document.body.appendChild(aviso)
  }
})()
