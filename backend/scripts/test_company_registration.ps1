# 🧪 Test API - Inscription Entreprise

Write-Host "`n🧪 TEST 1: Inscription d'une entreprise`n" -ForegroundColor Cyan

$body = @{
    companyName = "TechCorp Solutions"
    contactPerson = "Marie Dubois"
    email = "contact@techcorp.be"
    phone = "+32 2 123 4567"
    website = "https://techcorp.be"
    interestedTalentDays = @("691b54c646e14a55aa2418e0", "691b54c646e14a55aa2418e1")
    notes = "Recherchons développeurs Full-stack React/Node pour projets européens. Besoin de profils senior avec 3+ ans d'expérience."
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/companies" -Method POST -Body $body -ContentType "application/json"
    Write-Host "✅ Inscription réussie!" -ForegroundColor Green
    Write-Host "📧 Entreprise: $($response.company.companyName)" -ForegroundColor Yellow
    Write-Host "📧 Email: $($response.company.email)" -ForegroundColor Yellow
    Write-Host "📊 Statut: $($response.company.status)" -ForegroundColor Yellow
    Write-Host "🆔 ID: $($response.company._id)" -ForegroundColor Yellow
    Write-Host "🎯 TalentDays: $($response.company.interestedTalentDays.Count)" -ForegroundColor Yellow
    
    # Sauvegarder l'ID pour les tests suivants
    $companyId = $response.company._id
    Write-Host "`n💾 ID sauvegardé: $companyId`n" -ForegroundColor Magenta
    
} catch {
    Write-Host "❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Détails: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}

Write-Host "`n---`n"

# Test 2: Vérifier que l'email dupliqué est rejeté
Write-Host "🧪 TEST 2: Email dupliqué (doit échouer)`n" -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/companies" -Method POST -Body $body -ContentType "application/json"
    Write-Host "❌ Test échoué: email dupliqué accepté!" -ForegroundColor Red
} catch {
    Write-Host "✅ Test réussi: email dupliqué rejeté" -ForegroundColor Green
    Write-Host "Message: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "`n---`n"

# Test 3: Liste des inscriptions (nécessite admin token)
Write-Host "🧪 TEST 3: Récupération liste (public - doit échouer)`n" -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/companies" -Method GET
    Write-Host "❌ Test échoué: route non protégée!" -ForegroundColor Red
} catch {
    Write-Host "✅ Test réussi: route protégée (admin requis)" -ForegroundColor Green
}

Write-Host "`n---`n"

# Test 4: Vérification dans la base de données
Write-Host "🧪 TEST 4: Vérification données créées`n" -ForegroundColor Cyan
Write-Host "📊 Pour vérifier dans MongoDB avec mongosh`n" -ForegroundColor Yellow

Write-Host "`n✅ Tests terminés!`n" -ForegroundColor Green
Write-Host "🔍 Vérifier les logs backend pour:" -ForegroundColor Cyan
Write-Host "   - Email confirmation entreprise" -ForegroundColor Gray
Write-Host "   - Email notification admin" -ForegroundColor Gray
Write-Host "   - Sauvegarde en base de données`n" -ForegroundColor Gray
