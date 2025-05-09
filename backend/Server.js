require('dotenv').config();  
const express = require('express');
const serverless = require('serverless-http'); 
const app = express();
const port = process.env.PORT;

const cors = require('cors');

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true 
}));
  
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
        restaurantName: String,
        restaurantImageURL: String,
        restaurantLocation: String
    }]
}); 

const UserModel = mongoose.model('User', userSchema);

// creating the users account
app.post('/register', async (req, res) => {
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
    // pulling the id and restaurant out of the request body
    const { userId, restaurantId, restaurantName, restaurantImageURL, restaurantLocation} = req.body;
    
    try {
        // finding their user by their id an dupdating their favourties list
        const user = await UserModel.findByIdAndUpdate(userId, 
            { 
                $addToSet: { 
                    favourites: { 
                        restaurantId: restaurantId, 
                        restaurantName: restaurantName,
                        restaurantImageURL: restaurantImageURL,
                        restaurantLocation: restaurantLocation
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

// getting the users favourtied restaurants 
app.delete('/favourites/:id', async (req, res) => {
    // getting the id from the request parameter
    const { id } = req.params; 
    const { restaurantId } = req.body; 
 
    try {
        // finding the users account by their id
        const user = await UserModel.findByIdAndUpdate(
            //https://www.mongodb.com/docs/manual/reference/operator/update/pull/#:~:text=The%20%24pull%20operator%20removes%20from,that%20match%20a%20specified%20condition.
            id, 
            { $pull: {favourites: {restaurantId: restaurantId} } },
            { new: true }
        );
        
        res.status(200).json(user.favourites); // sending back the users favourited restaurant
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;
module.exports.handler = serverless(app);


