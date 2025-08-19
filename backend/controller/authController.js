
import bcrypt from 'bcryptjs'
import userModel from '../models/userModel.js';
import generateToken from '../utils/generateTokenUtils.js';

export const signup = async (req, res) => {
    const {name, email, password} = req.body;

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists'});

        const newUser = new userModel({ name, email, password});
        await newUser.save();

        const token = generateToken(newUser._id);
        res.status(200).json({
            message: 'Signup successful', 
            token,

        user: {
            id: newUser._id,
            name: newUser.name,
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

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid user name or password'});

    const token = generateToken(user._id);
    res.status(200).json({ 
        message: 'Login successful', 
        token,

        user: {
            id: user._id,
            name: user.username,
            email: user.email,
            avatar: user.avatar || null
        }
    });

   } catch (error) {
    res.status(500).json({ message: 'login failed', error: error.message})
   }
};
