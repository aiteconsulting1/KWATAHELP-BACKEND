const nodemailer = require('nodemailer')

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
module.exports = {
    isAuthenticatedUser,
    replaceAll,
    smtpTransport
  };