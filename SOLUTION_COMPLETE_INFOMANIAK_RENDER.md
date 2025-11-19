# 🚀 SOLUTIONS POUR UTILISER INFOMANIAK SUR RENDER

## ✅ SOLUTION #1 : TESTER LE PORT 2525 (RAPIDE)

Le port 2525 est un **port alternatif SMTP** souvent non bloqué par les hébergeurs cloud.

### Configuration sur Render

1. Allez sur **Render Dashboard → Votre service backend**
2. **Environment** → Trouvez `EMAIL_PORT`
3. Changez `587` → `2525`
4. **Save Changes**

### Test depuis Render (après déploiement)

Créez un endpoint test dans votre API :

```javascript
// Dans routes/testRoutes.js
router.get('/test-smtp', async (req, res) => {
  try {
    await sendEmail({
      to: 'info@princeaman.dev',
      subject: 'Test SMTP depuis Render',
      html: '<p>Test connexion port ' + process.env.EMAIL_PORT + '</p>',
    });
    res.json({ success: true, message: 'Email envoyé !' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

Puis appelez : `https://votre-app.onrender.com/api/test-smtp`

---

## ✅ SOLUTION #2 : UPGRADE RENDER STARTER ($7/mois)

Le plan **Starter** débloque tous les ports SMTP.

### Avantages :
- ✅ Ports 465, 587, 2525 débloqués
- ✅ Plus de ressources (512 MB RAM vs 256 MB)
- ✅ Support prioritaire
- ✅ Pas de spin down automatique
- ✅ Build minutes plus généreuses

### Comment :
1. Dashboard Render → Votre service
2. **Settings** → **Plan** → **Upgrade to Starter**
3. Confirmer le paiement ($7/mois)

---

## ✅ SOLUTION #3 : AUTORISATION RENDER

Demander l'autorisation explicite des ports SMTP au support Render.

### Email au support :

```
À: support@render.com
Sujet: Déblocage ports SMTP pour application professionnelle

Bonjour l'équipe Render,

Je développe une application SaaS (TalentProof) sur votre plateforme.
Mon application nécessite l'envoi d'emails transactionnels (confirmations d'inscription, réinitialisation de mot de passe).

J'utilise mon propre serveur SMTP professionnel Infomaniak (mail.infomaniak.com).
Je rencontre actuellement des timeouts de connexion (ETIMEDOUT) sur le port 587.

Pourriez-vous autoriser/débloquer les ports SMTP (587, 465, 2525) pour mon service ?

Informations du service :
- Service ID : [VOTRE_SERVICE_ID]
- Service name: [NOM_DE_VOTRE_SERVICE]
- Plan actuel : Free/Starter
- SMTP provider : Infomaniak (mail.infomaniak.com)

Merci pour votre aide !

Cordialement,
[Votre nom]
```

---

## ✅ SOLUTION #4 : UTILISER UN RELAY SMTP

Si Infomaniak ne fonctionne toujours pas, utilisez un service de relay SMTP qui **accepte Infomaniak comme backend**.

### Option A : SMTP2GO (Relay compatible)

SMTP2GO permet de relayer vos emails Infomaniak :

1. Créez un compte sur [smtp2go.com](https://www.smtp2go.com) (gratuit jusqu'à 1000 emails/mois)
2. Ajoutez votre domaine `princeaman.dev`
3. Configurez les DNS selon leurs instructions
4. Utilisez leurs serveurs SMTP :

```env
EMAIL_HOST=mail.smtp2go.com
EMAIL_PORT=2525
EMAIL_USER=votre_user_smtp2go
EMAIL_PASS=votre_pass_smtp2go
EMAIL_FROM=TalentProof <info@princeaman.dev>
```

**Avantage** : Les emails proviennent toujours de votre domaine Infomaniak !

### Option B : Mailgun (Relay)

Similaire à SMTP2GO, avec un plan gratuit.

---

## ✅ SOLUTION #5 : MIGRER VERS UN HÉBERGEUR PLUS PERMISSIF

Si aucune des solutions ci-dessus ne fonctionne :

### Railway.app
- Ports SMTP **non bloqués** par défaut
- Pricing similaire à Render
- Migration facile depuis GitHub

### DigitalOcean App Platform
- Contrôle total du réseau
- $5/mois (plan Starter)
- Ports SMTP ouverts

### Heroku
- Ports SMTP fonctionnent sur plan payant ($7/mois)

---

## 📊 TABLEAU RÉCAPITULATIF

| Solution | Coût | Difficulté | Fiabilité | Recommandation |
|----------|------|------------|-----------|----------------|
| **Port 2525** | Gratuit | ⭐ Facile | ⚠️ À tester | ✅ **ESSAYER EN PREMIER** |
| **Render Starter** | $7/mois | ⭐ Très facile | ✅ Excellent | ✅ **MEILLEUR RAPPORT QUALITÉ/PRIX** |
| **Support Render** | Gratuit | ⭐⭐ Moyen | ⚠️ Incertain | ⚠️ Peut prendre du temps |
| **Relay SMTP** | Gratuit/Payant | ⭐⭐⭐ Complexe | ✅ Bon | ⚠️ Configuration supplémentaire |
| **Autre hébergeur** | $5-7/mois | ⭐⭐⭐⭐ Difficile | ✅ Excellent | ⚠️ Migration nécessaire |

---

## 🎯 MON CONSEIL PROFESSIONNEL

### Option immédiate (GRATUIT) :
1. **Testez le port 2525** sur Render (changez juste la variable d'environnement)
2. Si ça ne fonctionne pas → **Contactez le support Render** (réponse sous 24-48h)

### Option professionnelle ($7/mois) :
3. **Upgrade vers Render Starter** → Résout tous les problèmes SMTP instantanément

### Pourquoi Render Starter vaut l'investissement :
- Votre app est **professionnelle** (TalentProof)
- $7/mois est **dérisoire** pour une app en production
- Vous gagnez aussi : plus de RAM, pas de spin down, meilleure performance
- Vous **gardez Infomaniak** (votre requirement absolu)

---

## 🔧 ACTIONS IMMÉDIATES

### 1. TESTER LE PORT 2525 SUR RENDER

Sur Render Dashboard :
- Environment → `EMAIL_PORT` → Changez en `2525`
- Save → Déploiement automatique
- Testez une inscription/réinitialisation de mot de passe

### 2. SI LE PORT 2525 NE FONCTIONNE PAS

**Option A** : Upgrade Render Starter ($7/mois)
**Option B** : Contacter le support Render
**Option C** : Migrer vers Railway.app (ports SMTP non bloqués)

---

## ✅ CONCLUSION

Vous **POUVEZ absolument utiliser Infomaniak sur Render**.

Le port 587 fonctionne parfaitement en local (confirmé par notre test).
Le problème est uniquement la restriction réseau de Render.

**Solution recommandée** : Testez le port 2525, sinon upgrade vers Render Starter.

Votre stack reste identique : Node.js + Infomaniak SMTP + Render.
Vous ne changez **rien** à votre code, juste la configuration réseau.

---

**Besoin d'aide pour implémenter une de ces solutions ?** Je suis là ! 🚀
