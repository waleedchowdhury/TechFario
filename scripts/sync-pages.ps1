$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$frontend = Join-Path $root "frontend"

$files = @(
  "index.html",
  "admin.html",
  "styles.css",
  "admin.css",
  "main.js",
  "admin.js",
  "site-config.js"
)

foreach ($file in $files) {
  Copy-Item -Force (Join-Path $frontend $file) (Join-Path $root $file)
}

Write-Host "GitHub Pages files synced to repository root."
