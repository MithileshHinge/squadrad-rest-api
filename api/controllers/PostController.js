const Post = require('../models/Post');

const allowedFields = ["title", "description", "pact_id", "otp_amount"];

const PostController = () => {

	const createPost = async (req, res) => {
		try {
			if (!req.isCreator)
				return res.status(401).json({ msg: 'Unauthorized' });

			const post = await Post.create({
				user_id: req.token.id,
				title: req.body.title,
				description: req.body.description,
				is_link: (req.body.is_link == "1"),
				path: req.files[0].filename,
				pact_id: req.body.pact_id,
				otp_amount: req.body.otp_amount,
			});

			return res.status(200).json({post});
		} catch (err) {
			console.log(err);
			return res.status(500).json({msg: 'Internal server error'});
		}
	};

	const getAllPosts = async (req, res) => {
		try{
			const posts = await Post.findAll({
				where: {
					user_id: req.body.user_id
				}
			});

			return res.status(200).json({posts});
		} catch (err) {
			console.log(err);
			return res.status(500).json({msg: 'Internal server error'});
		}
	};

	const getPostByID = async (req, res) => {
		try {
			const post = await Post.findByPk(req.params.post_id)
			if (!post)
				return res.status(404).json({msg: "Post not found"});
			return res.status(200).json(post);
		} catch (err) {
			console.log(err);
			return res.status(500).json({msg: 'Internal server error'});
		}
	};

	const updateFields = async (req, res) => {
		const fields = Object.keys(req.body);
		console.log(fields);
		let updateData = {};

		for (let field of fields){
			if (allowedFields.includes(field)){
				updateData[field] = req.body[field];
			}
		}

		console.log(updateData);

		try{
			const nrows = await Post.update(updateData, {
				where: {
					post_id: req.params.post_id,
					user_id: req.token.id
				}
			});
			if (nrows[0] > 0)
				return res.status(200).json({});
			else
				return res.status(400).json({ msg: 'Bad Request'});
		} catch (err) {
			console.log(err);
			return res.status(500).json({msg: 'Internal server error'});
		}
	};

	const deletePost = async (req, res) => {
		try {
			const post = await Post.findByPk(req.params.post_id);
			if (!post) {
				return res.status(404).json({ msg: 'Post not found' });
			}

			if (post.user_id === req.token.id) {
				post.destroy();
				return res.status(200).json({post});
			}

			return res.status(401).json({ msg: 'Unauthorized' });
		} catch (err) {
			console.log(err);
			return res.status(500).json({ msg: 'Internal server error' });
		}
	};

	return {
		createPost,
		getAllPosts,
		getPostByID,
		updateFields,
		deletePost,
	};
}

module.exports = PostController;