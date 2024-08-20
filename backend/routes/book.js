const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const bookCtrl = require('../controllers/book');

// Routes
router.get('/bestrating', bookCtrl.bestRatings);

router.post('/', auth, multer, multer.resizeImage, bookCtrl.createBook);

router.put('/:id', auth, multer, bookCtrl.modifyBook);

router.get('/:id', bookCtrl.getOneBook);

router.delete('/:id', auth, bookCtrl.deleteBook);

router.get('/', bookCtrl.getAllBook);

router.post('/:id/rating', auth, bookCtrl.createRating);

module.exports = router;





  
module.exports = router;


  