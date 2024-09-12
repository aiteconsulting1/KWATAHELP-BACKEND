const nodemailer = require('nodemailer')
const axios = require('axios')
const { SMS_LINK_MTARGET } = require("../config/keys");

//Checks if user is authenticated
function isAuthenticatedUser(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    req.flash('error_msg', 'Veuillez vous connecter pour accéder à cette page.')
    res.redirect('/login')
}

const replaceAll=(str, find, replace)=> {
    var escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return str.replace(new RegExp(escapedFind, 'g'), replace);
}
const smtpTransport = nodemailer.createTransport({
    host: "mail.smartcodegroup.com",
    port: 465,
    secure: 'ssl', // upgrade later with STARTTLS
    auth: {
        user: "no-reply@smartcodegroup.com",
        pass: "63-U5}]K[fB4"
    }
})

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

module.exports = {
    isAuthenticatedUser,
    replaceAll,
    smtpTransport,
    sendSms
}