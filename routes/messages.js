const router = require("express").Router();
const auth = require("../middleware/auth");
const Message = require("../models/Message");

router.post("/", auth, async (req, res) => {
  const newMessage = new Message(req.body);

  try {
    const savedMessage = await newMessage.save();
    res.status(200).send(savedMessage);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const messages = await Message.find({
      conversation: req.params.id,
    });
    res.status(200).send(messages);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
