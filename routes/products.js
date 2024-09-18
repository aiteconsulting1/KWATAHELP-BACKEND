const express = require("express");
const router = express.Router();
//Requiring user model
const Product = require("../models/product");
const ProductOffer = require("../models/productOffer");
const formidable = require("formidable");
const {
  uploadFileWithFormidable,
  isAuthenticatedUser,
} = require("../helpers/utils");

router.get("/dashboard/products/", isAuthenticatedUser, (req, res) => {
    Product.find()
      .populate("saller")
      .then((data) => {
        res.render("./products/all", {
          data: data,
          title: "Liste des produits",
          userdata: req.user,
          user_admin_id: req.user._id,
          menu: "product",
          page: "Liste des produits",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  
});

router.get("/dashboard/products/:id/edit", isAuthenticatedUser, (req, res) => {
  Product.findOne({ _id: req.params.id })
    .then((data) => {
      res.render("./products/add", {
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
});

router.get("/dashboard/products/add", isAuthenticatedUser, (req, res) => {
  var title = "Ajouter une catégorie";
  if (req.query.parent_id) title = "Ajouter une sous catégorie";

  res.render("./products/add", {
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

router.post("/api/products", (req, res) => {
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    const images = [];
    var imageFiles = files ? files["images[]"] : [];
    if (!Array.isArray(imageFiles)) imageFiles = [imageFiles];
    for (image of imageFiles) {
      const url = uploadFileWithFormidable(image, "public/images/");
      if (url) images.push(url.split("public")[1]);
    }

    if (fields.id == "no" || !fields.id) {
      if (images.length > 0) fields.images = images;
      Product.create(fields, (err, data) => {
        if (err) {
          console.log(err)
          var message = "Une erreur s'est produite";
          return res.status(400).json({ type: "error", message: message });
        }
        return res.status(200).json({
          type: "success",
          message: "Produit créé avec succès !",
          data: data,
        });
      });
    } else {
      let searchQuery = { _id: fields.id };
      if (images.length > 0)
        fields.images = fields.images.split(",").concat(images);
      Product.updateOne(searchQuery, {
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
router.get("/api/product-delete/:id", (req, res) => {
  let searchQuery = { _id: req.params.id };
  Product.deleteOne(searchQuery)
    .then((lang) => {
      return res.status(200).json({ message: "Supprimer " });
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({ message: "Erreur " + err });
    });
});
router.get("/api/products/:user_id", (req, res) => {
  Product.find({ saller: req.params.user_id })
    .populate({
      path: "idQuartier",
      populate: {
        path: "idVille",
        populate: { path: "idRegion", populate: { path: "idPays" } },
      },
    })
    .populate("saller")
    .populate("category")
    .sort({ createdAt: -1 })
    .then((data) => {
      let cat = req.query.cat;
      let quartier = req.query.quartier;
      if (cat && cat != "all")
        data = data.filter((item) => item.category._id == cat);
      if (quartier && quartier != "all")
        data = data.filter((item) => item.idQuartier._id == quartier);

      res.status(200).json({
        data: data,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/api/products", (req, res) => {
  Product.find({ pays: req.query.pays })
    .populate({
      path: "idQuartier",
      populate: {
        path: "idVille",
        populate: { path: "idRegion", populate: { path: "idPays" } },
      },
    })
    .populate("saller")
    .populate("category")
    .sort({ createdAt: -1 })
    .then((data) => {
      let cat = req.query.cat;
      let quartier = req.query.quartier;
      if (cat && cat != "all")
        data = data.filter((item) => item.category._id == cat);
      if (quartier && quartier != "all")
        data = data.filter((item) => item.idQuartier._id == quartier);

      res.status(200).json({
        data: data,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/api/products-offer", (req, res) => {
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    if (fields.id == "no" || !fields.id) {
      ProductOffer.create(fields, (err, data) => {
        if (err) {
          var message = "Une erreur s'est produite";
          return res.status(400).json({ type: "error", message: message });
        }
        return res.status(200).json({
          type: "success",
          message: "Offre envoyé avec succès !",
          data: data,
        });
      });
    } else {
      let searchQuery = { _id: fields.id };
      if (images.length > 0)
        fields.images = fields.images.split(",").concat(images);
        ProductOffer.updateOne(searchQuery, {
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

router.get("/api/products-offer/:user_id", (req, res) => {
    ProductOffer.find({ saller: req.params.user_id })
    .populate("sender")
    .populate("product")
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

router.get("/api/products-offer-accept/:offer_id/:status", (req, res) => {
    let searchQuery = { _id: req.params.offer_id };

        ProductOffer.updateOne(searchQuery, {
        $set: {
            status: req.params.status
        },
      })
        .then((result) => {
          return res.status(200).json({
            type: "success",
            message: "Modifié avec succès !",
            data: result,
          });
        })
        .catch((err) => {
          console.log(err);
          return res
            .status(400)
            .json({ type: "error", message: "ERROR: " + err });
        });
});
module.exports = router;
