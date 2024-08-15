const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')

const bookCtrl = require('../controllers/book');



router.post('/', auth, multer, multer.resizeImage, bookCtrl.createBook);
  
router.put('/:id', auth, multer,  bookCtrl.modifyBook);
  
router.delete('/:id', auth, bookCtrl.deleteBook);
  
router.get('/:id', bookCtrl.getOneBook);
  
router.get('/', bookCtrl.getAllBook);

router.get('/bestrating', bookCtrl.getBestRating);

router.post('/:id/rating', auth, bookCtrl.createRating);

router.put('/:id', auth, multer, multer.resizeImage, bookCtrl.modifyBook);



  
module.exports = router;


  