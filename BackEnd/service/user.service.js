import USER from "../models/user.model.js";

export const createUser = async (firstname, lastname, email, password) => {
  if (!firstname || !email || !password) {
    throw new Error("All fields Are Required");
  }
  const user = await USER.create({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password,
  });

  return user;
};

export const login = async (email, password) => {
  if (!email || !password) {
    throw new Error("All fields Are Required");
  }
  const user = await USER.findOne({ email }).select("+password");
  if (!user) {
    throw new Error("Invalid Email or Password");
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error("Invalid Email or Password");
  }
  user.password = undefined; // Remove password from the user object before returning
  return user;
};
