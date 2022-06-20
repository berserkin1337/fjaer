import type { NextApiRequest, NextApiResponse } from "next";
import Post from "../../../models/Post";
import connectMongo from "../../../utils/connectMongo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const _db = await connectMongo();
  switch (req.method) {
    case "PUT": {
      try {
        const post = await Post.findById(req.query.id);
        if (post.userId == req.body.userId) {
          await post.updateOne({ $set: req.body });
          res.status(200).json("The post has been updated");
        } else {
          res.status(403).json("you can update only your post");
        }
      } catch (err) {
        res.status(500).json(err);
      }
      break;
    }

    case "DELETE": {
      try {
        const post = await Post.findById(req.query.id);
        if (post.userId == req.body.userId) {
          await post.deleteOne();
          res.status(200).json("The post has been deleted");
        } else {
          res.status(403).json("you can delete only your post");
        }
      } catch (err) {
        res.status(500).json(err);
      }
      break;
    }

    case "GET": {
      try {
        const post = await Post.findById(req.query.id);
        res.status(200).json(post);
      } catch (err) {
        res.status(500).json(err);
      }
      break;
    }
  }
}
