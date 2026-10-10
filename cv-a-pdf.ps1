# Genera cv.pdf a partir de cv.html con Edge en modo headless. El CV se edita solo en cv.html.
#   powershell -ExecutionPolicy Bypass -File cv-a-pdf.ps1
#     → cv.pdf, el público (sin teléfono). Después: revisarlo y subir cv.html y cv.pdf a master.
#   powershell -ExecutionPolicy Bypass -File cv-a-pdf.ps1 -Telefono "+51 999 999 999"
#     → "..\Michael Cervera Cobeñas - CV.pdf", con teléfono, para mandarlo directo a un reclutador.
#       Queda fuera del repo: el número no se publica.
#   Con -Idioma en, lo mismo pero desde cv-en.html: cv-en.pdf, o "..\Michael Cervera Cobeñas - CV (EN).pdf"
#   si además va -Telefono.
param([string]$Telefono = '', [ValidateSet('es', 'en')][string]$Idioma = 'es')
$ErrorActionPreference = 'Stop'
$base = Split-Path -Parent $MyInvocation.MyCommand.Path
$nombre = if ($Idioma -eq 'en') { 'cv-en' } else { 'cv' }
$html = Join-Path $base "$nombre.html"
$pdf  = Join-Path $base "$nombre.pdf"
$temporal = $null

if ($Telefono) {
  # Copia temporal junto a cv.html, para que la foto y las rutas relativas sigan funcionando.
  $correo = '<p><a href="mailto:cm7chael@gmail.com">cm7chael@gmail.com</a></p>'
  $texto = [System.IO.File]::ReadAllText($html, [System.Text.Encoding]::UTF8)
  if (-not $texto.Contains($correo)) { throw "No encontré la línea del correo en $nombre.html para poner el teléfono debajo." }
  $digitos = $Telefono -replace '[^\d+]', ''
  $texto = $texto.Replace($correo, $correo + "`n        <p><a href=`"tel:$digitos`">$Telefono</a></p>")
  $temporal = Join-Path $base 'cv-con-telefono.tmp.html'
  [System.IO.File]::WriteAllText($temporal, $texto, (New-Object System.Text.UTF8Encoding($false)))
  $html = $temporal
  $sufijo = if ($Idioma -eq 'en') { ' (EN)' } else { '' }
  $pdf = Join-Path (Split-Path -Parent $base) "Michael Cervera Cobeñas - CV$sufijo.pdf"
}

$edge = @(
  "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $edge) { throw 'No encontré Edge ni Chrome.' }

try {
  $url = 'file:///' + $html.Replace([char]92, [char]47)   # \ → /
  if (Test-Path $pdf) { Remove-Item $pdf }
  $perfil = Join-Path $env:TEMP 'cv-a-pdf-perfil'   # perfil aparte para no chocar con el Edge abierto
  # Start-Process en vez de "& $edge": Edge escribe avisos en stderr y PowerShell 5.1 con 'Stop' los toma como error.
  $argumentos = @('--headless=new', '--disable-gpu', '--no-pdf-header-footer', "--user-data-dir=`"$perfil`"",
    '--virtual-time-budget=5000', "--print-to-pdf=`"$pdf`"", "`"$url`"")
  Start-Process -FilePath $edge -ArgumentList $argumentos -Wait -WindowStyle Hidden `
    -RedirectStandardError (Join-Path $env:TEMP 'cv-a-pdf.log')

  for ($i = 0; $i -lt 30 -and -not (Test-Path $pdf); $i++) { Start-Sleep -Milliseconds 500 }
  if (-not (Test-Path $pdf)) { throw 'Edge no generó el PDF.' }
  Write-Output "pdf: $pdf ($([math]::Round((Get-Item $pdf).Length / 1KB)) KB)"
} finally {
  if ($temporal -and (Test-Path $temporal)) { Remove-Item $temporal }
}
