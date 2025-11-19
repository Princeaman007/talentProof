import CompanyRegistration from '../models/CompanyRegistration.js';
import TalentDay from '../models/Talentday.js';
import Talent from '../models/Talent.js';
import { sendEmail } from '../utils/emailService.js';
//  Import du template professionnel d'inscription entreprise TalentDay
import { companyTalentDayRegistrationTemplate } from '../utils/emailTemplates.professional.js';
import { validationResult } from 'express-validator';

/**
 * @desc    Créer une inscription entreprise
 * @route   POST /api/companies
 * @access  Public
 */
export const createCompanyRegistration = async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: errors.array()
      });
    }

    const { companyName, contactPerson, email, phone, website, interestedTalentDays, notes } = req.body;

    // Vérifier si l'email existe déjà
    const existingCompany = await CompanyRegistration.findOne({ email });
    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: 'Une inscription avec cet email existe déjà',
      });
    }

    // Créer l'inscription
    const company = await CompanyRegistration.create({
      companyName,
      contactPerson,
      email,
      phone,
      website,
      interestedTalentDays,
      notes,
      user: req.user?._id,
    });

    // Populer les TalentDays avec tous les détails
    await company.populate({
      path: 'interestedTalentDays',
      select: 'titre description date heureDebut heureFin lieu technologies placesDisponibles typeEvenement niveauRequis organisateur'
    });

    // Fonction helper pour formater les détails d'un TalentDay
    const formatTalentDayDetails = (td) => {
      const dateFormatted = new Date(td.date).toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      const lieuText = td.lieu.type === 'physique' 
        ? `${td.lieu.adresse}, ${td.lieu.ville}` 
        : td.lieu.type === 'en-ligne'
        ? `En ligne : ${td.lieu.lienVirtuel}`
        : `Hybride - ${td.lieu.adresse}, ${td.lieu.ville} + ${td.lieu.lienVirtuel}`;

      return `
        <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 15px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">${td.titre}</h3>
          <p style="color: #4b5563; line-height: 1.6;">${td.description}</p>
          
          <div style="display: grid; gap: 10px; margin-top: 15px;">
            <div style="display: flex; align-items: center;">
              <span style="color: #6b7280; font-weight: bold; min-width: 120px;"> Date :</span>
              <span>${dateFormatted}</span>
            </div>
            <div style="display: flex; align-items: center;">
              <span style="color: #6b7280; font-weight: bold; min-width: 120px;"> Horaire :</span>
              <span>${td.heureDebut} - ${td.heureFin}</span>
            </div>
            <div style="display: flex; align-items: center;">
              <span style="color: #6b7280; font-weight: bold; min-width: 120px;"> Lieu :</span>
              <span>${lieuText}</span>
            </div>
            <div style="display: flex; align-items: center;">
              <span style="color: #6b7280; font-weight: bold; min-width: 120px;"> Type :</span>
              <span style="text-transform: capitalize;">${td.typeEvenement.replace('-', ' ')}</span>
            </div>
            <div style="display: flex; align-items: center;">
              <span style="color: #6b7280; font-weight: bold; min-width: 120px;"> Niveau :</span>
              <span style="text-transform: capitalize;">${td.niveauRequis.replace('-', ' ')}</span>
            </div>
            <div style="display: flex; align-items: center;">
              <span style="color: #6b7280; font-weight: bold; min-width: 120px;"> Places :</span>
              <span>${td.placesDisponibles} participants</span>
            </div>
          </div>

          <div style="margin-top: 15px;">
            <p style="color: #6b7280; font-weight: bold; margin-bottom: 8px;"> Technologies :</p>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${td.technologies.map(tech => 
                `<span style="background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 12px; font-size: 14px;">${tech}</span>`
              ).join('')}
            </div>
          </div>

          <div style="background: #f9fafb; padding: 12px; border-radius: 6px; margin-top: 15px;">
            <p style="margin: 0; font-size: 14px; color: #6b7280;">
              <strong>Organisateur :</strong> ${td.organisateur.nom}<br>
               ${td.organisateur.email} |  ${td.organisateur.telephone}
            </p>
          </div>
        </div>
      `;
    };

    //  NOUVEAU : Envoyer email professionnel avec logo TalentProof
    try {
      const companyInfo = {
        companyName,
        contactPerson,
        email,
        phone,
        website
      };
      
      await sendEmail({
        to: email,
        subject: ' Inscription TalentDay confirmée - TalentProof',
        html: companyTalentDayRegistrationTemplate(companyInfo, company.interestedTalentDays),
      });
    } catch (emailError) {
      console.error('Erreur envoi email entreprise:', emailError);
    }

    // Envoyer notification à l'admin
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL || 'admin@talentproof.com',
        subject: ' Nouvelle inscription entreprise TalentDay',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">Nouvelle inscription entreprise</h2>
            
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
              <h3 style="margin-top: 0;">Détails de l'entreprise :</h3>
              <p><strong>Entreprise :</strong> ${companyName}</p>
              <p><strong>Contact :</strong> ${contactPerson}</p>
              <p><strong>Email :</strong> ${email}</p>
              <p><strong>Téléphone :</strong> ${phone}</p>
              <p><strong>Site web :</strong> ${website || 'Non renseigné'}</p>
              ${notes ? `<p><strong>Notes :</strong> ${notes}</p>` : ''}
            </div>

            <p><strong>TalentDays d'intérêt :</strong></p>
            <ul>
              ${company.interestedTalentDays.map(td => `<li>${td.titre} - ${new Date(td.date).toLocaleDateString('fr-FR')}</li>`).join('')}
            </ul>

            <p>Connectez-vous au backoffice pour valider cette inscription.</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5174'}/admin/companies" 
               style="display: inline-block; background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">
              Voir dans le backoffice
            </a>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Erreur envoi email admin:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Inscription enregistrée avec succès. Vous recevrez un email de confirmation.',
      data: company,
    });
  } catch (error) {
    console.error('Erreur création inscription entreprise:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de l\'inscription',
    });
  }
};

/**
 * @desc    Récupérer toutes les inscriptions entreprises (admin)
 * @route   GET /api/companies
 * @access  Admin
 */
export const getCompanyRegistrations = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const companies = await CompanyRegistration.find(filter)
      .populate('interestedTalentDays', 'titre date statut')
      .populate('user', 'nom email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await CompanyRegistration.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: companies,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Erreur récupération inscriptions:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des inscriptions',
    });
  }
};

/**
 * @desc    Récupérer les détails d'une inscription
 * @route   GET /api/companies/:id
 * @access  Admin ou propriétaire
 */
export const getCompanyDetails = async (req, res) => {
  try {
    const company = await CompanyRegistration.findById(req.params.id)
      .populate('interestedTalentDays', 'titre date statut lieu')
      .populate('user', 'nom email')
      .populate('meetingRequests.talent', 'nom prenom email competences')
      .populate('meetingRequests.talentDay', 'titre date');

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Inscription non trouvée',
      });
    }

    // Vérifier les permissions (admin ou propriétaire)
    if (req.user.role !== 'admin' && company.user?.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé',
      });
    }

    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.error('Erreur récupération détails:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des détails',
    });
  }
};

/**
 * @desc    Mettre à jour le statut d'une inscription
 * @route   PATCH /api/companies/:id/status
 * @access  Admin
 */
export const updateCompanyStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'confirmed', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Statut invalide',
      });
    }

    const company = await CompanyRegistration.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate({
      path: 'interestedTalentDays',
      select: 'titre description date heureDebut heureFin lieu technologies placesDisponibles typeEvenement niveauRequis organisateur'
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Inscription non trouvée',
      });
    }

    // Fonction helper pour formater les détails d'un TalentDay
    const formatTalentDayDetails = (td) => {
      const dateFormatted = new Date(td.date).toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      const lieuText = td.lieu.type === 'physique' 
        ? `${td.lieu.adresse}, ${td.lieu.ville}` 
        : td.lieu.type === 'en-ligne'
        ? `En ligne : ${td.lieu.lienVirtuel}`
        : `Hybride - ${td.lieu.adresse}, ${td.lieu.ville} + ${td.lieu.lienVirtuel}`;

      return `
        <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 15px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">${td.titre}</h3>
          <p style="color: #4b5563; line-height: 1.6;">${td.description}</p>
          
          <div style="display: grid; gap: 10px; margin-top: 15px;">
            <div style="display: flex; align-items: center;">
              <span style="color: #6b7280; font-weight: bold; min-width: 120px;"> Date :</span>
              <span>${dateFormatted}</span>
            </div>
            <div style="display: flex; align-items: center;">
              <span style="color: #6b7280; font-weight: bold; min-width: 120px;"> Horaire :</span>
              <span>${td.heureDebut} - ${td.heureFin}</span>
            </div>
            <div style="display: flex; align-items: center;">
              <span style="color: #6b7280; font-weight: bold; min-width: 120px;"> Lieu :</span>
              <span>${lieuText}</span>
            </div>
            <div style="display: flex; align-items: center;">
              <span style="color: #6b7280; font-weight: bold; min-width: 120px;"> Type :</span>
              <span style="text-transform: capitalize;">${td.typeEvenement.replace('-', ' ')}</span>
            </div>
            <div style="display: flex; align-items: center;">
              <span style="color: #6b7280; font-weight: bold; min-width: 120px;"> Places :</span>
              <span>${td.placesDisponibles} participants</span>
            </div>
          </div>

          <div style="margin-top: 15px;">
            <p style="color: #6b7280; font-weight: bold; margin-bottom: 8px;"> Technologies :</p>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${td.technologies.map(tech => 
                `<span style="background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 12px; font-size: 14px;">${tech}</span>`
              ).join('')}
            </div>
          </div>

          <div style="background: #f9fafb; padding: 12px; border-radius: 6px; margin-top: 15px;">
            <p style="margin: 0; font-size: 14px; color: #6b7280;">
              <strong>Contact organisateur :</strong><br>
               ${td.organisateur.email} |  ${td.organisateur.telephone}
            </p>
          </div>
        </div>
      `;
    };

    // Envoyer email de notification
    let emailSubject = '';
    let emailContent = '';

    if (status === 'confirmed') {
      emailSubject = ' Votre inscription TalentDay a été confirmée !';
      emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; background: #f9fafb; padding: 30px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;"> Félicitations !</h1>
            <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 16px;">Votre inscription est confirmée</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px;">
            <p style="font-size: 16px; color: #374151;">Bonjour <strong>${company.contactPerson}</strong>,</p>
            <p style="color: #4b5563; line-height: 1.6;">
              Excellente nouvelle ! Votre inscription pour <strong>${company.companyName}</strong> aux TalentDays a été 
              <strong style="color: #059669;">validée et confirmée</strong> par notre équipe.
            </p>
            
            <div style="background: #d1fae5; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #059669;">
              <h3 style="margin-top: 0; color: #065f46;"> Vous pouvez maintenant :</h3>
              <ul style="color: #065f46; line-height: 1.8; margin: 10px 0;">
                <li><strong>Consulter</strong> la liste des talents participants</li>
                <li><strong>Parcourir</strong> les profils, portfolios et compétences</li>
                <li><strong>Réserver</strong> des meetings individuels avec les talents</li>
                <li><strong>Préparer</strong> vos questions et besoins de recrutement</li>
              </ul>
            </div>

            <h3 style="color: #1f2937; margin-top: 30px;"> Vos TalentDays</h3>
            <p style="color: #6b7280;">Voici les détails complets des événements auxquels vous participerez :</p>
            ${company.interestedTalentDays.map(td => formatTalentDayDetails(td)).join('')}

            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f59e0b;">
              <h4 style="margin-top: 0; color: #92400e;"> Conseils pour maximiser votre participation</h4>
              <ul style="color: #78350f; line-height: 1.8;">
                <li>Préparez vos critères de recrutement à l'avance</li>
                <li>Consultez les portfolios des talents avant les meetings</li>
                <li>Réservez vos créneaux tôt pour avoir plus de choix</li>
                <li>Préparez une présentation courte de votre entreprise</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5174'}/talent-days" 
                 style="display: inline-block; background: #059669; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                Accéder aux TalentDays
              </a>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">
                Des questions ? Contactez-nous à 
                <a href="mailto:${process.env.CONTACT_EMAIL || 'info@princeaman.dev'}" style="color: #2563eb;">
                  ${process.env.CONTACT_EMAIL || 'info@princeaman.dev'}
                </a>
              </p>
              <p style="color: #1e40af; font-weight: bold; margin: 10px 0;">À très bientôt !</p>
              <p style="color: #9ca3af; font-size: 14px;">L'équipe TalentProof</p>
            </div>
          </div>
        </div>
      `;
    } else if (status === 'rejected') {
      emailSubject = 'Information concernant votre inscription TalentDay';
      emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; background: #f9fafb; padding: 30px;">
          <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Information importante</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px;">
            <p style="font-size: 16px; color: #374151;">Bonjour <strong>${company.contactPerson}</strong>,</p>
            <p style="color: #4b5563; line-height: 1.6;">
              Nous vous remercions sincèrement pour votre intérêt pour les TalentDays organisés par TalentProof 
              et pour avoir pris le temps de soumettre votre inscription.
            </p>
            
            <div style="background: #fee2e2; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #dc2626;">
              <p style="color: #991b1b; margin: 0; line-height: 1.6;">
                Après examen attentif de votre demande, nous regrettons de vous informer que nous ne pouvons pas 
                donner suite à votre inscription pour les TalentDays sélectionnés.
              </p>
            </div>

            <h3 style="color: #1f2937;"> TalentDays concernés</h3>
            ${company.interestedTalentDays.map(td => `
              <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 15px; margin: 10px 0;">
                <h4 style="margin: 0 0 5px 0; color: #374151;">${td.titre}</h4>
                <p style="margin: 0; color: #6b7280; font-size: 14px;">
                   ${new Date(td.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            `).join('')}

            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f59e0b;">
              <h4 style="margin-top: 0; color: #92400e;">️ Raisons possibles</h4>
              <ul style="color: #78350f; line-height: 1.8; margin: 10px 0;">
                <li>Nombre limité de places entreprises disponibles</li>
                <li>Événements déjà complets au moment du traitement</li>
                <li>Profil d'entreprise ne correspondant pas exactement aux critères de l'événement</li>
                <li>Priorisation de certains secteurs d'activité pour cet événement</li>
              </ul>
            </div>

            <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #2563eb;">
              <h4 style="margin-top: 0; color: #1e40af;"> Prochaines opportunités</h4>
              <p style="color: #1e3a8a; margin: 0; line-height: 1.6;">
                Nous organisons régulièrement des TalentDays thématiques. N'hésitez pas à :
              </p>
              <ul style="color: #1e3a8a; line-height: 1.8;">
                <li>Vous réinscrire pour nos prochains événements</li>
                <li>Nous contacter pour discuter de vos besoins spécifiques</li>
                <li>Suivre nos actualités et annonces d'événements</li>
              </ul>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">
                Pour toute question ou information complémentaire :<br>
                 <a href="mailto:${process.env.CONTACT_EMAIL || 'info@princeaman.dev'}" style="color: #2563eb;">
                  ${process.env.CONTACT_EMAIL || 'info@princeaman.dev'}
                </a><br>
                 ${company.interestedTalentDays[0]?.organisateur?.telephone || '+32 467 62 08 78'}
              </p>
              <p style="color: #1e40af; font-weight: bold; margin: 15px 0;">Cordialement,</p>
              <p style="color: #9ca3af; font-size: 14px;">L'équipe TalentProof</p>
            </div>
          </div>
        </div>
      `;
    }

    if (emailSubject) {
      try {
        await sendEmail({
          to: company.email,
          subject: emailSubject,
          html: emailContent,
        });
      } catch (emailError) {
        console.error('Erreur envoi email statut:', emailError);
      }
    }

    res.status(200).json({
      success: true,
      message: `Statut mis à jour : ${status}`,
      data: company,
    });
  } catch (error) {
    console.error('Erreur mise à jour statut:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut',
    });
  }
};

/**
 * @desc    Réserver un meeting avec un talent
 * @route   POST /api/companies/:id/book
 * @access  Entreprise confirmée ou Admin
 */
export const bookTalentMeeting = async (req, res) => {
  try {
    const { talentId, talentDayId, proposedDate, message } = req.body;

    const company = await CompanyRegistration.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Inscription non trouvée',
      });
    }

    // Vérifier que l'entreprise est confirmée
    if (!company.canBook()) {
      return res.status(403).json({
        success: false,
        message: 'Votre inscription doit être confirmée pour réserver des meetings',
      });
    }

    // Vérifier les permissions (admin ou propriétaire)
    if (req.user.role !== 'admin' && company.user?.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé',
      });
    }

    // Vérifier que le talent existe
    const talent = await Talent.findById(talentId);
    if (!talent) {
      return res.status(404).json({
        success: false,
        message: 'Talent non trouvé',
      });
    }

    // Vérifier que le TalentDay existe
    const talentDay = await TalentDay.findById(talentDayId);
    if (!talentDay) {
      return res.status(404).json({
        success: false,
        message: 'TalentDay non trouvé',
      });
    }

    // Ajouter la demande de meeting
    company.meetingRequests.push({
      talent: talentId,
      talentDay: talentDayId,
      proposedDate: new Date(proposedDate),
      message,
      status: 'pending',
    });

    await company.save();

    // Envoyer email au talent
    try {
      await sendEmail({
        to: talent.email,
        subject: ` Demande de meeting de ${company.companyName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1e40af;">Nouvelle demande de meeting !</h2>
            <p>Bonjour ${talent.prenom} ${talent.nom},</p>
            
            <p>L'entreprise <strong>${company.companyName}</strong> souhaite vous rencontrer lors du TalentDay <strong>${talentDay.titre}</strong>.</p>
            
            <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1e40af;">
              <h3 style="margin-top: 0;">Détails de la demande :</h3>
              <p><strong>Entreprise :</strong> ${company.companyName}</p>
              <p><strong>Contact :</strong> ${company.contactPerson}</p>
              <p><strong>Date proposée :</strong> ${new Date(proposedDate).toLocaleString('fr-FR')}</p>
              ${message ? `<p><strong>Message :</strong> ${message}</p>` : ''}
            </div>

            <p>Connectez-vous à votre espace pour accepter ou refuser cette demande.</p>
            
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5174'}/dashboard" 
               style="display: inline-block; background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">
              Gérer mes meetings
            </a>

            <p style="margin-top: 30px;">Bonne chance !</p>
            <p style="color: #6b7280;">L'équipe TalentProof</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Erreur envoi email talent:', emailError);
    }

    // Envoyer confirmation à l'entreprise
    try {
      await sendEmail({
        to: company.email,
        subject: ' Demande de meeting envoyée',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #059669;">Demande envoyée avec succès !</h2>
            <p>Bonjour ${company.contactPerson},</p>
            
            <p>Votre demande de meeting avec <strong>${talent.prenom} ${talent.nom}</strong> a été envoyée.</p>
            
            <p><strong>Date proposée :</strong> ${new Date(proposedDate).toLocaleString('fr-FR')}</p>
            
            <p>Le talent recevra une notification et vous pourrez suivre l'état de votre demande dans votre espace.</p>
            
            <p>Nous vous tiendrons informé de sa réponse.</p>
            
            <p>Cordialement,</p>
            <p style="color: #6b7280;">L'équipe TalentProof</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Erreur envoi email confirmation:', emailError);
    }

    await company.populate('meetingRequests.talent', 'nom prenom email');

    res.status(201).json({
      success: true,
      message: 'Demande de meeting envoyée avec succès',
      data: company.meetingRequests[company.meetingRequests.length - 1],
    });
  } catch (error) {
    console.error('Erreur réservation meeting:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la réservation du meeting',
    });
  }
};
