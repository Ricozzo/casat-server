const {Schema, model} = require('mongoose');

const detailSchema = new Schema({
    title: String, 
    description: String,
    information: String,
    event: {type: Schema.Types.ObjectId, ref:'Event'}
})

module.exports = model('Detail', detailSchema);