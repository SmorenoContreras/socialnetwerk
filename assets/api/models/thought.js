const mongoose = require('mongoose');
Schema = mongoose.Schema;

const thoughtSchema = Schema({
    userId: {
        type: Schema.ObjectId,
        ref: "users",
        index: true
    },
    imageUrl: {
        type: String
    },
    description: {
        type: String
    },
    active: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true
    }
)
const model = mongoose.model("thoughts", thoughtSchema);
module.exports = model