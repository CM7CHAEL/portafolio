// Genera una página estática por cada artículo publicado en CentralWeb (blog/<slug>.html).
//   node generar-blog.js
// Después: subir blog/ y sitemap.xml a master.
//
// El blog funciona sin esto: blog/articulo.html?p=<slug> lee el artículo en el navegador. Pero
// LinkedIn, WhatsApp y Google no ejecutan JavaScript al leer un enlace, así que esa página
// siempre se ve con el título genérico. La página estática ya trae el título, la descripción,
// la portada y el texto en el HTML. Conviene correrlo cada vez que se publica un artículo.
//
// También escribe blog/estaticos.js (los slugs que ya tienen página, para que blog.js enlace a
// ellas), regenera sitemap.xml y feed.xml. El feed lleva el artículo completo: dev.to lo lee
// para importar cada artículo con el enlace original apuntando a este sitio.

const fs = require('fs')
const path = require('path')

const API = 'https://centralweb.studioxperto.com/api/public/blog/'
const ORG = '6abc25f782f610ad9bd58921' // empresa CM7CHAEL en CentralWeb
const SITIO = 'https://cm7chael.github.io/portafolio/'
const RAIZ = __dirname
const BLOG = path.join(RAIZ, 'blog')

// La API pública pide un origen conocido, igual que si la llamara el navegador desde el sitio.
const CABECERAS = { Accept: 'application/json', Origin: 'https://cm7chael.github.io', 'User-Agent': 'Mozilla/5.0 (generar-blog)' }

function esc (s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
}
function texto (html) { return String(html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() }
function fecha (p) {
  return new Date(p.publishedAt || p.createdAt).toLocaleDateString('es-PE',
    { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Lima' })
}
function minutos (p) { return Math.max(1, Math.round(texto(p.content).split(' ').length / 220)) }
function resumen (p) {
  const t = (p.seo && p.seo.metaDescription) || p.excerpt || texto(p.content)
  return t.length > 170 ? t.slice(0, 167) + '…' : t
}
function portada (p) {
  return (p.seo && p.seo.ogImage) || (p.featuredImage && p.featuredImage.url) || (p.gallery && p.gallery[0] && p.gallery[0].url) || ''
}

async function pedir (ruta, params) {
  const q = new URLSearchParams(Object.assign({ organization: ORG }, params || {}))
  const r = await fetch(API + ruta + '?' + q, { headers: CABECERAS })
  if (!r.ok) throw new Error(`${ruta}: HTTP ${r.status} ${await r.text()}`)
  return (await r.json()).data
}

// Reemplaza un pedazo exacto de la plantilla; si no está, la plantilla cambió y hay que avisar.
function cambiar (html, viejo, nuevo) {
  if (!html.includes(viejo)) throw new Error('La plantilla blog/articulo.html cambió, no encontré: ' + viejo.slice(0, 80))
  return html.replace(viejo, () => nuevo)
}

function pagina (plantilla, p) {
  const url = SITIO + 'blog/' + p.slug + '.html'
  const titulo = (p.seo && p.seo.metaTitle) || p.title
  const desc = resumen(p)
  const img = portada(p) || SITIO + 'assets/image/yo.jpg'
  const cat = p.category && p.category.slug ? p.category : null
  const datos = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: p.title,
    description: desc,
    image: img,
    datePublished: p.publishedAt,
    dateModified: p.updatedAt || p.publishedAt,
    author: { '@type': 'Person', name: 'Michael Cervera Cobeñas', url: SITIO },
    mainEntityOfPage: url,
    keywords: (p.tags || []).join(', ')
  }

  let h = plantilla
  h = cambiar(h, '<title>Blog | Michael Cervera Cobeñas</title>', `<title>${esc(titulo)} | Michael Cervera</title>`)
  h = cambiar(h, '<meta name="description" content="Artículo del blog de Michael Cervera, Lead Full Stack Developer en Lima.">', `<meta name="description" content="${esc(desc)}">`)
  h = cambiar(h, '<link rel="canonical" href="https://cm7chael.github.io/portafolio/blog/articulo.html">', `<link rel="canonical" href="${url}">`)
  h = cambiar(h, '<meta property="og:title" content="Blog | Michael Cervera Cobeñas">', `<meta property="og:title" content="${esc(p.title)}">\n  <meta property="og:type" content="article">\n  <meta property="article:published_time" content="${esc(p.publishedAt)}">`)
  h = cambiar(h, '<meta property="og:description" content="Artículo del blog de Michael Cervera, Lead Full Stack Developer en Lima.">', `<meta property="og:description" content="${esc(desc)}">`)
  h = cambiar(h, '<meta property="og:image" content="https://cm7chael.github.io/portafolio/assets/image/yo.jpg">', `<meta property="og:image" content="${esc(img)}">`)
  h = cambiar(h, '<meta property="og:url" content="https://cm7chael.github.io/portafolio/blog/articulo.html">', `<meta property="og:url" content="${url}">`)
  h = cambiar(h, '<meta name="twitter:card" content="summary_large_image">', '<meta name="twitter:card" content="summary_large_image">\n  <script type="application/ld+json">' + JSON.stringify(datos).replace(/</g, '\\u003c') + '</script>')

  h = cambiar(h, '<article class="articulo" id="articulo">', `<article class="articulo" id="articulo" data-slug="${esc(p.slug)}">`)
  h = cambiar(h, '<a class="blog-chip blog-chip--chico" id="articulo-categoria" hidden></a>',
    cat ? `<a class="blog-chip blog-chip--chico" id="articulo-categoria" href="./?c=${esc(cat.slug)}">${esc(cat.name)}</a>` : '<a class="blog-chip blog-chip--chico" id="articulo-categoria" hidden></a>')
  h = cambiar(h, '<h1 id="articulo-titulo">Cargando…</h1>', `<h1 id="articulo-titulo">${esc(p.title)}</h1>`)
  h = cambiar(h, '<p class="post-card__fecha" id="articulo-fecha"></p>', `<p class="post-card__fecha" id="articulo-fecha">${esc(fecha(p))} · ${minutos(p)} min de lectura</p>`)
  h = cambiar(h, '<img class="articulo__portada" id="articulo-portada" alt="" hidden>',
    portada(p) ? `<img class="articulo__portada" id="articulo-portada" alt="" src="${esc(portada(p))}">` : '<img class="articulo__portada" id="articulo-portada" alt="" hidden>')
  h = cambiar(h, '<!-- El contenido llega de CentralWeb, lo pinta blog.js. -->', '<!-- Generado por generar-blog.js desde CentralWeb. No editar: se sobrescribe. -->')
  h = cambiar(h, '<div class="articulo__cuerpo" id="articulo-cuerpo"></div>', `<div class="articulo__cuerpo" id="articulo-cuerpo">\n${p.content || ''}\n      </div>`)
  if (p.tags && p.tags.length) {
    h = cambiar(h, '<div class="stack articulo__tags" id="articulo-tags" hidden></div>',
      `<div class="stack articulo__tags" id="articulo-tags">${p.tags.map(t => `<span class="stack__item">${esc(t)}</span>`).join('')}</div>`)
  }
  return h
}

// RSS 2.0 con el texto completo. Al final de cada artículo va de dónde salió, para quien lo lea
// en otra plataforma.
function feed (articulos) {
  const cdata = s => '<![CDATA[' + String(s).replace(/]]>/g, ']]]]><![CDATA[>') + ']]>'
  const items = articulos.map(p => {
    const url = SITIO + 'blog/' + p.slug + '.html'
    const img = portada(p)
    const cuerpo = (img ? `<p><img src="${esc(img)}" alt=""></p>\n` : '') + (p.content || '') +
      `\n<p><em>Publicado originalmente en <a href="${url}">mi blog</a>.</em></p>`
    return [
      '    <item>',
      `      <title>${esc(p.title)}</title>`,
      `      <link>${url}</link>`,
      `      <guid isPermaLink="true">${url}</guid>`,
      `      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>`,
      '      <dc:creator>Michael Cervera Cobeñas</dc:creator>',
      ...(p.tags || []).map(t => `      <category>${esc(t)}</category>`),
      `      <description>${esc(resumen(p))}</description>`,
      `      <content:encoded>${cdata(cuerpo)}</content:encoded>`,
      '    </item>'
    ].join('\n')
  })
  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">\n' +
    '  <channel>\n' +
    '    <title>Blog de Michael Cervera</title>\n' +
    `    <link>${SITIO}blog/</link>\n` +
    `    <atom:link href="${SITIO}feed.xml" rel="self" type="application/rss+xml"/>\n` +
    '    <description>Arquitectura, Cloud, IA aplicada y lo que voy aprendiendo construyendo plataformas empresariales.</description>\n' +
    '    <language>es</language>\n' +
    (articulos[0] ? `    <lastBuildDate>${new Date(articulos[0].publishedAt).toUTCString()}</lastBuildDate>\n` : '') +
    items.join('\n') + '\n' +
    '  </channel>\n</rss>\n'
}

;(async () => {
  const plantilla = fs.readFileSync(path.join(BLOG, 'articulo.html'), 'utf8')
  const posts = await pedir('posts', { limit: 100, skip: 0 })
  const slugs = []
  const completos = []

  for (const resumenPost of posts) {
    const p = await pedir('post/slug/' + encodeURIComponent(resumenPost.slug))
    completos.push(p)
    fs.writeFileSync(path.join(BLOG, p.slug + '.html'), pagina(plantilla, p))
    slugs.push({ slug: p.slug, fecha: (p.updatedAt || p.publishedAt || '').slice(0, 10) })
    console.log('página:', 'blog/' + p.slug + '.html')
  }

  // Páginas de artículos que ya no están publicados (despublicados o archivados).
  const vigentes = new Set(slugs.map(s => s.slug + '.html'))
  const fijas = new Set(['articulo.html', 'index.html'])
  for (const f of fs.readdirSync(BLOG)) {
    if (f.endsWith('.html') && !fijas.has(f) && !vigentes.has(f)) {
      fs.unlinkSync(path.join(BLOG, f))
      console.log('borrada:', 'blog/' + f)
    }
  }

  fs.writeFileSync(path.join(BLOG, 'estaticos.js'),
    '// Generado por generar-blog.js: artículos que ya tienen su página en blog/<slug>.html.\n' +
    'window.ARTICULOS_ESTATICOS = ' + JSON.stringify(slugs.map(s => s.slug)) + '\n')

  const fijasSitemap = ['', 'blog/', 'cv.html', 'apps-moviles.html']
  const urls = fijasSitemap.map(u => `  <url><loc>${SITIO}${u}</loc></url>`)
    .concat(slugs.map(s => `  <url><loc>${SITIO}blog/${s.slug}.html</loc>${s.fecha ? `<lastmod>${s.fecha}</lastmod>` : ''}</url>`))
  fs.writeFileSync(path.join(RAIZ, 'sitemap.xml'),
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls.join('\n') + '\n</urlset>\n')

  fs.writeFileSync(path.join(RAIZ, 'feed.xml'), feed(completos))

  console.log(`listo: ${slugs.length} artículo(s), estaticos.js, sitemap.xml y feed.xml`)
})().catch(e => { console.error('FALLA:', e.message); process.exit(1) })
