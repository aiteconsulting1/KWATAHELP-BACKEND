const express = require("express");
const router = express.Router();
//Requiring user model
const User = require("../models/userModel");
const Pays = require("../models/paysModel");
const Ville = require("../models/ville");
const Region = require("../models/region");
const Quartier = require("../models/quartier");

const formidable = require("formidable");
var fs = require("fs");
const {
  smtpTransport,
  replaceAll,
  isAuthenticatedUser,
} = require("../helpers/utils");

router.get("/dashboard/locations/:type", isAuthenticatedUser, (req, res) => {
  if (req.params.type == "pays") {
    Pays.find()
      .then((data) => {
        res.render("./locations/all", {
          data: data,
          title: "Liste des Pays",
          userdata: req.user,
          user_admin_id: req.user._id,
          menu: "location",
          page: "Liste des pays",
          type: req.params.type,
          next: "region",
          next_title: "Voir les regions",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } else if (req.params.type == "region") {
    Region.find({ idPays: req.query.id_pays })
      .then((data) => {
        res.render("./locations/all", {
          data: data,
          title: "Liste des regions",
          userdata: req.user,
          user_admin_id: req.user._id,
          menu: "location",
          page: "Liste des regions",
          type: req.params.type,
          next: "ville",
          next_title: "Voir les villes",
          id_pays: req.query.id_pays,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } else if (req.params.type == "ville") {
    Ville.find({ idRegion: req.query.id_region })
      .then((data) => {
        res.render("./locations/all", {
          data: data,
          title: "Liste des villes",
          userdata: req.user,
          user_admin_id: req.user._id,
          menu: "location",
          page: "Liste des villes",
          type: req.params.type,
          next: "quartier",
          next_title: "Voir les quartiers",
          id_region: req.query.id_region,
          id_pays: req.query.id_pays,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } else if (req.params.type == "quartier") {
    Quartier.find({ idVille: req.query.id_ville })
      .then((data) => {
        res.render("./locations/all", {
          data: data,
          title: "Liste des quartiers",
          userdata: req.user,
          user_admin_id: req.user._id,
          menu: "location",
          page: "Liste des quartiers",
          type: req.params.type,
          id_region: req.query.id_region,
          id_ville: req.query.id_ville,
          id_pays: req.query.id_pays,
          next: "",
          next_title: "",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

router.get(
  "/dashboard/locations/add/:type",
  isAuthenticatedUser,
  (req, res) => {
    User.find({ type: "user" }).then((users) => {
      res.render("./logements/add", {
        page: "Ajouter un logements",
        userdata: req.user,
        user_admin_id: req.user._id,
        menu: "logement",
        niveau: null,
        spec: null,
        lang: [],
        logement: null,
        type: type,
        users: users,
      });
    });
  }
);

router.get(
  "/dashboard/locations/:type/:id/edit",
  isAuthenticatedUser,
  (req, res) => {
    if (req.params.type == "pays") {
      Pays.findOne({ _id: req.params.id })
        .then((data) => {
          res.render("./locations/add", {
            data: data,
            title: "Modifier le Pays",
            userdata: req.user,
            user_admin_id: req.user._id,
            menu: "location",
            page: "Modifier le pays",
            type: req.params.type,
            id_region: req.query.id_region,
            id_ville: req.query.id_ville,
            id_pays: req.query.id_pays,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (req.params.type == "region") {
      Region.findOne({ _id: req.params.id })
        .then((data) => {
          res.render("./locations/add", {
            data: data,
            title: "Modifier la region",
            userdata: req.user,
            user_admin_id: req.user._id,
            menu: "location",
            page: "Modifier la region",
            type: req.params.type,
            id_region: req.query.id_region,
            id_ville: req.query.id_ville,
            id_pays: req.query.id_pays,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (req.params.type == "ville") {
      Ville.findOne({ _id: req.params.id })
        .then((data) => {
          res.render("./locations/add", {
            data: data,
            title: "Modifier la ville",
            userdata: req.user,
            user_admin_id: req.user._id,
            menu: "location",
            page: "Modifier la ville",
            type: req.params.type,
            id_region: req.query.id_region,
            id_ville: req.query.id_ville,
            id_pays: req.query.id_pays,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (req.params.type == "quartier") {
      Quartier.findOne({ _id: req.params.id })
        .then((data) => {
          res.render("./locations/add", {
            data: data,
            title: "Modifier le quartier",
            userdata: req.user,
            user_admin_id: req.user._id,
            menu: "location",
            page: "Modifier le quartier",
            type: req.params.type,
            id_region: req.query.id_region,
            id_ville: req.query.id_ville,
            id_pays: req.query.id_pays,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
);

router.get(
  "/dashboard/locations/:type/add",
  isAuthenticatedUser,
  (req, res) => {
    var title = "Ajouter un pays";
    if (req.params.type == "region") title = "Ajouter une région";
    if (req.params.type == "ville") title = "Ajouter une ville";
    if (req.params.type == "quartier") title = "Ajouter un quartier";

    res.render("./locations/add", {
      data: null,
      title: title,
      userdata: req.user,
      user_admin_id: req.user._id,
      menu: "location",
      page: title,
      type: req.params.type,
      id_region: req.query.id_region,
      id_ville: req.query.id_ville,
      id_pays: req.query.id_pays,
    });
  }
);

router.post("/dashboard/locations", isAuthenticatedUser, (req, res) => {
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    console.log(fields);

    if (fields.id == "no" || !fields.id) {
      if (fields.type == "pays") {
        Pays.create(fields, (err, logement) => {
          if (err) {
            var message = "Une erreur s'est produite";
            return res.status(400).json({ type: "error", message: message });
          }
          return res.status(200).json({
            type: "success",
            message: "Pays créé avec succès !",
            data: logement,
          });
        });
      } else if (fields.type == "region") {
        Region.create(fields, (err, logement) => {
          if (err) {
            var message = "Une erreur s'est produite";
            return res.status(400).json({ type: "error", message: message });
          }
          return res.status(200).json({
            type: "success",
            message: "Région créé avec succès !",
            data: logement,
          });
        });
      } else if (fields.type == "ville") {
        Ville.create(fields, (err, logement) => {
          if (err) {
            var message = "Une erreur s'est produite";
            return res.status(400).json({ type: "error", message: message });
          }
          return res.status(200).json({
            type: "success",
            message: "Ville créé avec succès !",
            data: logement,
          });
        });
      } else if (fields.type == "quartier") {
        Quartier.create(fields, (err, logement) => {
          if (err) {
            var message = "Une erreur s'est produite";
            return res.status(400).json({ type: "error", message: message });
          }
          return res.status(200).json({
            type: "success",
            message: "Quartier créé avec succès !",
            data: logement,
          });
        });
      }
    } else {
      let searchQuery = { _id: fields.id };
      if (fields.type == "pays") {
        Pays.updateOne(searchQuery, {
          $set: fields,
        })
          .then((result) => {
            return res.status(200).json({
              type: "success",
              message: "Pays modifié avec succès !",
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
      } else if (fields.type == "region") {
        Region.updateOne(searchQuery, {
          $set: fields,
        })
          .then((result) => {
            return res.status(200).json({
              type: "success",
              message: "Région modifié avec succès !",
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
      } else if (fields.type == "ville") {
        Ville.updateOne(searchQuery, {
          $set: fields,
        })
          .then((result) => {
            return res.status(200).json({
              type: "success",
              message: "Ville modifié avec succès !",
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
      } else if (fields.type == "quartier") {
        Quartier.updateOne(searchQuery, {
          $set: fields,
        })
          .then((result) => {
            return res.status(200).json({
              type: "success",
              message: "Quartier modifié avec succès !",
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
    }
  });
});
router.get("/dashboard/location-delete/:type/:id", (req, res) => {
  let searchQuery = { _id: req.params.id };
  if (req.params.type == "pays") {
    Pays.deleteOne(searchQuery)
      .then((lang) => {
        return res.status(200).json({ message: "Supprimer " });
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json({ message: "Erreur " + err });
      });
  } else if (req.params.type == "region") {
    Region.deleteOne(searchQuery)
      .then((lang) => {
        return res.status(200).json({ message: "Supprimer " });
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json({ message: "Erreur " + err });
      });
  } else if (req.params.type == "ville") {
    Ville.deleteOne(searchQuery)
      .then((lang) => {
        return res.status(200).json({ message: "Supprimer " });
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json({ message: "Erreur " + err });
      });
  } else if (req.params.type == "quartier") {
    Quartier.deleteOne(searchQuery)
      .then((lang) => {
        return res.status(200).json({ message: "Supprimer " });
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json({ message: "Erreur " + err });
      });
  }
});
module.exports = router;
