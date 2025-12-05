/**
 * ═══════════════════════════════════════════════════════════════════════
 * TALENTPROOF - TEMPLATES D'EMAILS PROFESSIONNELS
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * Style : Corporate, épuré, formel
 * Design : Minimaliste, blanc, typographie classique
 * Ton : Professionnel, direct, courtois
 */

// ═══════════════════════════════════════════════════════════════════════
// TEMPLATE DE BASE PROFESSIONNEL
// ═══════════════════════════════════════════════════════════════════════

const baseTemplate = (content) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>TalentProof</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    /* Media Queries pour Responsive Mobile */
    @media only screen and (max-width: 600px) {
      /* Container principal */
      .email-container {
        width: 100% !important;
        max-width: 100% !important;
      }
      
      /* Padding réduit sur mobile */
      .email-wrapper {
        padding: 20px 10px !important;
      }
      
      .email-content {
        padding: 25px 20px !important;
      }
      
      .email-header {
        padding: 20px !important;
      }
      
      .email-footer {
        padding: 20px !important;
      }
      
      /* Logo et titre */
      .logo-container {
        text-align: center !important;
      }
      
      .logo-svg {
        width: 40px !important;
        height: 40px !important;
      }
      
      .logo-text {
        font-size: 22px !important;
        display: block !important;
        margin-top: 8px !important;
      }
      
      /* Boutons */
      .button-container {
        margin: 20px 0 !important;
      }
      
      .button-link {
        display: block !important;
        padding: 12px 24px !important;
        font-size: 14px !important;
        text-align: center !important;
      }
      
      /* Tables d'information */
      .info-table {
        font-size: 13px !important;
      }
      
      .info-table td {
        display: block !important;
        width: 100% !important;
        padding: 8px 12px !important;
      }
      
      .info-table td:first-child {
        font-weight: 700 !important;
        padding-bottom: 4px !important;
        border-bottom: none !important;
      }
      
      .info-table td:last-child {
        padding-top: 4px !important;
        padding-bottom: 12px !important;
      }
      
      /* Notice boxes */
      .notice-box {
        padding: 15px !important;
        font-size: 13px !important;
      }
      
      /* Texte général */
      .email-text {
        font-size: 14px !important;
        line-height: 1.6 !important;
      }
      
      /* Footer */
      .footer-logo {
        width: 20px !important;
        height: 20px !important;
      }
      
      .footer-text {
        font-size: 12px !important;
      }
      
      /* Espacement */
      .divider {
        margin: 20px 0 !important;
      }
    }
    
    /* Media Queries pour très petits écrans */
    @media only screen and (max-width: 400px) {
      .email-content {
        padding: 20px 15px !important;
      }
      
      .email-header {
        padding: 15px !important;
      }
      
      .logo-text {
        font-size: 20px !important;
      }
      
      .button-link {
        padding: 10px 20px !important;
        font-size: 13px !important;
      }
      
      .info-table {
        font-size: 12px !important;
      }
      
      .footer-text {
        font-size: 11px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F9FAFB; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
  
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #F9FAFB;">
    <tr>
      <td class="email-wrapper" style="padding: 40px 20px;">
        
        <!-- Container principal -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="email-container" style="margin: 0 auto; background-color: #FFFFFF; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border-radius: 8px;" align="center">
          
          <!-- HEADER : Logo professionnel avec gradient -->
          <tr>
            <td class="email-header" style="background: linear-gradient(135deg, #1E3A8A 0%, #2E4A9E 50%, #3B5BA8 100%); padding: 30px 40px; border-radius: 8px 8px 0 0;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" class="logo-container">
                <tr>
                  <td style="vertical-align: middle; padding-right: 15px;">
                    <!-- Logo SVG professionnel -->
                    <svg class="logo-svg" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="48" height="48" rx="8" fill="white" fill-opacity="0.15"/>
                      <rect x="4" y="4" width="40" height="40" rx="6" fill="white"/>
                      <path d="M14 16H20V32H14V16Z" fill="#2E4A9E"/>
                      <path d="M24 20H30V32H24V20Z" fill="#3B5BA8"/>
                      <path d="M34 24H40V32H34V24Z" fill="#4A6BB8"/>
                      <circle cx="17" cy="12" r="2" fill="#10B981"/>
                    </svg>
                  </td>
                  <td style="vertical-align: middle;">
                    <span class="logo-text" style="font-size: 26px; font-weight: 700; color: #FFFFFF; letter-spacing: -0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">TalentProof</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- CONTENT -->
          <tr>
            <td class="email-content email-text" style="padding: 45px 40px; color: #374151; font-size: 15px; line-height: 1.7;">
              ${content}
            </td>
          </tr>
          
          <!-- FOOTER -->
          <tr>
            <td class="email-footer" style="padding: 30px 40px; background-color: #F9FAFB; border-radius: 0 0 8px 8px; border-top: 1px solid #E5E7EB;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td class="footer-text" style="color: #6B7280; font-size: 13px; line-height: 1.7;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 15px;">
                      <tr>
                        <td style="vertical-align: middle; padding-right: 10px;">
                          <svg class="footer-logo" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="24" height="24" rx="4" fill="#2E4A9E" fill-opacity="0.1"/>
                            <path d="M7 8H10V16H7V8Z" fill="#2E4A9E"/>
                            <path d="M12 10H15V16H12V10Z" fill="#2E4A9E" fill-opacity="0.8"/>
                            <path d="M17 12H20V16H17V12Z" fill="#2E4A9E" fill-opacity="0.6"/>
                          </svg>
                        </td>
                        <td style="vertical-align: middle;">
                          <span style="font-weight: 700; color: #1F2937; font-size: 14px;">TalentProof</span>
                        </td>
                      </tr>
                    </table>
                    <p style="margin: 0 0 8px 0; color: #6B7280;">Plateforme de recrutement tech premium</p>
                    <p style="margin: 0 0 4px 0;">Avenue de Lille 4 A52, 4020 Liège, Belgique</p>
                    <p style="margin: 0 0 4px 0;">
                      <a href="mailto:info@princeaman.dev" style="color: #2E4A9E; text-decoration: none; font-weight: 500;">info@princeaman.dev</a>
                    </p>
                    <p style="margin: 0 0 20px 0;">
                      <a href="tel:+32467620878" style="color: #2E4A9E; text-decoration: none; font-weight: 500;">+32 467 62 08 78</a>
                    </p>
                    <p style="margin: 0; color: #9CA3AF; font-size: 12px;">
                      © ${new Date().getFullYear()} TalentProof. Tous droits réservés.
                    </p>
                  </td>
                </tr>
              </table>
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
// COMPOSANTS
// ═══════════════════════════════════════════════════════════════════════

const buttonLink = (text, url) => `
<table role="presentation" cellspacing="0" cellpadding="0" border="0" class="button-container" style="margin: 30px 0;">
  <tr>
    <td style="background: linear-gradient(135deg, #1E3A8A 0%, #2E4A9E 100%); border-radius: 6px; box-shadow: 0 4px 6px -1px rgba(46, 74, 158, 0.3);">
      <a href="${url}" class="button-link" style="display: inline-block; padding: 14px 36px; color: #FFFFFF; text-decoration: none; font-weight: 600; font-size: 15px; letter-spacing: 0.3px;">
        ${text}
      </a>
    </td>
  </tr>
</table>
`;

const infoTable = (rows) => {
  const rowsHtml = rows.map(([label, value]) => `
    <tr>
      <td class="info-table" style="padding: 12px 15px; color: #6B7280; font-weight: 600; vertical-align: top; width: 40%; background-color: #F9FAFB; border-bottom: 1px solid #E5E7EB;">
        ${label}
      </td>
      <td class="info-table" style="padding: 12px 15px; color: #1F2937; background-color: #FFFFFF; border-bottom: 1px solid #E5E7EB;">
        ${value}
      </td>
    </tr>
  `).join('');
  
  return `
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="info-table" style="margin: 25px 0; border: 1px solid #E5E7EB; border-radius: 6px; overflow: hidden;">
  ${rowsHtml}
</table>
  `;
};

const divider = () => `
<div class="divider" style="height: 1px; background-color: #E5E7EB; margin: 30px 0;"></div>
`;

const noticeBox = (text, type = 'info') => {
  const configs = {
    info: { 
      bg: '#EFF6FF', 
      border: '#2E4A9E',
      icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" fill="#2E4A9E" opacity="0.2"/><path d="M10 6v4m0 4h.01" stroke="#2E4A9E" stroke-width="2" stroke-linecap="round"/></svg>'
    },
    warning: { 
      bg: '#FFFBEB', 
      border: '#F59E0B',
      icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 3L3 17h14L10 3z" fill="#F59E0B" opacity="0.2"/><path d="M10 8v4m0 3h.01" stroke="#F59E0B" stroke-width="2" stroke-linecap="round"/></svg>'
    },
    success: { 
      bg: '#F0FDF4', 
      border: '#10B981',
      icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" fill="#10B981" opacity="0.2"/><path d="M7 10l2 2 4-4" stroke="#10B981" stroke-width="2" stroke-linecap="round"/></svg>'
    }
  };
  
  const config = configs[type] || configs.info;
  
  return `
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="notice-box" style="margin: 25px 0;">
  <tr>
    <td class="notice-box" style="background-color: ${config.bg}; border-left: 4px solid ${config.border}; padding: 18px 20px; border-radius: 6px; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td style="vertical-align: top; padding-right: 12px;">
            ${config.icon}
          </td>
          <td style="vertical-align: top;">
            <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.6; font-weight: 500;">
              ${text}
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
  `;
};

// ═══════════════════════════════════════════════════════════════════════
// 1. CONFIRMATION D'INSCRIPTION (ENTREPRISE)
// ═══════════════════════════════════════════════════════════════════════

export const confirmationEmailTemplate = (companyName, confirmationLink) => {
  const content = `
    <p style="margin: 0 0 20px 0; color: #1F2937;">
      Madame, Monsieur,
    </p>
    
    <p style="margin: 0 0 20px 0;">
      Nous avons bien enregistré votre demande d'inscription sur la plateforme TalentProof pour le compte de <strong>${companyName}</strong>.
    </p>
    
    <p style="margin: 0 0 20px 0;">
      Afin de finaliser votre inscription et accéder à votre espace entreprise, nous vous invitons à confirmer votre adresse email en cliquant sur le bouton ci-dessous :
    </p>
    
    ${buttonLink('Confirmer mon adresse email', confirmationLink)}
    
    <p style="margin: 0 0 5px 0; color: #6B7280; font-size: 14px;">
      Vous pouvez également copier ce lien dans votre navigateur :
    </p>
    <p style="margin: 0 0 20px 0; color: #2E4A9E; font-size: 13px; word-break: break-all;">
      ${confirmationLink}
    </p>
    
    ${noticeBox('Ce lien de confirmation est valable pendant 24 heures.', 'warning')}
    
    <p style="margin: 0 0 10px 0; font-weight: 600; color: #1F2937;">
      Après confirmation, vous pourrez :
    </p>
    
    <ul style="margin: 0 0 20px 0; padding-left: 20px; color: #374151;">
      <li style="margin: 8px 0;">Consulter notre base de talents certifiés</li>
      <li style="margin: 8px 0;">Accéder aux profils détaillés et résultats de tests</li>
      <li style="margin: 8px 0;">Contacter directement les candidats</li>
      <li style="margin: 8px 0;">Participer aux événements TalentDays</li>
    </ul>
    
    ${divider()}
    
    <p style="margin: 0 0 5px 0; color: #6B7280; font-size: 14px;">
      Si vous n'avez pas créé de compte sur TalentProof, vous pouvez ignorer cet email.
    </p>
    
    <p style="margin: 20px 0 0 0; color: #1F2937;">
      Cordialement,<br>
      <strong>L'équipe TalentProof</strong>
    </p>
  `;
  
  return baseTemplate(content);
};

// ═══════════════════════════════════════════════════════════════════════
// 2. RÉINITIALISATION DE MOT DE PASSE
// ═══════════════════════════════════════════════════════════════════════

export const resetPasswordTemplate = (companyName, resetLink) => {
  const content = `
    <p style="margin: 0 0 20px 0; color: #1F2937;">
      Madame, Monsieur,
    </p>
    
    <p style="margin: 0 0 20px 0;">
      Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte TalentProof associé à <strong>${companyName}</strong>.
    </p>
    
    <p style="margin: 0 0 20px 0;">
      Pour créer un nouveau mot de passe, veuillez cliquer sur le bouton ci-dessous :
    </p>
    
    ${buttonLink('Réinitialiser mon mot de passe', resetLink)}
    
    <p style="margin: 0 0 5px 0; color: #6B7280; font-size: 14px;">
      Vous pouvez également copier ce lien dans votre navigateur :
    </p>
    <p style="margin: 0 0 20px 0; color: #2E4A9E; font-size: 13px; word-break: break-all;">
      ${resetLink}
    </p>
    
    ${noticeBox('Ce lien de réinitialisation est valable pendant 1 heure et ne peut être utilisé qu\'une seule fois.', 'warning')}
    
    ${divider()}
    
    <p style="margin: 0 0 5px 0; color: #6B7280; font-size: 14px;">
      Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email. Votre mot de passe actuel restera inchangé.
    </p>
    
    <p style="margin: 20px 0 0 0; color: #1F2937;">
      Cordialement,<br>
      <strong>L'équipe TalentProof</strong>
    </p>
  `;
  
  return baseTemplate(content);
};

// ═══════════════════════════════════════════════════════════════════════
// 3. NOTIFICATION DE CONTACT (À PRINCE)
// ═══════════════════════════════════════════════════════════════════════

export const contactNotificationTemplate = (talentInfo, recruteurInfo) => {
  const content = `
    <p style="margin: 0 0 20px 0; color: #1F2937;">
      Bonjour,
    </p>
    
    <p style="margin: 0 0 20px 0;">
      Une entreprise souhaite entrer en contact avec un talent via la plateforme TalentProof.
    </p>
    
    <p style="margin: 0 0 10px 0; font-weight: 600; color: #1F2937;">
      Informations du talent :
    </p>
    
    ${infoTable([
      ['Nom', talentInfo.prenom],
      ['Technologies', talentInfo.technologies.join(', ')],
      ['Score', `${talentInfo.scoreTest}/100 (${talentInfo.plateforme})`],
      ['Niveau', talentInfo.niveau || 'Non spécifié']
    ])}
    
    ${divider()}
    
    <p style="margin: 0 0 10px 0; font-weight: 600; color: #1F2937;">
      Informations de l'entreprise :
    </p>
    
    ${infoTable([
      ['Nom du contact', recruteurInfo.nom],
      ['Entreprise', recruteurInfo.entreprise],
      ['Email', `<a href="mailto:${recruteurInfo.email}" style="color: #2E4A9E; text-decoration: none;">${recruteurInfo.email}</a>`],
      ['Téléphone', `<a href="tel:${recruteurInfo.tel}" style="color: #2E4A9E; text-decoration: none;">${recruteurInfo.tel}</a>`]
    ])}
    
    ${divider()}
    
    <p style="margin: 0 0 10px 0; font-weight: 600; color: #1F2937;">
      Message de l'entreprise :
    </p>
    
    <div style="background-color: #F9FAFB; padding: 15px; border-radius: 4px; margin: 15px 0;">
      <p style="margin: 0; color: #374151; white-space: pre-wrap;">${recruteurInfo.message}</p>
    </div>
    
    ${divider()}
    
    <p style="margin: 0 0 10px 0; font-weight: 600; color: #1F2937;">
      Actions à effectuer :
    </p>
    
    <ul style="margin: 0 0 20px 0; padding-left: 20px; color: #374151;">
      <li style="margin: 8px 0;">Contacter l'entreprise pour confirmer l'intérêt</li>
      <li style="margin: 8px 0;">Vérifier la disponibilité du talent</li>
      <li style="margin: 8px 0;">Transmettre les coordonnées complètes du talent</li>
      <li style="margin: 8px 0;">Faciliter la mise en relation si pertinent</li>
    </ul>
    
    ${buttonLink('Répondre à l\'entreprise', `mailto:${recruteurInfo.email}?subject=TalentProof - Contact talent ${talentInfo.prenom}`)}
    
    <p style="margin: 20px 0 0 0; color: #1F2937;">
      Cordialement,<br>
      <strong>Système de notification TalentProof</strong>
    </p>
  `;
  
  return baseTemplate(content);
};

// ═══════════════════════════════════════════════════════════════════════
// 4. EMAIL AU TALENT - ENTREPRISE INTÉRESSÉE
// ═══════════════════════════════════════════════════════════════════════

export const companyContactTalentEmail = (contactData) => {
  const { 
    talentName, 
    companyName, 
    companyContact,
    companyEmail,
    companyPhone,
    message
  } = contactData;
  
  const content = `
    <p style="margin: 0 0 20px 0; color: #1F2937;">
      Bonjour <strong>${talentName}</strong>,
    </p>
    
    <p style="margin: 0 0 20px 0;">
      Excellente nouvelle ! L'entreprise <strong>${companyName}</strong> est intéressée par votre profil.
    </p>
    
    ${noticeBox('Une entreprise souhaite vous rencontrer.', 'success')}
    
    <p style="margin: 0 0 10px 0; font-weight: 600; color: #1F2937;">
      Informations de l'entreprise :
    </p>
    
    ${infoTable([
      ['Entreprise', `<strong>${companyName}</strong>`],
      ['Contact', companyContact],
      ['Email', `<a href="mailto:${companyEmail}" style="color: #2E4A9E; text-decoration: none;">${companyEmail}</a>`],
      ['Téléphone', companyPhone ? `<a href="tel:${companyPhone}" style="color: #2E4A9E; text-decoration: none;">${companyPhone}</a>` : 'Non renseigné']
    ])}
    
    ${message ? `
      ${divider()}
      
      <p style="margin: 0 0 10px 0; font-weight: 600; color: #1F2937;">
        Message de l'entreprise :
      </p>
      
      <div style="background-color: #F9FAFB; padding: 15px; border-radius: 4px; margin: 15px 0;">
        <p style="margin: 0; color: #374151; white-space: pre-wrap;">${message}</p>
      </div>
    ` : ''}
    
    ${divider()}
    
    <p style="margin: 20px 0;">
      Notre équipe va prendre contact avec vous dans les prochaines 48 heures pour organiser la mise en relation.
    </p>
    
    ${noticeBox('Préparez votre CV et portfolio à jour pour optimiser cette opportunité.', 'info')}
    
    <p style="margin: 20px 0 0 0; color: #1F2937;">
      Bonne chance,<br>
      <strong>L'équipe TalentProof</strong>
    </p>
  `;
  
  return baseTemplate(content);
};

// ═══════════════════════════════════════════════════════════════════════
// 5. CONFIRMATION DEMANDE DE CONTACT (À L'ENTREPRISE)
// ═══════════════════════════════════════════════════════════════════════

export const contactConfirmationTemplate = (recruteurNom, entreprise, talentPrenom) => {
  const content = `
    <p style="margin: 0 0 20px 0; color: #1F2937;">
      Madame, Monsieur${recruteurNom ? ' ' + recruteurNom : ''},
    </p>
    
    <p style="margin: 0 0 20px 0;">
      Nous accusons réception de votre demande de contact concernant le profil de <strong>${talentPrenom}</strong>.
    </p>
    
    ${noticeBox('Votre demande a été transmise à notre équipe et est actuellement en cours de traitement.', 'success')}
    
    <p style="margin: 20px 0;">
      Notre équipe examine actuellement votre demande et prendra contact avec vous sous 48 heures ouvrables pour organiser la mise en relation avec ce talent.
    </p>
    
    <p style="margin: 0 0 10px 0; font-weight: 600; color: #1F2937;">
      Prochaines étapes :
    </p>
    
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 15px 0;">
      <tr>
        <td style="padding: 12px 0; color: #374151; vertical-align: top;">
          <strong style="color: #2E4A9E;">1.</strong> Vérification de la disponibilité du talent
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 0; color: #374151; vertical-align: top;">
          <strong style="color: #2E4A9E;">2.</strong> Préparation du dossier complet (CV, portfolio, coordonnées)
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 0; color: #374151; vertical-align: top;">
          <strong style="color: #2E4A9E;">3.</strong> Prise de contact avec votre entreprise pour faciliter la mise en relation
        </td>
      </tr>
    </table>
    
    ${noticeBox('Délai de traitement : 48 heures ouvrables maximum.', 'info')}
    
    ${divider()}
    
    <p style="margin: 0 0 5px 0; color: #374151;">
      Pour toute question concernant votre demande, vous pouvez nous contacter :
    </p>
    
    <p style="margin: 5px 0; color: #374151;">
      Email : <a href="mailto:info@princeaman.dev" style="color: #2E4A9E; text-decoration: none;">info@princeaman.dev</a><br>
      Téléphone : <a href="tel:+32467620878" style="color: #2E4A9E; text-decoration: none;">+32 467 62 08 78</a>
    </p>
    
    <p style="margin: 20px 0 0 0; color: #1F2937;">
      Cordialement,<br>
      <strong>L'équipe TalentProof</strong>
    </p>
  `;
  
  return baseTemplate(content);
};

// ═══════════════════════════════════════════════════════════════════════
// 5. NOTIFICATION CONTACT GÉNÉRAL (À PRINCE)
// ═══════════════════════════════════════════════════════════════════════

export const generalContactNotificationTemplate = (contactInfo) => {
  const content = `
    <p style="margin: 0 0 20px 0; color: #1F2937;">
      Bonjour,
    </p>
    
    <p style="margin: 0 0 20px 0;">
      Un nouveau message a été reçu via le formulaire de contact de TalentProof.
    </p>
    
    ${infoTable([
      ['Nom', contactInfo.nom],
      ['Email', `<a href="mailto:${contactInfo.email}" style="color: #2E4A9E; text-decoration: none;">${contactInfo.email}</a>`],
      ['Téléphone', contactInfo.telephone ? `<a href="tel:${contactInfo.telephone}" style="color: #2E4A9E; text-decoration: none;">${contactInfo.telephone}</a>` : 'Non renseigné'],
      ['Entreprise', contactInfo.entreprise || 'Non renseignée'],
      ['Sujet', `<strong>${contactInfo.sujet}</strong>`]
    ])}
    
    ${divider()}
    
    <p style="margin: 0 0 10px 0; font-weight: 600; color: #1F2937;">
      Message :
    </p>
    
    <div style="background-color: #F9FAFB; padding: 15px; border-radius: 4px; margin: 15px 0;">
      <p style="margin: 0; color: #374151; white-space: pre-wrap;">${contactInfo.message}</p>
    </div>
    
    ${buttonLink('Répondre', `mailto:${contactInfo.email}?subject=Re: ${contactInfo.sujet}`)}
    
    <p style="margin: 20px 0 0 0; color: #1F2937;">
      Cordialement,<br>
      <strong>Système de notification TalentProof</strong>
    </p>
  `;
  
  return baseTemplate(content);
};

// ═══════════════════════════════════════════════════════════════════════
// 6. CONFIRMATION CONTACT GÉNÉRAL (AU VISITEUR)
// ═══════════════════════════════════════════════════════════════════════

export const generalContactConfirmationTemplate = (nom) => {
  const content = `
    <p style="margin: 0 0 20px 0; color: #1F2937;">
      Madame, Monsieur ${nom},
    </p>
    
    <p style="margin: 0 0 20px 0;">
      Nous avons bien reçu votre message via notre formulaire de contact.
    </p>
    
    ${noticeBox('Votre demande est actuellement en cours de traitement par notre équipe.', 'success')}
    
    <p style="margin: 20px 0;">
      Nous nous engageons à vous répondre dans un délai de 48 heures ouvrables.
    </p>
    
    ${divider()}
    
    <p style="margin: 0 0 5px 0; color: #374151;">
      Pour toute urgence, vous pouvez nous joindre directement :
    </p>
    
    <p style="margin: 5px 0; color: #374151;">
      Téléphone : <a href="tel:+32467620878" style="color: #2E4A9E; text-decoration: none;">+32 467 62 08 78</a><br>
      Email : <a href="mailto:info@princeaman.dev" style="color: #2E4A9E; text-decoration: none;">info@princeaman.dev</a>
    </p>
    
    <p style="margin: 20px 0 0 0; color: #1F2937;">
      Cordialement,<br>
      <strong>L'équipe TalentProof</strong>
    </p>
  `;
  
  return baseTemplate(content);
};

// ═══════════════════════════════════════════════════════════════════════
// 7. CONFIRMATION INSCRIPTION TALENTDAY (TALENT)
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
    <p style="margin: 0 0 20px 0; color: #1F2937;">
      Madame, Monsieur ${inscription.prenom},
    </p>
    
    <p style="margin: 0 0 20px 0;">
      Nous avons bien enregistré votre inscription à l'événement <strong>"${talentDay.titre}"</strong>.
    </p>
    
    ${noticeBox('Votre inscription est confirmée.', 'success')}
    
    <p style="margin: 20px 0 10px 0; font-weight: 600; color: #1F2937;">
      Détails de l'événement :
    </p>
    
    ${infoTable([
      ['Date', formatDate(talentDay.date)],
      ['Lieu', talentDay.lieu],
      ['Horaires', talentDay.horaires || 'À confirmer prochainement']
    ])}
    
    ${divider()}
    
    <p style="margin: 0 0 10px 0; font-weight: 600; color: #1F2937;">
      Préparation recommandée :
    </p>
    
    <ul style="margin: 0 0 20px 0; padding-left: 20px; color: #374151;">
      <li style="margin: 8px 0;">Préparer une présentation de votre parcours (2 minutes)</li>
      <li style="margin: 8px 0;">Apporter plusieurs copies de votre CV</li>
      <li style="margin: 8px 0;">Se renseigner sur les entreprises participantes</li>
      <li style="margin: 8px 0;">Adopter une tenue professionnelle</li>
      <li style="margin: 8px 0;">Arriver 15 minutes en avance</li>
    </ul>
    
    ${noticeBox('Un email de rappel vous sera envoyé 48 heures avant l\'événement.', 'info')}
    
    <p style="margin: 20px 0 0 0; color: #1F2937;">
      Cordialement,<br>
      <strong>L'équipe TalentProof</strong>
    </p>
  `;
  
  return baseTemplate(content);
};

// ═══════════════════════════════════════════════════════════════════════
// 8. NOUVELLE CANDIDATURE TALENTDAY (À L'ENTREPRISE)
// ═══════════════════════════════════════════════════════════════════════

export const companyNewCandidatureTemplate = (talentInfo, talentDay) => {
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
    <p style="margin: 0 0 20px 0; color: #1F2937;">
      Madame, Monsieur,
    </p>
    
    <p style="margin: 0 0 20px 0;">
      Une nouvelle candidature a été enregistrée pour votre événement TalentDay <strong>"${talentDay.titre}"</strong>.
    </p>
    
    <p style="margin: 0 0 10px 0; font-weight: 600; color: #1F2937;">
      Profil du candidat :
    </p>
    
    ${infoTable([
      ['Nom', `${talentInfo.prenom} ${talentInfo.nom || ''}`],
      ['Email', `<a href="mailto:${talentInfo.email}" style="color: #2E4A9E; text-decoration: none;">${talentInfo.email}</a>`],
      ['Téléphone', talentInfo.telephone || 'Non renseigné'],
      ['Technologies', (talentInfo.technologies || []).join(', ')],
      ['Score', talentInfo.scoreTest ? `${talentInfo.scoreTest}/100` : 'Non évalué']
    ])}
    
    ${talentInfo.motivation ? `
      ${divider()}
      <p style="margin: 0 0 10px 0; font-weight: 600; color: #1F2937;">
        Message de motivation :
      </p>
      <div style="background-color: #F9FAFB; padding: 15px; border-radius: 4px; margin: 15px 0;">
        <p style="margin: 0; color: #374151; white-space: pre-wrap;">${talentInfo.motivation}</p>
      </div>
    ` : ''}
    
    ${divider()}
    
    <p style="margin: 0 0 10px 0; font-weight: 600; color: #1F2937;">
      Informations de l'événement :
    </p>
    
    ${infoTable([
      ['Date', formatDate(talentDay.date)],
      ['Lieu', talentDay.lieu],
      ['Inscriptions', `${talentDay.inscriptions?.length || 0} / ${talentDay.maxParticipants || 0}`]
    ])}
    
    ${buttonLink('Consulter toutes les candidatures', `https://talentproof-client.onrender.com/dashboard/entreprise/talent-days/${talentDay._id}`)}
    
    <p style="margin: 20px 0 0 0; color: #1F2937;">
      Cordialement,<br>
      <strong>L'équipe TalentProof</strong>
    </p>
  `;
  
  return baseTemplate(content);
};

// ═══════════════════════════════════════════════════════════════════════
// 9. INSCRIPTION ENTREPRISE TALENTDAY
// ═══════════════════════════════════════════════════════════════════════

export const companyTalentDayRegistrationTemplate = (companyInfo, talentDays) => {
  const talentDaysHtml = talentDays.map(td => {
    let lieuText = 'Lieu à confirmer';
    if (td.lieu) {
      if (td.lieu.type === 'physique' && td.lieu.adresse) {
        lieuText = `${td.lieu.adresse}, ${td.lieu.ville || ''}`.trim();
      } else if (td.lieu.type === 'en-ligne') {
        lieuText = 'En ligne';
      } else if (td.lieu.type === 'hybride') {
        lieuText = `Hybride - ${td.lieu.ville || 'Lieu à confirmer'}`;
      }
    }
    
    return `
      <tr>
        <td style="padding: 10px 0; color: #374151; border-bottom: 1px solid #E5E7EB;">
          <strong>${td.titre}</strong><br>
          <span style="color: #6B7280; font-size: 14px;">
            ${lieuText} • ${new Date(td.date).toLocaleDateString('fr-FR')}
          </span>
        </td>
      </tr>
    `;
  }).join('');
  
  const content = `
    <p style="margin: 0 0 20px 0; color: #1F2937;">
      Madame, Monsieur ${companyInfo.contactPerson},
    </p>
    
    <p style="margin: 0 0 20px 0;">
      Nous avons bien reçu votre demande d'inscription pour participer aux événements TalentDays en tant qu'entreprise.
    </p>
    
    ${noticeBox('Votre inscription est en cours de validation par notre équipe. Vous recevrez une confirmation sous 24-48 heures.', 'info')}
    
    <p style="margin: 20px 0 10px 0; font-weight: 600; color: #1F2937;">
      Récapitulatif de votre inscription :
    </p>
    
    ${infoTable([
      ['Entreprise', companyInfo.companyName],
      ['Contact', companyInfo.contactPerson],
      ['Email', companyInfo.email],
      ['Téléphone', companyInfo.phone],
      ['Site web', companyInfo.website || 'Non renseigné']
    ])}
    
    ${divider()}
    
    <p style="margin: 0 0 10px 0; font-weight: 600; color: #1F2937;">
      Événements sélectionnés :
    </p>
    
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 15px 0;">
      ${talentDaysHtml}
    </table>
    
    ${divider()}
    
    <p style="margin: 0 0 10px 0; font-weight: 600; color: #1F2937;">
      Prochaines étapes :
    </p>
    
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 15px 0;">
      <tr>
        <td style="padding: 12px 0; color: #374151; vertical-align: top;">
          <strong style="color: #2E4A9E;">1.</strong> Validation de votre inscription par notre équipe
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 0; color: #374151; vertical-align: top;">
          <strong style="color: #2E4A9E;">2.</strong> Email de confirmation avec les détails pratiques
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 0; color: #374151; vertical-align: top;">
          <strong style="color: #2E4A9E;">3.</strong> Préparation de votre participation
        </td>
      </tr>
    </table>
    
    <p style="margin: 20px 0 0 0; color: #1F2937;">
      Cordialement,<br>
      <strong>L'équipe TalentProof</strong>
    </p>
  `;
  
  return baseTemplate(content);
};

// ═══════════════════════════════════════════════════════════════════════
// 10. ACCEPTATION TALENTDAY (PARTICIPANT)
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
    <p style="margin: 0 0 20px 0; color: #1F2937;">
      Madame, Monsieur ${inscription.prenom},
    </p>
    
    <p style="margin: 0 0 20px 0;">
      Nous avons le plaisir de vous informer que votre candidature à l'événement TalentDay <strong>"${talentDay.titre}"</strong> a été acceptée.
    </p>
    
    ${noticeBox('Votre participation est confirmée.', 'success')}
    
    <p style="margin: 20px 0 10px 0; font-weight: 600; color: #1F2937;">
      Informations pratiques :
    </p>
    
    ${infoTable([
      ['Date', formatDate(talentDay.date)],
      ['Lieu', talentDay.lieu],
      ['Horaires', talentDay.horaires || 'À confirmer']
    ])}
    
    ${divider()}
    
    <p style="margin: 0 0 10px 0; font-weight: 600; color: #1F2937;">
      Préparation requise :
    </p>
    
    <ul style="margin: 0 0 20px 0; padding-left: 20px; color: #374151;">
      <li style="margin: 8px 0;">Préparer une présentation de 2 minutes de votre parcours</li>
      <li style="margin: 8px 0;">Apporter plusieurs copies de votre CV à jour</li>
      <li style="margin: 8px 0;">Se renseigner sur les entreprises participantes</li>
      <li style="margin: 8px 0;">Préparer des questions sur les postes disponibles</li>
      <li style="margin: 8px 0;">Adopter une tenue professionnelle</li>
    </ul>
    
    ${noticeBox('Veuillez arriver 15 minutes avant le début de l\'événement.', 'info')}
    
    <p style="margin: 20px 0 0 0; color: #1F2937;">
      Cordialement,<br>
      <strong>L'équipe TalentProof</strong>
    </p>
  `;
  
  return baseTemplate(content);
};

// ═══════════════════════════════════════════════════════════════════════
// 11. REFUS TALENTDAY (PARTICIPANT)
// ═══════════════════════════════════════════════════════════════════════

export const talentDayRefusTemplate = (inscription, talentDay, raison = null) => {
  const content = `
    <p style="margin: 0 0 20px 0; color: #1F2937;">
      Madame, Monsieur ${inscription.prenom},
    </p>
    
    <p style="margin: 0 0 20px 0;">
      Nous vous remercions pour votre candidature à l'événement TalentDay <strong>"${talentDay.titre}"</strong>.
    </p>
    
    <p style="margin: 0 0 20px 0;">
      Après examen de votre profil, nous ne sommes malheureusement pas en mesure de retenir votre candidature pour cet événement.
    </p>
    
    ${raison ? `
      <p style="margin: 0 0 10px 0; font-weight: 600; color: #1F2937;">
        Motif :
      </p>
      <div style="background-color: #F9FAFB; padding: 15px; border-radius: 4px; margin: 15px 0;">
        <p style="margin: 0; color: #374151;">${raison}</p>
      </div>
      ${divider()}
    ` : ''}
    
    <p style="margin: 0 0 20px 0;">
      Cette décision ne remet pas en cause vos compétences. Elle peut être liée au nombre limité de places disponibles ou aux critères spécifiques de cet événement.
    </p>
    
    <p style="margin: 0 0 20px 0;">
      Nous vous encourageons à postuler à nos prochains événements TalentDays.
    </p>
    
    ${buttonLink('Consulter les prochains événements', 'https://talentproof-client.onrender.com/talent-days')}
    
    <p style="margin: 20px 0 0 0; color: #1F2937;">
      Cordialement,<br>
      <strong>L'équipe TalentProof</strong>
    </p>
  `;
  
  return baseTemplate(content);
};

// ═══════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════

export {
  baseTemplate,
  buttonLink,
  infoTable,
  divider,
  noticeBox
};