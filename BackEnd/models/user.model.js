import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      require: true,
      minlength: [3, "First name must be with length atleast 3"],
    },
    lastname: {
      type: String,
      minlength: [3, "Last name must be with length atleast 3"],
    },
  },
  email: {
    type: String,
    require: true,
    unique: true,
    minlength: [5, "Email must be with length of atleast 5"],
  },
  password: {
    type: String,
    require: true,
    select:false
  },
  socketId: {
    type: String,
  },
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({_id: this._id},process.env.JWT_SECRET,{expiresIn: "1d"});
    return token;
};

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password)
}

// In user.model.js
userSchema.statics.hashPassword = async function(password) {
    return await bcrypt.hash(password, 10);
}

const USER = mongoose.model("USER", userSchema);
export default USER;
