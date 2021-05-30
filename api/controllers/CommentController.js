const Comment = require('../models/Comment');

const allowedFields = ['comment'];

const CommentController = () => {
	const createComment = async (req, res) => {
		try {
			const comment = await Comment.create({
				user_id: req.token.id,
				post_id: req.params.post_id,
				parent_id: req.body.parent_id,
				is_reply: req.body.is_reply,
				comment: req.body.comment,
			});

			return res.status(200).json({ comment });
		} catch (err) {
			console.log(err);
			return res.status(500).json({ msg: 'Internal server error' });
		}
	};

	const getAllComments = async (req, res) => {
		try {
			const comments = await Comment.findAll({
				where: {
					post_id: req.params.post_id,
				},
			});

			return res.status(200).json(comments);
		} catch (err) {
			console.log(err);
			return res.status(500).json({ msg: 'Internal server error' });
		}
	};

	const updateFields = async (req, res) => {
		const fields = Object.keys(req.body);
		const updateData = {};

		fields.forEach((field) => {
			if (allowedFields.includes(field)) {
				updateData[field] = req.body[field];
			}
		});

		console.log(updateData);

		try {
			const nrows = await Comment.update(updateData, {
				where: {
					comment_id: req.params.comment_id,
					user_id: req.token.id,
					post_id: req.params.post_id,
				},
			});

			if (nrows[0] > 0) {
				return res.status(200).json({});
			}
			return res.status(400).json({ msg: 'Bad Request: Comment not found' });
		} catch (err) {
			console.log(err);
			return res.status(500).json({ msg: 'Internal server error' });
		}
	};

	const deleteComment = async (req, res) => {
		try {
			const comment = await Comment.findByPk(req.params.comment_id);
			if (!comment || comment.post_id !== req.params.post_id) {
				return res.status(404).json({ msg: 'Comment not found' });
			}

			// Only comment's owner and post's owner can delete comments
			if (comment.user_id === req.token.id) {
				comment.destroy();
				return res.status(200).json({ comment });
			// eslint-disable-next-line no-else-return
			} else {
				// TODO: Check if requester is post's owner, if yes then delete comment
			}

			return res.status(401).json({ msg: 'Unauthorized' });
		} catch (err) {
			console.log(err);
			return res.status(500).json({ msg: 'Internal server error' });
		}
	};

	return {
		createComment,
		getAllComments,
		updateFields,
		deleteComment,
	};
};

module.exports = CommentController;
