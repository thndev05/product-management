const express = require('express');
const router = express.Router();
const controller = require('../../controllers/admin/my-account.controller');

const multer = require('multer');
const upload = multer();
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware');
const validate = require('../../validates/admin/account.validate');


router.get('/', controller.index);

router.get('/edit', controller.edit);
router.patch('/edit',
  upload.single('avatar'),
  uploadCloud.upload,
  validate.editPatch,
  controller.editPatch
);


module.exports = router;