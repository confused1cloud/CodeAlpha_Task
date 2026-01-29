const express = require("express");
const {
  handleGenerateNewShortURL,
  handleRedirectURL,
  handleGetAnalytics,
} = require("../controllers/url");

const router = express.Router();

router.post("/", handleGenerateNewShortURL);
router.get("/analytics/:shortId", handleGetAnalytics);
router.get("/:shortId", handleRedirectURL);

module.exports = router;