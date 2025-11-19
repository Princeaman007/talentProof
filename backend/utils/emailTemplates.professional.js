/**
 * ═══════════════════════════════════════════════════════════════════════
 * TALENTPROOF - SYSTÈME D'EMAILS PROFESSIONNELS
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * Identité visuelle :
 * - Couleur principale : Bleu #2E4A9E (couleur du logo)
 * - Couleur secondaire : Bleu clair #4A6FD9
 * - Couleur CTA : Orange #F97316
 * - Logo : Badge bleu avec coche blanche + texte "TalentProof"
 * 
 * Structure commune :
 * 1. Header : Logo TalentProof centré sur fond blanc
 * 2. Hero : Bannière bleue avec titre
 * 3. Content : Contenu dynamique
 * 4. Footer : Infos de contact, logo mini, mentions légales
 */

// ═══════════════════════════════════════════════════════════════════════
// LOGO TALENTPROOF EN SVG (Base64 embarqué)
// ═══════════════════════════════════════════════════════════════════════

const LOGO_SVG = `
<svg width="180" height="50" viewBox="0 0 180 50" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Badge circulaire bleu avec coche -->
  <circle cx="25" cy="25" r="20" fill="#2E4A9E"/>
  <path d="M18 25L22 29L32 19" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  
  <!-- Texte TalentProof -->
  <text x="52" y="30" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="#2E4A9E">
    TalentProof
  </text>
</svg>
`;

const LOGO_BASE64 = `data:image/svg+xml;base64,${Buffer.from(LOGO_SVG).toString('base64')}`;

// ═══════════════════════════════════════════════════════════════════════
// TEMPLATE DE BASE - STRUCTURE COMMUNE
// ═══════════════════════════════════════════════════════════════════════

/**
 * Template de base réutilisable pour tous les emails
 * @param {string} heroTitle - Titre principal dans la bannière hero
 * @param {string} content - Contenu HTML dynamique
 * @param {string} heroColor - Couleur de la bannière hero (défaut: bleu principal)
 */
const baseTemplate = (heroTitle, content, heroColor = '#2E4A9E') => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${heroTitle} - TalentProof</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #F3F4F6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  
  <!-- Wrapper principal -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #F3F4F6;">
    <tr>
      <td style="padding: 40px 20px;">
        
        <!-- Container principal (600px) -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;" align="center">
          
          <!-- HEADER : Logo TalentProof -->
          <tr>
            <td style="padding: 30px 40px; text-align: center; background-color: #FFFFFF;">
              <img src="${LOGO_BASE64}" alt="TalentProof - Validez vos talents" width="180" height="50" style="display: block; margin: 0 auto; max-width: 100%; height: auto;" />
            </td>
          </tr>
          
          <!-- HERO : Bannière avec titre -->
          <tr>
            <td style="background: linear-gradient(135deg, ${heroColor} 0%, #1E3A8A 100%); padding: 40px 40px; text-align: center;">
              <h1 style="margin: 0; padding: 0; color: #FFFFFF; font-size: 28px; font-weight: 700; line-height: 1.3;">
                ${heroTitle}
              </h1>
            </td>
          </tr>
          
          <!-- CONTENT : Contenu dynamique -->
          <tr>
            <td style="padding: 40px 40px; color: #374151; font-size: 16px; line-height: 1.6;">
              ${content}
            </td>
          </tr>
          
          <!-- FOOTER : Infos de contact -->
          <tr>
            <td style="background-color: #F9FAFB; padding: 30px 40px; border-top: 1px solid #E5E7EB;">
              
              <!-- Logo miniature -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="text-align: center; padding-bottom: 20px;">
                    <img src="${LOGO_BASE64}" alt="TalentProof" width="120" height="33" style="display: block; margin: 0 auto; opacity: 0.7;" />
                  </td>
                </tr>
              </table>
              
              <!-- Slogan -->
              <p style="margin: 0 0 20px 0; text-align: center; color: #2E4A9E; font-size: 16px; font-weight: 600;">
                 Validez vos talents, accélérez votre carrière
              </p>
              
              <!-- Informations de contact -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="text-align: center; color: #6B7280; font-size: 14px; line-height: 1.8;">
                    <p style="margin: 5px 0;">
                      <strong style="color: #2E4A9E;">TalentProof</strong><br>
                      Avenue de Lille 4 A52, 4020 Liège, Belgique
                    </p>
                    <p style="margin: 15px 0;">
                      <a href="mailto:info@princeaman.dev" style="color: #2E4A9E; text-decoration: none;"> info@princeaman.dev</a><br>
                      <a href="tel:+32467620878" style="color: #2E4A9E; text-decoration: none;"> +32 467 62 08 78</a>
                    </p>
                    <p style="margin: 15px 0;">
                      <a href="https://talentproof-client.onrender.com" style="color: #2E4A9E; text-decoration: none; font-weight: 600;"> Visitez notre plateforme</a>
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- Divider -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding: 20px 0;">
                    <div style="height: 1px; background-color: #E5E7EB;"></div>
                  </td>
                </tr>
              </table>
              
              <!-- Mentions légales -->
              <p style="margin: 0; text-align: center; color: #9CA3AF; font-size: 12px; line-height: 1.6;">
                Cet email est automatique, merci de ne pas y répondre directement.<br>
                Pour toute question, contactez-nous à <a href="mailto:info@princeaman.dev" style="color: #2E4A9E; text-decoration: none;">info@princeaman.dev</a>
              </p>
              
              <!-- Copyright -->
              <p style="margin: 15px 0 0 0; text-align: center; color: #9CA3AF; font-size: 12px;">
                © ${new Date().getFullYear()} TalentProof. Tous droits réservés.
              </p>
              
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>
`;

// ═══════════════════════════════════════════════════════════════════════
// COMPOSANTS RÉUTILISABLES
// ═══════════════════════════════════════════════════════════════════════

/**
 * Bouton CTA (Call To Action)
 */
const ctaButton = (text, url, color = '#F97316') => `
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
  <tr>
    <td style="text-align: center; padding: 25px 0;">
      <a href="${url}" style="display: inline-block; background: linear-gradient(135deg, ${color} 0%, #EA580C 100%); color: #FFFFFF; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        ${text}
      </a>
    </td>
  </tr>
</table>
`;

/**
 * Lien de secours (fallback)
 */
const fallbackLink = (url) => `
<p style="margin: 20px 0; padding: 15px; background-color: #F9FAFB; border-radius: 6px; font-size: 13px; color: #6B7280; word-break: break-all;">
  <strong>Le bouton ne fonctionne pas ?</strong><br>
  Copiez et collez ce lien dans votre navigateur :<br>
  <a href="${url}" style="color: #2E4A9E; text-decoration: none;">${url}</a>
</p>
`;

/**
 * Encadré d'information (highlight)
 */
const infoBox = (content, icon = '', color = '#FEF3C7', borderColor = '#F59E0B') => `
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
  <tr>
    <td style="padding: 20px 0;">
      <div style="background-color: ${color}; border-left: 4px solid ${borderColor}; padding: 20px; border-radius: 6px;">
        <p style="margin: 0; color: #1F2937; font-size: 15px; line-height: 1.6;">
          <strong style="font-size: 20px;">${icon}</strong> ${content}
        </p>
      </div>
    </td>
  </tr>
</table>
`;

/**
 * Tableau de données
 */
const dataTable = (rows) => {
  const rowsHtml = rows.map(([label, value]) => `
    <tr>
      <td style="padding: 12px 15px; border-bottom: 1px solid #E5E7EB; color: #6B7280; font-weight: 600; width: 40%;">
        ${label}
      </td>
      <td style="padding: 12px 15px; border-bottom: 1px solid #E5E7EB; color: #1F2937;">
        ${value}
      </td>
    </tr>
  `).join('');
  
  return `
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 20px 0; border-radius: 8px; overflow: hidden; border: 1px solid #E5E7EB;">
  ${rowsHtml}
</table>
  `;
};

/**
 * Liste à puces stylisée
 */
const styledList = (items) => {
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 8px 0; vertical-align: top; width: 30px;">
        <span style="display: inline-block; width: 8px; height: 8px; background-color: #2E4A9E; border-radius: 50%; margin-top: 6px;"></span>
      </td>
      <td style="padding: 8px 0; color: #374151; font-size: 15px; line-height: 1.6;">
        ${item}
      </td>
    </tr>
  `).join('');
  
  return `
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 15px 0;">
  ${itemsHtml}
</table>
  `;
};

// ═══════════════════════════════════════════════════════════════════════
// 1. EMAIL DE CONFIRMATION D'INSCRIPTION (ENTREPRISE)
// ═══════════════════════════════════════════════════════════════════════

export const confirmationEmailTemplate = (companyName, confirmationLink) => {
  const content = `
    <p style="margin: 0 0 20px 0; font-size: 18px; color: #1F2937;">
      Bonjour <strong>${companyName}</strong> ! 
    </p>
    
    <p style="margin: 0 0 20px 0; color: #374151;">
      Merci de vous être inscrit sur <strong>TalentProof</strong>, la plateforme de recrutement qui connecte les entreprises avec des talents tech validés et certifiés.
    </p>
    
    <p style="margin: 0 0 25px 0; color: #374151;">
      Pour activer votre compte et accéder à notre catalogue de talents, confirmez votre adresse email en cliquant sur le bouton ci-dessous :
    </p>
    
    ${ctaButton(' Confirmer mon email', confirmationLink)}
    
    ${fallbackLink(confirmationLink)}
    
    ${infoBox('<strong> Ce lien expire dans 24 heures.</strong><br>Si vous n\'avez pas créé de compte sur TalentProof, vous pouvez ignorer cet email en toute sécurité.', '', '#DBEAFE', '#2E4A9E')}
    
    <h3 style="margin: 30px 0 15px 0; color: #2E4A9E; font-size: 18px;">
       Après confirmation, vous pourrez :
    </h3>
    
    ${styledList([
      'Parcourir notre catalogue de talents tech validés',
      'Consulter les portfolios et projets des développeurs',
      'Contacter directement les talents qui correspondent à vos besoins',
      'Participer à nos TalentDays pour rencontrer les candidats',
      'Recevoir des recommandations personnalisées'
    ])}
    
    <p style="margin: 25px 0 0 0; color: #6B7280; font-size: 15px;">
      Notre équipe est là pour vous accompagner dans votre recrutement ! 
    </p>
  `;
  
  return baseTemplate('Bienvenue sur TalentProof ! ', content);
};

// ═══════════════════════════════════════════════════════════════════════
// 2. EMAIL DE RÉINITIALISATION DE MOT DE PASSE
// ═══════════════════════════════════════════════════════════════════════

export const resetPasswordTemplate = (companyName, resetLink) => {
  const content = `
    <p style="margin: 0 0 20px 0; font-size: 18px; color: #1F2937;">
      Bonjour <strong>${companyName}</strong>,
    </p>
    
    <p style="margin: 0 0 20px 0; color: #374151;">
      Vous avez demandé à réinitialiser votre mot de passe sur <strong>TalentProof</strong>.
    </p>
    
    <p style="margin: 0 0 25px 0; color: #374151;">
      Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe sécurisé :
    </p>
    
    ${ctaButton(' Réinitialiser mon mot de passe', resetLink, '#DC2626')}
    
    ${fallbackLink(resetLink)}
    
    ${infoBox('<strong> Ce lien expire dans 1 heure.</strong><br>Si vous n\'avez pas demandé cette réinitialisation, ignorez cet email. Votre mot de passe actuel restera inchangé.', '', '#FEE2E2', '#DC2626')}
    
    <h3 style="margin: 30px 0 15px 0; color: #2E4A9E; font-size: 18px;">
      ️ Conseils de sécurité :
    </h3>
    
    ${styledList([
      'Utilisez un mot de passe unique et complexe',
      'Combinez lettres majuscules, minuscules, chiffres et symboles',
      'Ne partagez jamais votre mot de passe',
      'Changez régulièrement vos identifiants',
      'Activez la double authentification si disponible'
    ])}
    
    <p style="margin: 25px 0 0 0; color: #6B7280; font-size: 15px;">
      En cas de problème, contactez notre équipe support : 
      <a href="mailto:info@princeaman.dev" style="color: #2E4A9E; text-decoration: none;">info@princeaman.dev</a>
    </p>
  `;
  
  return baseTemplate('Réinitialisation de mot de passe', content, '#DC2626');
};

// ═══════════════════════════════════════════════════════════════════════
// 3. EMAIL DE NOTIFICATION CONTACT TALENT (À PRINCE)
// ═══════════════════════════════════════════════════════════════════════

export const contactNotificationTemplate = (talentInfo, recruteurInfo) => {
  const content = `
    <p style="margin: 0 0 20px 0; font-size: 18px; color: #1F2937;">
      <strong> Nouvelle demande de contact pour un talent !</strong>
    </p>
    
    <p style="margin: 0 0 25px 0; color: #374151;">
      Un recruteur souhaite entrer en contact avec l'un de vos talents validés TalentProof.
    </p>
    
    <h3 style="margin: 30px 0 15px 0; color: #2E4A9E; font-size: 18px;">
       Informations du talent
    </h3>
    
    ${dataTable([
      ['‍ Prénom', talentInfo.prenom],
      [' Technologies', talentInfo.technologies.join(', ')],
      [' Score', `${talentInfo.scoreTest}/100 (${talentInfo.plateforme})`],
      [' Niveau', talentInfo.niveau || 'Non spécifié']
    ])}
    
    <h3 style="margin: 30px 0 15px 0; color: #2E4A9E; font-size: 18px;">
       Informations du recruteur
    </h3>
    
    ${dataTable([
      [' Nom', recruteurInfo.nom],
      [' Email', `<a href="mailto:${recruteurInfo.email}" style="color: #2E4A9E; text-decoration: none;">${recruteurInfo.email}</a>`],
      [' Téléphone', `<a href="tel:${recruteurInfo.tel}" style="color: #2E4A9E; text-decoration: none;">${recruteurInfo.tel}</a>`],
      [' Entreprise', recruteurInfo.entreprise]
    ])}
    
    <h3 style="margin: 30px 0 15px 0; color: #2E4A9E; font-size: 18px;">
       Message du recruteur
    </h3>
    
    <div style="background-color: #F9FAFB; border-left: 4px solid #2E4A9E; padding: 20px; border-radius: 6px; margin: 20px 0;">
      <p style="margin: 0; color: #374151; line-height: 1.6; white-space: pre-wrap;">${recruteurInfo.message}</p>
    </div>
    
    ${infoBox(`
      <strong> Actions à effectuer :</strong><br><br>
      ${styledList([
        'Contacter le recruteur par email ou téléphone',
        'Vérifier la disponibilité du talent',
        'Envoyer le CV complet et les coordonnées',
        'Organiser une mise en relation si pertinent'
      ])}
    `, '', '#DBEAFE', '#2E4A9E')}
    
    <p style="margin: 25px 0 0 0; text-align: center;">
      <a href="mailto:${recruteurInfo.email}?subject=TalentProof - Contact talent ${talentInfo.prenom}" style="display: inline-block; background-color: #2E4A9E; color: #FFFFFF; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: 600; font-size: 15px;">
         Répondre au recruteur
      </a>
    </p>
  `;
  
  return baseTemplate('Nouvelle demande de contact', content, '#059669');
};

// ═══════════════════════════════════════════════════════════════════════
// 4. EMAIL DE CONFIRMATION DEMANDE CONTACT (AU RECRUTEUR)
// ═══════════════════════════════════════════════════════════════════════

export const contactConfirmationTemplate = (recruteurNom, talentPrenom) => {
  const content = `
    <p style="margin: 0 0 20px 0; font-size: 18px; color: #1F2937;">
      Bonjour <strong>${recruteurNom}</strong> ! 
    </p>
    
    <p style="margin: 0 0 20px 0; color: #374151;">
      Merci pour votre intérêt pour <strong>${talentPrenom}</strong>, l'un de nos talents validés TalentProof.
    </p>
    
    ${infoBox('<strong> Demande bien reçue !</strong><br>Votre demande a été transmise à notre équipe et nous allons la traiter dans les plus brefs délais.', '', '#D1FAE5', '#059669')}
    
    <h3 style="margin: 30px 0 15px 0; color: #2E4A9E; font-size: 18px;">
      ️ Prochaines étapes
    </h3>
    
    ${styledList([
      '<strong>Analyse de votre demande</strong> - Notre équipe étudie votre profil et vos besoins',
      '<strong>Vérification disponibilité</strong> - Nous contactons le talent pour confirmer son intérêt',
      '<strong>Envoi du CV complet</strong> - Vous recevrez le dossier complet du candidat sous 24-48h',
      '<strong>Mise en relation</strong> - Organisation d\'un premier échange si les deux parties sont intéressées'
    ])}
    
    ${infoBox('<strong> Délai de réponse : 24-48 heures maximum</strong><br>Nous vous recontacterons rapidement avec les informations complètes sur ce talent.', '️', '#FEF3C7', '#F59E0B')}
    
    <h3 style="margin: 30px 0 15px 0; color: #2E4A9E; font-size: 18px;">
       Pourquoi TalentProof ?
    </h3>
    
    ${styledList([
      '<strong>Talents validés</strong> - Tous nos candidats ont passé des tests techniques certifiés',
      '<strong>Portfolios vérifiés</strong> - Projets concrets et compétences démontrées',
      '<strong>Gain de temps</strong> - Pré-sélection rigoureuse pour vous',
      '<strong>Accompagnement</strong> - Support tout au long du processus de recrutement'
    ])}
    
    <p style="margin: 25px 0 0 0; color: #6B7280; font-size: 15px;">
      Des questions en attendant notre retour ? Contactez-nous à 
      <a href="mailto:info@princeaman.dev" style="color: #2E4A9E; text-decoration: none;">info@princeaman.dev</a> 
      ou au <a href="tel:+32467620878" style="color: #2E4A9E; text-decoration: none;">+32 467 62 08 78</a>.
    </p>
  `;
  
  return baseTemplate('Demande bien reçue ! ', content, '#059669');
};

// ═══════════════════════════════════════════════════════════════════════
// 5. EMAIL DE CONTACT GÉNÉRAL - NOTIFICATION (À PRINCE)
// ═══════════════════════════════════════════════════════════════════════

export const generalContactNotificationTemplate = (contactInfo) => {
  const content = `
    <p style="margin: 0 0 20px 0; font-size: 18px; color: #1F2937;">
      <strong> Nouveau message via le formulaire de contact</strong>
    </p>
    
    <p style="margin: 0 0 25px 0; color: #374151;">
      Un visiteur a utilisé le formulaire de contact sur TalentProof.
    </p>
    
    ${dataTable([
      [' Nom', contactInfo.nom],
      [' Email', `<a href="mailto:${contactInfo.email}" style="color: #2E4A9E; text-decoration: none;">${contactInfo.email}</a>`],
      [' Téléphone', contactInfo.telephone ? `<a href="tel:${contactInfo.telephone}" style="color: #2E4A9E; text-decoration: none;">${contactInfo.telephone}</a>` : 'Non renseigné'],
      [' Entreprise', contactInfo.entreprise || 'Non renseignée'],
      [' Sujet', `<strong>${contactInfo.sujet}</strong>`]
    ])}
    
    <h3 style="margin: 30px 0 15px 0; color: #2E4A9E; font-size: 18px;">
       Message
    </h3>
    
    <div style="background-color: #F9FAFB; border-left: 4px solid #2E4A9E; padding: 20px; border-radius: 6px; margin: 20px 0;">
      <p style="margin: 0; color: #374151; line-height: 1.6; white-space: pre-wrap;">${contactInfo.message}</p>
    </div>
    
    <p style="margin: 25px 0 0 0; text-align: center;">
      <a href="mailto:${contactInfo.email}?subject=Re: ${contactInfo.sujet}" style="display: inline-block; background-color: #2E4A9E; color: #FFFFFF; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: 600; font-size: 15px;">
         Répondre à ${contactInfo.nom}
      </a>
    </p>
  `;
  
  return baseTemplate('Nouveau message de contact', content, '#8B5CF6');
};

// ═══════════════════════════════════════════════════════════════════════
// 6. EMAIL DE CONTACT GÉNÉRAL - CONFIRMATION (AU VISITEUR)
// ═══════════════════════════════════════════════════════════════════════

export const generalContactConfirmationTemplate = (nom) => {
  const content = `
    <p style="margin: 0 0 20px 0; font-size: 18px; color: #1F2937;">
      Bonjour <strong>${nom}</strong> ! 
    </p>
    
    <p style="margin: 0 0 20px 0; color: #374151;">
      Merci de nous avoir contactés via <strong>TalentProof</strong>.
    </p>
    
    ${infoBox('<strong> Message bien reçu !</strong><br>Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.', '', '#D1FAE5', '#059669')}
    
    <h3 style="margin: 30px 0 15px 0; color: #2E4A9E; font-size: 18px;">
      ️ Que se passe-t-il maintenant ?
    </h3>
    
    ${styledList([
      '<strong>Lecture de votre message</strong> - Notre équipe prend connaissance de votre demande',
      '<strong>Analyse et préparation</strong> - Nous préparons une réponse adaptée à vos besoins',
      '<strong>Réponse personnalisée</strong> - Vous recevrez notre retour sous 24-48 heures maximum',
      '<strong>Suivi</strong> - Nous restons disponibles pour toute question complémentaire'
    ])}
    
    ${infoBox('<strong> Délai de réponse : 24-48 heures maximum</strong><br>Notre équipe vous recontactera rapidement pour répondre à votre demande.', '️', '#FEF3C7', '#F59E0B')}
    
    <h3 style="margin: 30px 0 15px 0; color: #2E4A9E; font-size: 18px;">
       Découvrez TalentProof
    </h3>
    
    <p style="margin: 0 0 15px 0; color: #374151;">
      En attendant notre réponse, découvrez comment TalentProof révolutionne le recrutement tech :
    </p>
    
    ${styledList([
      '<strong>Pour les talents</strong> - Validez vos compétences et boostez votre employabilité',
      '<strong>Pour les entreprises</strong> - Accédez à des talents pré-qualifiés et certifiés',
      '<strong>TalentDays</strong> - Participez à nos événements de recrutement',
      '<strong>Accompagnement</strong> - Profitez de notre expertise en recrutement tech'
    ])}
    
    <p style="margin: 25px 0; text-align: center;">
      <a href="https://talentproof-client.onrender.com" style="display: inline-block; background: linear-gradient(135deg, #2E4A9E 0%, #1E3A8A 100%); color: #FFFFFF; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: 600; font-size: 15px;">
         Découvrir la plateforme
      </a>
    </p>
    
    <p style="margin: 25px 0 0 0; color: #6B7280; font-size: 15px;">
      Besoin d'une réponse urgente ? Contactez-nous directement au 
      <a href="tel:+32467620878" style="color: #2E4A9E; text-decoration: none;">+32 467 62 08 78</a>.
    </p>
  `;
  
  return baseTemplate('Message bien reçu ! ', content, '#8B5CF6');
};

// ═══════════════════════════════════════════════════════════════════════
// 7. EMAIL DE CONFIRMATION INSCRIPTION TALENTDAY
// ═══════════════════════════════════════════════════════════════════════

export const talentDayConfirmationTemplate = (inscription, talentDay) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  const content = `
    <p style="margin: 0 0 20px 0; font-size: 18px; color: #1F2937;">
      Bonjour <strong>${inscription.prenom}</strong> ! 
    </p>
    
    <p style="margin: 0 0 20px 0; color: #374151;">
      Félicitations ! Votre inscription au TalentDay <strong>"${talentDay.titre}"</strong> a bien été enregistrée.
    </p>
    
    ${infoBox('<strong> Inscription confirmée !</strong><br>Vous êtes maintenant inscrit(e) à cet événement. Préparez-vous à rencontrer des entreprises qui recrutent !', '', '#D1FAE5', '#059669')}
    
    <h3 style="margin: 30px 0 15px 0; color: #2E4A9E; font-size: 18px;">
       Détails de l'événement
    </h3>
    
    ${dataTable([
      [' Événement', talentDay.titre],
      [' Date', formatDate(talentDay.date)],
      [' Lieu', talentDay.lieu],
      [' Horaires', talentDay.horaires || 'À confirmer'],
      [' Places disponibles', `${talentDay.maxParticipants - talentDay.inscriptions.length} / ${talentDay.maxParticipants}`]
    ])}
    
    <div style="background-color: #F9FAFB; padding: 20px; border-radius: 8px; margin: 25px 0;">
      <h4 style="margin: 0 0 10px 0; color: #2E4A9E; font-size: 16px;"> Description</h4>
      <p style="margin: 0; color: #374151; line-height: 1.6;">${talentDay.description}</p>
    </div>
    
    <h3 style="margin: 30px 0 15px 0; color: #2E4A9E; font-size: 18px;">
       Comment se préparer ?
    </h3>
    
    ${styledList([
      '<strong>Mettez à jour votre portfolio</strong> - Assurez-vous que vos projets sont à jour',
      '<strong>Préparez votre pitch</strong> - Soyez prêt à vous présenter en 2 minutes',
      '<strong>Renseignez-vous</strong> - Découvrez les entreprises participantes',
      '<strong>CV à jour</strong> - Apportez plusieurs copies de votre CV',
      '<strong>Questions préparées</strong> - Ayez des questions pertinentes sur les postes',
      '<strong>Tenue professionnelle</strong> - Adoptez une tenue adaptée à un entretien'
    ])}
    
    ${infoBox('<strong> Arrivez 15 minutes en avance</strong><br>Pour vous enregistrer et prendre vos repères avant le début de l\'événement.', '️', '#FEF3C7', '#F59E0B')}
    
    <h3 style="margin: 30px 0 15px 0; color: #2E4A9E; font-size: 18px;">
       Vos informations d'inscription
    </h3>
    
    ${dataTable([
      [' Nom complet', `${inscription.prenom} ${inscription.nom}`],
      [' Email', inscription.email],
      [' Téléphone', inscription.telephone || 'Non renseigné'],
      [' Technologies', inscription.technologies?.join(', ') || 'Non spécifiées']
    ])}
    
    <p style="margin: 25px 0; text-align: center;">
      <a href="https://talentproof-client.onrender.com/talent-days/${talentDay._id}" style="display: inline-block; background: linear-gradient(135deg, #F97316 0%, #EA580C 100%); color: #FFFFFF; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: 600; font-size: 15px;">
         Voir les détails complets
      </a>
    </p>
    
    <p style="margin: 25px 0 0 0; color: #6B7280; font-size: 15px;">
      Questions ou besoin d'annuler votre inscription ? Contactez-nous à 
      <a href="mailto:info@princeaman.dev" style="color: #2E4A9E; text-decoration: none;">info@princeaman.dev</a>.
    </p>
  `;
  
  return baseTemplate('Inscription TalentDay confirmée ! ', content, '#8B5CF6');
};

// ═══════════════════════════════════════════════════════════════════════
// 8. EMAIL INSCRIPTION ENTREPRISE TALENTDAY
// ═══════════════════════════════════════════════════════════════════════

export const companyTalentDayRegistrationTemplate = (companyInfo, talentDays) => {
  const talentDaysHtml = talentDays.map(td => `
    <div style="background-color: #F9FAFB; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #2E4A9E;">
      <p style="margin: 0; color: #1F2937;">
        <strong style="color: #2E4A9E; font-size: 16px;"> ${td.titre}</strong><br>
        <span style="color: #6B7280; font-size: 14px;">
           ${td.lieu} • ${new Date(td.date).toLocaleDateString('fr-FR')}
        </span>
      </p>
    </div>
  `).join('');
  
  const content = `
    <p style="margin: 0 0 20px 0; font-size: 18px; color: #1F2937;">
      Bonjour <strong>${companyInfo.contactPerson}</strong> ! 
    </p>
    
    <p style="margin: 0 0 20px 0; color: #374151;">
      Nous avons bien reçu votre inscription pour participer aux <strong>TalentDays</strong> en tant qu'entreprise.
    </p>
    
    ${infoBox('<strong> Demande en attente de validation</strong><br>Votre inscription est actuellement en cours d\'analyse par notre équipe. Vous recevrez une confirmation sous 24-48 heures.', '️', '#FEF3C7', '#F59E0B')}
    
    <h3 style="margin: 30px 0 15px 0; color: #2E4A9E; font-size: 18px;">
       Récapitulatif de votre inscription
    </h3>
    
    ${dataTable([
      [' Entreprise', companyInfo.companyName],
      [' Contact', companyInfo.contactPerson],
      [' Email', companyInfo.email],
      [' Téléphone', companyInfo.phone],
      [' Site web', companyInfo.website ? `<a href="${companyInfo.website}" style="color: #2E4A9E; text-decoration: none;">${companyInfo.website}</a>` : 'Non renseigné']
    ])}
    
    <h3 style="margin: 30px 0 15px 0; color: #2E4A9E; font-size: 18px;">
       TalentDays sélectionnés
    </h3>
    
    ${talentDaysHtml}
    
    <h3 style="margin: 30px 0 15px 0; color: #2E4A9E; font-size: 18px;">
       Prochaines étapes
    </h3>
    
    ${styledList([
      '<strong>Validation de votre inscription</strong> - Notre équipe vérifie vos informations',
      '<strong>Confirmation par email</strong> - Vous recevrez un email de confirmation sous 24-48h',
      '<strong>Préparation de l\'événement</strong> - Nous vous enverrons les détails pratiques',
      '<strong>Jour J</strong> - Rencontrez les talents tech qui correspondent à vos besoins !'
    ])}
    
    <h3 style="margin: 30px 0 15px 0; color: #2E4A9E; font-size: 18px;">
       Préparez votre participation
    </h3>
    
    ${styledList([
      'Définissez clairement vos besoins de recrutement',
      'Préparez une présentation de votre entreprise et de vos projets',
      'Listez les compétences techniques recherchées',
      'Préparez des questions pertinentes pour les candidats',
      'Prévoyez des supports de présentation (flyers, goodies, etc.)'
    ])}
    
    ${infoBox('<strong> Conseil</strong><br>Plus vous serez précis sur vos besoins, plus nous pourrons vous mettre en relation avec des talents qui correspondent exactement à vos attentes.', '', '#DBEAFE', '#2E4A9E')}
    
    <p style="margin: 25px 0 0 0; color: #6B7280; font-size: 15px;">
      Des questions en attendant notre validation ? Contactez-nous à 
      <a href="mailto:info@princeaman.dev" style="color: #2E4A9E; text-decoration: none;">info@princeaman.dev</a> 
      ou au <a href="tel:+32467620878" style="color: #2E4A9E; text-decoration: none;">+32 467 62 08 78</a>.
    </p>
  `;
  
  return baseTemplate('Inscription TalentDay bien reçue ! ', content, '#8B5CF6');
};

// ═══════════════════════════════════════════════════════════════════════
// 9. EMAIL D'ACCEPTATION TALENTDAY (PARTICIPANT)
// ═══════════════════════════════════════════════════════════════════════

export const talentDayAcceptationTemplate = (inscription, talentDay) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  const content = `
    <p style="margin: 0 0 20px 0; font-size: 18px; color: #1F2937;">
      Bonjour <strong>${inscription.prenom}</strong> ! 
    </p>
    
    <p style="margin: 0 0 20px 0; color: #374151;">
      Nous avons le plaisir de vous informer que votre candidature au TalentDay <strong>"${talentDay.titre}"</strong> a été <strong style="color: #059669;">acceptée</strong> !
    </p>
    
    ${infoBox('<strong> Félicitations !</strong><br>Vous êtes maintenant officiellement inscrit(e) à cet événement. Préparez-vous à rencontrer des entreprises qui recrutent !', '', '#D1FAE5', '#059669')}
    
    <h3 style="margin: 30px 0 15px 0; color: #2E4A9E; font-size: 18px;">
       Informations pratiques
    </h3>
    
    ${dataTable([
      [' Date', formatDate(talentDay.date)],
      [' Lieu', talentDay.lieu],
      [' Horaires', talentDay.horaires || 'À confirmer'],
      [' Participants', `${talentDay.inscriptions?.length || 0} / ${talentDay.maxParticipants}`]
    ])}
    
    <h3 style="margin: 30px 0 15px 0; color: #2E4A9E; font-size: 18px;">
       Comment bien se préparer ?
    </h3>
    
    ${styledList([
      '<strong>Préparez votre pitch</strong> - Présentez-vous en 2 minutes maximum',
      '<strong>CV à jour</strong> - Apportez plusieurs copies imprimées',
      '<strong>Renseignez-vous</strong> - Informez-vous sur les entreprises participantes',
      '<strong>Questions préparées</strong> - Ayez des questions pertinentes sur les postes',
      '<strong>Tenue professionnelle</strong> - Adoptez une tenue adaptée à un entretien',
      '<strong>Portfolio/GitHub</strong> - Préparez des exemples de vos projets'
    ])}
    
    ${infoBox('<strong> Arrivez 15 minutes en avance</strong><br>Pour vous enregistrer et prendre vos repères avant le début de l\'événement.', '️', '#FEF3C7', '#F59E0B')}
    
    <p style="margin: 25px 0; text-align: center;">
      <a href="https://talentproof-client.onrender.com/talent-days/${talentDay._id}" style="display: inline-block; background: linear-gradient(135deg, #059669 0%, #047857 100%); color: #FFFFFF; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: 600; font-size: 15px;">
         Voir tous les détails
      </a>
    </p>
    
    <p style="margin: 25px 0 0 0; color: #6B7280; font-size: 15px;">
      Des questions ? Contactez-nous à 
      <a href="mailto:info@princeaman.dev" style="color: #2E4A9E; text-decoration: none;">info@princeaman.dev</a>.
    </p>
  `;
  
  return baseTemplate('Candidature acceptée ! ', content, '#059669');
};

// ═══════════════════════════════════════════════════════════════════════
// 10. EMAIL DE REFUS TALENTDAY (PARTICIPANT)
// ═══════════════════════════════════════════════════════════════════════

export const talentDayRefusTemplate = (inscription, talentDay, raison = null) => {
  const content = `
    <p style="margin: 0 0 20px 0; font-size: 18px; color: #1F2937;">
      Bonjour <strong>${inscription.prenom}</strong>,
    </p>
    
    <p style="margin: 0 0 20px 0; color: #374151;">
      Merci pour votre intérêt et votre candidature au TalentDay <strong>"${talentDay.titre}"</strong>.
    </p>
    
    ${infoBox('<strong>Candidature non retenue</strong><br>Après examen de votre profil, nous ne pouvons malheureusement pas retenir votre candidature pour cet événement.', '', '#FEE2E2', '#DC2626')}
    
    ${raison ? `
      <h3 style="margin: 30px 0 15px 0; color: #2E4A9E; font-size: 18px;">
         Raison
      </h3>
      <div style="background-color: #F9FAFB; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; color: #374151; line-height: 1.6;">${raison}</p>
      </div>
    ` : ''}
    
    <p style="margin: 20px 0; color: #374151;">
      Cette décision ne remet pas en cause vos compétences, mais reflète simplement les critères spécifiques de cet événement ou le nombre limité de places disponibles.
    </p>
    
    <h3 style="margin: 30px 0 15px 0; color: #2E4A9E; font-size: 18px;">
       Ne vous découragez pas !
    </h3>
    
    ${styledList([
      '<strong>D\'autres TalentDays arrivent bientôt</strong> - Consultez régulièrement nos prochains événements',
      '<strong>Améliorez votre profil</strong> - Continuez à développer vos compétences techniques',
      '<strong>Réessayez</strong> - Nous serions ravis de recevoir une nouvelle candidature',
      '<strong>Restez motivé(e)</strong> - Chaque refus est une opportunité d\'apprendre'
    ])}
    
    ${infoBox('<strong> Conseil</strong><br>Continuez à postuler à nos futurs événements. Votre profil peut évoluer et correspondre parfaitement à nos prochains TalentDays !', '', '#DBEAFE', '#2E4A9E')}
    
    <p style="margin: 25px 0; text-align: center;">
      <a href="https://talentproof-client.onrender.com/talent-days" style="display: inline-block; background: linear-gradient(135deg, #2E4A9E 0%, #1E3A8A 100%); color: #FFFFFF; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: 600; font-size: 15px;">
         Voir nos prochains événements
      </a>
    </p>
    
    <p style="margin: 25px 0 0 0; color: #6B7280; font-size: 15px;">
      Des questions ? Notre équipe reste à votre disposition : 
      <a href="mailto:info@princeaman.dev" style="color: #2E4A9E; text-decoration: none;">info@princeaman.dev</a>
    </p>
    
    <p style="margin: 25px 0 0 0; text-align: center; color: #6B7280; font-size: 14px;">
      Nous vous souhaitons beaucoup de succès dans vos projets professionnels ! 
    </p>
  `;
  
  return baseTemplate('Votre candidature au TalentDay', content, '#6B7280');
};

// ═══════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════

export {
  // Composants réutilisables (pour créer d'autres emails)
  baseTemplate,
  ctaButton,
  fallbackLink,
  infoBox,
  dataTable,
  styledList
};
