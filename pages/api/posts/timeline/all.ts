import type { NextApiRequest, NextApiResponse } from "next";
import Post from "../../../../models/Post";
import connectMongo from "../../../../utils/connectMongo";
import User from "../../../../models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const currentUser = await User.findById(req.body.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId: any) => {
        return Post.find({ userId: friendId });
      })
    );
    res.json(userPosts.concat(...friendPosts));
  } catch (err) {
    res.status(500).json(err);
  }
}
