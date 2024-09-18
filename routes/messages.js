const express = require("express");
const router = express.Router();
//Requiring user model
const Message = require("../models/message");
const Discussion = require("../models/discussion");
const Notification = require("../models/notification");

const formidable = require("formidable");
router.post("/api/messages", (req, res) => {
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
      const users = [fields.sender, fields.receiver];
      Discussion.findOne({
        sender: { $in: users },
        receiver: { $in: users },
      }).then((discussion) => {
        if (discussion) {
          fields.discussion = discussion._id;
          Message.create(fields, (err, data) => {
            if (err) {
              var message = "Une erreur s'est produite";
              return res.status(400).json({ type: "error", message: message });
            }

            if (req) req.app.get("websocket").broadcaster("newMessage", fields);
            Notification.create(
              { to: fields.receiver, type: "message" },
              (err, notification) => {
                Discussion.updateOne(
                  { _id: discussion._id },
                  {
                    $set: {
                      lastMessage: data._id,
                      updatedAt: Date.now(),
                    },
                  }
                ).then((response) => {
                  return res.status(200).json({
                    type: "success",
                    message: "Message nvoyé avec succès !",
                    data: data,
                  });
                });
              }
            );
          });
        } else {
          Discussion.create(fields, (err, discussion) => {
            fields.discussion = discussion._id;
            Message.create(fields, (err, data) => {
              if (err) {
                var message = "Une erreur s'est produite";
                return res
                  .status(400)
                  .json({ type: "error", message: message });
              }
              if (req)
                req.app.get("websocket").broadcaster("newMessage", fields);
              Notification.create(
                { to: fields.receiver, type: "message" },
                (err, notification) => {
                  Discussion.updateOne(
                    { _id: discussion._id },
                    {
                      $set: {
                        lastMessage: data._id,
                        updatedAt: Date.now(),
                      },
                    }
                  ).then((response) => {
                    return res.status(200).json({
                      type: "success",
                      message: "Message nvoyé avec succès !",
                      data: data,
                    });
                  });
                }
              );
            });
          });
        }
      });
    } else {
      let searchQuery = { _id: fields.id };
      Message.updateOne(searchQuery, {
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
  Message.deleteOne(searchQuery)
    .then((lang) => {
      return res.status(200).json({ message: "Supprimer " });
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({ message: "Erreur " + err });
    });
});
router.get("/api/discussions/:user_id", (req, res) => {
  Discussion.find({
    $or: [{ sender: req.params.user_id }, { receiver: req.params.user_id }],
  })
    .populate("sender")
    .populate("receiver")
    .populate("lastMessage")
    .sort({ updatedAt: -1 })
    .then((data) => {
      Notification.updateMany(
        { to: req.params.user_id },
        {
          $set: {
            status: false,
          },
        }
      ).then((response) => {
        res.status(200).json({
          data: data,
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/api/messages/:discussion", (req, res) => {
  Message.find({ discussion: req.params.discussion })
    .then((data) => {
      res.status(200).json({
        data: data,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/api/messages/:sender/:receiver", (req, res) => {
  const users = [req.params.sender, req.params.receiver];
  Discussion.findOne({ sender: { $in: users }, receiver: { $in: users } })
    .then((discussion) => {
      Message.find({ discussion })
        .then((data) => {
          res.status(200).json({
            data: data,
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

router.get("/api/notifications/:user_id/:type", (req, res) => {
  Notification.find({
    to: req.params.user_id,
    type: req.params.type,
    status: true,
  })
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
