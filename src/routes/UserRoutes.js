const router = require('express').Router();

const UserController = require('../controllers/UserController');

router.post('/', UserController.addUser);
router.post('/admin', UserController.addUserAdmin);

module.exports = router;