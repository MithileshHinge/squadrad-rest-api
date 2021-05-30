const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');

const tmpDir = '../tmpDir/';
const userProfilePicsDir = 'images/profilePics/';
const creatorDir = 'images/creator/';

const isImage = (file) => {
	const allowedFileTypes = /jpeg|jpg|png|tiff|bmp/;
	return (allowedFileTypes.test(path.extname(file.originalname).toLowerCase()) && allowedFileTypes.test(file.mimetype));
};

// eslint-disable-next-line no-unused-vars
const isVideo = (file) => {
	const allowedFileTypes = /mp4/;
	return (allowedFileTypes.test(path.extname(file.originalname).toLowerCase()) && allowedFileTypes.test(file.mimetype));
};

const uploadStorage = multer.diskStorage({
	destination: tmpDir,
});

const uploadProfilePic = (req, res, next) => {
	multer({
		storage: uploadStorage,
		fileFilter: isImage,
		limits: {
			fields: 10,
			fileSize: 1000000, // 1MB
			files: 1,
		},
	}).single('input-profile-pic')(req, res, (err) => {
		if (err) {
			res.status(500).json({ msg: err });
			return;
		}

		const fileName = req.file.filename;
		fs.move(tmpDir + fileName, userProfilePicsDir + fileName, (moveErr) => {
			if (moveErr) {
				res.status(500).json({ msg: moveErr });
				return console.error(moveErr);
			}

			return next();
		});
	});
};

const uploadCreatorProfilePic = (req, res, next) => {
	multer({
		storage: uploadStorage,
		fileFilter: isImage,
		limits: {
			fields: 10,
			fileSize: 1000000, // 1MB
			files: 1,
		},
	}).single('input-creator-profile-pic')(req, res, (err) => {
		if (err) {
			res.status(500).json({ msg: err });
			return;
		}

		const fileName = req.file.filename;
		fs.move(tmpDir + fileName, `${creatorDir + req.token.id}/${fileName}`, (moveErr) => {
			if (moveErr) {
				res.status(500).json({ msg: moveErr });
				return console.error(moveErr);
			}

			return next();
		});
	});
};

const uploadCreatorCoverPic = (req, res, next) => {
	multer({
		storage: uploadStorage,
		fileFilter: isImage,
		limits: {
			fields: 10,
			fileSize: 5000000, // 5MB
			files: 1,
		},
	}).single('input-creator-cover-pic')(req, res, (err) => {
		if (err) {
			res.status(500).json({ msg: err });
			return;
		}

		const fileName = req.file.filename;
		fs.move(tmpDir + fileName, `${creatorDir + req.token.id}/${fileName}`, (moveErr) => {
			if (moveErr) {
				res.status(500).json({ msg: moveErr });
				return console.error(moveErr);
			}

			return next();
		});
	});
};

const uploadPost = (req, res, next) => {
	const multerUpload = multer({
		storage: uploadStorage,
		limits: {
			fields: 10,
			fileSize: 200000000, // 200MB
			files: 1,
		},
	});

	multerUpload.any()(req, res, (err) => {
		if (err) {
			res.status(500).json({ msg: err });
			return;
		}

		console.log(req.body);
		console.log(req.files);
		/*
		switch(req.body.post_type){
			case "1":
				//image
				if (!isImage(req.file)){
					res.status(400).json("Bad Request: Only image files are allowed");
					return;
				}
				break;
			case "2":
				//video
				if (!isVideo(req.file)){
					res.status(400).json("Bad Request: Only video files are allowed");
				}
				break;
		}
		*/

		const fileName = req.files[0].filename;
		fs.move(tmpDir + fileName, `${creatorDir + req.token.id}/posts/${fileName}`, (moveErr) => {
			if (moveErr) {
				res.status(500).json({ msg: moveErr });
				return console.error(moveErr);
			}
			return next();
		});
	});

	/*
	let multerUpload;
	let inputFieldName;
	switch (req.body.post_type){
		case "1":
			//image
			multerUpload = multer({
				storage: uploadStorage,
				fileFilter: isImage,
				limits: {
					fields: 10,
					fileSize: 50000000, //50MB
					files: 1,
				}
			});
			inputFieldName = 'input-post-image';
			break;
		case "2":
			//video
			multerUpload = multer({
				storage: uploadStorage,
				fileFilter: isVideo,
				limits: {
					fields: 10,
					fileSize: 200000000, //200MB
					files: 1,
				}
			});
			inputFieldName = 'input-post-video';
			break;
		default:
			res.status(400).json("Bad Request");
			return;
	}

	multerUpload.single(inputFieldName)(req, res, err=> {
		if (err) {
			res.status(500).json({msg: err});
			return;
		}

		const fileName = req.file.filename;
		fs.move(tmpDir+fileName, creatorDir + req.token.id + '/posts/' + fileName, err => {
			if (err) {
				res.status(500).json({msg: err});
				return console.error(err);
			}
			return next();
		});
	});
	*/
};

module.exports = {
	uploadProfilePic,
	uploadCreatorProfilePic,
	uploadCreatorCoverPic,
	uploadPost,
};
