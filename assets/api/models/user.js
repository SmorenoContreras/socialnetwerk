const mongoose = require('mongoose');
Schema = mongoose.Schema;

const userSchema = Schema({
    email: {
        type: String,
        unique: true,
        required: "addOn Name is required"
    },
    fullName: {
        type: String,
        unique: true,
        required: "Unique AddOn usage slug is required"
    },
    password: {
        type: String,
        trim: true
    },
    friends: {
        type: [
            {
                type: Schema.ObjectId
            }
        ]
    }
},
    {
        timestamps: true
    }
)
const model = mongoose.model("users", userSchema);
module.exports = model