import type { NextApiRequest, NextApiResponse } from "next";
import User from "../../../../models/User";
import connectMongo from "../../../../utils/connectMongo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //connect to mongo
  const _db = await connectMongo();
  if (req.body.userId !== req.query.id) {
    const user = await User.findById(req.query.id);
    const currentUser = await User.findById(req.body.userId);
    if (!user.followers.includes(req.body.userId)) {
      await user.updateOne({ $push: { followers: req.body.userId } });
      await currentUser.updateOne({ $push: { followings: req.query.id } });
      res.status(200).json("user has been followed");
    } else {
      res.status(403).json("you already follow this user");
    }
  } else {
    res.status(403).json({
      message: "You can't follow yourself",
    });
  }
}
