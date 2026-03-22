
import bcrypt from 'bcryptjs'
import userModel from '../models/userModel.js';
import generateToken from '../utils/generateTokenUtils.js';

export const signup = async (req, res) => {
    const {firstName, lastName, email, password, confirmPassword} = req.body;

 try {
        if (password !== confirmPassword) {
            return res.status(404).json({ message: 'Password do not match' });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            if (existingUser.isBanned) {
                return res.status(403).json({
                    code: "ACCOUNT_BANNED",
                    message:
                      existingUser.banReason ||
                      "This email has been banned from using the marketplace.",
                });
            }

            return res.status(400).json({ message: 'User already exists'});
        }
        const newUser = new userModel({ firstName, lastName, email, password, provider: 'local'});
        await newUser.save();

        const token = generateToken(newUser._id);
        res.status(200).json({
            message: 'Signup successful', 
            token,

        user: {
            id: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            avatar: newUser.avatar || null
        }
    });

        
    } catch (error) {
        console.error('Signup error:', error); 
        res.status(500).json({ message: 'Sever error', error: error.message });
    }
};

export const login = async (req, res) => {
   try {
        const {email, password} = req.body;
    
        const user = await userModel.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password'});

        if (user.isBanned) {
          return res.status(403).json({
            code: "ACCOUNT_BANNED",
            message:
              user.banReason ||
              "Your account has been banned for violating marketplace standards.",
          });
        }

        if (user.provider === 'google' && !user.password) {
          return res.status(400).json({
            message: 'This account was created with Google. Please sign in with Google.'
          });
        }
    
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid user name or password'});
    
        const token = generateToken(user._id, { provider: user.provider });
        res.status(200).json({ 
            message: 'Login successful', 
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                avatar: user.avatar || null,
                provider: user.provider
            }
        });

   } catch (error) {
    res.status(500).json({ message: 'login failed', error: error.message})
   }
};
