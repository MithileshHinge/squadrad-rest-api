const PostLike = require('../models/PostLike');

const PostLikeController = () => {

	const likePost = async (req, res) => {
		try {

			//TODO : Testing and make entry unique
			const like = await PostLike.create({
				user_id: req.token.id,
				post_id: req.params.post_id,
			});

			return res.status(200).json({like});
		}catch (err){
			console.log(err);
			return res.status(500).json({msg: 'Internal server error'});
		}
	};

	const unlikePost = async (req, res) => {
		try {
			const like = await PostLike.findOne({
				where: {
					user_id: req.token.id,
					post_id: req.params.post_id,
				}
			});

			if (like){
				like.destroy();
				return res.status(200).json({like});
			}
			return res.status(400).json({ msg: 'Bad Request' });
		}catch (err){
			console.log(err);
			return res.status(500).json({msg: 'Internal server error'});
		}
	};

	const getPostLikes = async (req, res) => {
		try {
			const numLikes = await PostLike.count({
				where: {
					post_id: req.params.post_id,
				}
			});

			return res.status(200).json({numLikes: numLikes});
		} catch (err) {
			console.log(err);
			return res.status(500).json({msg: 'Internal server error'});
		}
	};

	return {
		likePost,
		unlikePost,
		getPostLikes,
	};
};

module.exports = PostLikeController;