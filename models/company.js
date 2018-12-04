var mongoose = require('mongoose');
var schema = require('mongoose').Schema;

var companySchema = new schema({
    name: String,
    logo: String
})

module.exports = mongoose.model('Company', companySchema);

