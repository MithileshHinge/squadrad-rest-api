const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');

const tmpDir = '../tmpDir/';
const creatorDir = 'images/creator/';

const uploadProfilePic = multer({
	dest: 'images/profile_pics',
	limits: {
		fields: 10,
		fileSize: 1000000,
		files: 1,
	}
});

const uploadStorage = multer.diskStorage({
	destination: tmpDir
});

const uploadCreatorProfilePic = (req, res, next) => {
	multer({
		storage: uploadStorage,
		fileFilter: function (req, file, next) {
			const ext = path.extname(file.originalname);
			if (ext != '.png' && ext != '.jpg' && ext != '.jpeg'){
				return next(new Error('Only images are allowed'));
			}
			next(null, true);
		},
		limits: {
			fields: 10,
			fileSize: 1000000,
			files: 1,
		}
	}).single('input-creator-profile-pic')(req, res, err => {
		if (err) {
			res.status(500).json({msg: err});
			return;
		}

		const fileName = req.file.filename;
		fs.move(tmpDir + fileName, creatorDir + req.token.id + '/' + fileName, err => {
			if (err) {
				res.status(500).json({msg: err});
				return console.error(err);
			}

			return next();
		});
	});
};

const uploadCreatorCoverPic = (req, res, next) => {
	multer({
		storage: uploadStorage,
		fileFilter: function (req, file, next) {
			const ext = path.extname(file.originalname);
			if (ext != '.png' && ext != '.jpg' && ext != '.jpeg'){
				return next(new Error('Only images are allowed'));
			}
			next(null, true);
		},
		limits: {
			fields: 10,
			fileSize: 5000000,
			files: 1,
		}
	}).single('input-creator-cover-pic')(req, res, err => {
		if (err) {
			res.status(500).json({msg: err});
			return;
		}

		const fileName = req.file.filename;
		fs.move(tmpDir + fileName, creatorDir + req.token.id + '/' + fileName, err => {
			if (err) {
				res.status(500).json({msg: err});
				return console.error(err);
			}

			return next();
		});
	});
}

module.exports = {
	uploadProfilePic,
	uploadCreatorProfilePic,
	uploadCreatorCoverPic,
};