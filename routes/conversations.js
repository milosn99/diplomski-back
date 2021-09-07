const router = require("express").Router();
const auth = require("../middleware/auth");
const { Conversation } = require("../models/conversation");

router.post("/", auth, async (req, res) => {
  if (!req.body.receiverId) return res.status(400).send("Bad request");
  const newConversation = new Conversation({
    members: [req.user._id, req.body.receiverId],
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).send(savedConversation);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.user._id] },
    });
    res.status(200).send(conversation);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/find/:secondUserId", auth, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.user._id, req.params.secondUserId] },
    });
    res.status(200).send(conversation);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
