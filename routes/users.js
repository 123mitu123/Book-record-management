const express = require("express");
const { addListener } = require("nodemon");
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

/**
 * route: /users/subscription-details/:id
 * merthod: get
 * description: get all user subscription details
 * access: public
 * parameter: id 
 */

router.get('/subscription-details/:id', (req,res) => {
    const {id}  = req.params;

    const user = users.find((each) => each.id === id);

    if(!user) 
    return res.status(404).json({
        success: false,
        message: "user not found",

    }); 

    const getDateInDays = (data = "") => {
        let date;
        if(data === ""){
            //current date
            date = new Date ();
        }else{
            //getting date on basic of data variable
            data = new Date(data);
        }
        let days = Math.floor(data/ (1000 * 60 * 60 *24));
        return days;
    };
    const subscriptiontype = (date) => {
        if(user.subscriptiontype === "Basic"){
            date = date + 90;
        }else if(user.subscriptiontype === "Standard"){
            date = date + 180;
        }else if(user.subscriptiontype === "Premium"){
            date = date + 365;
        }
        return date;
    };

    //subscription expiration calculation
    //january 1, 1970,utc//milisecond
    let returndate = getDateInDays(user.returndate);
    let currentdate = getDateInDays();
    let subscriptiondate = getDateInDays(user.subscriptiondate);
    let subscriptionexpiration = subscriptiontype(subscriptiondate);

    const data = {
        ...user,
        subscriptionExpired: subscriptionexpiration < currentdate,
        daysLeftForExpiration: 
            subscriptionexpiration <= currentdate 
            ? 0
            : subscriptionexpiration - currentdate,

            fine:
            returndate < currentdate 
            ?  subscriptionexpiration <= currentdate
            ? 200
            : 100
            : 0 , 

    };
    return res.status(200).json({
        success: true,
        data,
    });

})
 
module.exports = router;