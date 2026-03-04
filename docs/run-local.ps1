# MarkdownPad — Local Development Server
$port = 8080
Write-Host ""
Write-Host "  MarkdownPad local server starting..." -ForegroundColor Cyan
Write-Host "  Open: http://localhost:$port" -ForegroundColor Green
Write-Host "  Press Ctrl+C to stop" -ForegroundColor DarkGray
Write-Host ""

Set-Location $PSScriptRoot
python -m http.server $port
