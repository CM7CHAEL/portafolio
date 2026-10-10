// Los artículos se escriben en CentralWeb (empresa CM7CHAEL) y se leen desde aquí en el
// navegador. Publicar uno no requiere tocar el repo.
//
//   #blog-grid   → los 3 últimos en la portada (la sección #blog solo aparece si hay)
//   #blog-lista  → todos, en blog/index.html, agrupados por categoría (?c=<slug> filtra una)
//   #articulo    → uno, en blog/articulo.html?p=<slug>, con su categoría y los relacionados
//
// Los artículos que ya tienen página propia (blog/<slug>.html, la genera generar-blog.js) se
// enlazan a esa página: es la que se ve bien al compartirla. La lista llega en blog/estaticos.js.

(function () {
  var API = 'https://centralweb.studioxperto.com/api/public/blog/'
  var ORG = '6abc25f782f610ad9bd58921' // empresa CM7CHAEL en CentralWeb
  // Raíz del sitio (/portafolio/), según desde dónde se cargó este archivo.
  var RAIZ = ((document.currentScript && document.currentScript.src) || '/').replace(/blog\.js.*$/, '')
  var ESTATICOS = window.ARTICULOS_ESTATICOS || []

  function pedir (ruta, params) {
    var q = new URLSearchParams(Object.assign({ organization: ORG }, params || {}))
    return fetch(API + ruta + '?' + q.toString(), { headers: { Accept: 'application/json' } })
      .then(function (r) {
        if (!r.ok) { var e = new Error('HTTP ' + r.status); e.status = r.status; throw e }
        return r.json()
      })
      .then(function (j) { return j.data })
  }

  // Las tarjetas, la agrupación y los textos vienen de blog/comun.js, que también usa generar-blog.js.
  var C = window.BlogComun
  var CTX = { raiz: RAIZ, estaticos: ESTATICOS, miniaturas: window.ARTICULOS_MINIATURAS || {} }
  var SIN_CATEGORIA = C.SIN_CATEGORIA
  var esc = C.esc
  var fecha = C.fecha
  var minutos = C.minutos
  var resumen = C.resumen
  var portada = C.portada
  var categoria = C.categoria
  function tienePagina (slug) { return C.tienePagina(slug, CTX) }
  function enlaceCategoria (c) { return C.enlaceCategoria(c, CTX) }
  function columna (p, primera) { return C.columna(p, primera, CTX) }

  // ------------------------------------------------------------ portada: los 3 últimos
  var grid = document.getElementById('blog-grid')
  if (grid) {
    pedir('posts', { limit: 3, skip: 0 }).then(function (posts) {
      if (!posts || !posts.length) return
      grid.innerHTML = posts.map(function (p, i) { return columna(p, i === 0) }).join('')
      document.getElementById('blog').hidden = false
    }).catch(function () { /* si falla, la portada queda sin la sección */ })
  }

  // ------------------------------------------------------------ lista por categorías
  // generar-blog.js deja la lista ya escrita (data-slugs dice cuáles trae). Si la API devuelve los
  // mismos artículos, no se vuelve a pintar: solo se activan los botones de categoría.
  var lista = document.getElementById('blog-lista')
  if (lista) {
    var filtros = document.getElementById('blog-categorias')
    var prearmada = lista.getAttribute('data-slugs')
    pedir('posts', { limit: 100, skip: 0 }).then(function (posts) {
      if (!posts || !posts.length) {
        filtros.hidden = true
        lista.innerHTML = '<p class="text-muted">Pronto el primer artículo.</p>'
        return
      }
      var grupos = C.agrupar(posts)
      var elegida = new URLSearchParams(location.search).get('c')
      if (!grupos.some(function (g) { return g.slug === elegida })) elegida = null

      function pintar () {
        filtros.innerHTML = C.chips(posts, grupos, elegida)
        lista.innerHTML = C.lista(grupos, elegida, CTX)
      }

      filtros.addEventListener('click', function (e) {
        var b = e.target.closest && e.target.closest('.blog-chip')
        if (!b) return
        elegida = b.getAttribute('data-c') || null
        history.replaceState(null, '', elegida ? '?c=' + encodeURIComponent(elegida) : location.pathname)
        pintar()
      })
      filtros.hidden = false
      var iguales = prearmada === posts.map(function (p) { return p.slug }).join(',')
      if (!iguales || elegida) pintar()
    }).catch(function () {
      if (prearmada) return // la lista escrita sigue sirviendo; solo no se puede filtrar
      lista.innerHTML = '<p class="text-muted">No se pudo cargar el blog. Intenta de nuevo en un momento.</p>'
    })
  }

  // ------------------------------------------------------------ un artículo
  var art = document.getElementById('articulo')
  if (art) {
    // En una página propia el slug viene en el HTML y el texto ya está cargado.
    var prearmado = art.getAttribute('data-slug')
    var slug = prearmado || new URLSearchParams(location.search).get('p')
    var cuerpo = document.getElementById('articulo-cuerpo')
    if (!slug) { location.replace(RAIZ + 'blog/'); return }
    // La dirección vieja (articulo.html?p=) lleva a la página propia si ya existe, sin perder ?ref=.
    if (!prearmado && tienePagina(slug)) {
      var resto = new URLSearchParams(location.search)
      resto.delete('p')
      var q = resto.toString()
      location.replace(RAIZ + 'blog/' + slug + '.html' + (q ? '?' + q : '') + location.hash)
      return
    }

    pedir('post/slug/' + encodeURIComponent(slug)).then(function (p) {
      var titulo = (p.seo && p.seo.metaTitle) || p.title
      document.title = titulo + ' | Michael Cervera'
      var meta = document.querySelector('meta[name="description"]')
      if (meta) meta.setAttribute('content', resumen(p))
      var canon = document.querySelector('link[rel="canonical"]')
      if (canon) canon.setAttribute('href', 'https://cm7chael.github.io/portafolio/blog/' +
        (tienePagina(p.slug) ? p.slug + '.html' : 'articulo.html?p=' + encodeURIComponent(p.slug)))

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
      if (prearmado) return // la página propia ya trae el artículo; solo faltan los relacionados
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
      document.getElementById('relacionados-grid').innerHTML = r.posts.slice(0, 3).map(function (p) { return columna(p, false) }).join('')
      caja.hidden = false
    }).catch(function () { /* sin relacionados el artículo se lee igual */ })
  }
})()
