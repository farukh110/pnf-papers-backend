const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;
const crypto = require('crypto');

const userSchema = Schema({

    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user"
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    cart: {
        type: Array,
        default: []
    },
    address: [{ type: Schema.Types.ObjectId, ref: "Address" }],
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    refreshToken: {
        type: String
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date

}, {
    timestamps: true
});

userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);

});

userSchema.methods.isPasswordMatched = async function (enteredPassword) {

    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.methods.createPasswordResetToken = async function () {

    const resetToken = crypto.randomBytes(32).toString("hex");

    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    //10 minutes 
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000;

    return resetToken;
}

module.exports = mongoose.model("User", userSchema);