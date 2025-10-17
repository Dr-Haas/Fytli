/**
 * Configuration de Nodemailer pour l'envoi d'emails
 * Templates pour confirmation, reset password, notifications
 */

const nodemailer = require('nodemailer');

/**
 * Configuration du transporteur d'emails
 */
const createTransporter = () => {
  // En développement, utiliser Ethereal (emails de test)
  if (process.env.NODE_ENV === 'development' && !process.env.EMAIL_HOST) {
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: 'ethereal.user@ethereal.email',
        pass: 'ethereal.password'
      }
    });
  }

  // En production, utiliser la configuration réelle
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

const transporter = createTransporter();

/**
 * Template d'email de bienvenue
 */
const sendWelcomeEmail = async (userEmail, userName) => {
  const mailOptions = {
    from: `"FollowSport" <${process.env.EMAIL_FROM || 'noreply@followsport.com'}>`,
    to: userEmail,
    subject: 'Bienvenue sur FollowSport ! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4CAF50;">Bienvenue ${userName} !</h1>
        <p>Nous sommes ravis de vous accueillir sur <strong>FollowSport</strong>.</p>
        <p>Vous pouvez maintenant :</p>
        <ul>
          <li>📋 Créer vos programmes d'entraînement personnalisés</li>
          <li>💪 Suivre vos sessions d'exercices</li>
          <li>📊 Analyser votre progression</li>
        </ul>
        <p>Commencez dès maintenant votre parcours sportif !</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          Cet email a été envoyé automatiquement, merci de ne pas y répondre.
        </p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email de bienvenue envoyé:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Erreur envoi email de bienvenue:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Template d'email de réinitialisation de mot de passe
 */
const sendPasswordResetEmail = async (userEmail, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: `"FollowSport" <${process.env.EMAIL_FROM || 'noreply@followsport.com'}>`,
    to: userEmail,
    subject: 'Réinitialisation de votre mot de passe 🔐',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #FF9800;">Réinitialisation de mot de passe</h1>
        <p>Vous avez demandé à réinitialiser votre mot de passe FollowSport.</p>
        <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
          Réinitialiser mon mot de passe
        </a>
        <p style="color: #666;">
          Ce lien est valide pendant <strong>1 heure</strong>.
        </p>
        <p style="color: #999; font-size: 14px;">
          Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          Ou copiez ce lien dans votre navigateur :<br>
          <span style="color: #2196F3;">${resetUrl}</span>
        </p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email de reset password envoyé:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Erreur envoi email reset password:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Template d'email de notification de progression
 */
const sendProgressNotification = async (userEmail, userName, achievements) => {
  const mailOptions = {
    from: `"FollowSport" <${process.env.EMAIL_FROM || 'noreply@followsport.com'}>`,
    to: userEmail,
    subject: 'Bravo pour votre progression ! 🏆',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4CAF50;">Félicitations ${userName} ! 🎉</h1>
        <p>Vous avez franchi de nouvelles étapes dans votre parcours sportif :</p>
        <ul>
          ${achievements.map(achievement => `<li>✅ ${achievement}</li>`).join('')}
        </ul>
        <p>Continuez comme ça, vous êtes sur la bonne voie ! 💪</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          Connectez-vous pour voir vos statistiques détaillées.
        </p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email de notification envoyé:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Erreur envoi email de notification:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Envoie un email générique
 */
const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: `"FollowSport" <${process.env.EMAIL_FROM || 'noreply@followsport.com'}>`,
    to,
    subject,
    html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email envoyé:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Erreur envoi email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendProgressNotification,
  sendEmail
};

