import User from "../model/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import { gentoken } from "../config/token.js";
export const registration= async(req,res)=>{
    try {
        const {name,email,password}=req.body;
        const existUser= await User.findOne({email})
        if(existUser){
            return res.status(400).json({message:"User already exists"})
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({message:"Enter Valid Email"})
        }
        if(password.length<8){
            return res.status(400).json({message:"Enter Strong Password"})
        }
        let hashPassword= await bcrypt.hash(password,10)

        const user=await User.create({name,email,password:hashPassword})

        let token= await gentoken(user._id)
        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            sameSite:"none",
            maxAge:7*24*60*60*1000
        })
        return res.status(201).json(user)
    } catch (error) {
        console.log("Registration Error")
        return res.status(500).json({message:`Registration Error ${error}`})
    }
}


export const login = async (req, res) => {
    try {
        let { email, password } = req.body;

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }

        let isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect Password" });
        }

        let token = gentoken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.log("Login Error:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const logout=async(req,res)=>{
    try {
        res.clearCookie("token")
        return res.status(200).json({message:"Logout successfull"})
    } catch (error) {
        console.log("Logout Error")
        return res.status(500).json({message:`Logout Error ${error}`})
    }
}



