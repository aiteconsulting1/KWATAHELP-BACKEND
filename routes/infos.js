const express = require("express");
const router = express.Router();
//Requiring user model
const Info = require("../models/info");

const formidable = require("formidable");
const {
  isAuthenticatedUser,
  uploadFileWithFormidable,
  saveFile,
} = require("../helpers/utils");

router.get("/dashboard/infos/", isAuthenticatedUser, (req, res) => {
  Info.find()
    .populate({
      path: "idQuartier",
      populate: {
        path: "idVille",
        populate: { path: "idRegion", populate: { path: "idPays" } },
      },
    })
    .populate("requester")
    .then((data) => {
      res.render("./infos/all", {
        data: data,
        title: "Liste  des infos",
        userdata: req.user,
        user_admin_id: req.user._id,
        menu: "info",
        page: "Liste des infos",
        next_title: "Voir les sous infos",
        parent_id: req.query.parent_id,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/dashboard/infos/:id/edit", isAuthenticatedUser, (req, res) => {
  Info.findOne({ _id: req.params.id })
    .then((data) => {
      res.render("./infos/add", {
        data: data,
        title: "Modifier",
        userdata: req.user,
        user_admin_id: req.user._id,
        menu: "info",
        page: "Modifier",
        type: req.params.type,
        parent_id: "",
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/dashboard/infos/add", isAuthenticatedUser, (req, res) => {
  var title = "Ajouter une catégorie";
  if (req.query.parent_id) title = "Ajouter une sous catégorie";

  res.render("./infos/add", {
    data: null,
    title: title,
    userdata: req.user,
    user_admin_id: req.user._id,
    menu: "info",
    page: title,
    type: req.params.type,
    parent_id: req.query.parent_id,
  });
});

router.post("/api/infos", (req, res) => {
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    if (files && files.attachment && files.attachment.name) {
      // const url = uploadFileWithFormidable(files.attachment, "public/images/");
      const url = saveFile(files.attachment, "public/images/");
      // if (url) fields.attachment = url.split("public")[1];
      if (url) fields.attachment = url;
    }
    if (fields.id == "no" || !fields.id) {
      Info.create(fields, (err, data) => {
        if (err) {
          var message = "Une erreur s'est produite";
          return res.status(400).json({ type: "error", message: message });
        }
        return res.status(200).json({
          type: "success",
          message: "Info publié avec succès!",
          data: data,
        });
      });
    } else {
      let searchQuery = { _id: fields.id };
      Info.updateOne(searchQuery, {
        $set: fields,
      })
        .then((result) => {
          return res.status(200).json({
            type: "success",
            message: "Info modifié avec succès !",
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
router.get("/api/info-delete/:id", (req, res) => {
  let searchQuery = { _id: req.params.id };
  Info.deleteOne(searchQuery)
    .then((lang) => {
      return res.status(200).json({ message: "Supprimer " });
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({ message: "Erreur " + err });
    });
});
router.get("/api/infos/:id_quartier", (req, res) => {
  Info.find({ idQuartier: req.params.id_quartier })
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
module.exports = router;
