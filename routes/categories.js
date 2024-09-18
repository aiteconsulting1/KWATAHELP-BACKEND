const express = require("express");
const router = express.Router();
//Requiring user model
const Category = require("../models/category");

const formidable = require("formidable");
const {
  isAuthenticatedUser,
  uploadFileWithFormidable,
} = require("../helpers/utils");

router.get("/dashboard/categories/", isAuthenticatedUser, (req, res) => {
  if (req.query.parent_id) {
    Category.find({ parentId: req.query.parent_id })
      .then((data) => {
        res.render("./categories/all", {
          data: data,
          title: "Liste des  sous catégories",
          userdata: req.user,
          user_admin_id: req.user._id,
          menu: "category",
          page: "Liste des catégories",
          next_title: "Voir les sous catégories",
          parent_id: req.query.parent_id,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    Category.find()
      .then((data) => {
        res.render("./categories/all", {
          data: data.filter((item) => !item.parentId),
          title: "Liste des catégories",
          userdata: req.user,
          user_admin_id: req.user._id,
          menu: "category",
          page: "Liste des catégories",
          type: req.params.type,
          next_title: "Voir les sous catégories",
          parent_id: "",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

router.get(
  "/dashboard/categories/:id/edit",
  isAuthenticatedUser,
  (req, res) => {
    Category.findOne({ _id: req.params.id })
      .then((data) => {
        res.render("./categories/add", {
          data: data,
          title: "Modifier",
          userdata: req.user,
          user_admin_id: req.user._id,
          menu: "category",
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

router.get("/dashboard/categories/add", isAuthenticatedUser, (req, res) => {
  var title = "Ajouter une catégorie";
  if (req.query.parent_id) title = "Ajouter une sous catégorie";

  res.render("./categories/add", {
    data: null,
    title: title,
    userdata: req.user,
    user_admin_id: req.user._id,
    menu: "category",
    page: title,
    type: req.params.type,
    parent_id: req.query.parent_id,
  });
});

router.post("/dashboard/categories", isAuthenticatedUser, (req, res) => {
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
      Category.create(fields, (err, logement) => {
        if (err) {
          var message = "Une erreur s'est produite";
          return res.status(400).json({ type: "error", message: message });
        }
        return res.status(200).json({
          type: "success",
          message: "Catégorie créé avec succès !",
          data: logement,
        });
      });
    } else {
      let searchQuery = { _id: fields.id };
      Category.updateOne(searchQuery, {
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
router.get("/dashboard/category-delete/:id", (req, res) => {
  let searchQuery = { _id: req.params.id };
  Category.deleteOne(searchQuery)
    .then((lang) => {
      return res.status(200).json({ message: "Supprimer " });
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({ message: "Erreur " + err });
    });
});
router.get("/api/categories", (req, res) => {
  Category.find()
    .sort({ name: 1 })
    .then((data) => {
      return res.status(200).json({ data });
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({ message: "Erreur " + err });
    });
});
module.exports = router;
