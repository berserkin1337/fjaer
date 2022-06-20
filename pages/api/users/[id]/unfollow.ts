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
    if (user.followers.includes(req.body.userId)) {
      await user.updateOne({ $pull: { followers: req.body.userId } });
      await currentUser.updateOne({ $pull: { followings: req.query.id } });
      res.status(200).json("user has been unfollowed");
    } else {
      res.status(403).json("you do not follow this user");
    }
  } else {
    res.status(403).json({
      message: "You can't unfollow yourself",
    });
  }
}
