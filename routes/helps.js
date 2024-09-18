const express = require("express");
const router = express.Router();
//Requiring user model
const Help = require("../models/help");

const formidable = require("formidable");
const {
  isAuthenticatedUser,
  uploadFileWithFormidable,
} = require("../helpers/utils");

router.get("/dashboard/helps/", isAuthenticatedUser, (req, res) => {
  Help.find()
    .then((data) => {
      res.render("./helps/all", {
        data: data,
        title: "Liste des  messages d'aide",
        userdata: req.user,
        user_admin_id: req.user._id,
        menu: "help",
        page: "Liste des  messages d'aide",
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/dashboard/helps/:id/edit", isAuthenticatedUser, (req, res) => {
  Help.findOne({ _id: req.params.id })
    .then((data) => {
      res.render("./helps/add", {
        data: data,
        title: "Modifier",
        userdata: req.user,
        user_admin_id: req.user._id,
        menu: "help",
        page: "Modifier",
        parent_id: "",
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/dashboard/helps/add", isAuthenticatedUser, (req, res) => {
  var title = "Ajouter un message d'aide";
  res.render("./helps/add", {
    data: null,
    title: title,
    userdata: req.user,
    user_admin_id: req.user._id,
    menu: "help",
    page: title,
    parent_id: req.query.parent_id,
  });
});

router.post("/dashboard/helps", isAuthenticatedUser, (req, res) => {
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    if (files && files.image && files.image.name) {
      const url = uploadFileWithFormidable(files.image, "public/images/");
      if (url) fields.image = url.split("public")[1];
    }
    if (fields.id == "no" || !fields.id) {
      Help.create(fields, (err, logement) => {
        if (err) {
          var message = "Une erreur s'est produite";
          return res.status(400).json({ type: "error", message: message });
        }
        return res.status(200).json({
          type: "success",
          message: "Aide créé avec succès !",
          data: logement,
        });
      });
    } else {
      let searchQuery = { _id: fields.id };
      Help.updateOne(searchQuery, {
        $set: fields,
      })
        .then((result) => {
          return res.status(200).json({
            type: "success",
            message: "Aide modifié avec succès !",
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
router.get("/dashboard/help-delete/:id", (req, res) => {
  let searchQuery = { _id: req.params.id };
  Help.deleteOne(searchQuery)
    .then((lang) => {
      return res.status(200).json({ message: "Supprimer " });
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({ message: "Erreur " + err });
    });
});
router.get("/api/helps/:type", (req, res) => {
  Help.findOne({type:req.params.type})
    .then((data) => {
      return res.status(200).json({ data });
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({ message: "Erreur " + err });
    });
});
module.exports = router;
