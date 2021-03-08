const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

exports.uploadAvatar = async (name, path) => {
    const response  = await cloudinary.uploader.upload(path, {
        public_id: `Foodies/users/${name}`,
        overwrite: true
    })
    return response.secure_url
}
