$files = @(
    "D:\OneDrive\Desktop\work\src\app\globals.css",
    "D:\OneDrive\Desktop\work\src\app\layout.tsx",
    "D:\OneDrive\Desktop\work\src\app\page.tsx",
    "D:\OneDrive\Desktop\work\src\app\home\page.tsx",
    "D:\OneDrive\Desktop\work\src\app\error.tsx"
)

foreach ($f in $files) {
    if (Test-Path $f) {
        $bytes = [System.IO.File]::ReadAllBytes($f)
        $text = [System.Text.Encoding]::UTF8.GetString($bytes)
        $clean = $text.Replace([char]0x2060, '')
        [System.IO.File]::WriteAllText($f, $clean, [System.Text.Encoding]::UTF8)
        Write-Host "Cleaned: $f"
    } else {
        Write-Host "Not found: $f"
    }
}
