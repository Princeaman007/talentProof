# Script PowerShell pour supprimer tous les emojis du code
# Exclut les fichiers .md (documentation)

Write-Host "Nettoyage des emojis dans le projet TalentProof..." -ForegroundColor Cyan

# Compteurs
$filesProcessed = 0
$totalChanges = 0

# Pattern pour détecter les lignes avec emojis courants dans les commentaires/logs
$patterns = @(
    '// .*[✅❌⚠️🔒🚀💡📝🎯✨🐛⏳📧🔗📊🆘🔧🧪📋🔍✓💾🔥👋🎉📬📞⏰📅🔑]',
    'console\.log\([''"].*[✅❌⚠️🔒🚀💡📝🎯✨🐛⏳📧🔗📊🆘🔧🧪📋🔍✓💾🔥👋🎉📬📞⏰📅🔑]',
    'throw new Error\([''"].*[✅❌⚠️🔒🚀💡📝🎯✨🐛⏳📧🔗📊🆘🔧🧪📋🔍✓💾🔥👋🎉📬📞⏰📅🔑]',
    '\.json\(\{.*message.*[✅❌⚠️🔒🚀💡📝🎯✨🐛⏳📧🔗📊🆘🔧🧪📋🔍✓💾🔥👋🎉📬📞⏰📅🔑]'
)

# Extensions de fichiers à traiter
$extensions = @('*.js', '*.jsx', '*.mjs', '*.cjs')

# Dossiers à traiter
$folders = @('backend', 'client/src')

foreach ($folder in $folders) {
    $folderPath = Join-Path $PSScriptRoot $folder
    
    if (Test-Path $folderPath) {
        Write-Host "`nTraitement du dossier: $folder" -ForegroundColor Yellow
        
        foreach ($ext in $extensions) {
            $files = Get-ChildItem -Path $folderPath -Filter $ext -Recurse -File -ErrorAction SilentlyContinue
            
            foreach ($file in $files) {
                try {
                    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
                    
                    if ($null -eq $content) { continue }
                    
                    $originalContent = $content
                    $modified = $false
                    
                    # Supprimer les emojis - approche caractère par caractère
                    $newContent = ""
                    foreach ($char in $content.ToCharArray()) {
                        $code = [int]$char
                        # Exclure les emojis courants (plages Unicode)
                        if ($code -ge 0x1F300 -and $code -le 0x1F9FF) { 
                            $modified = $true
                            continue 
                        }
                        if ($code -ge 0x2600 -and $code -le 0x27BF) { 
                            $modified = $true
                            continue 
                        }
                        # Caractères spéciaux courants
                        if ($char -match '[✅❌⚠✓]') {
                            $modified = $true
                            continue
                        }
                        $newContent += $char
                    }
                    
                    if ($modified) {
                        Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8 -NoNewline
                        
                        $relativePath = $file.FullName.Replace($PSScriptRoot + '\', '')
                        Write-Host "  [OK] $relativePath" -ForegroundColor Green
                        
                        $filesProcessed++
                        $totalChanges++
                    }
                } catch {
                    Write-Host "  [ERREUR] $($file.Name): $_" -ForegroundColor Red
                }
            }
        }
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Nettoyage termine!" -ForegroundColor Green
Write-Host "Fichiers modifies: $filesProcessed" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Cyan
