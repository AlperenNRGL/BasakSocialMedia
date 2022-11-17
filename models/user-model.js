const { mongoose, Schema} = require("mongoose");
const joi = require("joi");


const message = Schema({
    user : {type: Schema.Types.ObjectId, ref: "user"},
    messages :{type: Schema.Types.ObjectId, ref: "message"}
})


const userSchema = Schema({

    firstName : {required : true,type : String,},
    lastName : {required : true,type : String,},
    username : {required : true,type : String,},
    email : {required : true,type : String,unique : true,},
    password : {type : String,required : true,},
    // cinsiyet : {type : Boolean,required : true,},
    dataOfBirth : {type : Date},
    city : {type : String,},
    country : {type : String,},
    token : {type : String,},
    profilImageData : {
        data: {
            type : Buffer,
            // default : fs.readFileSync(path.join(__dirname + '/../doc/uploads/icons8-person-64.png')),  
        },
        contentType: {
            type : String,
            default : "image/png"    
        
        }
    },
    profilImage : {
        type : String,
        default : "icons8-person-64.png"
    },
    coverImage : {
        data: {
            type : Buffer,
            default : null,
        
        },
        contentType: String,
    },
    friends : [{type : Schema.Types.ObjectId, ref : "user"}],
    messages : [message],
    biyografi : {type : String, default : null},
})


const registerValidate = joi.object({
    firstName :joi.string().required(),
    lastName : joi.string().required(),
    username : joi.string().required().min(5).max(30)
    .messages({
    "string.min" : "Username en az 5 karakter olması gerekmektedir",
    "string.max" : "Username en fazla 30 karakter olabilir"
}),
    email : joi.string().required().email().messages({"string.email" : "Lütfen geçerli bir mail adresi giriniz."}),
    password : joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).messages({"string.pattern.base":"Parola için geçerli karakterler giriniz "}),
    // cinsiyet : joi.boolean().required(),
})


const User = mongoose.model("user",userSchema);


module.exports = { User, registerValidate}