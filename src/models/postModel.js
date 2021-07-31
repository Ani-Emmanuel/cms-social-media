const { Schema, model } = require('mongoose');

const schema = new Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		image: { type: String }
	},
	{ timestamps: true }
);

const PostModel = model('Post', schema);
module.exports = PostModel;
