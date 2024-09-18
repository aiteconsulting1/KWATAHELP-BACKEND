const express = require("express");
const router = express.Router();
//Requiring user model
const Offre = require("../models/offre");
const User = require("../models/userModel");

const formidable = require("formidable");
const {
  isAuthenticatedUser,
  uploadFileWithFormidable,
} = require("../helpers/utils");

router.get("/dashboard/offres/", (req, res) => {
  if (req.query.user_id) {
    Offre.find({ provider: req.query.user_id })
      .then((data) => {
        res.render("./offres/all", {
          data: data,
          title: "Liste des  sous offres",
          userdata: req.user,
          user_admin_id: req.user._id,
          menu: "offre",
          page: "Liste des offres",
          next_title: "Voir les sous offres",
          parent_id: req.query.parent_id,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    Offre.find()
      .then((data) => {
        res.render("./offres/all", {
          data: data.filter((item) => !item.parentId),
          title: "Liste des offres",
          userdata: req.user,
          user_admin_id: req.user._id,
          menu: "offre",
          page: "Liste des offres",
          type: req.params.type,
          next_title: "Voir les sous offres",
          parent_id: "",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

router.get("/dashboard/offres/:id/edit", isAuthenticatedUser, (req, res) => {
  Offre.findOne({ _id: req.params.id })
    .then((data) => {
      res.render("./offres/add", {
        data: data,
        title: "Modifier",
        userdata: req.user,
        user_admin_id: req.user._id,
        menu: "offre",
        page: "Modifier",
        type: req.params.type,
        parent_id: "",
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/dashboard/offres/add", isAuthenticatedUser, (req, res) => {
  var title = "Ajouter une catégorie";
  if (req.query.parent_id) title = "Ajouter une sous catégorie";

  res.render("./offres/add", {
    data: null,
    title: title,
    userdata: req.user,
    user_admin_id: req.user._id,
    menu: "offre",
    page: title,
    type: req.params.type,
    parent_id: req.query.parent_id,
  });
});

router.post("/api/offres", (req, res) => {
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    if (files && files.attachment && files.attachment.name) {
      const url = uploadFileWithFormidable(files.attachment, "public/images/");
      if (url) fields.attachment = url.split("public")[1];
    }
    if (fields.id == "no" || !fields.id) {
      Offre.create(fields, (err, data) => {
        if (err) {
          var message = "Une erreur s'est produite";
          return res.status(400).json({ type: "error", message: message });
        }
        return res.status(200).json({
          type: "success",
          message: "Offre envoyé avec succès!",
          data: data,
        });
      });
    } else {
      let searchQuery = { _id: fields.id };
      Offre.updateOne(searchQuery, {
        $set: fields,
      })
        .then((result) => {
          return res.status(200).json({
            type: "success",
            message: "Offre modifié avec succès !",
            redirector: fields.savetype,
            data: result,
          });
        })
        .catch((err) => {
          console.log(err);
          return res
            .status(400)
            .json({ type: "error", message: "ERROR: " + err });
        });
    }
  });
});
router.get("/api/offre-delete/:id", (req, res) => {
  let searchQuery = { _id: req.params.id };
  Offre.deleteOne(searchQuery)
    .then((lang) => {
      return res.status(200).json({ message: "Supprimer " });
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({ message: "Erreur " + err });
    });
});
router.get("/api/offres/:user_id", (req, res) => {
  Offre.find({ provider: req.params.user_id })
    .populate({
      path: "requester",
      populate: {
        path: "idQuartier",
        populate: {
          path: "idVille",
          populate: { path: "idRegion", populate: { path: "idPays" } },
        },
      },
    })
    .populate("provider")
    .sort({ createdAt: -1 })
    .then((data) => {
      res.status(200).json({
        data: data,
      });
    })
    .catch((err) => {
      res.status(400).json({
        message: err.message,
      });
    });
});
router.get(
  "/api/offres-offer-accept/:userId/:offer_id/:status/",
  (req, res) => {
    let searchQuery = { _id: req.params.offer_id };

    Offre.updateOne(searchQuery, {
      $set: {
        status: req.params.status == 1 ? 1 : 0,
        is_accept: req.params.status,
      },
    })
      .then((result) => {
        if (req.params.status == 1) {
          User.updateOne(
            { _id: req.params.userId },
            {
              $set: {
                in_mission: 1,
              },
            }
          ).then((result) => {
            return res.status(200).json({
              type: "success",
              message: "Modifié avec succès !",
              data: result,
            });
          });
        } else {
          return res.status(200).json({
            type: "success",
            message: "Modifié avec succès !",
            data: result,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        return res
          .status(400)
          .json({ type: "error", message: "ERROR: " + err });
      });
  }
);
module.exports = router;
