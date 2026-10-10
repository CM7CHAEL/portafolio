// Lo que comparten blog.js (en el navegador) y generar-blog.js (en Node): cómo se arma una tarjeta
// y cómo se agrupan los artículos por categoría. Así la lista que deja escrita generar-blog.js en
// blog/index.html y la que pinta el navegador salen idénticas, y la página no salta al cargar.
//
// ctx = { raiz, estaticos, miniaturas }
//   raiz        la raíz del sitio, termina en / (https://cm7chael.github.io/portafolio/)
//   estaticos   slugs que ya tienen página propia en blog/<slug>.html
//   miniaturas  { slug: url } con la portada achicada para las tarjetas

(function (global) {
  var SIN_CATEGORIA = { slug: 'otros', name: 'Otros temas' }

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
  function tienePagina (slug, ctx) { return (ctx.estaticos || []).indexOf(slug) !== -1 }
  function enlace (p, ctx) {
    return tienePagina(p.slug, ctx) ? ctx.raiz + 'blog/' + p.slug + '.html' : ctx.raiz + 'blog/articulo.html?p=' + encodeURIComponent(p.slug)
  }
  function enlaceCategoria (c, ctx) { return ctx.raiz + 'blog/?c=' + encodeURIComponent(c.slug) }

  // Tarjeta de un artículo. Sin foto de portada, muestra un fondo con el nombre de la categoría.
  // La primera de cada lista no espera al lazy loading: suele ser lo más grande en pantalla.
  function tarjeta (p, primera, ctx) {
    var img = (ctx.miniaturas && ctx.miniaturas[p.slug]) || portada(p)
    var cat = categoria(p)
    var cabecera = img
      ? '<img class="blog-card__img" src="' + esc(img) + '" alt="" width="1200" height="627"' + (primera ? ' fetchpriority="high"' : ' loading="lazy"') + '>'
      : '<div class="blog-card__img blog-card__img--vacia"><span>' + esc(cat.name) + '</span></div>'
    var tags = (p.tags || []).slice(0, 3).map(function (t) { return '<span class="stack__item">' + esc(t) + '</span>' }).join('')
    return '<a class="blog-card" href="' + enlace(p, ctx) + '">' + cabecera +
      '<div class="blog-card__cuerpo">' +
      '<p class="blog-card__meta">' + esc(cat.name) + ' · ' + esc(fecha(p)) + ' · ' + minutos(p) + ' min</p>' +
      '<h3>' + esc(p.title) + '</h3>' +
      '<p class="blog-card__resumen">' + esc(resumen(p)) + '</p>' +
      (tags ? '<div class="stack">' + tags + '</div>' : '') +
      '</div></a>'
  }
  function columna (p, primera, ctx) { return '<div class="col-12 col-md-6 col-lg-4 mb-4">' + tarjeta(p, primera, ctx) + '</div>' }

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

  // Los botones de categoría y la lista agrupada de blog/index.html. elegida = slug o null.
  function chips (posts, grupos, elegida) {
    return '<button type="button" class="blog-chip' + (elegida ? '' : ' activo') + '" data-c="">Todos <span>' + posts.length + '</span></button>' +
      grupos.map(function (g) {
        return '<button type="button" class="blog-chip' + (g.slug === elegida ? ' activo' : '') + '" data-c="' + esc(g.slug) + '">' +
          esc(g.name) + ' <span>' + g.posts.length + '</span></button>'
      }).join('')
  }
  function lista (grupos, elegida, ctx) {
    return grupos.filter(function (g) { return !elegida || g.slug === elegida }).map(function (g, i) {
      return '<section class="blog-grupo" id="cat-' + esc(g.slug) + '">' +
        '<div class="blog-grupo__cabecera"><h2>' + esc(g.name) + '</h2>' +
        '<span>' + g.posts.length + (g.posts.length === 1 ? ' artículo' : ' artículos') + '</span></div>' +
        '<div class="row">' + g.posts.map(function (p, j) { return columna(p, i === 0 && j === 0, ctx) }).join('') + '</div></section>'
    }).join('')
  }

  var api = {
    SIN_CATEGORIA: SIN_CATEGORIA, esc: esc, texto: texto, fecha: fecha, minutos: minutos, resumen: resumen,
    portada: portada, categoria: categoria, tienePagina: tienePagina, enlace: enlace, enlaceCategoria: enlaceCategoria,
    tarjeta: tarjeta, columna: columna, agrupar: agrupar, chips: chips, lista: lista
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = api
  else global.BlogComun = api
})(this)
