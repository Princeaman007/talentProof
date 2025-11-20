# Script PowerShell pour diagnostiquer les appels Axios
# Usage: .\axios-check.ps1

Write-Host "`n🔍 DIAGNOSTIC AXIOS - TalentProof`n" -ForegroundColor Cyan

# Couleurs
$success = "Green"
$warning = "Yellow"
$error = "Red"
$info = "Cyan"

# Compteurs
$totalFiles = 0
$filesWithLogs = 0
$filesWithoutLogs = 0
$totalAPICalls = 0

Write-Host "📁 Scanning client/src directory...`n" -ForegroundColor $info

# Trouver tous les fichiers JS/JSX
$files = Get-ChildItem -Path ".\client\src" -Recurse -Include *.jsx,*.js -Exclude *.test.*,*.spec.*

$results = @()

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $relativePath = $file.FullName.Replace((Get-Location).Path + "\", "")
    
    # Compter les appels API
    $apiCalls = [regex]::Matches($content, "await (api|apiService|axios)\.(get|post|put|delete|patch)\(")
    
    if ($apiCalls.Count -gt 0) {
        $totalFiles++
        $totalAPICalls += $apiCalls.Count
        
        # Vérifier si des logs sont présents
        $hasLogs = $content -match "console\.log\('📤|console\.log\('📥|console\.log\('\ud83d\udce4|\ud83d\udce5"
        
        if ($hasLogs) {
            $filesWithLogs++
            $status = "✅"
            $color = $success
        } else {
            $filesWithoutLogs++
            $status = "❌"
            $color = $error
        }
        
        $results += [PSCustomObject]@{
            Status = $status
            File = $relativePath
            APICalls = $apiCalls.Count
            HasLogs = $hasLogs
            Color = $color
        }
    }
}

# Afficher les résultats groupés
Write-Host "📊 RÉSULTATS:`n" -ForegroundColor $info

Write-Host "  ✅ Fichiers avec logs détaillés ($filesWithLogs):`n" -ForegroundColor $success
$results | Where-Object { $_.HasLogs } | Sort-Object File | ForEach-Object {
    Write-Host "    $($_.Status) $($_.File) ($($_.APICalls) appels)" -ForegroundColor $_.Color
}

Write-Host "`n  ❌ Fichiers SANS logs détaillés ($filesWithoutLogs):`n" -ForegroundColor $error
$results | Where-Object { -not $_.HasLogs } | Sort-Object File | ForEach-Object {
    Write-Host "    $($_.Status) $($_.File) ($($_.APICalls) appels)" -ForegroundColor $_.Color
}

# Statistiques
Write-Host "`n📈 STATISTIQUES:`n" -ForegroundColor $info
Write-Host "  Total fichiers avec API calls: $totalFiles" -ForegroundColor White
Write-Host "  Total appels API: $totalAPICalls" -ForegroundColor White
Write-Host "  Fichiers avec logs: $filesWithLogs ✅" -ForegroundColor $success
Write-Host "  Fichiers sans logs: $filesWithoutLogs ❌" -ForegroundColor $error

$percentage = [math]::Round(($filesWithLogs / $totalFiles) * 100, 2)
Write-Host "  Progression: $percentage% complété" -ForegroundColor $(if ($percentage -ge 50) { $success } else { $warning })

# Priorités
Write-Host "`n🎯 PRIORITÉS (fichiers à corriger):`n" -ForegroundColor $info

$priorities = @{
    "🔴 HAUTE" = @(
        "dashboard\\AdminDevis.jsx",
        "dashboard\\Adminentreprises.jsx",
        "dashboard\\Admincontactrequests.jsx",
        "dashboard\\AdminPortfolio.jsx",
        "dashboard\\AdminTeam.jsx",
        "dashboard\\MesDemandesContact.jsx"
    )
    "🟡 MOYENNE" = @(
        "auth\\ResetPassword.jsx",
        "auth\\ConfirmEmail.jsx",
        "Talentdayregister.jsx",
        "services\\DevisForm.jsx",
        "About.jsx"
    )
    "🟢 BASSE" = @(
        "talents\\TalentCard.jsx",
        "layout\\Navbar.jsx",
        "contact\\Contactform.jsx",
        "modals\\AddTalentModal.jsx",
        "services\\PortfolioSection.jsx",
        "admin\\TalentDayInscriptions.jsx",
        "home\\Hero.jsx",
        "hooks\\useAdminStats.js"
    )
}

foreach ($priority in $priorities.Keys | Sort-Object) {
    Write-Host "  $priority :" -ForegroundColor $(if ($priority -match "🔴") { $error } elseif ($priority -match "🟡") { $warning } else { $success })
    
    foreach ($pattern in $priorities[$priority]) {
        $matchingFile = $results | Where-Object { $_.File -like "*$pattern" -and -not $_.HasLogs }
        if ($matchingFile) {
            Write-Host "    ❌ $($matchingFile.File) ($($matchingFile.APICalls) appels)" -ForegroundColor White
        } else {
            $checkedFile = $results | Where-Object { $_.File -like "*$pattern" }
            if ($checkedFile -and $checkedFile.HasLogs) {
                Write-Host "    ✅ $($checkedFile.File) (déjà corrigé)" -ForegroundColor $success
            }
        }
    }
    Write-Host ""
}

# Commandes suggérées
Write-Host "💡 COMMANDES SUGGÉRÉES:`n" -ForegroundColor $info
Write-Host "  # Voir les lignes exactes dans un fichier:"
Write-Host "  Get-Content 'client\src\pages\dashboard\AdminDevis.jsx' | Select-String 'await api\.'" -ForegroundColor Gray
Write-Host "`n  # Compter les lignes de code:"
Write-Host "  (Get-Content 'client\src\pages\dashboard\AdminDevis.jsx').Count" -ForegroundColor Gray
Write-Host "`n  # Chercher un pattern spécifique:"
Write-Host "  Select-String -Path .\client\src\**\*.jsx -Pattern 'response\.data\.data' | Select-Object -First 10" -ForegroundColor Gray

Write-Host "`n✨ Diagnostic terminé !`n" -ForegroundColor $success
