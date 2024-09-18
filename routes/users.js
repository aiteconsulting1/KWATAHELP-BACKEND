const express = require("express");
const router = express.Router();
const passport = require("passport");
const formidable = require("formidable");
//Requiring user model
const User = require("../models/userModel");
const Quartier = require("../models/quartier");
const Product = require("../models/product");
const Publicite = require("../models/publicite");
const ProductOffer = require("../models/productOffer");
const Vip = require("../models/vip");
const Review = require("../models/review");
const readXlsxFile = require("read-excel-file/node");
const Pays = require("../models/paysModel");
const Ville = require("../models/ville");
const Region = require("../models/region");
const Category = require("../models/category");
const mongoose = require("mongoose");

const {
  isAuthenticatedUser,
  uploadFileWithFormidable,
  formatPhone,
  sendNotification,
  sendSms,
} = require("../helpers/utils");

//Get routes
router.get("/login", (req, res) => {
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
router.get("/", (req, res) => {
  res.render("./landing/index");
});

router.get("/dashboard/users/add/:type", isAuthenticatedUser, (req, res) => {
  var title = "Ajouter un simple utilisateur";
  if (req.params.type == "admin") title = "Ajouter un administrateur";
  if (req.params.type == "provider")
    title = "Ajouter un prestataire de services";
  if (req.params.type == "agent") title = "Ajouter un agent de rue";
  if (req.params.type == "region_admin")
    title = "Ajouter un responsables régional";
  if (req.params.type == "national_admin")
    title = "Ajouter un responsables national";

  Quartier.find().then((quartiers) => {
    if (req.user.type == "region_admin") {
      let quartier = quartiers.find((item) => item._id === req.user.idQuartier);
      quartiers = quartiers.filter(
        (item) => quartier && item.idRegion == quartier.idRegion
      );
    }
    if (req.user.type == "national_admin") {
      let quartier = quartiers.find((item) => item._id === req.user.idQuartier);
      quartiers = quartiers.filter(
        (item) => quartier && item.idPays == quartie.idPays
      );
    }
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

// BACKUP ANCIEN...
router.get("/dashboard", isAuthenticatedUser, (req, res) => {
  console.log('Ce user est ', req.user.type)
  const types = new Set(['region_admin', 'user', 'agent'])
  if (req.user.type == "admin") {
    User.find({ type: { $ne: "admin" } })
      .then((users) => {
        var nbre_user = users.filter((champ) => champ.type == "user").length;
        var nbre_ecole = users.filter(
          (champ) => champ.type == "provider"
        ).length;
        User.aggregate([
          { $match: { type: { $in: ["user", "provider"] } } },
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
            Product.aggregate([
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
              .then((statdata) => {
                var product = 0;
                for (let item of statdata) {
                  product += item.count;
                }
                Publicite.countDocuments().then((pubs) => {
                  var admin = req.user.id;
                  res.render("./users/dashboard", {
                    users: users,
                    page: "Dashboard",
                    userdata: req.user,
                    user_admin_id: req.user._id,
                    menu: "",
                    nbre_user: nbre_user,
                    nbre_parent: nbre_ecole,
                    nbre_message_programme: pubs,
                    nbre_message_total: product,
                    statdata_etudiant,
                    statdata_ecole: statdata,
                    admin,
                  });
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
  } else if (types.has(req.user.type)) {
    res.redirect("/dashboard/users/agent");
  } else if (req.user.type == "national_admin") {
    res.redirect("/dashboard/users/region_admin");
  } else {
    res.redirect("/login");
  }
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
  if (req.params.type == "national_admin")
    title = "Liste des responsables nationaux";

  User.find({ type: req.params.type })
    .populate({
      path: "idQuartier",
      populate: {
        path: "idVille",
        populate: { path: "idRegion", populate: { path: "idPays" } },
      },
    })
    .populate("plan")
    .sort({ createdAt: -1 })
    .then((users) => {
      if (req.user.type == "region_admin") {
        Quartier.findOne({ _id: req.user.idQuartier }).then((quartier) => {
          users = users.filter(
            (item) => item.idQuartier.iRegion == quartier.idRegion
          );
        });
      }
      if (req.user.type == "national_admin") {
        Quartier.findOne({ _id: req.user.idQuartier }).then((quartier) => {
          users = users.filter(
            (item) => item.idQuartier.idPays == quartier.idPays
          );
        });
      }
      res.render("./users/allusers", {
        users: users,
        page: title,
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
      var pays = req.query.pays;
      if (pays) quartiers = quartiers.filter((item) => item.idPays._id == pays);
      res.status(200).json({
        quartiers: quartiers,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/api/user/:id", (req, res) => {
  User.findOne({ _id: req.params.id })
    .populate({
      path: "idQuartier",
      populate: {
        path: "idVille",
        populate: { path: "idRegion", populate: { path: "idPays" } },
      },
    })
    .populate("domaines")
    .populate("plan")
    .sort({ createdAt: -1 })
    .then((user) => {
      res.status(200).json({
        user: user,
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
      if (req.user.type == "region_admin") {
        let quartier = quartiers.find(
          (item) => item._id == req.user.idQuartier
        );
        quartiers = quartiers.filter(
          (item) => item.idRegion == quartier.idRegion
        );
      }
      if (req.user.type == "national_admin") {
        let quartier = quartiers.find(
          (item) => item._id == req.user.idQuartier
        );
        quartiers = quartiers.filter((item) => item.idPays == quartier.idPays);
      }
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
        .then(() => {
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
router.get("/successjson", async function (req, res) {
  console.log('successjson -> ')
  const user = await User.findOne({ _id: req.user._id })
    .populate({
      path: "idQuartier",
      populate: {
        path: "idVille",
        populate: { path: "idRegion", populate: { path: "idPays" } },
      },
    })
    .populate("plan");
    console.log('user pris =>  ', user)
    res.status(200).json({ success: "Login ok.", user: req.user });
});

router.get("/failurejson", async function (req, res) {
  console.log('failurejson ==> ')
  res.status(401).json({ error: "Identifiants invalides." });
});

//api auth
router.post("/api/login", function (req, res, next) {
  var langue = req.body.lang;

  passport.authenticate("local", function (err, user) {
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
        .populate({
          path: "idQuartier",
          populate: {
            path: "idVille",
            populate: { path: "idRegion", populate: { path: "idPays" } },
          },
        })
        .populate("plan")
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

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.log(err);
      next(err);
      return;
    }

    if (files && files.image && files.image.name) {
      const url = uploadFileWithFormidable(files.image, "public/images/");
      if (url) fields.image = url.split("public")[1];
    }
    if (fields.categories) fields.domaines = fields.categories.split(",");
    if (fields.id_user == "no" || !fields.id_user) {
      fields.code = Math.floor(1000 + Math.random() * 9000);
      if (fields.type_req == "admin") fields.active = 1;
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
        const msg_sms = `Votre code de validation est ${user.code}`
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
      let password = fields.password;
      delete fields.password;

      User.updateOne(searchQuery, {
        $set: fields,
      })
        .then(() => {
          User.findOne(searchQuery)
            .populate({
              path: "idQuartier",
              populate: {
                path: "idVille",
                populate: { path: "idRegion", populate: { path: "idPays" } },
              },
            })
            .populate("plan")
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
      user.setPassword(req.body.password, () => {
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
router.post("/forgot-pwd", (req, res) => {
  var code = Math.floor(1000 + Math.random() * 9000);
  let searchQuery = { phone: req.body.phone };
  User.updateOne(searchQuery, {
    $set: {
      code: code,
    },
  })
    .then(() => {
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
    .then(() => {
      User.findOne(searchQuery)
        .populate({
          path: "idQuartier",
          populate: {
            path: "idVille",
            populate: { path: "idRegion", populate: { path: "idPays" } },
          },
        })
        .populate("plan")
        .then((u) => {
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

router.get("/api/activate-saller/:id", (req, res) => {
  let searchQuery = { _id: req.params.id };
  let data = {};
  if (req.query.type == "open_seller_account") {
    data = {
      isSaller: 1,
      becomeSallerAt: Date.now(),
      saller_pay_token: req.query.token,
    };
  } else if (req.query.type == "pub" || req.query.type == "product") {
    data = {
      is_pay: 1,
      pay_date: Date.now(),
      pay_token: req.query.token,
    };
  } else {
    data = {
      isVip: 1,
      subscriptionDate: Date.now(),
      vip_pay_token: req.query.token,
      plan: req.query.plan,
    };
  }
  if (req.query.type == "pub") {
    Publicite.updateOne(
      { _id: req.query.id },
      {
        $set: data,
      }
    )
      .then((resdata) => {
        return res.status(200).json({
          message: "Paiement effectué avec succès!",
          data: resdata,
        });
      })
      .catch((err) => {
        return res.status(422).json({ error: err });
      });
  } else if (req.query.type == "product") {
    ProductOffer.updateOne(
      { _id: req.query.id },
      {
        $set: data,
      }
    )
      .then((resdata) => {
        return res.status(200).json({
          message: "Paiement effectué avec succès!",
          data: resdata,
        });
      })
      .catch((err) => {
        return res.status(422).json({ error: err });
      });
  } else {
    User.updateOne(searchQuery, {
      $set: data,
    })
      .then(() => {
        User.findOne(searchQuery)
          .populate({
            path: "idQuartier",
            populate: {
              path: "idVille",
              populate: { path: "idRegion", populate: { path: "idPays" } },
            },
          })
          .populate("plan")
          .then((u) => {
            if (u) {
              if (req.query.plan) {
                Vip.findOne({ _id: req.query.plan }).then(async (plan) => {
                  return res.status(200).json({
                    message: "Votre compte vendeur à été activé!",
                    user: u,
                  });
                });
              } else {
                return res.status(200).json({
                  message: "Votre compte vendeur à été activé!",
                  user: u,
                });
              }
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
  }
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
      .then(() => {
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

//Delete route starts here
router.delete("/undelete/user/:id", (req, res) => {
  let searchQuery = { _id: req.params.id };

  User.updateOne(searchQuery, { $set: { active: 1 } })
    .then(() => {
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
    .then(() => {
      return res.status(200).json({ type: "succes" });
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({ type: "error", message: "Erreur " + err });
    });
});

router.get("/api/find-user", (req, res) => {
  let queryData = { type: "provider" };
  if (req.query.quartier)
    queryData["idQuartier"] = mongoose.Types.ObjectId(req.query.quartier);
  if (req.query.cat)
    queryData.domaines = {
      $in: [req.query.cat],
    };

  User.find(queryData)
    .populate({
      path: "idQuartier",
      populate: {
        path: "idVille",
        populate: { path: "idRegion", populate: { path: "idPays" } },
      },
    })
    .sort({ note: -1 })
    .then((data) => {
      return res.status(200).json({
        type: "success",
        message: "Etudiant récupéré avec succès !",
        data: data,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/api/reviews", (req, res) => {
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields) => {
    if (err) {
      next(err);
      return;
    }

    if (fields.id == "no" || !fields.id) {
      Review.create(fields, (err, data) => {
        if (err) {
          var message = "Une erreur s'est produite";
          return res.status(400).json({ type: "error", message: message });
        }
        Review.find({ provider: fields.provider }).then((reviews) => {
          let note = 0;
          for (let rev of reviews) {
            note += rev.note;
          }
          User.updateOne(
            { _id: fields.provider },
            {
              $set: { note: (note / reviews.length).toFixed(1) },
            }
          ).then((resp) => {
            return res.status(200).json({
              type: "success",
              message: "Config ajouté avec succès!",
              data: data,
            });
          });
        });
      });
    } else {
      let searchQuery = { _id: fields.id };
      Review.updateOne(searchQuery, {
        $set: fields,
      })
        .then((result) => {
          return res.status(200).json({
            type: "success",
            message: "Publicité modifié avec succès !",
            redirector: fields.savetype,
            data: result,
          });
        })
        .catch((err) => {
          return res
            .status(400)
            .json({ type: "error", message: "ERROR: " + err });
        });
    }
  });
});

router.get("/api/reviews/:provider", (req, res) => {
  Review.find({ provider: req.params.provider })
    .populate("user")
    .populate("provider")
    .sort({ createdAt: -1 })
    .then((data) => {
      return res.status(200).json({
        type: "success",
        message: "Avis récupéré avec succès !",
        data: data,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/dashboard/import", isAuthenticatedUser, (req, res) => {
  res.render("./users/import", {
    page: "Importer la liste des utilisateurs",
    userdata: req.user,
    user_admin_id: req.user._id,
    menu: "user",
  });
});

router.post("/dashboard/import", isAuthenticatedUser, (req, res) => {
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    if (files && files.fichier && files.fichier.name) {
      // File path.
      readXlsxFile(files.fichier.path)
        .then(async (rows) => {
          let users = [];
          for (let user of rows) {
            let userData = {
              phone: formatPhone(user[0].toString(), user[7].toString()),
              name: user[1],
              type: user[2] && user[2] != "NULL" ? "provider" : "user",
            };
            let fuser = users.find((item) => item.phone == userData.phone);
            if (!fuser || fuser == undefined) {
              if (user[3] && user[3] != "NULL") {
                let qt = await getQuartier(
                  user[3].toString(),
                  user[4].toString(),
                  user[5].toString(),
                  user[6].toString()
                );
                if (qt) userData.idQuartier = qt;
              }
              if (user[2] && user[2] != "NULL") {
                let dm = await getDomaine(user[2].toString());
                if (dm) userData.domaines = [dm];
              }
              users.push(userData);
            }
          }
          User.insertMany(users, {
            ordered: false,
          })
            .then((res) => {
              sendNotification(fields.email);
            })
            .catch((err) => {
              sendNotification(fields.email);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    return res.status(200).json({
      type: "success",
      message:
        "Importation en cours. vous serez notifier à la fin de l'import!",
      data: null,
    });
  });
});
const getDomaine = async (name) => {
  let cat = await Category.findOne({ name: { $regex: name } });
  if (cat) return cat._id;
  else {
    let data = {
      name,
    };
    cat = await Category.create(data);
    return cat._id;
  }
};
const getQuartier = async (name, cityName, regionName, code) => {
  let quartier = await Quartier.findOne({ name: { $regex: name } });
  if (quartier) return quartier._id;
  else {
    let data = {
      name,
    };
    let city = await Ville.findOne({ name: { $regex: cityName } });
    if (city) {
      data.idVille = city._id;
      data.idRegion = city.idRegion;
      data.idPays = city.idPays;
    } else {
      let cdata = {
        name: cityName,
      };
      let region = await Region.findOne({ name: { $regex: regionName } });
      if (region) {
        cdata.idRegion = region._id;
        cdata.idPays = region.idPays;
      } else {
        let rdata = {
          name: regionName,
        };
        let pays = await Pays.findOne({ code });
        if (pays) {
          rdata.idPays = pays._id;
        } else {
          pays = await Pays.create({ code, name: code });
          rdata.idPays = pays._id;
        }
        region = await Region.create(rdata);
        cdata.idRegion = region._id;
        cdata.idPays = region.idPays;
      }
      city = await Ville.create(cdata);
      data.idVille = city._id;
      data.idRegion = city.idRegion;
      data.idPays = city.idPays;
    }
    quartier = await Quartier.create(data);
    return quartier._id;
  }
};
module.exports = router;
