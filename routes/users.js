const express = require("express");
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
const async = require("async");
const nodemailer = require("nodemailer");
const formidable = require("formidable");
var fs = require("fs");
var ejs = require("ejs");
//Requiring user model
const User = require("../models/userModel");
const Quartier = require("../models/quartier");
const {
  smtpTransport,
  replaceAll,
  isAuthenticatedUser,
  sendSms,
} = require("../helpers/utils");
const { SMS_LINK } = require("../config/keys");
const axios = require("axios");

//Get routes
router.get("/", (req, res) => {
  User.findOne({ type: "admin" })
    .then((users) => {
      if (users) {
        res.render("./users/login");
      } else {
        let userData = {
          name: "Admin",
          phone: "admin@kwatahelp.com",
          email: "admin@kwatahelp.com",
          type: "admin",
          active: 1,
        };
        var password = "kwataHelp@21";
        User.register(userData, password, (err, user) => {
          user.setPassword(password);
          if (err) {
            console.log(err);
          } else {
            res.render("./users/login");
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/login", (req, res) => {
  var jan312009 = new Date();
  var oneMonthFromJan312009 = new Date(
    new Date(jan312009).setMonth(jan312009.getMonth() + 1)
  );
  console.log(oneMonthFromJan312009);
  res.render("./users/login");
});

router.get("/dashboard/users/add/:type", isAuthenticatedUser, (req, res) => {
  var title = "Ajouter un simple utilisateur";
  if (req.params.type == "admin") title = "Ajouter un administrateur";
  if (req.params.type == "provider")
    title = "Ajouter un prestataire de services";
  if (req.params.type == "agent") title = "Ajouter un agent de rue";
  if (req.params.type == "region_admin")
    title = "Ajouter un responsables régional";
  if (req.params.type == "nationaux_admin")
    title = "Ajouter un responsables national";

  Quartier.find().then((quartiers) => {
    res.render("./users/add", {
      page: title,
      userdata: req.user,
      user_admin_id: req.user._id,
      menu: "user",
      niveau: null,
      spec: null,
      lang: [],
      user: null,
      quartiers: quartiers,
      type: req.params.type,
    });
  });
});

router.get("/dashboard", isAuthenticatedUser, (req, res) => {
  console.log(req);
  User.find({ type: { $ne: "admin" } })
    .then((users) => {
      var nbre_user = users.length;
      var nbre_ecole = users.filter(
        (champ) => champ.type == "parent" && champ.ecole == req.user.id
      ).length;

      User.aggregate([
        { $match: { type: "user" } },
        {
          $project: {
            createdAt: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
          },
        },
        {
          $group: {
            _id: { createdAt: "$createdAt" },
            count: { $sum: 1 },
          },
        },
        {
          $project: { _id: 0, createdAt: "$_id.createdAt", count: 1 },
        },
        {
          $sort: { createdAt: -1 },
        },
      ])
        .then((statdata_etudiant) => {
          User.aggregate([
            { $match: { type: "parent", ecole: req.user.id } },
            {
              $project: {
                createdAt: {
                  $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                },
              },
            },
            {
              $group: {
                _id: { createdAt: "$createdAt" },
                count: { $sum: 1 },
              },
            },
            {
              $project: { _id: 0, createdAt: "$_id.createdAt", count: 1 },
            },
            {
              $sort: { createdAt: -1 },
            },
          ])
            .then((statdata_ecole) => {
              var admin = req.user.id;
              res.render("./users/dashboard", {
                users: users,
                page: "Dashboard",
                userdata: req.user,
                user_admin_id: req.user._id,
                menu: "",
                nbre_user: nbre_user,
                nbre_parent: nbre_ecole,
                nbre_message_programme: 0,
                nbre_message_total: 0,
                statdata_etudiant,
                statdata_ecole,
                admin,
              });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/logout", isAuthenticatedUser, (req, res) => {
  req.logOut();
  req.flash("success_msg", "Déconnexion reussie.");
  res.redirect("/login");
});

router.get("/forgot", (req, res) => {
  res.render("./users/forgot");
});

router.get("/reset/:token", (req, res) => {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        req.flash(
          "error_msg",
          "Password reset token is invalid or has been expired!"
        );
        res.redirect("/forgot");
      }
      res.render("./users/newpassword", { token: req.params.token });
    })
    .catch((err) => {
      req.flash("error_msg", "ERROR: " + err);
      res.redirect("/forgot");
    });
});

router.get("/password/change", (req, res) => {
  res.render("./users/changepassword");
});

router.get("/dashboard/users/:type", isAuthenticatedUser, (req, res) => {
  var title = "Liste des simples utilisateurs";
  if (req.params.type == "admin") title = "Liste des administrateurs";
  if (req.params.type == "provider")
    title = "Liste des prestataires de services";
  if (req.params.type == "agent") title = "Liste des agents de rue";
  if (req.params.type == "region_admin")
    title = "Liste des responsables régionaux";
  if (req.params.type == "nationaux_admin")
    title = "Liste des responsables nationaux";

  User.find({ type: req.params.type })
    .populate({
      path: "idQuartier",
      populate: {
        path: "idVille",
        populate: { path: "idRegion", populate: { path: "idPays" } },
      },
    })
    .sort({ createdAt: -1 })
    .then((users) => {
      console.log(users);
      res.render("./users/allusers", {
        users: users,
        page: "Utilisateurs",
        userdata: req.user,
        user_admin_id: req.user._id,
        menu: "user",
        title,
        type: req.params.type,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/dashboard/ecoles", isAuthenticatedUser, (req, res) => {
  User.find({ type: "Ecole" })
    .sort({ createdAt: -1 })
    .then((users) => {
      res.render("./users/ecoles", {
        users: users,
        page: "Utilisateurs",
        userdata: req.user,
        user_admin_id: req.user._id,
        menu: "user",
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/api/quartiers", (req, res) => {
  Quartier.find()
    .populate("idPays")
    .sort({ createdAt: -1 })
    .then((quartiers) => {
      res.status(200).json({
        quartiers: quartiers,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get(
  "/dashboard/users/edit/:id/:type",
  isAuthenticatedUser,
  (req, res) => {
    let searchQuery = { _id: req.params.id };
    Quartier.find().then((quartiers) => {
      User.findOne(searchQuery)
        .then((user) => {
          res.render("./users/add", {
            user,
            type: req.params.type,
            page: "Modifier l'utilisateur",
            userdata: req.user,
            user_admin_id: req.user._id,
            menu: "user",
            quartiers: quartiers,
          });
        })
        .catch((err) => {
          console.log(err);
          // req.flash('error_msg', 'ERROR: ' + err)http://localhost:5000/dashboard/users/edit/602e529c29fc4058e4cca6c0/saveaddeducation
          res.redirect("/dashboard/users/user");
        });
    });
  }
);

router.get("/reset-password/:id", (req, res) => {
  let searchQuery = { _id: req.params.id };

  User.findOne(searchQuery)
    .then((user) => {
      res.render("./users/resetpwd", { user });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/user/details/:id", (req, res) => {
  User.findOne({ _id: req.params.id })
    // .populate('eleve_honneur','_id titre_honneur annee_honneur description_honneur attestation_honneur')
    // .populate('eleve_experience','_id titre_poste_eleve entreprise_eleve debut_entreprise fin_entreprise desc_poste_eleve attestation_entreprise_eleve')
    // .populate('eleve_langue','_id langue_eleve attestation_langue_eleve')
    // .populate('eleve_education','_id niveau_etude_eleve specialisation_eleve etablissement_eleve pays_etablissement debut_etablissement fin_etablissement desc_formation resultat_formation bulletin_eleve diplome_eleve')
    .then((user) => {
      return res.status(200).json({
        type: "success",
        data: user,
        message: "Infos de l'utilisateur récupérées avec succès.",
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/user/details-profile/:username", (req, res) => {
  User.findOne({ username: req.params.username })
    .then((user) => {
      User.updateOne(
        { _id: user._id },
        {
          $set: {
            vue: parseInt(user.vue) + 1,
          },
        }
      )
        .then((lange) => {
          return res.status(200).json({
            type: "success",
            data: user,
            message: "Infos de l'utilisateur récupérées avec succès.",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

/******************Post routes*******************/
//web auth
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/successjson",
    failureRedirect: "/failurejson",
    failureFlash: true,
  })
);
router.get("/successjson", function (req, res) {
  console.log('successjson', req.body)
  res.status(200).json({ success: "Login ok.", user: req.user });
});

router.get("/failurejson", function (req, res) {
  console.log('failurejson', req.body)
  res.status(401).json({ error: "Identifiants invalides." });
});

//api auth
router.post("/api/login", function (req, res, next) {
  console.log('ICICC ', req.body)
  var langue = req.body.lang;
  console.log(req.body.phone);

  passport.authenticate("local", function (err, user, info) {
    console.log('fet => ', user);
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        type: "error",
        message:
          langue == "en" ? "Invalid identifiers." : "Identifiants invalides.",
      });
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      User.findOne({ _id: req.user._id })
        .then((user) => {
          return res.status(200).json({
            type: "success",
            data: user,
            message:
              langue == "en"
                ? "Welcome " + user.name
                : "Bienvenue " + user.name,
            createdAt: user.createdAt,
            welcome_message: null,
          });
        })
        .catch((err) => {
          return res.status(422).json({ message: "ERROR: " + err });
        });
    });
  })(req, res, next);
});

//web and api registration
/**
 * @api {post} /signup Request User Signup
 * @apiName UserSignup
 * @apiGroup User
 *
 * @apiParam {String} [name]  Optional Name of the User.
 * @apiParam {String} [phone]  Phone of the User.
 * @apiParam {String} [type]  Type of the User.
 * @apiParam {String} [password] passord of the user.
 *
 * @apiSuccess {String} message Account created successfully.
 * @apiSuccess {Object} user details  of the User.
 */
router.post("/signup", (req, res, next) => {
  const form = formidable({ multiples: true });
  var filese = [];
  var champs = [];
  form.on("file", function (field, file) {
    filese.push({ field: field, file: file });
  });
  form.on("field", function (fieldName, fieldValue) {
    champs.push({
      key: fieldName,
      value: fieldValue == "undefined" ? "" : fieldValue,
    });
  });
  form.parse(req, (err, fields, files) => {
    if (err) {
      console.log(err);
      next(err);
      return;
    }
    console.log(fields);

    if (fields.id_user == "no" || !fields.id_user) {
      fields.code = Math.floor(1000 + Math.random() * 9000);
      User.register(fields, fields.password, (err, user) => {
        if (err) {
          console.log(err);
          var message = "";
          if (err.code == 11000 && err.message.indexOf("username_1") > -1) {
            message = "Un utilisateur ayant ce nom existe déjà";
          } else if (err.message.indexOf("username") > -1) {
            message = "Un utilisateur ayant ce numéro de téléphone existe déjà";
          }
          return res.status(400).json({ type: "error", message: message });
        }
        user.setPassword(fields.password);
        console.log('User created ', SMS_LINK, user.phone.split("+")[1], fields)
        // if (fields.send_sms == "yes") {
          console.log('send_sms try => ', user.phone)
          const msg_sms = `Votre code de validation est ${user.code}`
          // axios
          //   .get(
          //     SMS_LINK +
          //       "&destination=" +
          //       user.phone.split("+")[1] +
          //       "&message=Votre code de validation est " +
          //       user.code
          //   )
          //   .then(function (response) {
          //     console.log('success sms =>', response);
          //   })
          //   .catch((err) => console.log('Failed sms =>', err));
        // }

        // Envoi SMS ici..
        sendSms(user.phone, msg_sms)
        // Fin envoi SMS..
        return res.status(200).json({
          type: "success",
          message: "Compte créé avec succès !",
          user: user,
        });
      });
    } else {
      let searchQuery = { _id: fields.id_user };
      let password= fields.password;
      delete fields.password;
      User.updateOne(searchQuery, {
        $set: fields,
      })
        .then((user) => {
          if (password) {
            user.setPassword(password);
          }
          return res.status(200).json({
            type: "success",
            message: "Compte modifié avec succès !",
            redirector: fields.savetype,
            user: user,
          });
        })
        .catch((err) => {
          console.log(err);
          return res
            .status(200)
            .json({ type: "error", message: "ERROR: " + err });
        });
    }
  });
});

router.post("/password/change", (req, res) => {
  User.findOne({ _id: req.body.user_id })
    .then((user) => {
      user.setPassword(req.body.password, (err) => {
        user.save().then((user) => {
          return res.status(200).json({
            type: "success",
            message:
              req.body.lang == "en"
                ? "Password reset successfully"
                : "Mot de passe reinitialisé avec succès.",
            user,
          });
        });
      });
    })
    .catch((err) => {
      return res.status(422).json({ message: "ERROR: " + err });
    });
});

//Routes to handle forgot password
router.post("/forgot-pwd", (req, res, next) => {
  var code = Math.floor(1000 + Math.random() * 9000);
  let searchQuery = { phone: req.body.phone };
  User.updateOne(searchQuery, {
    $set: {
      code: code,
    },
  })
    .then((user) => {
      User.findOne(searchQuery).then((u) => {
        if (u) {
          return res.status(200).json({
            type: "error",
            message: "Nous vous avons envoyé un code de validation!",
            user: u,
          });
        } else {
          return res.status(400).json({
            message: "Aucun utilisateur trouvé!",
          });
        }
      });
    })
    .catch((err) => {
      return res.status(422).json({ error: err });
    });
});

/**
 * @api {put} /edit/id Request id the id of the user
 * @apiName UserEdit
 * @apiGroup User
 *
 *  @apiParam {String} id Users unique ID.
 * @apiParam {String} [residence]  Residence of the User.
 * @apiParam {String} [phone]  Phone of the User.
 *
 * @apiSuccess {String} message User updated successfully.
 * @apiSuccess {Object} user details  of the User.
 */
//Put routes starts here
router.get("/activate-user/:id", (req, res) => {
  let searchQuery = { _id: req.params.id };
  User.updateOne(searchQuery, {
    $set: {
      active: 1,
    },
  })
    .then((user) => {
      User.findOne(searchQuery).then((u) => {
        if (u) {
          return res
            .status(200)
            .json({ message: "Votre compte à été activé!", user: u });
        } else {
          return res.status(400).json({
            message: "Aucun utilisateur trouvé!",
          });
        }
      });
    })
    .catch((err) => {
      return res.status(422).json({ error: err });
    });
});

/**
 * @api {put} /edit/id Request id the id of the user
 * @apiName UserEdit
 * @apiGroup User
 *
 *  @apiParam {String} id Users unique ID.
 * @apiParam {String} [residence]  Residence of the User.
 * @apiParam {String} [phone]  Phone of the User.
 *
 * @apiSuccess {String} message User updated successfully.
 * @apiSuccess {Object} user details  of the User.
 */
//Put routes starts here
router.put("/edit/:id", (req, res) => {
  let searchQuery = { _id: req.params.id };
  if (req.body.activate == "oui") {
    User.updateOne(searchQuery, {
      $set: {
        active: req.body.active,
      },
    })
      .then((user) => {
        Formation.update(
          { user_id: req.params.id },
          {
            $set: {
              active: req.body.active,
            },
          }
        )
          .then((user) => {
            return res
              .status(200)
              .json({ message: "User updated successfully", user });
          })
          .catch((err) => {
            return res.status(422).json({ error: err });
          });
      })
      .catch((err) => {
        return res.status(422).json({ error: err });
      });
  } else {
    User.updateOne(searchQuery, {
      $set: {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        residence: req.body.residence,
      },
    })
      .then((user) => {
        return res
          .status(200)
          .json({ message: "User updated successfully", user });
      })
      .catch((err) => {
        return res.status(200).json({ error: err });
      });
  }
});

//Update residence Api
// router.put('/residence/:id', (req,res) =>{
//     let searchQuery = {_id:req.params.id}
//     User.updateOne(searchQuery, {$set: {residence: req.body.residence}})
//     .then(user =>{
//         return res.status(200).json({ message: 'User updated successfully', user: {residence: req.body.residence, phone: req.body.phone} })
//     })
//     .catch(err =>{
//         return res.status(422).json({ error: 'ERROR: '+err })
//     })
// })

//Delete route starts here
router.delete("/delete/user/:id", (req, res) => {
  let searchQuery = { _id: req.params.id };

  // User.updateOne(searchQuery, {$set: {active:0}})
  //     .then(user =>{
  //         if(req.body.type !== 'admin'){
  //             return res.status(200).json({ message: 'User blocked successfully' })
  //         }
  //         req.flash('success_msg', 'User blocked successfully')
  //         res.redirect('/users/all')
  //     })
  //     .catch(err =>{
  //         if(req.body.type !== 'admin'){
  //             return res.status(422).json({ error: 'ERROR: '+err })
  //         }
  //         req.flash('error_msg', 'ERROR: '+err)
  //         res.redirect('/users/all')
  //     })
});

//Delete route starts here
router.delete("/undelete/user/:id", (req, res) => {
  let searchQuery = { _id: req.params.id };

  User.updateOne(searchQuery, { $set: { active: 1 } })
    .then((user) => {
      if (req.body.type !== "admin") {
        return res.status(200).json({ message: "User unblocked successfully" });
      }
      req.flash("success_msg", "User unblocked successfully");
      res.redirect("/users/all");
    })
    .catch((err) => {
      if (req.body.type !== "admin") {
        return res.status(422).json({ error: "ERROR: " + err });
      }
      req.flash("error_msg", "ERROR: " + err);
      res.redirect("/users/all");
    });
});

//Delete route starts here
router.get("/dashboard/user-delete/:id", (req, res) => {
  let searchQuery = { _id: req.params.id };

  User.deleteOne(searchQuery)
    .then((lang) => {
      return res.status(200).json({ type: "succes" });
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({ type: "error", message: "Erreur " + err });
    });
});

router.get("/api/search_student", (req, res) => {
  User.find({ type: "Etudiant" })
    .sort({ createdAt: -1 })
    .then((lang) => {
      return res.status(200).json({
        type: "success",
        message: "Etudiant récupéré avec succès !",
        data: lang,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/api/like/:id", (req, res) => {
  User.findOne({ _id: req.query.studentId })
    .then((user) => {
      user.like(req.params.id).then((result) => {
        User.findOne({ _id: req.params.id }).then((ecole) => {
          ReponseMail.findOne({ user_id: req.params.id }).then((rep) => {
            var subject = rep.subject_like;
            var body = "";
            body = replaceAll(
              rep.content_like,
              "#ecole_name#",
              ecole.nom_ecole
            );
            body = replaceAll(body, "#ecole_email#", ecole.email);
            body = replaceAll(body, "#etudiant_name#", user.name);
            body = replaceAll(body, "#etudiant_email#", user.email);
            let mailOptions = {
              to: user.email,
              from: "no-reply@smartcodegroup.com",
              subject: subject ? subject : "Like du profil",
              text: body
                ? body
                : "Hello, " +
                  user.username +
                  "\n\n" +
                  ecole.nom_ecole +
                  " Like your profil",
            };
            smtpTransport.sendMail(mailOptions, (err) => {
              addNotification(
                req,
                req.params.id,
                "A liker votre profil",
                req.query.studentId,
                false,
                "/ecole/" + ecole.username
              )
                .then((resp) => {
                  return res
                    .status(200)
                    .json({ type: "success", message: "success", data: user });
                })
                .catch((err) => {
                  console.log(err);
                  return res.status(422).json({ message: "ERROR: " + err });
                });
            });
          });
        });
      });
    })
    .catch((err) => {
      return res.status(422).json({ error: "ERROR: " + err });
    });
});
module.exports = router;
