# Script pour corriger la gestion d'erreurs dans tous les fichiers
$files = @(
    "src\pages\Profile.jsx",
    "src\pages\Talentdays.jsx",
    "src\pages\DevisForm.jsx",
    "src\pages\TalentsDashboard.jsx",
    "src\pages\Dashboard.jsx",
    "src\pages\admin\AdminDashboard.jsx",
    "src\pages\admin\AdminCompanyRegistrations.jsx",
    "src\pages\admin\AdminCompanies.jsx",
    "src\pages\admin\AdminTalentdays.jsx",
    "src\pages\admin\AdminTalents.jsx",
    "src\pages\auth\ConfirmEmail.jsx",
    "src\components\Navbar.jsx",
    "src\components\Hero.jsx",
    "src\components\TalentCard.jsx",
    "src\components\PortfolioSection.jsx",
    "src\components\modals\AddTalentModal.jsx",
    "src\components\modals\EditTalentModal.jsx",
    "src\components\modals\AddTeamMemberModal.jsx",
    "src\components\modals\EditTeamMemberModal.jsx"
)

$importLine = "import { extractErrorMessage } from '../utils/errorHandler';"
$oldPattern1 = "error?.error?.message || error?.message || "
$oldPattern2 = "err?.error?.message || err?.message || "
$oldPattern3 = "error.response?.data?.message || error.message || "
$oldPattern4 = "error?.message || "

Write-Host "🔧 Début de la correction automatique..." -ForegroundColor Cyan
Write-Host ""

$corrected = 0
$notFound = 0

foreach ($file in $files) {
    $fullPath = Join-Path $PSScriptRoot $file
    
    if (Test-Path $fullPath) {
        Write-Host "📝 Traitement: $file" -ForegroundColor Yellow
        
        try {
            $content = Get-Content $fullPath -Raw
            $modified = $false
            
            # Vérifier si l'import existe déjà
            if ($content -notmatch "extractErrorMessage") {
                # Trouver la dernière ligne d'import
                $lines = Get-Content $fullPath
                $lastImportIndex = -1
                for ($i = 0; $i -lt $lines.Count; $i++) {
                    if ($lines[$i] -match "^import ") {
                        $lastImportIndex = $i
                    }
                }
                
                if ($lastImportIndex -ge 0) {
                    # Ajuster l'import selon le niveau du fichier
                    $depth = ($file.Split('\').Count - 2)
                    $importPath = "../" * $depth + "utils/errorHandler"
                    $importToAdd = "import { extractErrorMessage } from '$importPath';"
                    
                    $lines = @($lines[0..$lastImportIndex]) + $importToAdd + @($lines[($lastImportIndex + 1)..($lines.Count - 1)])
                    $content = $lines -join "`n"
                    $modified = $true
                }
            }
            
            # Remplacer les patterns d'erreur
            $patterns = @(
                @{ old = "error\.response\?\.data\?\.error\?\.message \|\| error\.response\?\.data\?\.message \|\| error\?\.message \|\| "; new = "extractErrorMessage(error, " },
                @{ old = "error\?\.error\?\.message \|\| error\?\.message \|\| "; new = "extractErrorMessage(error, " },
                @{ old = "err\?\.error\?\.message \|\| err\?\.message \|\| "; new = "extractErrorMessage(err, " },
                @{ old = "error\.response\?\.data\?\.message \|\| error\.message \|\| "; new = "extractErrorMessage(error, " },
                @{ old = "error\?\.message \|\| '"; new = "extractErrorMessage(error, '" },
                @{ old = "err\?\.message \|\| '"; new = "extractErrorMessage(err, '" }
            )
            
            foreach ($pattern in $patterns) {
                if ($content -match [regex]::Escape($pattern.old)) {
                    $content = $content -replace [regex]::Escape($pattern.old), $pattern.new
                    # Fermer la parenthèse
                    $content = $content -replace "extractErrorMessage\((error|err), '([^']+)';", "extractErrorMessage(`$1, '`$2');"
                    $modified = $true
                }
            }
            
            if ($modified) {
                Set-Content $fullPath -Value $content -NoNewline
                Write-Host "   ✅ Corrigé" -ForegroundColor Green
                $corrected++
            } else {
                Write-Host "   ℹ️  Déjà à jour ou aucun pattern trouvé" -ForegroundColor Gray
            }
        }
        catch {
            Write-Host "   ❌ Erreur: $_" -ForegroundColor Red
        }
    } else {
        Write-Host "   ⚠️  Fichier non trouvé: $fullPath" -ForegroundColor DarkYellow
        $notFound++
    }
}

Write-Host ""
Write-Host "✅ Terminé!" -ForegroundColor Green
Write-Host "   Fichiers corrigés: $corrected" -ForegroundColor Cyan
Write-Host "   Fichiers non trouvés: $notFound" -ForegroundColor Yellow
