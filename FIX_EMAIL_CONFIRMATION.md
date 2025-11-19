# 🔧 FIX : Email de confirmation non reçu

## 🎯 Problème
Les utilisateurs ne reçoivent pas l'email de confirmation lors de l'inscription.

## 🔍 Cause
**Render bloque le port SMTP 587** sur les plans gratuits. Les connexions vers `mail.infomaniak.com:587` timeout systématiquement.

## ✅ Solution : Utiliser le port 2525

### Étape 1 : Modifier les variables d'environnement sur Render

1. **Connectez-vous à Render** : https://dashboard.render.com
2. **Sélectionnez votre service backend** (talentproof-backend ou similaire)
3. **Allez dans l'onglet "Environment"**
4. **Modifiez la variable `EMAIL_PORT`** :
   - Ancienne valeur : `587`
   - Nouvelle valeur : **`2525`**
5. **Sauvegardez** (bouton "Save Changes")
6. **Attendez le redéploiement automatique** (2-3 minutes)

### Étape 2 : Vérifier les autres variables email

Assurez-vous que ces variables sont correctement configurées :

```env
EMAIL_HOST=mail.infomaniak.com
EMAIL_PORT=2525                           # ⚠️ PORT 2525 (pas 587)
EMAIL_USER=info@princeaman.dev
EMAIL_PASS=***VOTRE_NOUVEAU_MOT_DE_PASSE***  # ⚠️ Changez après le leak GitHub
EMAIL_FROM=TalentProof <info@princeaman.dev>
```

### Étape 3 : Tester l'inscription

1. Allez sur https://talentproof.onrender.com/register
2. Créez un nouveau compte entreprise avec un **email réel**
3. Vérifiez votre boîte de réception (et spam)
4. Vous devriez recevoir l'email avec le template professionnel TalentProof

---

## 🔐 IMPORTANT : Sécurité

**Vous DEVEZ changer votre mot de passe email Infomaniak** car il a été exposé sur GitHub.

### Changer le mot de passe Infomaniak

1. **Connectez-vous à Infomaniak** : https://manager.infomaniak.com
2. **Allez dans "Emails"**
3. **Sélectionnez info@princeaman.dev**
4. **Changez le mot de passe**
5. **Mettez à jour `EMAIL_PASS` sur Render** avec le nouveau mot de passe

---

## 📊 Vérification des logs

Après le changement, surveillez les logs Render :

### Logs de succès attendus :
```
📧 Configuration Email: { host: 'mail.infomaniak.com', port: 2525, secure: false, user: 'info@princeaman.dev' }
✅ Serveur email prêt
✅ Email envoyé avec succès: <message-id>
```

### Logs d'erreur (si ça ne marche toujours pas) :
```
❌ Erreur envoi email: Error: Connection timeout
```

Si vous voyez l'erreur de timeout avec le port 2525, alors :
- Vérifiez que le mot de passe est correct
- Vérifiez que l'email `info@princeaman.dev` existe bien sur Infomaniak
- Contactez le support Infomaniak pour s'assurer que le port 2525 est activé

---

## 🚀 Alternative : Upgrade Render Starter

Si le port 2525 ne fonctionne pas, vous pouvez upgrader vers **Render Starter** ($7/mois) :

### Avantages
- ✅ Déblocage de tous les ports SMTP (587, 465, etc.)
- ✅ Plus de ressources (512 MB RAM vs 256 MB)
- ✅ Pas de spin-down après 15 min d'inactivité
- ✅ Support prioritaire

### Comment upgrader
1. Dashboard Render → Votre service
2. Onglet "Settings"
3. Section "Instance Type"
4. Choisir "Starter" au lieu de "Free"
5. Confirmer et entrer les informations de paiement

---

## 📋 Checklist de résolution

- [ ] Changé `EMAIL_PORT` de 587 à 2525 sur Render
- [ ] Vérifié que toutes les variables email sont correctes
- [ ] Redéploiement Render terminé
- [ ] Testé une inscription avec email réel
- [ ] Email de confirmation reçu
- [ ] Changé le mot de passe Infomaniak (SÉCURITÉ)
- [ ] Mis à jour `EMAIL_PASS` sur Render

---

## 🆘 Si ça ne marche toujours pas

1. **Vérifiez les logs Render** pour voir l'erreur exacte
2. **Testez en local** avec le port 2525 pour vérifier que c'est bien Render le problème
3. **Contactez Infomaniak** pour confirmer que le port 2525 est disponible
4. **Envisagez Render Starter** ($7/mois) pour débloquer tous les ports

---

## 📞 Support

- **Infomaniak** : https://www.infomaniak.com/fr/support
- **Render** : https://render.com/docs/support
- **Documentation Nodemailer** : https://nodemailer.com/smtp/

---

**Date de création** : 19 novembre 2025
**Status** : ⏳ Action requise - Changement du port EMAIL_PORT nécessaire
