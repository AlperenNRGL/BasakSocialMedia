
const Joi = require('joi');
const { mongoose, Schema } = require('mongoose');
const date = require('date-and-time');


const altcomment = Schema({
    user: { type: Schema.Types.ObjectId, ref: "user" },
    text: String,
    date: {
        type: Date,
        default: Date.now,
    },
})

const comment = Schema({
    user: { type: Schema.Types.ObjectId, ref: "user" },
    date: {
        type: Date,
        default: Date.now,
    },
    text: String,
    altcomment: [altcomment],
});


comment.methods.getDate = function (){
    return date.format(this.date, 'HH:mm  DD/MM/YYYY ')
}
altcomment.methods.getDate = function (){
    return date.format(this.date, 'HH:mm  DD/MM/YYYY ')
}


const post = Schema({
    user: { type: Schema.Types.ObjectId, ref: "user" },
    text: String,
    img:
    {
        data: Buffer,
        contentType: String
    },
     date: {
        type: Date,
        default: Date.now,
    },
    like: [{
        user: { type: Schema.Types.ObjectId, ref: "user" },
        date: {
            type: Date,
            default: Date.now,
        },
    }],
    comments: [comment]
})

post.methods.getDate = function (){
    return date.format(this.date, 'HH:mm  DD/MM/YYYY ')
}



const postValidate = Joi.object({
    user: Joi.string().required(),
    text: Joi.string(),
    image: Joi.string(),
})

const Post = mongoose.model("post", post);
// const Comment = mongoose.model("comment", );

module.exports = { Post, postValidate };
