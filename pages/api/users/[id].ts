import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import User from "../../../models/User";
import connectMongo from "../../../utils/connectMongo";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const _db = await connectMongo();
  switch (req.method) {
    case "PUT": {
      if (req.body.userId === req.query.id || req.body.isAdmin) {
        if (req.body.password) {
          try {
            const salt = await bcrypt.genSalt(10);
            // console.log(req.body.password);
            req.body.password = await bcrypt.hash(req.body.password, salt);
            // console.log(req.body.password);
          } catch (error) {
            console.log(error);
            return res.status(500).json({
              message: "Server error",
            });
          }
        }
        try {
          const { updatedUser, userId } = req.body;
          // console.log(req.body);
          const user = await User.findByIdAndUpdate(req.query.id, {
            $set: req.body,
          });
          res.status(200).json(user);
        } catch (error) {
          console.log(error);
          return res.status(500).json({
            message: "Server error",
          });
        }
      } else {
        return res.status(403).json({
          message: "You are not allowed to edit this user",
        });
      }
      break;
    }
    case "DELETE": {
      if (req.body.userId === req.query.id || req.body.isAdmin) {
        try {
          const { updatedUser, userId } = req.body;
          // console.log(req.body);
          const user = await User.findByIdAndDelete(req.query.id);
          res.status(200).json("Account has been deleted");
        } catch (error) {
          console.log(error);
          return res.status(500).json({
            message: "Server error",
          });
        }
      } else {
        return res.status(403).json({
          message: "You are not allowed to delete other users",
        });
      }

      break;
    }
    case "GET": {
      try {
        const user = await User.findById(req.query.id);
        const { password, updatedAt, ...other } = user._doc;
        res.status(200).json(other);
      } catch (err) {
        res.status(500).json(err);
      }
      break;
    }
  }
}
