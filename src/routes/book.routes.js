const express = require('express');
const router = express.Router();
const Book = require('../models/book.model');

// MIDDLEWARE: Obtiene un libro que se podrá utilizar en las demás funciones
const getBook = async ( req, res, next ) => {

    let book;
    const { id } = red.params;

    if(!id.match(/^([0-9a-fA-F]{24})$/)){
        return res.status(404).json({message: "ID no válido"})
    }

    try{

        book = await Book.findById(id);
        if(!book){
            return res.status(404).json({message: "Libro no encontrado"})
        }

    }catch(err){
        return res.status(500).json({message: err.message});
    }

    res.book = book;
    next();

}

// OBTENER TODOS LOS LIBROS
router.get('/', async ( req, res) => {

    try{

        const books = await Book.find();

        console.log("GETT ALL", books);

        if(books.length === 0){
            return res.status(204).json([])
        }

        res.json(books)


    }catch(err){
        res.status(500).json({message: err.message})
    }

});

// CREAR UN NUEVO LIBRO
router.post('/', async ( req, res ) => {
    
    const { title, author, genre, publication_date } = req.body;

    if(!title || !author || !genre || !publication_date){
        return res.status(400).json({message: "Todos los campos son obligatorios"});
    }

    const book = new Book({
        title,
        author,
        genre,
        publication_date
    });

    try{

        const newBook = await book.save();
        res.status(201).json(newBook);
        console.log(newBook);

    }catch(err){
        res.status(400).json({message: err.message})
    }
})

router.get('/:id', getBook, async( req, res ) => {
    res.json(res.book)
})

router.put('/:id', getBook, async( req, res ) => {
    
    try{

        const book = res.book;
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.publication_date = req.body.publication_date || book.publication_date;

        const updateBook = await book.save();
        res.json(updateBook)

    }catch(err){
        res.status(400).json({message: err.message})
    }

})

router.patch('/:id', getBook, async( req, res ) => {

    if(
        !req.body.title && 
        !req.body.author &&
        !req.body.genre &&
        !req.body.publication_date 
    ){
        return res.status(400).json({message: "No hay campos para actualizar"})
    }

    try{
        const book = res.book;
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.publication_date = req.body.publication_date || book.publication_date;

        const updateBook = await book.save();
        res.json(updateBook)

    }catch(err){
        res.status(400).json({message: err.message})
    }
})

router.delete('/:id', getBook, async( req, res ) => {

    try{
        const book = res.book;
        await book.deleteOne({
            _id: book._id
        });
        res.json({message: `El libro ${book.title} fue eliminado.`})

    }catch(err){
        res.status(500).json({message: err.message})
    }

})

module.exports = router
