const express = require("express");
const router = express.Router();
//Requiring user model
const Vip = require("../models/vip");
const User = require("../models/userModel");
const axios = require("axios");
const formidable = require("formidable");
const {
  isAuthenticatedUser,
  uploadFileWithFormidable,
} = require("../helpers/utils");

router.get("/dashboard/vip/", isAuthenticatedUser, (req, res) => {
  User.find({ isVip: true })
    .populate({
      path: "idQuartier",
      populate: {
        path: "idVille",
        populate: { path: "idRegion", populate: { path: "idPays" } },
      },
    })
    .populate("plan")
    .then((data) => {
      res.render("./vip/all", {
        data: data,
        title: "Liste  des utilisateurs vip",
        userdata: req.user,
        user_admin_id: req.user._id,
        menu: "vip",
        page: "Liste des vip",
        next_title: "Voir les sous vip",
        parent_id: req.query.parent_id,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/dashboard/vip/plans/", isAuthenticatedUser, (req, res) => {
  Vip.find()
    .then((data) => {
      res.render("./vip/plans", {
        data: data,
        title: "Liste des plans d'abonement",
        userdata: req.user,
        user_admin_id: req.user._id,
        menu: "vip",
        page: "Liste des plans d'abonement",
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/dashboard/vip/:id/edit", isAuthenticatedUser, (req, res) => {
  Vip.findOne({ _id: req.params.id })
    .then((data) => {
      res.render("./vip/add", {
        data: data,
        title: "Modifier",
        userdata: req.user,
        user_admin_id: req.user._id,
        menu: "vip",
        page: "Modifier",
        type: req.params.type,
        parent_id: "",
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/dashboard/vip/add", isAuthenticatedUser, (req, res) => {
  var title = "Ajouter un plan";
  res.render("./vip/add", {
    data: null,
    title: title,
    userdata: req.user,
    user_admin_id: req.user._id,
    menu: "vip",
    page: title,
  });
});

router.post("/api/vip", (req, res) => {
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    if (fields.id == "no" || !fields.id) {
      Vip.create(fields, (err, data) => {
        if (err) {
          var message = "Une erreur s'est produite";
          return res.status(400).json({ type: "error", message: message });
        }
        return res.status(200).json({
          type: "success",
          message: "Vip publié avec succès!",
          data: data,
        });
      });
    } else {
      let searchQuery = { _id: fields.id };
      Vip.updateOne(searchQuery, {
        $set: fields,
      })
        .then((result) => {
          return res.status(200).json({
            type: "success",
            message: "Vip modifié avec succès !",
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
router.get("/api/vip-delete/:id", (req, res) => {
  let searchQuery = { _id: req.params.id };
  Vip.deleteOne(searchQuery)
    .then((lang) => {
      return res.status(200).json({ message: "Supprimer " });
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({ message: "Erreur " + err });
    });
});
router.get("/api/vip/", (req, res) => {
  Vip.find()
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

router.post("/api/check-pay/", (req, res) => {
  var config = {
    method: "post",
    url: "https://api-checkout.cinetpay.com/v2/payment/check",
    headers: {
      "Content-Type": "application/json",
    },
    data: req.body,
  };
  axios(config)
    .then(function (response) {
      res.status(200).json({
        data: response.data,
      });
    })
    .catch(function (error) {
      console.log(error);
      res.status(400).json({
        dada: error.data,
      });
    });
});
module.exports = router;
