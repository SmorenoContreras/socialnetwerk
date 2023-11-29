const mongoose = require('mongoose');
Schema = mongoose.Schema;

const likeSchema = Schema({
    likedBy: {
        type: Schema.ObjectId,
        ref: "users",
        index: true
    },
    thoughtId: {
        type: Schema.ObjectId,
        ref: "thoughts",
        index: true  
    },
    reactionType: {
        type: String,
        enum: ["like", "heart", "laugh", "angry", "sad"],
        default: "like"
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
const model = mongoose.model("likes", likeSchema);
module.exports = model