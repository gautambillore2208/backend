













const { Schema, model } = require("mongoose");
// const bcrypt = require("bcrypt");

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    profileImage: String,
    bio: { type: String, maxlength: 200 },
    profession: String,
    createdAt: { type: Date, default: Date.now }
});








const bcrypt = require("bcrypt");

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};






// 🔹 Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// 🔹 Fix comparePassword method
// userSchema.methods.comparePassword = function (candidatePassword) {
//     return bcrypt.compare(candidatePassword, this.password);

    
// };

// 🔹 Correct model creation
const User = model("User", userSchema);

module.exports = User;
