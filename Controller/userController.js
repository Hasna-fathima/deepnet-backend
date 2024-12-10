import userModel from '../model/usermodel.js'
import bcryptjs from 'bcryptjs';
import {generateToken} from '../util/generateToken.js'

const saltRounds=10
const hashPassword = async (password) => {
    try {
        const hashedPassword= await bcryptjs.hash(password, saltRounds);
        return hashedPassword
    } catch (error) {
        console.log('error hashing paasword', error)
        throw new Error("Error hashing password");
    }
};


export async function Signup(req, res) {
    try {
        console.log(req.body);

        const { firstname, lastname, username, email, password, phoneNumber } = req.body;
        const userExist = await userModel.findOne({ email });
        if (userExist) {
            return res.status(400).send("User already exists");
        }

        const hashedPassword = await hashPassword(password);
        console.log("hashed password is", hashedPassword);

        const newUser = new userModel({ email, firstname, lastname, username, password: hashedPassword, phoneNumber });
        console.log('new user object', newUser);
        const newUserCreated = await newUser.save();
        console.log("new user is created", newUserCreated);

        if (!newUserCreated) {
            return res.status(500).json("User creation failed");
        }
   
        res.status(201).json("Signed up successfully");
    } catch (error) {
        console.log(error);
        res.status(500).json("Server error");
    }
};



export const usermessage=async(req,res)=>{
     const { userId, name, email, phoneNumber, message } = req.body;
 
     const newContact = new Message({
         userId,
         name,
         email,
         phoneNumber,
         message,
     });
     try {
         await newContact.save();
         res.status(201).send('Contact information saved successfully');
     } catch (error) {
         console.error(error); 
         res.status(400).send('Error saving contact information');
     }
 };

export async function Signin(req, res) {
    try {
        const { email, password } = req.body;
        console.log("Received Email:", email);
        const userExist = await userModel.findOne({ email });
        if (!userExist) {
            console.log("User does not exist");
            return res.status(404).json({ message: "User does not exist" });
        }
        const matchPassword = await bcryptjs.compare(password, userExist.password);
        if (!matchPassword) {
            console.log("Password is not correct");
            return res.status(401).json({ message: "Password is not correct" });
        }
    
        const token = generateToken(email); 
        console.log("Generated Token:", token);

        
        res.cookie("token", token, { httpOnly: true });

        const userId = userExist._id;
        console.log("User ID:", userId);

        
        res.status(200).json({ message: "Login successful", userId });

    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ message: "Server error" });
    }
}