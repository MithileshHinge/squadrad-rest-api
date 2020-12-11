const multer = require('multer');

const uploadProfilePic = multer({
    dest: 'images/profile_pics',
    limits: {
        fields: 10,
        fileSize: 1000000,
        files: 1,
    }
});

module.exports = {
    uploadProfilePic
};