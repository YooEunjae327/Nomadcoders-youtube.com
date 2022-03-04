import bcrypt from "bcrypt"
import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  avatarUrl: String,
  socialOnly: { type: Boolean, default: false },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  name: { type: String, required: true },
  location: String,
<<<<<<< HEAD
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video " }],
})

userSchema.pre("save", async function () {
  console.log("Users password:", this.password)
  this.password = await bcrypt.hash(this.password, 5)
  console.log("Hashed password:", this.password)
=======
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
})

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 5)
  }
>>>>>>> 329d88c75d397b779330b0b05daa8669a811fa88
})

const User = mongoose.model("User", userSchema)

export default User
