require('dotenv').config();  
const express = require('express');
const app = express();
const port = process.env.PORT;

const cors = require('cors');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  
app.options("*", cors());
app.use(express.json());


const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded()); 
app.use(bodyParser.json()); 

const mongoose = require('mongoose');
// connecting to mongoose database with the value in the .env file   
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// creating a scehma in the database for all the newly registered users - the values the schema will hold 
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    favourites: [{
        restaurantId: String,
        restaurantName: String     
    }]
}); 

const UserModel = mongoose.model('User', userSchema);

// creating the users account
app.post('/register', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    // pulling the email and password out of the request body 
    const { email, password} = req.body;
    try {    
        // creating a new account and saving it to the database model
        const newAccount = new UserModel({email, password });
        await newAccount.save();
        console.log("Account created successfully")
        // creating the account and sending back the users profile id so they can be redirected to the profile page 
        res.status(201).json({ message: "Account created successfully",  id: newAccount._id   });
    } catch (error) {
        console.error("Error:", error); 
        res.status(500).json({ message: "Server Error" });
    } 
});

// retrieving a specifc user by email and password
app.post('/login', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    // pulling the email and the password out of the request body 
    const { email, password } = req.body;
    
    try {
        // searching the database for the email and password in the request body and assigning it to account
        const account = await UserModel.findOne({ email, password }); 
        // if the account doesnt exist it alerts the user 
        if (!account) {
            return res.status(401).json({ message: "Incorrect email or password" });
        }
        // if the account exists it allows the user to continue - sends back the users account id so they can be redirected to their create page 
        res.status(200).json({ message: "Log in successful", id: account._id  });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// posting the users favourtied restaurants 
app.post('/favourites', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    // pulling the id and restaurant out of the request body
    const { userId, restaurantId, restaurantName } = req.body;
    
    try {
        // finding their user by their id an dupdating their favourties list
        const user = await UserModel.findByIdAndUpdate(userId, 
            { 
                $addToSet: { 
                    favourites: { 
                        restaurantId: restaurantId, 
                        restaurantName: restaurantName 
                    } 
                } 
            }, 
            { new: true }
        );
        // if the account exists it allows the user to continue - sends back the users account id so they can be redirected to their create page 
        res.status(200).json({ message: "Added to favourites", user: user.favourites });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server Error" });
    } 
});

// getting the users favourtied restaurants 
app.get('/favourites/:id', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    // getting the id from the request parameter
    const { id } = req.params; 

    try {
        // finding the users account by their id
        const user = await UserModel.findById(id);
        res.status(200).json(user.favourites); // sending back the users favourited restaurants
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
