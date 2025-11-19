/**
 * Template email pour notification de contact général (à Prince)
 */
export const generalContactNotificationTemplate = (contactInfo) => {
  const baseTemplate = (content) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TalentProof</title>
  <style>
    body {
      font-family: 'Inter', 'Helvetica', 'Arial', sans-serif;
      line-height: 1.6;
      color: #475569;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: #ffffff;
      text-decoration: none;
    }
    .content {
      padding: 40px 30px;
    }
    .footer {
      background-color: #f1f5f9;
      padding: 30px;
      text-align: center;
      font-size: 14px;
      color: #64748B;
    }
    .footer a {
      color: #1E3A8A;
      text-decoration: none;
    }
    h1 {
      color: #1E3A8A;
      font-size: 24px;
      margin-bottom: 20px;
    }
    p {
      margin: 15px 0;
      color: #475569;
    }
    .highlight {
      background-color: #fef3c7;
      padding: 15px;
      border-left: 4px solid #F97316;
      border-radius: 4px;
      margin: 20px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }
    td {
      padding: 10px;
      border-bottom: 1px solid #e2e8f0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo"> TalentProof</div>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p><strong>TalentProof</strong> - Le label de confiance pour les talents tech</p>
      <p>Avenue de lille 4 A52, 4020 Liège, Belgique</p>
      <p>
        <a href="mailto:info@princeaman.dev">info@princeaman.dev</a> | 
        <a href="tel:+32467620878">+32 467 62 08 78</a>
      </p>
      <p style="font-size: 12px; color: #94A3B8; margin-top: 20px;">
        © ${new Date().getFullYear()} TalentProof. Tous droits réservés.
      </p>
    </div>
  </div>
</body>
</html>
`;

  const content = `
    <h1> Nouveau message depuis le formulaire de contact</h1>
    <p><strong>Une personne souhaite entrer en contact avec TalentProof.</strong></p>
    
    <h2 style="color: #1E3A8A; font-size: 18px; margin-top: 30px;"> Informations de contact</h2>
    <table>
      <tr>
        <td style="width: 35%;"><strong>Nom complet :</strong></td>
        <td>${contactInfo.nom}</td>
      </tr>
      <tr>
        <td><strong>Email :</strong></td>
        <td>
          <a href="mailto:${contactInfo.email}" style="color: #1E3A8A;">${contactInfo.email}</a>
        </td>
      </tr>
      ${contactInfo.telephone ? `
      <tr>
        <td><strong>Téléphone :</strong></td>
        <td>
          <a href="tel:${contactInfo.telephone}" style="color: #1E3A8A;">${contactInfo.telephone}</a>
        </td>
      </tr>
      ` : ''}
      ${contactInfo.entreprise ? `
      <tr>
        <td><strong>Entreprise :</strong></td>
        <td>${contactInfo.entreprise}</td>
      </tr>
      ` : ''}
      <tr>
        <td><strong>Sujet :</strong></td>
        <td><strong style="color: #F97316;">${contactInfo.sujet}</strong></td>
      </tr>
      <tr>
        <td><strong>Date :</strong></td>
        <td>${new Date().toLocaleString('fr-BE', { dateStyle: 'full', timeStyle: 'short' })}</td>
      </tr>
    </table>

    <div class="highlight" style="margin-top: 30px;">
      <strong> Message :</strong><br><br>
      ${contactInfo.message.replace(/\n/g, '<br>')}
    </div>

    <div style="margin-top: 30px; padding: 20px; background-color: #f1f5f9; border-radius: 8px;">
      <strong> Actions suggérées :</strong>
      <ul style="margin: 10px 0; padding-left: 20px;">
        <li>Répondre dans les 24h pour un service optimal</li>
        <li>Contacter par email ou téléphone selon l'urgence</li>
        <li>Vérifier si le sujet nécessite des documents supplémentaires</li>
      </ul>
    </div>
  `;
  
  return baseTemplate(content);
};

/**
 * Template email de confirmation pour l'expéditeur
 */
export const generalContactConfirmationTemplate = (nom) => {
  const baseTemplate = (content) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TalentProof</title>
  <style>
    body {
      font-family: 'Inter', 'Helvetica', 'Arial', sans-serif;
      line-height: 1.6;
      color: #475569;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: #ffffff;
      text-decoration: none;
    }
    .content {
      padding: 40px 30px;
    }
    .footer {
      background-color: #f1f5f9;
      padding: 30px;
      text-align: center;
      font-size: 14px;
      color: #64748B;
    }
    .footer a {
      color: #1E3A8A;
      text-decoration: none;
    }
    h1 {
      color: #1E3A8A;
      font-size: 24px;
      margin-bottom: 20px;
    }
    p {
      margin: 15px 0;
      color: #475569;
    }
    .highlight {
      background-color: #dcfce7;
      padding: 15px;
      border-left: 4px solid #10B981;
      border-radius: 4px;
      margin: 20px 0;
    }
    .contact-box {
      background-color: #f1f5f9;
      padding: 20px;
      border-radius: 8px;
      margin-top: 30px;
    }
    .contact-box a {
      color: #1E3A8A;
      text-decoration: none;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo"> TalentProof</div>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p><strong>TalentProof</strong> - Le label de confiance pour les talents tech</p>
      <p>Avenue de lille 4 A52, 4020 Liège, Belgique</p>
      <p>
        <a href="mailto:info@princeaman.dev">info@princeaman.dev</a> | 
        <a href="tel:+32467620878">+32 467 62 08 78</a>
      </p>
      <p style="font-size: 12px; color: #94A3B8; margin-top: 20px;">
        © ${new Date().getFullYear()} TalentProof. Tous droits réservés.
      </p>
    </div>
  </div>
</body>
</html>
`;

  const content = `
    <h1>Message bien reçu ! </h1>
    <p>Bonjour ${nom},</p>
    <p>Merci de nous avoir contactés. Nous avons bien reçu votre message et nous vous en remercions.</p>
    
    <div class="highlight">
      <strong>️ Délai de réponse : 24-48 heures</strong><br>
      Notre équipe va analyser votre demande et vous recontacter dans les plus brefs délais.
    </div>

    <p>Nous nous engageons à vous fournir une réponse complète et adaptée à vos besoins.</p>

    <p style="margin-top: 30px;">En attendant notre réponse, n'hésitez pas à explorer notre plateforme :</p>
    <ul style="line-height: 2;">
      <li><strong>Catalogue de Talents</strong> - Découvrez nos développeurs validés</li>
      <li><strong>Nos Services</strong> - Sites web et applications mobiles</li>
      <li><strong>Notre Expertise</strong> - Technologies et méthodologies</li>
    </ul>

    <div class="contact-box">
      <p style="margin: 0;"><strong> Contact direct :</strong></p>
      <p style="margin: 10px 0 0 0;">
        <a href="mailto:info@princeaman.dev">info@princeaman.dev</a><br>
        <a href="tel:+32467620878">+32 467 62 08 78</a>
      </p>
    </div>

    <p style="margin-top: 30px; font-size: 14px; color: #64748B;">
      Nous avons hâte d'échanger avec vous ! 
    </p>
  `;
  
  return baseTemplate(content);
};