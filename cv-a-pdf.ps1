# Genera cv.pdf a partir de cv.html con Edge en modo headless. El CV se edita SOLO en cv.html.
#   powershell -ExecutionPolicy Bypass -File cv-a-pdf.ps1
# Despues: revisar el PDF y subir cv.html + cv.pdf a master.
$ErrorActionPreference = 'Stop'
$base = Split-Path -Parent $MyInvocation.MyCommand.Path
$html = Join-Path $base 'cv.html'
$pdf  = Join-Path $base 'cv.pdf'

$edge = @(
  "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $edge) { throw 'No encontre Edge ni Chrome.' }

$url = 'file:///' + $html.Replace([char]92, [char]47)   # \ → /
if (Test-Path $pdf) { Remove-Item $pdf }
$perfil = Join-Path $env:TEMP 'cv-a-pdf-perfil'   # perfil aparte: no choca con el Edge abierto
# Start-Process y no "& $edge": Edge escribe avisos en stderr y PowerShell 5.1 con 'Stop' los toma como error.
$argumentos = @('--headless=new', '--disable-gpu', '--no-pdf-header-footer', "--user-data-dir=`"$perfil`"",
  '--virtual-time-budget=5000', "--print-to-pdf=`"$pdf`"", "`"$url`"")
Start-Process -FilePath $edge -ArgumentList $argumentos -Wait -WindowStyle Hidden `
  -RedirectStandardError (Join-Path $env:TEMP 'cv-a-pdf.log')

for ($i = 0; $i -lt 30 -and -not (Test-Path $pdf); $i++) { Start-Sleep -Milliseconds 500 }
if (-not (Test-Path $pdf)) { throw 'Edge no genero el PDF.' }
Write-Output "pdf: $pdf ($([math]::Round((Get-Item $pdf).Length / 1KB)) KB)"
