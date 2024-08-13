const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 

  
  
const BookshelfSchema = new Schema({    
    user_id: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true, 
        unique: true,
    }, 
    isbn_list: {
        type: [{isbn: String, 
                year: String
              }],
        unique: true
    }, 
}); 

BookshelfSchema.index({user_id: 1, isbn: 1}, { unique: true }) // ensure that the combination of user_id and isbn is unique.

module.exports = mongoose.model("Bookshelf", BookshelfSchema); 