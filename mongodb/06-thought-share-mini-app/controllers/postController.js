const Post = require("../model/post.model");
const User = require("../model/user.model");

const userProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("posts");
    res.render("profile", {user});
  } catch (error) {
    console.log("Profile:", error);
  }
};

const createPost = async (req, res) => {
  try {
    const content = req.body.content;
    const userId = req.params.userId;

    const newPost = await Post.create({content, author: userId});
    await User.findByIdAndUpdate(userId, {$push: {posts: newPost._id}});

    res.redirect("/profile/" + userId);
  } catch (error) {
    console.log("Post create:", error);
  }
};

const likePost = async (req, res) => {
  const {postId, userId} = req.params;

  const post = await Post.findById(postId);
  if (post.likes?.indexOf(userId) === -1) {
    await Post.findByIdAndUpdate(postId, {$push: {likes: userId}}, {new: true});
  } else {
    await Post.findByIdAndUpdate(postId, {$pull: {likes: userId}}, {new: true});
  }
  res.redirect(`/profile/${userId}`);
};

const editPost = async (req, res) => {
  try {
    const {postId, userId} = req.params;
    const post = await Post.findById(postId);
    res.render("editPost", {content: post.content, userId, postId});
  } catch (error) {
    console.log("Edit Post:", error);
  }
};

const updatePost = async (req, res) => {
  try {
    const content = req.body.content;
    const {userId, postId} = req.params;
    await Post.findOneAndUpdate({_id: postId}, {content}, {new: true});
    res.redirect(`/profile/${userId}`);
  } catch (error) {
    console.log("Post Update:", error);
  }
};

const deletePost = async (req, res) => {
  try {
    const {postId, userId} = req.params;

    await User.findByIdAndUpdate(userId, {$pull: {posts: postId}});
    await Post.findByIdAndDelete(postId);

    res.redirect("/login");
  } catch (error) {
    console.log("Delete error:", error);
  }
};

module.exports = {userProfile, createPost, likePost, editPost, updatePost, deletePost};
