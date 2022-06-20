import type { NextApiRequest, NextApiResponse } from "next";
import Post from "../../models/Post";
import connectMongo from "../../utils/connectMongo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //connect to mongo
  const _db = await connectMongo();
  if (req.method == "POST") {
    const newPost = new Post(req.body);
    try {
      const savedPost = await newPost.save();
      res.status(200).json(savedPost);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
