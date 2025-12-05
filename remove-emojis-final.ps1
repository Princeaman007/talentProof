# Script pour supprimer tous les emojis des fichiers JS/JSX
# Utilise des regex Unicode pour détecter et supprimer les emojis

function Remove-EmojisFromFile {
    param([string]$filePath)
    
    if (!(Test-Path $filePath)) {
        Write-Warning "Fichier non trouvé: $filePath"
        return $false
    }
    
    try {
        $content = Get-Content -Path $filePath -Raw -Encoding UTF8
        $originalContent = $content
        
        # Pattern regex pour capturer les emojis Unicode
        # Couvre les plages Unicode courantes pour les emojis
        $emojiPattern = '[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{FE00}-\u{FE0F}]|[\u{1F1E0}-\u{1F1FF}]'
        
        # Remplacer les emojis
        $content = $content -replace $emojiPattern, ''
        
        # Nettoyer les espaces multiples
        $content = $content -replace '  +', ' '
        
        # Nettoyer les lignes avec seulement des espaces
        $content = $content -replace '(?m)^\s+$', ''
        
        if ($content -ne $originalContent) {
            Set-Content -Path $filePath -Value $content -Encoding UTF8 -NoNewline
            return $true
        }
        return $false
    }
    catch {
        Write-Error "Erreur lors du traitement de $filePath : $_"
        return $false
    }
}

Write-Host "`n=== SUPPRESSION DES EMOJIS ===" -ForegroundColor Cyan
Write-Host "Recherche des fichiers JS/JSX dans client/src et backend...`n" -ForegroundColor Yellow

# Traiter les fichiers frontend
$frontendFiles = Get-ChildItem -Path "client\src" -Recurse -Include *.js,*.jsx | Where-Object { $_.FullName -notmatch 'node_modules|build|dist' }

# Traiter les fichiers backend
$backendFiles = Get-ChildItem -Path "backend" -Recurse -Include *.js,*.cjs | Where-Object { $_.FullName -notmatch 'node_modules|uploads|logs' }

$allFiles = $frontendFiles + $backendFiles
$totalFiles = $allFiles.Count
$modifiedFiles = 0
$processedFiles = 0

Write-Host "Fichiers à traiter: $totalFiles`n" -ForegroundColor Green

foreach ($file in $allFiles) {
    $processedFiles++
    $relativePath = $file.FullName.Replace((Get-Location).Path + '\', '')
    
    Write-Progress -Activity "Suppression des emojis" -Status "Traitement de $relativePath" -PercentComplete (($processedFiles / $totalFiles) * 100)
    
    if (Remove-EmojisFromFile -filePath $file.FullName) {
        $modifiedFiles++
        Write-Host "[OK] $relativePath" -ForegroundColor Green
    }
}

Write-Progress -Activity "Suppression des emojis" -Completed

Write-Host "`n=== RÉSUMÉ ===" -ForegroundColor Cyan
Write-Host "Fichiers traités: $processedFiles" -ForegroundColor White
Write-Host "Fichiers modifiés: $modifiedFiles" -ForegroundColor Green
Write-Host "`nSuppression terminée!`n" -ForegroundColor Green
