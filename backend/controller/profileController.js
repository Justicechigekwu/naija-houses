import userModel from "../models/userModel.js"

export const updateProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found"});
        }

        if (req.body.email && req.body.email !== user.email) {
            const emailExists = await userModel.findOne({ email: req.body.email });
            if (emailExists) {
                return res.status(400).json({ messge: "New email and old email can not be the same"})
            }
            user.email = req.body.email;
        }

        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.phone = req.body.phone || user.phone;
        user.location = req.body.location || user.location;
        user.bio = req.body.bio || user.bio;
        user.dob = req.body.dob || user.dob;
        user.sex = req.body.sex || user.sex;

        if (req.file) {
            user.avatar = `/uploads/${req.file.filename}`;
        }

        const updatedUser = await user.save();
        res.json({
            message: "Profile updated successfully",
            user: {
                id: updatedUser._id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                avatar: updatedUser.avatar,
                phone: updatedUser.phone,
                location: updatedUser.location,
                dob: updatedUser.dob,
                bio: updatedUser.bio,
                sex: updatedUser.sex,
            }
        });

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server error", error})
        
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found"})
        }
        res.json({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            avatar: user.avatar,
            phone: user.phone,
            location: user.location,
            dob: user.dob,
            bio: user.bio,
            sex: user.sex,
        });
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Failed to fetch profile details", error})
    }
};
