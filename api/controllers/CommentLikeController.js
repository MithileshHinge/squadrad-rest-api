const CommentLike = require('../models/CommentLike');

const CommentLikeController = () => {

	const likeComment = async (req, res) => {
		try {
			const like = await CommentLike.create({
				user_id: req.token.id,
				comment_id: req.params.comment_id,
			});

			return res.status(200).json({like});
		} catch (err){
			console.log(err);
			return res.status(500).json({msg: 'Internal server error'});
		}
	};

	const unlikeComment = async (req, res) => {
		try {
			const like = await CommentLike.findOne({
				where: {
					user_id: req.token.id,
					comment_id: req.params.comment_id,
				}
			});

			if (like) {
				like.destroy();
				return res.status(200).json({like});
			}
			return res.status(400).json({ msg: 'Bad Request'});
		} catch (err){
			console.log(err);
			return res.status(500).json({msg: 'Internal server error'});
		} 
	};

	const getCommentLikes = async (req, res) => {
		try {
			const numLikes = await CommentLike.count({
				where: {
					comment_id: req.params.comment_id,
				}
			});

			return res.status(200).json({numLikes: numLikes})
		} catch (err){
			console.log(err);
			return res.status(500).json({msg: 'Internal server error'});
		}
	};

	return {
		likeComment,
		unlikeComment,
		getCommentLikes,
	};
};

module.exports = CommentLikeController;