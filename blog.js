// Blog: el contenido se escribe y se publica en CentralWeb (Blog de la empresa CM7CHAEL).
// Este archivo lo pide desde el navegador, asi que un articulo publicado alla aparece aca al
// instante, sin compilar ni subir nada al repo.
//
// Pinta tres cosas, segun lo que haya en la pagina:
//   #blog-grid     → los 3 ultimos en la portada (la seccion #blog se muestra solo si hay)
//   #blog-lista    → todos, en blog/index.html
//   #articulo      → uno, en blog/articulo.html?p=<slug>

(function () {
  var API = 'https://centralweb.studioxperto.com/api/public/blog/'
  var ORG = '6abc25f782f610ad9bd58921' // empresa CM7CHAEL en CentralWeb
  // Raiz del sitio (/portafolio/), sacada de donde se cargo este mismo archivo.
  var RAIZ = ((document.currentScript && document.currentScript.src) || '/').replace(/blog\.js.*$/, '')

  function pedir (ruta, params) {
    var q = new URLSearchParams(Object.assign({ organization: ORG }, params || {}))
    return fetch(API + ruta + '?' + q.toString(), { headers: { Accept: 'application/json' } })
      .then(function (r) {
        if (!r.ok) { var e = new Error('HTTP ' + r.status); e.status = r.status; throw e }
        return r.json()
      })
      .then(function (j) { return j.data })
  }

  function esc (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    })
  }
  function texto (html) { return String(html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() }
  function fecha (p) {
    return new Date(p.publishedAt || p.createdAt).toLocaleDateString('es-PE',
      { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Lima' })
  }
  function minutos (p) { return Math.max(1, Math.round(texto(p.content).split(' ').length / 220)) }
  function resumen (p) {
    var t = (p.seo && p.seo.metaDescription) || p.excerpt || texto(p.content)
    return t.length > 170 ? t.slice(0, 167) + '…' : t
  }
  function portada (p) {
    return (p.featuredImage && p.featuredImage.url) || (p.gallery && p.gallery[0] && p.gallery[0].url) || ''
  }
  function enlace (p) { return RAIZ + 'blog/articulo.html?p=' + encodeURIComponent(p.slug) }

  // ------------------------------------------------------------ portada: los 3 ultimos
  var grid = document.getElementById('blog-grid')
  if (grid) {
    pedir('posts', { limit: 3, skip: 0 }).then(function (posts) {
      if (!posts || !posts.length) return
      grid.innerHTML = posts.map(function (p) {
        return '<div class="col-12 col-md-6 col-lg-4 mb-4">' +
          '<a class="card card--project h-100 d-block post-card" href="' + enlace(p) + '"><div class="card-body">' +
          '<p class="post-card__fecha">' + esc(fecha(p)) + '</p>' +
          '<h3 class="h5">' + esc(p.title) + '</h3>' +
          '<p class="card-text">' + esc(resumen(p)) + '</p>' +
          '</div></a></div>'
      }).join('')
      document.getElementById('blog').hidden = false
    }).catch(function () { /* sin blog la portada sigue igual */ })
  }

  // ------------------------------------------------------------ lista completa
  var lista = document.getElementById('blog-lista')
  if (lista) {
    pedir('posts', { limit: 50, skip: 0 }).then(function (posts) {
      if (!posts || !posts.length) {
        lista.innerHTML = '<li class="text-muted">Pronto el primer artículo.</li>'
        return
      }
      lista.innerHTML = posts.map(function (p) {
        return '<li><a href="' + enlace(p) + '">' +
          '<p class="post-card__fecha">' + esc(fecha(p)) + ' · ' + minutos(p) + ' min</p>' +
          '<h2 class="h4">' + esc(p.title) + '</h2>' +
          '<p>' + esc(resumen(p)) + '</p></a></li>'
      }).join('')
    }).catch(function () {
      lista.innerHTML = '<li class="text-muted">No se pudo cargar el blog. Intenta de nuevo en un momento.</li>'
    })
  }

  // ------------------------------------------------------------ un articulo
  var art = document.getElementById('articulo')
  if (art) {
    var slug = new URLSearchParams(location.search).get('p')
    var cuerpo = document.getElementById('articulo-cuerpo')
    if (!slug) { location.replace(RAIZ + 'blog/'); return }

    pedir('post/slug/' + encodeURIComponent(slug)).then(function (p) {
      var titulo = (p.seo && p.seo.metaTitle) || p.title
      document.title = titulo + ' | Michael Cervera'
      var meta = document.querySelector('meta[name="description"]')
      if (meta) meta.setAttribute('content', resumen(p))
      var canon = document.querySelector('link[rel="canonical"]')
      if (canon) canon.setAttribute('href', 'https://cm7chael.github.io/portafolio/blog/articulo.html?p=' + encodeURIComponent(p.slug))

      document.getElementById('articulo-titulo').textContent = p.title
      document.getElementById('articulo-fecha').textContent = fecha(p) + ' · ' + minutos(p) + ' min de lectura'
      var img = portada(p)
      if (img) {
        var el = document.getElementById('articulo-portada')
        el.src = img
        el.hidden = false
      }
      // El HTML lo escribe CM7CHAEL en el editor de CentralWeb.
      cuerpo.innerHTML = p.content || ''

      // Llegar al final cuenta como leyo_articulo (medicion.js).
      var cierre = document.getElementById('articulo-cierre')
      cierre.dataset.medir = p.slug
      cierre.hidden = false
      if (window.medirObservar) window.medirObservar(cierre)

      // Suma la lectura al contador del articulo en CentralWeb, como en studioxperto.com.
      // text/plain + no-cors: peticion simple, sin preflight. En local no cuenta.
      if (!/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) {
        try {
          fetch(API + 'post/' + p._id + '/view',
            { method: 'POST', mode: 'no-cors', keepalive: true, body: '{}', headers: { 'Content-Type': 'text/plain' } })
        } catch (e) { /* nunca rompe la pagina */ }
      }
    }).catch(function (e) {
      document.getElementById('articulo-titulo').textContent =
        e.status === 404 ? 'No encontré ese artículo' : 'No se pudo cargar el artículo'
      cuerpo.innerHTML = '<p><a href="' + RAIZ + 'blog/">Ver todos los artículos</a></p>'
    })
  }
})()
