const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Income = require('../models/income');
const Expense = require('../models/expense');
const { now } = require('mongoose');
const User = require('../models/user');
// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('login'));



// Dashboard
router.get('/dashboard', ensureAuthenticated, async(req, res) =>
  { 
    user_id=req.session.passport.user._id;
    var expense = await Expense.find({userID:user_id}).exec()
  
    var income = await Income.find({userID:user_id}).exec();
            console.log("Expense",expense)
            console.log("Income",income)

            var totalIncome=0;
            income.forEach((item)=>{
              totalIncome=totalIncome+item.number;
            });
            var totalExpense=0;
            expense.forEach((item)=>{
              totalExpense=totalExpense+item.number;
            });
            var salary=0;
            var rental=0;
            var trading=0;
            var business=0;
            var otherSalary=0;
            income.forEach((item)=>{
              if(item.typeOfIncome=="salary"){
                salary=salary+item.number;
              }
              if(item.typeOfIncome=="business"){
                business=business+item.number;
              }
              if(item.typeOfIncome=="trading"){
                trading=trading+item.number;
              }
              if(item.typeOfIncome=="rental"){
                rental=rental+item.number;
              }
              if(item.typeOfIncome=="others"){
                otherSalary=otherSalary+item.number;
              }
            });
            if(salary!=0){ salary=salary/totalIncome;};
            if(rental!=0){ rental=rental/totalIncome;};
            if(trading!=0){ trading=trading/totalIncome;};
            if(business!=0){ business=business/totalIncome;};
            if(otherSalary!=0){ otherSalary=otherSalary/totalIncome;};
            var incomeEmpty=1;
            if(salary==0 && rental==0 && trading==0 && business==0 && otherSalary==0){
              incomeEmpty=0;
              console.log('i am  Income empty 0',incomeEmpty)
            }
           var incomeDetails={
            salary:salary,
            rental:rental,
            trading:trading,
            business:business,
            otherSalary:otherSalary
           }
           console.log(incomeDetails)
            var rent=0;
            var grocery=0;
            var clothing=0;
            var junkFood=0;
            var others=0;
            expense.forEach((item)=>{
              if(item.typeOfExpense=="rent"){
                rent=rent+item.number;
                console.log(rent);
              }
              if(item.typeOfExpense=="grocery"){
                grocery=grocery+item.number;
                console.log(grocery);
              }
              if(item.typeOfExpense=="clothing"){
                clothing=clothing+item.number;
                console.log(clothing);
              }
              if(item.typeOfExpense=="junk"){
                junkFood=junkFood+item.number;
                console.log(junkFood);
              }
              if(item.typeOfExpense=="others"){
                others=others+item.number;
                console.log(others);
              }
            });
            if(rent!=0){ rent=rent/totalExpense;};
            if(grocery!=0){ grocery=grocery/totalExpense;};
            if(clothing!=0){ clothing=clothing/totalExpense;};
            if(junkFood!=0){ junkFood=junkFood/totalExpense;};
            if(others!=0){ others=others/totalExpense;};
           
          
            var expenseEmpty=1;
            if(rent==0 && grocery==0 && clothing==0 && junkFood==0 && others==0){
              expenseEmpty=0;
              console.log('i am empty 0',expenseEmpty)
            }
           var expenseDetails={
            rent:rent,
            grocery:grocery,
            clothing:clothing,
            junkFood:junkFood,
            others:others
           }
           console.log(expenseDetails)

            var savings=totalIncome-totalExpense;
         
            res.render('dashboard', {
            user : req.user,
            Expense: expense,
            Income:income,
            totalIncome:totalIncome,
            totalExpense:totalExpense,
            savings:savings,
            incomeDetails:incomeDetails,
            expenseDetails:expenseDetails,
            expenseEmpty:expenseEmpty,
            incomeEmpty:incomeEmpty
        });
    console.log("dash-",req.user)}
);




router.get('/addIncome', (req, res) =>
{console.log(req.body);  
res.render('addIncome',{
name:req.session.passport.user.name,
email:req.session.passport.user.email

}
)}
);

router.post('/addIncome', (req, res) =>
  {
    
    console.log("form data -",req.body,);
    console.log("user -",req.user);
    var {typeOfIncome, date, number, description } = req.body;
    var userID=req.session.passport.user._id;
    var newIncome = new Income({
      userID,
     typeOfIncome,
      date,
      number,
      description
    });
    newIncome.save((err,doc)=>{
      if(!err){
        req.flash('sucess')
      }
      else{
        console.log('error0',err)
      }
    });
    console.log(newIncome,"in");
    res.redirect('/dashboard')
  }
);

router.post('/addExpense', (req, res) =>
  {
    
    console.log("form data -",req.body,);
    console.log("user -",req.user);
    var { typeOfExpense, date, number, description } = req.body;
    var userID=req.session.passport.user._id;
    var newExpense= new Expense({
      userID,
      typeOfExpense,
      date,
      number,
      description
    });
    newExpense.save((err,doc)=>{
      if(!err){
        req.flash('sucess')
      }
      else{
        console.log('error',err)
      }
    });
    console.log(newExpense,"in");
    res.redirect('/dashboard')
  }
);
router.get('/addExpense', (req, res) =>{
  console.log(req.session);
  res.render('addExpense',{
    name:req.session.passport.user.name,
    email:req.session.passport.user.email
    
    })}
);
router.get('/admin', async(req, res) =>{
  console.log(req.session,"session debug here ------------");
  var allUsers = await User.find({role:0}).exec() ;
  var count=0;
  allUsers.forEach((item)=>{
   count++;
  });
  res.render('adminPanel',{
    name:req.session.passport.user.name,
    email:req.session.passport.user.email,
    user:allUsers,
    userCount:count
    
    })}
);


router.post('/delete/:expenseID', (req,res) => {
  
  Expense.deleteOne({ _id:req.params.expenseID}, function(err, data) {
    if(!err){
      console.log(data)
    }
    else{
      console.log(err)
    }
    
  });
  res.redirect('/dashboard')
})
router.post('/deleteIncome/:incomeID', (req,res) => {
  
  Income.deleteOne({ _id:req.params.incomeID}, function(err, data) {
    if(!err){
      console.log(data)
    }
    else{
      console.log(err)
    }
    
  });
  res.redirect('/dashboard')
})
router.post('/deleteUser/:userID', async (req,res) => {
  var allUsers = await User.find({}).exec() ;
  User.deleteOne({ _id:req.params.userID}, function(err, data) {
    if(!err){
      console.log(data)
    }
    else{
      console.log(err)
    }
    
  });

  res.redirect('/admin')
})

router.get('/edit-income/:incomeID', (req,res) => {
  console.log(req.params.incomeID);
  Income.findById(req.params.incomeID, function(err, data){
    if(!err){
      console.log(data)
    }
    else{
      console.log(err)
    }
    var date=data.date;
    const day =('0' + date.getDate()).slice(-2);
    const month =('0' + (date.getMonth()+1)).slice(-2);
    const year = date.getFullYear();  
   
    date=year+"-"+month+"-"+day;
    console.log(date);

    
    return res.render('editIncome', {incomeDetail:data,date:date})
  })
  
})

router.get('/edit-expense/:expenseID', (req,res) => {
  console.log(req.params.expenseID);
  Expense.findById(req.params.expenseID, function(err, data){
    if(!err){
      console.log(data)
    }
    else{
      console.log(err)
    }
    var date=data.date;
    const day =('0' + date.getDate()).slice(-2);
    const month =('0' + (date.getMonth()+1)).slice(-2);
    const year = date.getFullYear();  
   
    date=year+"-"+month+"-"+day;

    
    return res.render('editExpense', {expenseDetail:data,date:date})
  })
  
})
router.post('/edit-income/:incomeID' , (req,res)=>{
  Income.updateOne({"_id":req.params.incomeID},req.body,function (err,data){
    if(!err){
      console.log(data)
    }
    else{
      console.log(err)
    }
  });

  res.redirect('/dashboard');
})
router.post('/edit-expense/:expenseID' , (req,res)=>{
  Expense.updateOne({"_id":req.params.expenseID},req.body,function (err,data){
    if(!err){
      console.log(data)
    }
    else{
      console.log(err)
    }
  });

  res.redirect('/dashboard');
})
module.exports = router;
