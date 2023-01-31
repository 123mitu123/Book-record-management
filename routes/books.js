const express = require("express");

const {books} = require("../data/books.json");
const {users} = require("../data/users.json");
 
const  router = express.Router();

/**
 * route: /books
 * merthod: get
 * description: get all books
 * access: public
 * parameter: none
 */
router.get('/', (req,res) => {
    res.status(200).json({
        success: true,
        data: books  
    });
});

/**
 * route: /books/:id
 * merthod: get
 * description: get book by id
 * access: public
 * parameter: id
 */
router.get("/:id", (req,res) => {
    const { id } = req.params;
    const book = books.find((each) => each.id === id);
    if(!book) {
        return res.status(404).json({
            success: false,
            message: "book not found",
        });
    }
    return res.status(200).json({
        success: true,
        data: book,
    });
}); 

/**
 * route: /books/issued/books
 * merthod: get
 * description: get all issued books
 * access: public
 * parameter: none
 */
router.get("/issued/by-user", (req,res) => {
    const usersWithIssuedbooks = users.filter((each) => {
        if(each.issuedbook) return each; 
    });

    const issuedbooks = [];

    usersWithIssuedbooks.forEach((each) => {
        const book = books.find((book) => book.id === each.issuedbook);

        book.issuedBy = each.name;
        book.issuedDate = each.issuedDate;
        book.returnDate = each.returnDate; 

        issuedbooks.push(book);
    });

    if(issuedbooks.length === 0)
    return res.status(404).json({
        success: false,
        message: "no books issued yet",
    });
    return res.status(200).json({
        success: true,
        data: issuedbooks,
    });
});

//default export    
module.exports = router;