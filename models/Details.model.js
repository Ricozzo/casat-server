const {Schema, model} = require('mongoose');

const detailSchema = new Schema({
    title: String, 
    description: String,
    events: {type: Schema.Types.ObjectId, ref:'Event'}
})

module.exports = model('Detail', detailSchema);