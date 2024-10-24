const nodemailer = require("nodemailer");
var fs = require("fs");
const path = require('path')
const axios = require('axios')
const { mailTemplate } = require("./mailTemplate");
const { SMS_LINK_MTARGET, SMS_LINK_NEXAH } = require("../config/keys");

//Checks if user is authenticated
function isAuthenticatedUser(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error_msg", "Veuillez vous connecter pour accéder à cette page.");
  res.redirect("/login");
}

const replaceAll = (str, find, replace) => {
  var escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  return str.replace(new RegExp(escapedFind, "g"), replace);
};

const saveFile = (file, uploadDir) => {
  const fileName = `${Date.now()}_${file.name}`
  const filePath = path.join(uploadDir, fileName)
  const tempPath = file.path
  if (!fs.existsSync(tempPath)) {
    throw new Error(`Le fichier temporaire n'existe pas: ${tempPath}`)
  }
  try {
    fs.copyFileSync(tempPath, filePath)
    fs.unlinkSync(tempPath)  // Supprimer le fichier temporaire après copie
    console.log(`Fichier copié à : ${filePath}`)
  } catch (err) {
    console.error(`Erreur lors de la copie du fichier: ${err.message}`)
    throw err
  }

  return `/images/${fileName}`
}

const uploadFileWithFormidable = (file, uploadDir, name = "") => {
  if (file) {
    var oldpath = file.path;
    var newpath =
      uploadDir + getFileNameWithExt(file.name.replace(/ /g, "_"), name);
    fs.rename(oldpath, newpath, (err) => {
      if (err)
        throw new Error("Erreur lors du telechargement du fichier ", err);
      return newpath;
    });

    return newpath;
  }
};
function getFileNameWithExt(file, name) {
  const lastDot = file.lastIndexOf(".");
  const fileName = file.substring(0, lastDot);
  const ext = file.substring(lastDot + 1);
  return fileName + Date.now() + name + "." + ext;
}
const smtpTransport = nodemailer.createTransport({
  host: "mail.smartcodegroup.com",
  port: 465,
  secure: "ssl", // upgrade later with STARTTLS
  auth: {
    user: "no-reply@smartcodegroup.com",
    pass: "63-U5}]K[fB4",
  },
});
const mailTranporter = () => {
  var smtpConfig = {
    host: "mail.smartcodegroup.com",
    port: 465,
    secure: true, // use SSL
    auth: {
      user: 'tira@smartcodegroup.com',
      pass: 'Px79#,^cc?.!'
    },
  };
  const transporter = nodemailer.createTransport(smtpConfig);
  return transporter;
};
const sendNotification = (email) => {
  let subject = "Import terminé";
  let to = email;
  let from = "no-reply@kwatahelp.com";
  let html = `<p>Hello,<p><br><p>Nous vous informons que votre import est terminé.</p>`;

  var mailOptions = createMailOption(subject, html, from, to);
  //configure the email transport
  var transporter = mailTranporter();
  //send the code verification
  transporter.sendMail(mailOptions, function (error, info) {
    return true;
  });
};
const createMailOption = (subject, html, from, to) => {
  //create the html tmplate
  const html1 = mailTemplate(subject, html);
  var mailOptions = {
    from: from,
    to: to,
    subject: subject,
    html: html1,
  };
  return mailOptions;
};
const formatPhone = (phone, code) => {
  let forPhone = phone;
  if (phone.length >= 6) {
    let pcode = phone.slice(0, 3);
    if (pcode == code) forPhone = "+" + phone;
    else forPhone = "+" + code + phone;
  }
  return forPhone.replace(/ /g, "");
};


const formatDate = (timestamp) => {
  const date = new Date(timestamp)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')  // Mois de 0 à 11, on ajoute +1
  const day = String(date.getDate()).padStart(2, '0')
  
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

const sendSms = async (phoneNumber, message) => {
  // je prepare mon corps de requete..
  const data = new URLSearchParams({
      username: 'aiteconsulting',  // Remplace par ton nom d'utilisateur MTARGET
      password: 'ch0BpMeTvV2w',  // Remplace par ton mot de passe MTARGET
      msisdn: phoneNumber,  // Numéro Orange Cameroun au format international
      msg: message,  // Message simple à envoyer
      timetosend: formatDate(Date.now()),  // Date et heure d'envoi programmée
      sender: 'AITE',  // Nom ou ID de l'expéditeur
    })

  const headers = {
  'Content-Type': 'application/x-www-form-urlencoded',
  }
  console.log('D Envoi', formatDate(Date.now()))
  try {
  const response = await axios.post(SMS_LINK_MTARGET, data.toString(), { headers })
  console.log('SMS programmé avec succès:', response.data)
  } catch (error) {
  console.error('Erreur send SMS:', error.response ? 
      error.response.data : 
      error.message
  )
  }
}

const sendNexahSms = async (phoneNumber, message) => {
  // prepare mes donnees de l'API..
  // const data = {
  //   user: 'bessala.aristide@aite-consulting.com', // Votre nom d'utilisateur Nexa
  //   password: 'kisskiss', // Votre mot de passe Nexa
  //   senderid: 'KWATAHELP', // ID de l'expéditeur (choisissez selon votre compte)
  //   sms: `${message}`, // Votre message
  //   mobiles: `${phoneNumber}`, // Les numéros de téléphone à cibler (format international)
  //   scheduletime: `${formatDate(Date.now())}` // Facultatif : heure programmée pour l'envoi
  // }
  const headers = {
    'Content-Type': 'application/json',
  }

  // Construire l'URL avec les paramètres
  const url = `${SMS_LINK_NEXAH}?user=bessala.aristide@aite-consulting.com&password=kisskiss&senderid=KWATAHELP&sms='${message}'&mobiles=${phoneNumber}`
  console.log('url nexah => ', url)
  try {
    // Envoi de ma requete Nexah
    // const response = await axios.post(SMS_LINK_NEXAH, data, { headers })
    const response = await axios.get(url)

    // Gérer la réponse
    console.log('Réponse:', response.data)
  } catch (error) {
    // Gérer les erreurs
    console.error('Erreur lors de l\'envoi du SMS:', error.response ? error.response.data : error.message)
  }
}

module.exports = {
  isAuthenticatedUser,
  replaceAll,
  smtpTransport,
  uploadFileWithFormidable,
  saveFile,
  formatPhone,
  sendNotification,
  sendSms,
  sendNexahSms,
};
