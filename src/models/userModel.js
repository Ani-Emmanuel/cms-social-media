const { Schema, model } = require('mongoose');

const schema = new Schema(
	{
		name: { type: String, required: true },
		email: {
			type: String,
			required: true,
			validate: {
				validator: function (value) {
					return;
					/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
						value
					);
				},
				message: (props) => `${props.value} is not a valid email`
			}
		},
		password: { type: String, required: true },
		image: { type: String }
	},
	{ timestamps: true }
);

const UserModel = model('User', schema);
module.exports = UserModel;
