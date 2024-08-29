const express = require('express');
const router = express.Router();
const controller = require('../../controllers/admin/product-category.controller');

// [GET] /admin/products-category
router.get('/', controller.index);

module.exports = router;