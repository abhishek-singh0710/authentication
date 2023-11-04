const express = require('express');
const app= express();

const { pool } = require("./dbConfig");

const bcrypt=require("bcrypt");
const session= require("express-session");
const flash= require("express-flash");

const passport= require("passport");
const initializePassport= require("./passportConfig.js");
initializePassport(passport);

const PORT = 4000;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false})); //This middleware will ask us to send details from the frontend

app.use(session({
    secret: "secret",

    resave: false,

    saveUninitialized: false,
})
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.get("/", ( req,res) => {
    res.render("index.ejs");
});

app.get("/users/register", checkAuthenticated, (req,res) => { //placing authenticated here to check if authenticated then only go to these register and login pages
    res.render("register");
});

app.get("/users/login", checkAuthenticated,  (req,res) => {
    res.render("login.ejs");
});

app.get("/users/dashboard", checkNotAuthenticated,  (req,res) => { //if the user tries to access the dashboard and if he is authenticated then go to response if not authenticated the user will be redirected to the login page
    res.render("dashboard", {user: req.user.name});
});

app.get("/users/logout", (req,res) => {
    req.logOut(function(err){
        if(err) {
            return next(err);
        }
        req.flash("success_msg", "You Have Logged Out");
        res.redirect("/users/login");
    });
    // req.flash("success_msg", "You Have Logged Out");
    // res.redirect("/users/login");
});

app.post("/users/register", async (req,res) => {
    let {name, email, password, password2}=req.body;
    console.log(name,email,password,password2);
    console.log(req.body);

let errors= [];

if(!name || !email || !password || !password2)
{
    errors.push({ message: "Please Enter All Fields"});
}

if(password.length<6)
{
    errors.push( { message: "Password Should Be At Least 6 Characters"});
}

if(password!=password2)
{
    errors.push({ message: "Passwords Do Not Match"});
}
{
    errors.push( { message: "Password Should Be At Least 6 Characters"});
}

// console.log("Lenght=",errors.length);
if(errors.length > 1)  //Since when no error then also length of error is showing 1
{
    res.render("register.ejs", {errors})
}else
{
    //FORM Validation Has Passed

    //making it await since it is a asynchronous function so will have to await it
    let hashedPassword= await bcrypt.hash(password, 10); //Second Argument is the number of rounds of encryption we want for our password
    // console.log("Hello");
    console.log(hashedPassword);

    pool.query(
        `SELECT * FROM patients
        WHERE email= $1`, 
        [email], 
        (err, results) => {
            if(err){
                console.log(err.message);
                throw err;
            }
            console.log(results.rows);

            if(results.rows.length>0){
                errors.push({message: "Email Already Registered" });
                res.render("register", {errors});
            }else{
                // pool.query(
                //     `INSERT INTO users (name,roll no,age,course,gender,email,password)
                //     VALUES ($1,wfcwecfwdcw,19,CSE,Male,$2,$3)
                //     RETURNING id, password`,
                //     [name, email, hashedPassword],
                //     (err, results) => {
                //         if (err) {
                //             throw err;
                //         }
                //         console.log(results.rows);
                //         req.flash("success_msg","You are now registered. Please log in");
                //         res.redirect("/users/login");
                //     }
                // );
                // pool.query(
                //     `INSERT INTO users (name, "roll no", age, course, gender, email, password)
                //     VALUES ($1, $2, $3, $4, $5, $6, $7)
                //     RETURNING id, password`,
                //     [name, roll_no_value, age_value, course_value, gender_value, email, hashedPassword],
                //     (err, results) => {
                //         if (err) {
                //             throw err;
                //         }
                //         console.log(results.rows);
                //         req.flash("success_msg", "You are now registered. Please log in");
                //         res.redirect("/users/login");
                //     }
                // );
                pool.query(
                    `INSERT INTO patients (name, email, password)
                    VALUES ($1, $2, $3)
                    RETURNING email, password`,
                    [name, email, hashedPassword],
                    (err, results) => {
                        if (err) {
                            throw err;
                        }
                        console.log(results.rows);
                        req.flash("success_msg", "You are now registered. Please log in");
                        res.redirect("/users/login");
                    }
                );
                
                
            }
        }
    );

}

});

app.post("/users/login", passport.authenticate("local", {
    successRedirect: "/users/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true //if cannot login if failed to login then want to render any of the errors messages
}));

function checkAuthenticated(req,res,next) {
    if(req.isAuthenticated()) {
        return res.redirect("/users/dashboard"); //If The User Is Authenticated Then He will be redirected to the dashboard otherwise next to move to the next piece of middleware
}
next();
}

function checkNotAuthenticated(req,res,next) {
    if(req.isAuthenticated()) {
        return next(); //if authenticated move to the next middleware otheriwse redirect to the login page
    }
    res.redirect("/users/login");
}


app.listen(PORT, () => {
    console.log(`Server Running On port ${PORT}`);
});

