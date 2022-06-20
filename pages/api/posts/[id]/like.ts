import type { NextApiRequest, NextApiResponse } from "next";
import Post from "../../../../models/Post";
import connectMongo from "../../../../utils/connectMongo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const _db = await connectMongo();
  if (req.method == "PUT") {
    try {
      const post = await Post.findById(req.query.id);
      if (!post.likes.includes(req.body.userId)) {
        await post.updateOne({ $push: { likes: req.body.userId } });
        res.status(200).json("The post has been liked");
      } else {
        await post.updateOne({ $pull: { likes: req.body.userId } });
        res.status(200).json("The post has been disliked");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
