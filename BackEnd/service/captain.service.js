import CAPTAIN from "../models/captain.model.js";

// export const registerCaptain = {
//   findOneByEmail: async (email) => {
//     return await CAPTAIN.findOne({ email });
//   },

//   hashPassword: async (password) => {
//     return await CAPTAIN.hashPassword(password);
//   },

//   create: async ({ fullname, email, password, vehicle }) => {
//     if (!fullname || !email || !password || !vehicle) {
//       throw new Error("All fields are required");
//     }

//     const newCaptain = new CAPTAIN({
//       fullname,
//       email,
//       password,
//       vehicle,
//     });

//     await newCaptain.save();
//     return newCaptain;
//   },
// };


export const registerCaptain = async (captainData) => {
  const { fullname, email, password, vehicle } = captainData;

  if (!fullname || !email || !password || !vehicle) {
    throw new Error("All fields are required");
  }

  const existingCaptain = await CAPTAIN.findOne({ email });
  if (existingCaptain) {
    throw new Error("Captain with this email already exists");
  }

  const newCaptain = new CAPTAIN({
    fullname,
    email,
    password,
    vehicle,
  });

  await newCaptain.save();
  return newCaptain;
}   