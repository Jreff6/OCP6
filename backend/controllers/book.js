const Book = require('../models/Book');
const average = require('../utils/average')
const fs = require('fs')




  exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/resized_${req.file.filename}`,
    });

    book.save()
    .then(() => { res.status(201).json({message: 'Livre enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
  };
  

  exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/resized_${req.file.filename}`
    } : { ...req.body };
  
    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Livre modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
  };



  exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id})
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Livre supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
  };




  exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id})
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
  };

  exports.getAllBook = (req, res, next) => {

    Book.find()
  
      .then(books => res.status(200).json(books))
      .catch(error => res.status(400).json({ error }));
    };


    exports.createRating = async (req, res, next) => {
        const bookId = req.params.id;
        const userId = req.auth.userId;
        const rating = req.body.rating;
    
        if (rating < 1 || rating > 5) {
            return res
                .status(400)
                .json({ error: "La note doit être comprise entre 1 et 5." });
        }
    
        try {
            //Verify if the user has already rated
            const book = await Book.findById(bookId);
            if (book.ratings.some((rating) => rating.userId === userId)) {
                return res
                    .status(400)
                    .json({ error: "L'utilisateur a déjà noté ce livre." });
            }
    
            //Add the new rate
            const updatedBook = await Book.findByIdAndUpdate(
                bookId,
                {
                    $push: { ratings: { userId: userId, grade: rating } },
                },
                { new: true }
            );
    
            //Update the new average rate
            const totalRatings = updatedBook.ratings.length;
            const totalRatingSum = updatedBook.ratings.reduce(
                (sum, rating) => sum + rating.grade,
                0
            );
            updatedBook.averageRating = (totalRatingSum / totalRatings).toFixed(0);
    
            await updatedBook.save();
            return res.json(updatedBook);
        } catch (error) {
            return res.status(500).json({ error });
        }
    };
    

    exports.bestRatings = (req, res, next) => {
        Book.find()
            .sort({ averageRating: "desc" }).limit(3)
            .then((books => res.status(200).json(books)))
            .catch((error) => res.status(400).json({ error }));
    };
    