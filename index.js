const express = require("express");
//json data import
const { users } = require("./Data/users.json");

const app = express();

const port = 8081;

app.use(express.json());

app.get("/", (req,res) => {
    res.status(200).json({
        message: "server is up and running ",
    });
});

/**
 * route: /users
 * merthod: get
 * description: get all users
 * access: public
 * parameter: none
 */

app.get("/users", (req,res) => {
    res.status(200).json({
        success: true,
        data: users,
    });
});

/**
 * route: /users/id
 * merthod: get
 * description: get single user by id
 * access: public
 * parameter: none
 */

app.get("/users/:id", (req,res) => {
    const { id } = req.params;
    const user = users.find((each) => each.id === id);
    if(!user) {
        return res.status(404).json({
            success: false,
            message: "user not found",
        });
    }
    return res.status(200).json({
        success: true,
        data: user,
    });
});

/*
 * route: /users
 * merthod: post
 * description: create new user
 * access: public
 * parameter: none
 */

app.post('/users', (req,res) => {
    const { id, name, surname, email, subscriptiontype, subscriptiondate} =
    req.body;

    const user = users.find ((each) => each.id === id);

    if (user) {
        return res.status(404).json({
            success: false,
            message: "user exists with this id",
        });
    }

    users.push({
        id, 
        name, 
        surname, 
        email, 
        subscriptiontype, 
        subscriptiondate,
    });
    return res.status(201).json({
        success: true,
        data: users,
    });
});


app.get("*", (req,res) => {
    res.status(404).json({
        message: "this route does not exist",
    });
});

/**
 * route: /users/id
 * merthod: put
 * description: update user data
 * access: public
 * parameter: id 
 */

app.put('/user/:id', (req,res) => {
    const {id} = req.params;
    const {data} = req.body;

    const user = users.find((each) => each.id === id);

    if(!user) 
    return res.status(404).json({
        success : false, 
        message: "user not found"
    });

    const updatedUser = users.map((each) => {
        if(each.id === id){
            return {
                ...each,
                ...data,
            };
        }
        return each;
    });
    return res.status(200).json({
        success: true,
        data: updatedUser,
    });
}) ;

app.listen(port, () => {
    console.log(`server is running at port ${port}`);
});

