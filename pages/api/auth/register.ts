import User from "../../../models/User";
import type { NextApiRequest, NextApiResponse } from "next";
import connectMongo from "../../../utils/connectMongo";
import bcrypt from "bcrypt";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // return error if the method is not POST
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed",
    });
  }
  try {
    //generate new Password
    const db = await connectMongo();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    //create new User
    const newUser = await new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    //save new User
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500);
  }
}
