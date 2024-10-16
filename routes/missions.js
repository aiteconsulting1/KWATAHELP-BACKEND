const express = require("express");
const router = express.Router();
//Requiring user model
const User = require("../models/userModel");
const Mission = require("../models/mission");

const formidable = require("formidable");
const {
  uploadFileWithFormidable,
  isAuthenticatedUser,
  saveFile,
} = require("../helpers/utils");

router.get("/dashboard/missions/", isAuthenticatedUser, (req, res) => {
  if (req.query.user_id) {
    Mission.find({ provider: req.query.user_id })
      .then((data) => {
        res.render("./missions/all", {
          data: data,
          title: "Liste des  sous missions",
          userdata: req.user,
          user_admin_id: req.user._id,
          menu: "service",
          page: "Liste des missions",
          next_title: "Voir les sous missions",
          parent_id: req.query.parent_id,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    Mission.find()
      .then((data) => {
        res.render("./missions/all", {
          data: data.filter((item) => !item.parentId),
          title: "Liste des missions",
          userdata: req.user,
          user_admin_id: req.user._id,
          menu: "service",
          page: "Liste des missions",
          type: req.params.type,
          next_title: "Voir les sous missions",
          parent_id: "",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

router.get(
  "/dashboard/missions/:id/edit",
  isAuthenticatedUser,
  (req, res) => {
    Mission.findOne({ _id: req.params.id })
      .then((data) => {
        res.render("./missions/add", {
          data: data,
          title: "Modifier",
          userdata: req.user,
          user_admin_id: req.user._id,
          menu: "service",
          page: "Modifier",
          type: req.params.type,
          parent_id: "",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
);

router.get("/dashboard/missions/add", isAuthenticatedUser, (req, res) => {
  var title = "Ajouter une catégorie";
  if (req.query.parent_id) title = "Ajouter une sous catégorie";

  res.render("./missions/add", {
    data: null,
    title: title,
    userdata: req.user,
    user_admin_id: req.user._id,
    menu: "service",
    page: title,
    type: req.params.type,
    parent_id: req.query.parent_id,
  });
});

router.post("/api/missions", (req, res) => {
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    const images = [];
    var imageFiles = files ? files["images[]"] : [];
    if(!Array.isArray(imageFiles)) imageFiles =[imageFiles]
    for (image of imageFiles) {
      // const url = uploadFileWithFormidable(image, "public/images/");
      const url = saveFile(image, "public/images/");
      // if (url) images.push(url.split("public")[1]);
      if (url) images.push(url);
    }

    if (fields.id == "no" || !fields.id) {
      if(images.length > 0) fields.images= images
      Mission.create(fields, (err, data) => {
        if (err) {
          var message = "Une erreur s'est produite";
          return res.status(400).json({ type: "error", message: message });
        }
        return res.status(200).json({
          type: "success",
          message: "Mission créé avec succès !",
          data: data,
        });
      });
    } else {
      let searchQuery = { _id: fields.id };
      Mission.updateOne(searchQuery, {
        $set: fields,
      })
        .then((result) => {
          return res.status(200).json({
            type: "success",
            message: "Catégorie modifié avec succès !",
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
router.get("/api/service-delete/:id", (req, res) => {
  let searchQuery = { _id: req.params.id };
  Mission.deleteOne(searchQuery)
    .then((lang) => {
      return res.status(200).json({ message: "Supprimer " });
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({ message: "Erreur " + err });
    });
});
router.get("/api/missions/:user_id", (req, res) => {
    Mission.find({ provider: req.params.user_id })
      .sort({ createdAt: -1 })
      .then((data) => {
        res.status(200).json({
          data: data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
module.exports = router;
