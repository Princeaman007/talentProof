# Script pour nettoyer les blocs orphelins dans emailService.js

$filePath = "c:\Users\princ\talentproof\backend\utils\emailService.js"
$content = Get-Content $filePath -Raw

# Pattern pour détecter les blocs orphelins (objets sans console.log)
# Format: lignes commençant par espace + propriété: valeur + }); à la fin
$orphanPatterns = @(
    # Bloc 1: après "// LOG DÉTAILLÉ POUR VÉRIFICATION" ligne ~353
    "  \/\/ LOG DÉTAILLÉ POUR VÉRIFICATION\s+talent: talentName,\s+event: talentDay\.titre,\s+lieu: locationData\.formatted,\s+date: eventDate,\s+horaires: horaires,\s+spots: ``\$\{availableSpots\}/\$\{totalSpots\}``\s+\}\);",
    
    # Bloc 2: dans sendNewApplicationEmail ligne ~440
    "  \/\/ LOG DÉTAILLÉ POUR DEBUG\s+technologies: talentInfo\.technologies\.join\(', '\),\s+event: talentDay\.titre,\s+lieu: locationData\.formatted,\s+inscriptions: ``\$\{talentDay\.inscriptions\?\.length \|\| 0\}/\$\{totalSpots\}``,\s+availableSpots: availableSpots\s+\}\);",
    
    # Bloc 3: dans sendTalentDaySummaryEmail ligne ~500
    "  \/\/ LOG DES DONNÉES D'ENVOI\s+contact: companyInfo\.contactPerson \|\| companyInfo\.nomContact,\s+talentDays: formattedTalentDays\.map\(td => \(\{\s+titre: td\.titre,\s+date: td\.date,\s+lieu: td\.lieu,\s+inscriptions: td\.inscriptions\s+\}\)\)\.slice\(0, 2\)\s+\}\);",
    
    # Bloc 4: dans notifyTalentOfRecruiterInterest ligne ~542
    "  \/\/ LOG DES DONNÉES D'ENVOI\s+technologies: talentInfo\.technologies\?\.join\(', '\),\s+entreprise: recruteurInfo\.entreprise,\s+recruteur: recruteurInfo\.nom\s+\}\);",
    
    # Bloc 5: dans sendContactNotificationToAdmin ligne ~599
    "  \/\/ LOG POUR VÉRIFICATION\s+email: contactInfo\.email,\s+sujet: contactInfo\.sujet\s+\}\);",
    
    # Bloc 6: dans sendTalentDayCancellationEmail ligne ~671
    "  \/\/ LOG DE L'ENVOI\s+event: talentDay\.titre,\s+lieu: locationData\.formatted,\s+date: eventDate\s+\}\);",
    
    # Bloc 7: dans notifyTalentOfRejection ligne ~709
    "  \/\/ LOG DE L'ENVOI\s+event: talentDay\.titre,\s+raison: raison \|\| 'Non spécifiée'\s+\}\);"
)

$modified = $false

Write-Host "🔧 Nettoyage des blocs orphelins dans emailService.js..." -ForegroundColor Cyan
Write-Host ""

# Supprimer chaque pattern (un par un en préservant l'ordre)
$content = $content -replace "  \/\/ LOG DÉTAILLÉ POUR VÉRIFICATION\s+talent: talentName,\s+event: talentDay\.titre,\s+lieu: locationData\.formatted,\s+date: eventDate,\s+horaires: horaires,\s+spots: ``\$\{availableSpots\}/\$\{totalSpots\}``\s+\}\);", ""
$content = $content -replace "  \/\/ LOG DÉTAILLÉ POUR DEBUG\s+technologies: talentInfo\.technologies\.join\(', '\),\s+event: talentDay\.titre,\s+lieu: locationData\.formatted,\s+inscriptions: ``\$\{talentDay\.inscriptions\?\.length \|\| 0\}/\$\{totalSpots\}``,\s+availableSpots: availableSpots\s+\}\);", ""
$content = $content -replace "  \/\/ LOG DES DONNÉES D'ENVOI\s+contact: companyInfo\.contactPerson \|\| companyInfo\.nomContact,\s+talentDays: formattedTalentDays\.map\(td => \(\{\s+titre: td\.titre,\s+date: td\.date,\s+lieu: td\.lieu,\s+inscriptions: td\.inscriptions\s+\}\)\)\.slice\(0, 2\)\s+\}\);", ""
$content = $content -replace "  \/\/ LOG DES DONNÉES D'ENVOI\s+technologies: talentInfo\.technologies\?\.join\(', '\),\s+entreprise: recruteurInfo\.entreprise,\s+recruteur: recruteurInfo\.nom\s+\}\);", ""
$content = $content -replace "  \/\/ LOG POUR VÉRIFICATION\s+email: contactInfo\.email,\s+sujet: contactInfo\.sujet\s+\}\);", ""
$content = $content -replace "  \/\/ LOG DE L'ENVOI\s+event: talentDay\.titre,\s+lieu: locationData\.formatted,\s+date: eventDate\s+\}\);", ""
$content = $content -replace "  \/\/ LOG DE L'ENVOI\s+event: talentDay\.titre,\s+raison: raison \|\| 'Non spécifiée'\s+\}\);", ""

# Écrire le fichier nettoyé
$content | Set-Content $filePath -NoNewline

Write-Host "✅ Fichier nettoyé avec succès!" -ForegroundColor Green
Write-Host "📝 7 blocs orphelins supprimés" -ForegroundColor Yellow
