# Read the file and keep only first 309 lines
$file = "d:\git_download\DIC04-Circulink\src\pages\MessagesPage.tsx"
$lines = @(Get-Content $file)

# Keep only lines 0-308 (first 309 lines)
$cleaned = $lines[0..308]

# Write back to file
$cleaned | Out-File $file -Encoding UTF8 -NoNewline

Write-Host "Cleaned MessagesPage.tsx - kept 309 lines"
