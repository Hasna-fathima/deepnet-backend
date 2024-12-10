import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import dotenv from 'dotenv';
import adminModel from '../model/adminmodel.js';
import userModel from "../model/usermodel.js";
import {adminToken} from '../util/generateToken.js';
import mongoose from "mongoose";


dotenv.config();

const saltRounds = 10;

const hashPassword = async (password) => {
    try {
        return await bcryptjs.hash(password, saltRounds);
    } catch (error) {
        throw new Error("Error hashing password");
    }
};

export async function Signup(req, res) {
    try {
        const { username, email, password } = req.body;
        const adminExist = await adminModel.findOne({ email });
        if (adminExist) {
            return res.status(400).json({ message: "Admin already exists" });
        }
        const hashedPassword = await hashPassword(password);

        const newAdmin = new adminModel({ email, username, password: hashedPassword, role: "admin" });
        const newUserCreated = await newAdmin.save();

        if (!newUserCreated) {
            return res.status(500).json({ message: "Admin registration failed" });
        }

        res.status(201).json({ message: "Admin signed up successfully" });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}




export const Signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await adminModel.findOne({ email }).exec();
    if (!admin) {
        return res.status(400).json({ message: "Admin not found" });
    }
    if (admin.role !== 'admin') {
        return res.status(403).json({ message: "Access denied. Not an admin" });
    }

    const isPasswordValid = await bcryptjs.compare(password, admin.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
    }

    const token = adminToken(admin);
    res.cookie("token", token, { httpOnly: true }); 
    const _id = admin._id;
    const { username, email: adminEmail, role } = admin;

  
    return res.status(200).json({
        message: "Login successful",
        token,
        user: { _id, username, email: adminEmail, role },
    });

} catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
}
};






export const Signout=(req, res)=> {
    res.clearCookie("token")
    res.status(200).json("signout  Scuccessfully...")
   
    }



 const getAllusers = async (req, res) => {
        try {
          const users = await userModel.find();
          console.log('users',users)
          res.status(200).json(users);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal server error' });
        }
      };


      const getuserbyid=async(req,res)=>{
        try {
            const user = await userModel.findById(req.params.id);
            if (!user) {
                return res.status(404).send('user not found');
            }
            res.status(200).send(user);
        } catch (err) {
            res.status(500).send(err);
        }
    }




 const unblockedusers=async(req,res)=>{
    try {
        const { id } = req.params; 
    
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ message: 'Invalid user ID format' });
        }
    
        const user = await userModel.findById(id);
    
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        user.isblocked = false;
        await user.save();
    
        res.status(200).json({ message: 'User unblocked successfully' });
      } catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
      }
    };

 const blockedusers = async (req, res) => {
        try {
          const { id } = req.params; 
      
          if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
          }
      
          const user = await userModel.findById(id);
      
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
      
          user.isblocked = true;
          await user.save();
      
          res.status(200).json({ message: 'User blocked successfully' });
        } catch (error) {
          res.status(500).json({ message: 'An error occurred', error });
        }
      };





      const adminController={getAllusers,blockedusers,unblockedusers,getuserbyid,}
      
      export default adminController





