const express = require("express");

//importing routes
const usersRouter = require("./routes/users");
const booksRouter = require("./routes/books");

const app = express();

const port = 8081;

app.use(express.json());

//this one is just tell me our server is running rightly
app.get("/", (req,res) => {
    res.status(200).json({
        message: "server is up and running ",
    });
});

//redirect to users.js and books.ja
app.use("/users", usersRouter);
app.use("/books", booksRouter);


app.get("*", (req,res) => {
    res.status(404).json({
        message: "this route does not exist",
    });
});


app.listen(port, () => {
    console.log(`server is running at port ${port}`);
});

