const express = require("express");
const router = express.Router();
//Requiring user model
const Publicite = require("../models/publicite");
const User = require("../models/userModel");
const Setting = require("../models/setting");
const Quartier = require("../models/quartier");

const formidable = require("formidable");
const {
  isAuthenticatedUser,
  uploadFileWithFormidable,
  saveFile,
} = require("../helpers/utils");

router.get("/dashboard/publicites/", isAuthenticatedUser, (req, res) => {
  if (req.query.user_id) {
    Publicite.find({ provider: req.query.user_id })
      .then((data) => {
        res.render("./publicites/all", {
          data: data,
          title: "Liste des  sous publicités",
          userdata: req.user,
          user_admin_id: req.user._id,
          menu: "publicite",
          page: "Liste des publicités",
          next_title: "Voir les sous publicités",
          parent_id: req.query.parent_id,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    Publicite.find()
      .populate("provider")
      .then((data) => {
        res.render("./publicites/all", {
          data: data.filter((item) => !item.parentId),
          title: "Liste des publicités",
          userdata: req.user,
          user_admin_id: req.user._id,
          menu: "publicite",
          page: "Liste des publicités",
          type: req.params.type,
          next_title: "Voir les sous publicités",
          parent_id: "",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

router.get(
  "/dashboard/publicites/:id/edit",
  isAuthenticatedUser,
  (req, res) => {
    User.find({ type: "provider" }).then((users) => {
      Publicite.findOne({ _id: req.params.id })
        .populate("provider")
        .then((data) => {
          Quartier.find().then((quartiers) => {
            res.render("./publicites/add", {
              data: data,
              title: "Modifier",
              userdata: req.user,
              user_admin_id: req.user._id,
              menu: "publicite",
              page: "Modifier",
              type: req.params.type,
              users,
              quartiers,
            });
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }
);

router.get("/dashboard/publicites/add", isAuthenticatedUser, (req, res) => {
  var title = "Ajouter une publicité";
  User.find({ type: "provider" }).then((users) => {
    Quartier.find().then((quartiers) => {
      res.render("./publicites/add", {
        data: null,
        title: title,
        userdata: req.user,
        user_admin_id: req.user._id,
        menu: "publicite",
        page: title,
        type: req.params.type,
        users,
        quartiers,
      });
    });
  });
});

router.get("/dashboard/pub-setting/add", isAuthenticatedUser, (req, res) => {
  var title = "Parametres des publicités";
  Setting.findOne({ type: "pub" }).then((item) => {
    res.render("./publicites/setting", {
      data: item,
      title: title,
      userdata: req.user,
      user_admin_id: req.user._id,
      menu: "publicite",
      page: title,
      type: req.params.type,
    });
  });
});
router.post("/api/pub-setting", (req, res) => {
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    if (files && files.image && files.image.name) {
      // const url = uploadFileWithFormidable(files.image, "public/images/");
      // if (url) fields.image = url.split("public")[1];
      const url = saveFile(files.image, "public/images");
      if (url) fields.image = url;
    }
    if (fields.id == "no" || !fields.id) {
      Setting.create(fields, (err, data) => {
        if (err) {
          var message = "Une erreur s'est produite";
          return res.status(400).json({ type: "error", message: message });
        }
        return res.status(200).json({
          type: "success",
          message: "Config ajouté avec succès!",
          data: data,
        });
      });
    } else {
      let searchQuery = { _id: fields.id };
      Setting.updateOne(searchQuery, {
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

router.post("/api/publicites", (req, res) => {
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    if (files && files.image && files.image.name) {
      // const url = uploadFileWithFormidable(files.image, "public/images/");
      // if (url) fields.image = url.split("public")[1];
      const url = saveFile(files.image, "public/images");
      if (url) fields.image = url;
    }
    console.log("fields", fields);
    fields.quartiers = fields.quartiers.split(",");
    if (fields.id == "no" || !fields.id) {
      Publicite.create(fields, (err, data) => {
        if (err) {
          var message = "Une erreur s'est produite";
          return res.status(400).json({ type: "error", message: message });
        }
        return res.status(200).json({
          type: "success",
          message: "Publicité créé avec succès!",
          data: data,
        });
      });
    } else {
      let searchQuery = { _id: fields.id };
      Publicite.updateOne(searchQuery, {
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
router.get("/api/publicite-delete/:id", (req, res) => {
  let searchQuery = { _id: req.params.id };
  Publicite.deleteOne(searchQuery)
    .then((lang) => {
      return res.status(200).json({ message: "Supprimer " });
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({ message: "Erreur " + err });
    });
});
router.get(
  "/dashboard/publicites/active/:id/:status",
  isAuthenticatedUser,
  (req, res) => {
    let searchQuery = { _id: req.params.id };
    Publicite.updateOne(searchQuery, {
      $set: {
        status: req.params.status,
      },
    })
      .then((result) => {
        return res.status(200).json({
          type: "success",
          message: "Publicité modifié avec succès !",
          data: result,
        });
      })
      .catch((err) => {
        return res
          .status(400)
          .json({ type: "error", message: "ERROR: " + err });
      });
  }
);
router.get("/api/publicites/:user_id", (req, res) => {
  Publicite.find({ provider: req.params.user_id })
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

router.get("/api/pub-setting/", (req, res) => {
  Setting.findOne({ type: "pub" })
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

router.get("/api/pub-valid/:user_id/:quartier_id", (req, res) => {
  Publicite.findOne({
    quartiers: { $in: [req.params.quartier_id] },
    affected: { $nin: [req.params.user_id] },
    status: 1,
    provider: { $nin: [req.params.user_id] },
  })
    .sort({ createdAt: -1 })
    .then(async (pub) => {
      if (pub) {
        await pub.addUser(req.params.user_id);
      }
      res.status(200).json({
        data: pub,
      });
    })
    .catch((err) => {
      res.status(400).json({
        message: err.message,
      });
    });
});
module.exports = router;
