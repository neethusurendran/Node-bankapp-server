const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/bankAppBOne',{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
const User = mongoose.model('User',{
    accno:Number,
    username:String,
    password:String,
    balance:Number,
    transaction:[]
}) 

module.exports={
    User
}