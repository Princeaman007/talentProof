# 🏢 Guide de Test - Inscription Entreprises TalentDay

## ✅ Système Déployé - Prêt à Tester

### 🌐 URLs du Projet
- **Frontend**: http://localhost:5174
- **Backend**: http://localhost:5000
- **API Docs**: http://localhost:5000/api-docs

---

## 📋 Fonctionnalités Implémentées

### 1. Backend (100% Complet)

#### Modèle `CompanyRegistration.js`
```javascript
{
  companyName: String (requis),
  contactPerson: String (requis),
  email: String (unique, requis),
  phone: String (requis),
  website: String (optionnel),
  interestedTalentDays: [TalentDay refs] (requis),
  notes: String (optionnel),
  status: 'pending' | 'confirmed' | 'rejected' (défaut: pending),
  user: User ref (optionnel),
  meetingRequests: [{
    talent: Talent ref,
    talentDay: TalentDay ref,
    status: 'pending' | 'confirmed' | 'cancelled',
    requestedDate: Date,
    notes: String
  }],
  createdAt, updatedAt
}
```

#### Routes API `/api/companies`
| Méthode | Route | Protection | Description |
|---------|-------|------------|-------------|
| POST | `/` | Public | Inscription entreprise |
| GET | `/` | Admin | Liste paginée avec filtres |
| GET | `/:id` | Protect | Détails (admin ou propriétaire) |
| PATCH | `/:id/status` | Admin | Changer statut (confirmed/rejected) |
| POST | `/:id/book` | Protect | Réserver meeting avec talent |

#### Controller `companyController.js`
- ✅ `createCompanyRegistration`: Validation, sauvegarde, 2 emails (entreprise + admin)
- ✅ `getCompanyRegistrations`: Liste admin avec pagination, filtres status
- ✅ `getCompanyDetails`: Détails avec populations (talents, TalentDays)
- ✅ `updateCompanyStatus`: Mise à jour statut + email notification
- ✅ `bookTalentMeeting`: Réservation meeting (uniquement si confirmé)

#### Emails HTML (5 Templates)
1. **Confirmation Inscription Entreprise** → Envoyé immédiatement
2. **Notification Admin** → Nouvelle inscription à traiter
3. **Confirmation Status** → Entreprise confirmée
4. **Rejet Status** → Entreprise rejetée
5. **Demande Meeting Talent** → Entreprise + Talent notifiés

---

### 2. Frontend (100% Complet)

#### Page Publique `/company-registration`
**Composant**: `CompanyRegistration.jsx`
- Formulaire complet avec validation client
- Sélection multiple TalentDays (Ctrl+click)
- Compteurs caractères (notes: 500 max)
- Écran de succès avec redirection automatique (3s)
- Gestion erreurs backend (email dupliqué, etc.)

#### Page Admin `/dashboard/admin/companies`
**Composant**: `AdminCompanies.jsx`
- Filtres tabs: Toutes | En attente | Confirmées | Rejetées
- Cartes entreprises avec badges statut
- Boutons actions: Confirmer, Rejeter, Détails
- Modal détails avec infos complètes
- Compteur meetings réservés

#### Intégrations UI
1. **Sidebar Admin**: Lien "Inscriptions Entreprises" (icône Building)
2. **TalentDayDetail**: CTA "🏢 Vous êtes une entreprise ?" → `/company-registration`
3. **Routes**: Montées dans `App.jsx` et `DashboardEntreprise.jsx`

---

## 🧪 Plan de Test Complet

### Test 1: Inscription Entreprise (Public)

**Étapes**:
1. Ouvrir http://localhost:5174/company-registration
2. Remplir le formulaire:
   ```
   Nom entreprise: TechCorp Solutions
   Contact: Marie Dubois
   Email: contact@techcorp.be
   Téléphone: +32 2 123 4567
   Site web: https://techcorp.be
   TalentDays: Sélectionner 1-2 événements (Ctrl+click)
   Notes: "Recherchons développeurs Full-stack React/Node"
   ```
3. Cliquer "Envoyer l'inscription"
4. ✅ **Vérifications**:
   - Message succès affiché
   - Redirection automatique après 3s
   - Email reçu par entreprise (vérifier logs backend)
   - Email admin reçu (vérifier logs backend)

**Commande pour vérifier emails dans logs**:
```powershell
# Dans le terminal backend, chercher:
# "✅ Email envoyé avec succès" ou "❌ Erreur envoi email"
```

---

### Test 2: Administration - Liste Entreprises

**Étapes**:
1. Se connecter en tant qu'admin
2. Aller à `/dashboard/admin/companies`
3. ✅ **Vérifications**:
   - L'entreprise créée apparaît dans "En attente"
   - Badge "Pending" affiché en orange
   - Email, téléphone, site web cliquables
   - TalentDays affichés en chips
   - Boutons "Confirmer" et "Rejeter" visibles

---

### Test 3: Confirmation Entreprise

**Étapes**:
1. Dans la page admin, sur l'entreprise "TechCorp Solutions"
2. Cliquer "Confirmer"
3. Confirmer dans l'alerte
4. ✅ **Vérifications**:
   - Badge passe à "Confirmed" (vert)
   - Boutons actions disparaissent
   - Email confirmation envoyé à l'entreprise
   - Filtrer par "Confirmées" → entreprise visible

---

### Test 4: Réservation Meeting Talent (Future)

**Prérequis**: Entreprise confirmée

**Étapes**:
1. Se connecter en tant qu'entreprise (ou admin)
2. Aller sur page TalentDay
3. Sélectionner un talent
4. Cliquer "Réserver un meeting"
5. POST `/api/companies/:companyId/book` avec:
   ```json
   {
     "talentId": "...",
     "talentDayId": "...",
     "notes": "Meeting 30min - stack React/Node"
   }
   ```
6. ✅ **Vérifications**:
   - Meeting ajouté dans `meetingRequests`
   - Email talent envoyé
   - Email entreprise envoyé (confirmation)
   - Compteur meetings mis à jour

---

### Test 5: Validation & Sécurité

#### Test Email Dupliqué
1. Réinscrire avec même email `contact@techcorp.be`
2. ✅ **Attendu**: Erreur 400 "Email déjà enregistré"

#### Test Entreprise Non Confirmée
1. Nouvelle inscription avec statut "pending"
2. Tenter de booker un talent (via API)
3. ✅ **Attendu**: Erreur 403 "Seules les entreprises confirmées peuvent réserver"

#### Test Routes Admin
1. Se connecter en tant qu'utilisateur standard
2. Tenter d'accéder `/api/companies` (GET)
3. ✅ **Attendu**: Erreur 403 "Accès admin requis"

---

## 🔍 Vérification Base de Données

### Via MongoDB Compass ou Shell
```javascript
// Voir toutes les inscriptions
db.companyregistrations.find().pretty()

// Filtrer par statut
db.companyregistrations.find({ status: "pending" })

// Voir meetings réservés
db.companyregistrations.find({ "meetingRequests.0": { $exists: true } })
```

---

## 📧 Vérification Emails (Logs Backend)

Dans le terminal backend, chercher ces logs:

```
✅ Email envoyé avec succès
📧 Email de confirmation envoyé à: contact@techcorp.be
📧 Email notification admin envoyé
📧 Email de statut envoyé à l'entreprise
📧 Email meeting talent envoyé
```

Si email service non configuré, voir:
```
⚠️ Email service non configuré - Email simulé
```

---

## 🐛 Troubleshooting

### Problème: "Cannot POST /api/companies"
**Solution**: Vérifier que `companyRoutes` est monté dans `server.js`:
```javascript
app.use('/api/companies', companyRoutes);
```

### Problème: "isAdmin is not a function"
**Solution**: Vérifier import dans `companyRoutes.js`:
```javascript
import { isAdmin } from '../middleware/isAdmin.js';
```

### Problème: "OverwriteModelError: Cannot overwrite model"
**Solution**: ✅ Déjà corrigé - tous les modèles utilisent:
```javascript
const Model = mongoose.models.Model || mongoose.model('Model', schema);
```

### Problème: Page admin vide
**Solution**: Vérifier que l'utilisateur a `role: 'admin'` dans la DB:
```javascript
db.users.updateOne({ email: "admin@talentproof.be" }, { $set: { role: "admin" } })
```

---

## 🎯 Checklist Finale

### Backend
- [x] Modèle `CompanyRegistration` créé
- [x] Controller avec 5 fonctions
- [x] Routes montées dans `server.js`
- [x] Validation express-validator
- [x] Middleware protection (protect, isAdmin)
- [x] 5 templates emails HTML
- [x] Gestion erreurs + logging

### Frontend
- [x] Page `/company-registration` (publique)
- [x] Page `/dashboard/admin/companies` (admin)
- [x] Validation formulaire client
- [x] Gestion états (loading, success, errors)
- [x] UI responsive avec Tailwind
- [x] Intégration Sidebar + TalentDayDetail
- [x] Routes montées dans App.jsx

### Sécurité
- [x] Routes admin protégées
- [x] Validation email unique
- [x] Vérification statut (canBook)
- [x] CSRF protection (api instance)
- [x] express-validator sur mutations

---

## 🚀 Next Steps (Optionnel)

1. **Dashboard Entreprise**: Page pour entreprises confirmées avec leurs meetings
2. **Gestion Meetings**: UI admin pour voir tous les meetings réservés
3. **Calendrier**: Système de slots horaires pour meetings
4. **Notifications Real-time**: WebSocket pour alertes admin
5. **Export Excel**: Liste entreprises inscrites
6. **Statistiques**: Dashboard analytics inscriptions

---

## 📞 Support

- **Logs Backend**: Terminal `backend` (port 5000)
- **Logs Frontend**: Terminal `client` (port 5174)
- **Console Browser**: F12 → Console (erreurs axios/react)
- **Network Tab**: F12 → Network (vérifier requêtes API)

---

## ✅ Statut Actuel

**Backend**: ✅ Opérationnel (http://localhost:5000)
**Frontend**: ✅ Opérationnel (http://localhost:5174)
**Base de données**: ✅ Connectée (MongoDB)

**Système prêt pour tests end-to-end !**

---

*Document généré le 17 novembre 2025*
*Projet: TalentProof - Inscription Entreprises TalentDay*
