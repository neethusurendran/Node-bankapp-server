const db = require('./db')
users = {
  1000: { accno: 1000, username: "Aahil", password: "userone", balance: 5000, transaction: [] },
  1001: { accno: 1001, username: "Bahit", password: "usertwo", balance: 7000, transaction: [] },
  1002: { accno: 1002, username: "Cahit", password: "userthree", balance: 6000, transaction: [] },
  1003: { accno: 1003, username: "Dahit", password: "userfour", balance: 4000, transaction: [] }
}

const register = (accno, username, password) => {

  return db.User.findOne({ accno })
    .then(user => {
      console.log(user)
      if (user) {
        return {
          statusCode: 422,
          status: false,
          message: "User already exist... Please Log In"
        }
      }
      else {
        const newUser = new db.User({
          accno,
          username,
          password,
          balance: 0,
          transaction: []
        })
        newUser.save()
        return {
          statusCode: 200,
          status: true,
          message: "Sucessfully Registered"
        }
      }
    })
}

const login = (req, acno, pswd) => {

  return db.User.findOne({
    accno: acno,
    password: pswd
  })
    .then(user => {
      if (user) {
        req.session.currentAcc = user.accno
        return {
          statusCode: 200,
          status: true,
          message: "sucessfully login"
        }
      }
      return {
        statusCode: 422,
        status: false,
        message: "invalid Account details"
      }
    })
}
const deposit= (acno, pswd, amount) => {

  var amt = parseInt(amount)
  return db.User.findOne({
    accno:acno,
    password:pswd
  })
  .then(user=>{
    if(!user){
      return {
        statusCode: 422,
        status: false,
        message: "invalid user"
      }
    }
    user.balance=user.balance + amt
    user.transaction.push({
      amount:amt,
      type:"CREDIT"
    })
    user.save()
    return {
      statusCode: 200,
      status: true,
      message: amt + "succesfully deposited and new balance is: " + user.balance
    }
  })
}
  

const withdraw = (req,acno, pswd, amount) => {
console.log(acno);
  var amt = parseInt(amount)
  return db.User.findOne({
    accno:acno,
    password:pswd
  })
  .then(user=>{
    //console.log(user);
    if(!user){
      return {
        statusCode: 422,
        status: false,
        message: "invalid user"
      }
    }
    if(req.session.currentAcc != user.accno){
      return{
        statusCode: 422,
        status: false,
        message: "operation Denied"
      }
    }
    if(user.balance < amt){
      return {
        statusCode: 422,
        status: false,
        message: "insufficient balance"
      }
    }
    user.balance=user.balance - amt
    user.transaction.push({
      amount:amt,
     type:"DEBIT"
    })
    user.save()
    return {
      statusCode: 200,
      status: true,
      message: amt + "succesfully debited and new balance is: " + user.balance
    }
  })
}
  
const getTransaction = (req) => {
  return db.User.findOne({
    accno:req.session.currentAcc
  }).then(user=>{
    if(user){
      return {
        statusCode: 200,
        status: true,
        transaction: user.transaction
      }
    }
  else{
    return {
      statusCode: 422,
      status: false,
      message:"invalid operation"
  }
  }
  })
  
}
module.exports = {
  register,
  login,
  deposit,
  withdraw,
  getTransaction
}