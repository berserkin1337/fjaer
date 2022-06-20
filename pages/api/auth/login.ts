import type { NextApiRequest, NextApiResponse } from "next";
import User from "../../../models/User";
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
    const db = await connectMongo();
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }
    res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
    console.log(err);
  }
}
