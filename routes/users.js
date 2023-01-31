const express = require("express");
//json import
const {users} = require("../Data/users.json");

const router = express.Router();

/**
 * route: /users
 * merthod: get
 * description: get all users
 * access: public
 * parameter: none
 */

router.get("/", (req,res) => {
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

router.get("/:id", (req,res) => {
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

router.post('/', (req,res) => {
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

/**
 * route: /users/id
 * merthod: put
 * description: update user data
 * access: public
 * parameter: id 
 */

router.put('/:id', (req,res) => {
    const {id} = req.params;
    const {data} = req.body;

    const user = users.find((each) => each.id === id);

    if(!user) 
    return res.status(404).json({
        success : false, 
        message: "user not found"
    });

    const updateUser = users.map((each) => {
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
        data: updateUser,
    });
}) ;

/**
 * route: /users/id
 * merthod: delete
 * description: delete a user by id
 * access: public
 * parameter: id 
 */

router.delete("/:id", (req,res) => {
    const {id} = req.params;
    const user = users.find((each) => each.id === id);

    if(!user) {
    return res.status(404).json({
        success : false, 
        message: "user to be deleted  was not found",
    });
    }  
    
    const index  = users.indexOf(user);
    users.splice(index, 1);

    return res.status(202).json({
        success: true,
        data: users
    });


});


module.exports = router;