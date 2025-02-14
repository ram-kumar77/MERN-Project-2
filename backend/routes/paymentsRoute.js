const express = require("express");
const router = express.Router();

router.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body;
    
    // Generate a dummy client secret
    const dummyClientSecret = `pi_dummy_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`;
    
    res.send({
      clientSecret: dummyClientSecret,
      dummy: true 
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to create payment intent" });
  }
});

module.exports = router;

