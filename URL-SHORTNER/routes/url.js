const express = require ("express");
const {handleGetNewShortURL,handleGetAnalytics} = require ("../controllers/url");

const router = express.Router();

router.post ("/", handleGetNewShortURL);
router.get ("/analytics/:shortId", handleGetAnalytics);

module.exports = router;