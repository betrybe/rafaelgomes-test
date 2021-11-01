const router = require('express').Router();

const UserController = require('../controllers/UserController');

router.post('/', UserController.users);
router.get('/checkuser', UserController.checkUser);

module.exports = router;