const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 

  
  
const BookSchema = new Schema({    
    user_id: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true, 
    }, 
    isbn: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
    },
    author: {
        type: String
    },
    coverImage: {
        type: String
    }
}); 

BookSchema.index({user_id: 1, isbn: 1}, { unique: true }) // ensure that the combination of user_id and isbn is unique.


module.exports = mongoose.model("Book", BookSchema); 