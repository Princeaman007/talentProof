# 📧 Documentation EmailService - TalentProof

## ✅ PROBLÈME RÉSOLU

### Ce qui était cassé ❌
```javascript
// AVANT - Données génériques/statiques
eventLocation: "À confirmer"
availableSpots: undefined
eventDate: "2025-01-15T09:00:00.000Z" // Timestamp brut
```

### Ce qui fonctionne maintenant ✅
```javascript
// APRÈS - Vraies données MongoDB formatées
eventLocation: {
  type: 'physique',
  address: 'Avenue De Lille 4',
  city: 'Liège',
  postalCode: '4000',
  formatted: 'Avenue De Lille 4, 4000 Liège' // Formaté selon le type
}
availableSpots: 12, // Calculé dynamiquement: maxParticipants - inscriptions.length
totalSpots: 20,
eventDate: "Lundi 15 janvier 2025 à 09:00" // Formaté en français
```

---

## 📋 FONCTIONS CORRIGÉES

### 1. `sendTalentDayConfirmationEmail(talent, talentDay, inscription)`
**Pour:** Talent qui s'inscrit à un TalentDay  
**Données extraites de MongoDB:**
- ✅ `talent.prenom`, `talent.nom`, `talent.email`, `talent.telephone`
- ✅ `talentDay.titre`, `talentDay.description`, `talentDay.date`
- ✅ `talentDay.location` → Formaté selon type (physique/en-ligne/hybride)
- ✅ `talentDay.heureDebut`, `talentDay.heureFin` → Formatés en "HH:MM - HH:MM"
- ✅ `talentDay.maxParticipants - talentDay.inscriptions.length` → Places disponibles

**Exemple d'email généré:**
```
✅ Inscription confirmée - Développeur Full-Stack

Bonjour Jean Dupont !

Votre inscription au TalentDay "Développeur Full-Stack" est confirmée.

📅 Date: Lundi 15 janvier 2025 à 09:00
📍 Lieu: Avenue De Lille 4, 4000 Liège
⏰ Horaires: 09:30 - 17:00
👥 Places: 12/20 disponibles
```

---

### 2. `sendNewApplicationEmail(talent, talentDay, inscription)`
**Pour:** Entreprise qui reçoit une nouvelle candidature  
**Données extraites de MongoDB:**
- ✅ **Profil talent complet:**
  - `talent.prenom`, `talent.nom`, `talent.email`, `talent.telephone`
  - `talent.technologies[]` → Liste des compétences
  - `talent.scoreTest` → Score de validation
  - `talent.linkedin`, `talent.github`, `talent.portfolio`
  - `inscription.motivation` → Message du candidat
  
- ✅ **Informations événement:**
  - `talentDay.titre`, `talentDay.date` (formatée FR)
  - `talentDay.location` → Formaté selon type
  - `talentDay.inscriptions.length / talentDay.maxParticipants`

**Exemple d'email généré:**
```
📋 Nouvelle candidature - Jean Dupont pour Développeur Full-Stack

Nouvelle candidature reçue !

👤 Profil du talent
Nom: Jean Dupont
Email: jean.dupont@email.com
Téléphone: +32 467 12 34 56
Technologies: JavaScript, React, Node.js, MongoDB
Score: 85/100

💬 Message de motivation
"Je suis très intéressé par cette opportunité..."

📅 Événement: Développeur Full-Stack
📆 Date: Lundi 15 janvier 2025 à 09:00
📍 Lieu: Avenue De Lille 4, 4000 Liège
👥 Inscriptions: 8/20
```

---

### 3. `sendCompanyTalentDayRegistrationEmail(companyInfo, talentDays[])`
**Pour:** Entreprise qui s'inscrit comme organisateur  
**Données extraites de MongoDB:**
- ✅ `companyInfo.companyName`, `companyInfo.contactPerson`, `companyInfo.email`
- ✅ Pour chaque TalentDay:
  - `talentDay.titre`, `talentDay.description`
  - `talentDay.date` → Formatée en français
  - `talentDay.location` → Formaté selon type
  - `talentDay.heureDebut - talentDay.heureFin`
  - `availableSpots / totalSpots` → Calculé dynamiquement

**Exemple d'email généré:**
```
🎉 Inscription TalentDay(s) bien reçue - TechCorp

Bonjour Marie Dupont !

Votre inscription aux TalentDays suivants a bien été reçue :

📅 Développeur Full-Stack
📍 Avenue De Lille 4, 4000 Liège
📆 Lundi 15 janvier 2025 à 09:00
⏰ Horaires: 09:30 - 17:00
👥 Places: 15/20 disponibles

📅 Développeur Mobile
📍 En ligne (lien fourni 24h avant l'événement)
📆 Vendredi 19 janvier 2025 à 14:00
⏰ Horaires: 14:00 - 18:00
👥 Places: 8/15 disponibles

Notre équipe va valider votre inscription sous 24-48h.
```

---

### 4. `sendResetPasswordEmail(user, resetToken)`
**Pour:** Réinitialisation mot de passe (talent ou entreprise)  
**Données extraites:**
- ✅ `user.email`, `user.prenom` ou `user.companyName`
- ✅ `resetToken` → Génère URL complète
- ✅ URL frontend depuis `process.env.FRONTEND_URL`

**Exemple:**
```
🔐 Réinitialisation de votre mot de passe

Bonjour Jean !

Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :
[Réinitialiser mon mot de passe]

⚠️ Ce lien expire dans 1 heure.
```

---

### 5. `sendContactTalentNotificationEmail(talentInfo, recruteurInfo)`
**Pour:** Admin reçoit notification qu'une entreprise veut contacter un talent  
**Données extraites:**
- ✅ **Talent:**
  - `talentInfo.prenom`, `talentInfo.nom`
  - `talentInfo.technologies[]`
  - `talentInfo.scoreTest`, `talentInfo.plateforme`
  
- ✅ **Recruteur:**
  - `recruteurInfo.nom`, `recruteurInfo.email`, `recruteurInfo.tel`
  - `recruteurInfo.entreprise`, `recruteurInfo.message`

---

## 🛠️ FONCTIONS UTILITAIRES

### `formatDateFR(date)`
Convertit une date MongoDB en français lisible.

**Entrée:** `"2025-01-15T09:00:00.000Z"`  
**Sortie:** `"Lundi 15 janvier 2025 à 09:00"`

```javascript
const formatDateFR = (date) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
```

---

### `formatLocation(location)`
Formate le lieu selon son type.

**Entrée:**
```javascript
{
  type: 'physique',
  address: 'Avenue De Lille 4',
  city: 'Liège',
  postalCode: '4000'
}
```

**Sortie:**
```javascript
{
  type: 'physique',
  address: 'Avenue De Lille 4',
  city: 'Liège',
  postalCode: '4000',
  formatted: 'Avenue De Lille 4, 4000 Liège' // ← Utilisé dans les emails
}
```

**Types gérés:**
- `physique` → `"Avenue De Lille 4, 4000 Liège"`
- `en-ligne` → `"En ligne (lien fourni 24h avant l'événement)"`
- `hybride` → `"Hybride - Liège"`

---

### `calculateAvailableSpots(talentDay)`
Calcule dynamiquement les places restantes.

**Entrée:**
```javascript
{
  maxParticipants: 20,
  inscriptions: [/* 8 inscriptions */]
}
```

**Sortie:**
```javascript
{
  availableSpots: 12, // 20 - 8
  totalSpots: 20,
  percentage: 40 // (8/20) * 100
}
```

---

### `formatHoraires(heureDebut, heureFin)`
Formate les horaires d'un événement.

**Entrée:** `"09:30"`, `"17:00"`  
**Sortie:** `"09:30 - 17:00"`

---

### `validateTalentDayData(talentDay)`
Valide les données critiques avant envoi email.

**Vérifie:**
- ✅ `talentDay.titre` existe
- ✅ `talentDay.date` existe
- ⚠️ `talentDay.location` existe (warning si manquant)
- ⚠️ `talentDay.maxParticipants` existe (warning si manquant)

**Throws Error si données critiques manquantes.**

---

## 🎯 CHECKLIST VALIDATION

Avant chaque envoi d'email, le système vérifie :

- ✅ Email destinataire existe
- ✅ Données MongoDB complètes
- ✅ Lieu formaté selon type (physique/en-ligne/hybride)
- ✅ Date formatée en français
- ✅ Places disponibles calculées dynamiquement
- ✅ Horaires formatés correctement
- ✅ Logo TalentProof inclus (base64)
- ✅ Fallback texte pour clients email sans HTML

---

## 📊 EXEMPLE COMPLET: Inscription TalentDay

### Données MongoDB
```javascript
const talent = {
  prenom: "Jean",
  nom: "Dupont",
  email: "jean.dupont@email.com",
  telephone: "+32 467 12 34 56",
  technologies: ["JavaScript", "React", "Node.js"]
};

const talentDay = {
  _id: "507f1f77bcf86cd799439011",
  titre: "Développeur Full-Stack",
  description: "Journée de recrutement pour développeurs full-stack...",
  date: new Date("2025-01-15T09:00:00Z"),
  location: {
    type: "physique",
    address: "Avenue De Lille 4",
    city: "Liège",
    postalCode: "4000"
  },
  heureDebut: "09:30",
  heureFin: "17:00",
  maxParticipants: 20,
  inscriptions: [
    /* 8 inscriptions existantes */
  ]
};
```

### Code d'envoi
```javascript
await sendTalentDayConfirmationEmail(talent, talentDay, {});
```

### Email généré (aperçu)
```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Inscription TalentDay confirmée ! - TalentProof</title>
</head>
<body>
  <!-- Header avec logo TalentProof -->
  <div style="text-align: center; padding: 30px;">
    <img src="data:image/svg+xml;base64,..." alt="TalentProof" />
  </div>
  
  <!-- Hero -->
  <div style="background: linear-gradient(135deg, #8B5CF6 0%, #1E3A8A 100%);">
    <h1>Inscription TalentDay confirmée !</h1>
  </div>
  
  <!-- Contenu -->
  <div style="padding: 40px;">
    <p>Bonjour <strong>Jean Dupont</strong> !</p>
    
    <p>Votre inscription au TalentDay <strong>"Développeur Full-Stack"</strong> 
       a bien été enregistrée.</p>
    
    <div style="background-color: #D1FAE5; border-left: 4px solid #059669;">
      <strong>✅ Inscription confirmée !</strong><br>
      Vous êtes maintenant inscrit(e) à cet événement.
    </div>
    
    <h3>📅 Détails de l'événement</h3>
    <table>
      <tr>
        <td>📅 Événement</td>
        <td>Développeur Full-Stack</td>
      </tr>
      <tr>
        <td>📆 Date</td>
        <td>Lundi 15 janvier 2025 à 09:00</td>
      </tr>
      <tr>
        <td>📍 Lieu</td>
        <td>Avenue De Lille 4, 4000 Liège</td>
      </tr>
      <tr>
        <td>⏰ Horaires</td>
        <td>09:30 - 17:00</td>
      </tr>
      <tr>
        <td>👥 Places disponibles</td>
        <td>12 / 20</td>
      </tr>
    </table>
    
    <!-- Description -->
    <div>
      <h4>📝 Description</h4>
      <p>Journée de recrutement pour développeurs full-stack...</p>
    </div>
    
    <!-- Bouton CTA -->
    <a href="https://talentproof.com/talent-days/507f1f77bcf86cd799439011"
       style="background: linear-gradient(135deg, #F97316 0%, #EA580C 100%);">
      📋 Voir les détails complets
    </a>
  </div>
  
  <!-- Footer -->
  <div style="background-color: #F9FAFB; padding: 30px;">
    <p><strong>TalentProof</strong> - Validez vos talents</p>
    <p>Avenue de Lille 4 A52, 4020 Liège, Belgique</p>
    <p>📧 info@princeaman.dev | 📞 +32 467 62 08 78</p>
  </div>
</body>
</html>
```

---

## 🚀 UTILISATION DANS LES CONTROLLERS

### TalentDayController
```javascript
import { 
  sendTalentDayConfirmationEmail,
  sendNewApplicationEmail 
} from '../utils/emailService.js';

// Après inscription d'un talent
const talent = await Talent.findById(talentId);
const talentDay = await TalentDay.findById(talentDayId)
  .populate('organisateur')
  .populate('inscriptions');

// ✅ Email au talent
await sendTalentDayConfirmationEmail(talent, talentDay, inscription);

// ✅ Email à l'entreprise
await sendNewApplicationEmail(talent, talentDay, inscription);
```

### CompanyController
```javascript
import { sendCompanyTalentDayRegistrationEmail } from '../utils/emailService.js';

// Après inscription entreprise
const company = await Company.findById(companyId);
const talentDays = await TalentDay.find({ _id: { $in: selectedIds } });

await sendCompanyTalentDayRegistrationEmail(
  {
    companyName: company.nomEntreprise,
    contactPerson: company.nomContact,
    email: company.email,
    phone: company.telephone,
    website: company.website
  },
  talentDays
);
```

---

## ⚠️ GESTION DES ERREURS

Toutes les fonctions incluent une validation stricte :

```javascript
// ❌ Si données manquantes
throw new Error('❌ Email talent manquant pour confirmation inscription');

// ⚠️ Si données optionnelles manquantes
console.warn('⚠️ Lieu manquant pour TalentDay, utilisation valeur par défaut');

// ✅ Logs de succès
console.log(`✅ Email envoyé à ${email}:`, { details... });
```

---

## 🔧 VARIABLES D'ENVIRONNEMENT REQUISES

```env
# Email SMTP (Infomaniak)
EMAIL_HOST=mail.infomaniak.com
EMAIL_PORT=587
EMAIL_USER=info@princeaman.dev
EMAIL_PASS=your_password_here
EMAIL_FROM=TalentProof <info@princeaman.dev>

# Frontend URL (pour liens dans emails)
FRONTEND_URL=https://talentproof-client.onrender.com

# Admin email (pour notifications)
ADMIN_EMAIL=info@princeaman.dev

# Dev mode (skip emails)
SKIP_EMAILS=false
```

---

## ✅ TESTS RECOMMANDÉS

### Test 1: Inscription talent à TalentDay
```javascript
const talent = {
  prenom: "Test",
  nom: "User",
  email: "test@example.com",
  telephone: "+32 123 45 67 89",
  technologies: ["JavaScript", "React"]
};

const talentDay = {
  titre: "Test Event",
  date: new Date(),
  location: {
    type: "physique",
    address: "Rue Test 1",
    city: "Liège",
    postalCode: "4000"
  },
  heureDebut: "09:00",
  heureFin: "17:00",
  maxParticipants: 20,
  inscriptions: []
};

await sendTalentDayConfirmationEmail(talent, talentDay, {});
```

**Vérifier dans l'email:**
- ✅ Date formatée en français
- ✅ Lieu complet affiché
- ✅ Horaires corrects
- ✅ Places disponibles: 20/20

---

## 📚 CONCLUSION

✅ **Toutes les fonctions ont été corrigées**  
✅ **Toutes les données viennent de MongoDB**  
✅ **Dates formatées en français lisible**  
✅ **Lieux formatés selon le type**  
✅ **Places calculées dynamiquement**  
✅ **Validation des données avant envoi**  
✅ **Logo TalentProof embarqué**

🎯 **Résultat:** Emails professionnels avec données réelles et complètes !
