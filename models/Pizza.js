const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const PizzaSchema = new Schema({
    pizzaName: {
        type: String,
        //or put required: true if you don't want a custom message
        required: 'You need to provide a pizza name!',
        trim: true
    },
    createdBy: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
        type: String,
        required: true,
        //the enum option stands for enumerable, a popular term in web development that refers to a set of data that can be iterated over,
        //much like using the for...in loop to iterate through an object.
        enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large'],
        default: 'Large'
    },
    toppings: [],
    comments: [
        {
            type: Schema.Types.ObjectId,
            //The ref property is especially important because it tells the Pizza model which documents to search to find the right comments.
            ref: 'Comment'
        }
    ]
},
{
    toJSON: {
    virtuals: true,
    getters: true
    },
    //we set id to false because this is a virtual that Mongoose returns, and we don’t need it.
    id: false
}
);

// get total count of comments and replies on retrieval
//mongoose uses virtuals instead of helpers
PizzaSchema.virtual('commentCount').get(function() {
    return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
  });

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;