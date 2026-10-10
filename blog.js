// Los artículos se escriben en CentralWeb (empresa CM7CHAEL) y se leen desde aquí en el
// navegador. Publicar uno no requiere tocar el repo.
//
//   #blog-grid   → los 3 últimos en la portada (la sección #blog solo aparece si hay)
//   #blog-lista  → todos, en blog/index.html, agrupados por categoría (?c=<slug> filtra una)
//   #articulo    → uno, en blog/articulo.html?p=<slug>, con su categoría y los relacionados

(function () {
  var API = 'https://centralweb.studioxperto.com/api/public/blog/'
  var ORG = '6abc25f782f610ad9bd58921' // empresa CM7CHAEL en CentralWeb
  // Raíz del sitio (/portafolio/), según desde dónde se cargó este archivo.
  var RAIZ = ((document.currentScript && document.currentScript.src) || '/').replace(/blog\.js.*$/, '')
  var SIN_CATEGORIA = { slug: 'otros', name: 'Otros temas' }

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
  function categoria (p) { return (p.category && p.category.slug) ? p.category : SIN_CATEGORIA }
  function enlace (p) { return RAIZ + 'blog/articulo.html?p=' + encodeURIComponent(p.slug) }
  function enlaceCategoria (c) { return RAIZ + 'blog/?c=' + encodeURIComponent(c.slug) }

  // Tarjeta de un artículo. Sin foto de portada, muestra un fondo con el nombre de la categoría.
  function tarjeta (p) {
    var img = portada(p)
    var cat = categoria(p)
    var cabecera = img
      ? '<img class="blog-card__img" src="' + esc(img) + '" alt="" loading="lazy">'
      : '<div class="blog-card__img blog-card__img--vacia"><span>' + esc(cat.name) + '</span></div>'
    var tags = (p.tags || []).slice(0, 3).map(function (t) { return '<span class="stack__item">' + esc(t) + '</span>' }).join('')
    return '<a class="blog-card" href="' + enlace(p) + '">' + cabecera +
      '<div class="blog-card__cuerpo">' +
      '<p class="blog-card__meta">' + esc(cat.name) + ' · ' + esc(fecha(p)) + ' · ' + minutos(p) + ' min</p>' +
      '<h3>' + esc(p.title) + '</h3>' +
      '<p class="blog-card__resumen">' + esc(resumen(p)) + '</p>' +
      (tags ? '<div class="stack">' + tags + '</div>' : '') +
      '</div></a>'
  }
  function columna (p) { return '<div class="col-12 col-md-6 col-lg-4 mb-4">' + tarjeta(p) + '</div>' }

  // Agrupa por categoría. Los artículos llegan del más nuevo al más viejo, así que las
  // categorías quedan ordenadas por su último artículo. "Otros temas" siempre al final.
  function agrupar (posts) {
    var grupos = {}
    var orden = []
    posts.forEach(function (p) {
      var c = categoria(p)
      if (!grupos[c.slug]) { grupos[c.slug] = { slug: c.slug, name: c.name, posts: [] }; orden.push(c.slug) }
      grupos[c.slug].posts.push(p)
    })
    orden.sort(function (a, b) { return (a === SIN_CATEGORIA.slug) - (b === SIN_CATEGORIA.slug) })
    return orden.map(function (s) { return grupos[s] })
  }

  // ------------------------------------------------------------ portada: los 3 últimos
  var grid = document.getElementById('blog-grid')
  if (grid) {
    pedir('posts', { limit: 3, skip: 0 }).then(function (posts) {
      if (!posts || !posts.length) return
      grid.innerHTML = posts.map(columna).join('')
      document.getElementById('blog').hidden = false
    }).catch(function () { /* si falla, la portada queda sin la sección */ })
  }

  // ------------------------------------------------------------ lista por categorías
  var lista = document.getElementById('blog-lista')
  if (lista) {
    var filtros = document.getElementById('blog-categorias')
    pedir('posts', { limit: 100, skip: 0 }).then(function (posts) {
      if (!posts || !posts.length) {
        lista.innerHTML = '<p class="text-muted">Pronto el primer artículo.</p>'
        return
      }
      var grupos = agrupar(posts)
      var elegida = new URLSearchParams(location.search).get('c')
      if (!grupos.some(function (g) { return g.slug === elegida })) elegida = null

      function pintar () {
        filtros.innerHTML = '<button type="button" class="blog-chip' + (elegida ? '' : ' activo') + '" data-c="">Todos <span>' + posts.length + '</span></button>' +
          grupos.map(function (g) {
            return '<button type="button" class="blog-chip' + (g.slug === elegida ? ' activo' : '') + '" data-c="' + esc(g.slug) + '">' +
              esc(g.name) + ' <span>' + g.posts.length + '</span></button>'
          }).join('')
        lista.innerHTML = grupos.filter(function (g) { return !elegida || g.slug === elegida }).map(function (g) {
          return '<section class="blog-grupo" id="cat-' + esc(g.slug) + '">' +
            '<div class="blog-grupo__cabecera"><h2>' + esc(g.name) + '</h2>' +
            '<span>' + g.posts.length + (g.posts.length === 1 ? ' artículo' : ' artículos') + '</span></div>' +
            '<div class="row">' + g.posts.map(columna).join('') + '</div></section>'
        }).join('')
      }

      filtros.addEventListener('click', function (e) {
        var b = e.target.closest && e.target.closest('.blog-chip')
        if (!b) return
        elegida = b.getAttribute('data-c') || null
        history.replaceState(null, '', elegida ? '?c=' + encodeURIComponent(elegida) : location.pathname)
        pintar()
      })
      filtros.hidden = false
      pintar()
    }).catch(function () {
      lista.innerHTML = '<p class="text-muted">No se pudo cargar el blog. Intenta de nuevo en un momento.</p>'
    })
  }

  // ------------------------------------------------------------ un artículo
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

      var cat = categoria(p)
      var chip = document.getElementById('articulo-categoria')
      if (chip && cat !== SIN_CATEGORIA) {
        chip.textContent = cat.name
        chip.href = enlaceCategoria(cat)
        chip.hidden = false
      }
      document.getElementById('articulo-titulo').textContent = p.title
      document.getElementById('articulo-fecha').textContent = fecha(p) + ' · ' + minutos(p) + ' min de lectura'
      var img = portada(p)
      if (img) {
        var el = document.getElementById('articulo-portada')
        el.src = img
        el.hidden = false
      }
      // El HTML viene del editor de CentralWeb.
      cuerpo.innerHTML = p.content || ''

      var tags = document.getElementById('articulo-tags')
      if (tags && p.tags && p.tags.length) {
        tags.innerHTML = p.tags.map(function (t) { return '<span class="stack__item">' + esc(t) + '</span>' }).join('')
        tags.hidden = false
      }

      // Llegar al final cuenta como leyo_articulo (medicion.js).
      var cierre = document.getElementById('articulo-cierre')
      cierre.dataset.medir = p.slug
      cierre.hidden = false
      if (window.medirObservar) window.medirObservar(cierre)

      relacionados(p, cat)

      // Suma la lectura al contador del artículo en CentralWeb. text/plain + no-cors para
      // que sea una petición simple, sin preflight. En local no se cuenta.
      if (!/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) {
        try {
          fetch(API + 'post/' + p._id + '/view',
            { method: 'POST', mode: 'no-cors', keepalive: true, body: '{}', headers: { 'Content-Type': 'text/plain' } })
        } catch (e) { /* no debe romper la página */ }
      }
    }).catch(function (e) {
      document.getElementById('articulo-titulo').textContent =
        e.status === 404 ? 'No encontré ese artículo' : 'No se pudo cargar el artículo'
      cuerpo.innerHTML = '<p><a href="' + RAIZ + 'blog/">Ver todos los artículos</a></p>'
    })
  }

  // Hasta 3 artículos de la misma categoría; si no hay, los más recientes.
  function relacionados (actual, cat) {
    var caja = document.getElementById('articulo-relacionados')
    if (!caja) return
    var params = { limit: 4, skip: 0 }
    if (actual.category && actual.category._id) params.category = actual.category._id
    pedir('posts', params).then(function (posts) {
      var otros = (posts || []).filter(function (p) { return p._id !== actual._id })
      if (otros.length) return { titulo: 'Más de ' + cat.name, posts: otros }
      return pedir('posts', { limit: 4, skip: 0 }).then(function (todos) {
        return { titulo: 'Más artículos', posts: (todos || []).filter(function (p) { return p._id !== actual._id }) }
      })
    }).then(function (r) {
      if (!r || !r.posts.length) return
      document.getElementById('relacionados-titulo').textContent = r.titulo
      document.getElementById('relacionados-grid').innerHTML = r.posts.slice(0, 3).map(columna).join('')
      caja.hidden = false
    }).catch(function () { /* sin relacionados el artículo se lee igual */ })
  }
})()
