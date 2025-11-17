# Test des emails enrichis avec détails TalentDays

Write-Host "`n🧪 TEST - Inscription avec emails enrichis`n" -ForegroundColor Cyan

# ID du TalentDay créé précédemment
$talentDayId = "691b54c646e14a55aa2418e0"

$body = @{
    companyName = "InnoTech Solutions"
    contactPerson = "Sophie Martin"
    email = "sophie.martin@innotech.be"
    phone = "+32 2 987 6543"
    website = "https://innotech-solutions.be"
    interestedTalentDays = @($talentDayId)
    notes = "Recherche développeurs seniors React/Node pour projets innovants. Budget conséquent."
} | ConvertTo-Json

try {
    Write-Host "📤 Envoi de l'inscription..." -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/companies" -Method POST -Body $body -ContentType "application/json"
    
    Write-Host "`n✅ INSCRIPTION RÉUSSIE!`n" -ForegroundColor Green
    Write-Host "🏢 Entreprise : $($response.data.companyName)" -ForegroundColor White
    Write-Host "👤 Contact    : $($response.data.contactPerson)" -ForegroundColor White
    Write-Host "📧 Email      : $($response.data.email)" -ForegroundColor Yellow
    Write-Host "🆔 ID         : $($response.data._id)" -ForegroundColor Cyan
    Write-Host "📊 Statut     : $($response.data.status)" -ForegroundColor Magenta
    Write-Host "📅 TalentDays : $($response.data.interestedTalentDays.Count)" -ForegroundColor White
    
    Write-Host "`n📧 VÉRIFICATION EMAILS :" -ForegroundColor Cyan
    Write-Host "   1️⃣  Email confirmation → Entreprise (avec détails complets)" -ForegroundColor Green
    Write-Host "   2️⃣  Email notification → Admin" -ForegroundColor Green
    
    Write-Host "`n💡 Consultez les logs du serveur backend pour voir les emails HTML!`n" -ForegroundColor Yellow
    
    # Sauvegarder l'ID pour test de mise à jour statut
    $companyId = $response.data._id
    Write-Host "💾 ID sauvegardé : $companyId`n" -ForegroundColor Magenta
    
    # Attendre un peu
    Write-Host "⏳ Attente 3 secondes...`n" -ForegroundColor Gray
    Start-Sleep -Seconds 3
    
    # Test mise à jour statut (nécessite token admin)
    Write-Host "ℹ️  Pour tester l'email de confirmation/rejet :" -ForegroundColor Cyan
    Write-Host "   1. Connectez-vous en tant qu'admin" -ForegroundColor Gray
    Write-Host "   2. Allez sur /dashboard/admin/companies" -ForegroundColor Gray
    Write-Host "   3. Cliquez sur 'Confirmer' ou 'Rejeter'" -ForegroundColor Gray
    Write-Host "   4. L'email avec tous les détails sera envoyé!`n" -ForegroundColor Gray
    
} catch {
    Write-Host "`n❌ ERREUR : $($_.Exception.Message)`n" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        $errorJson = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "Détails : $($errorJson.message)`n" -ForegroundColor Yellow
    }
}

Write-Host "✅ Test terminé!`n" -ForegroundColor Green
