const transactionController = {}
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const Transaction = require('../models/transaction.model');
const Client = require('../models/client.model');

transactionController.makeTransaction = (req,res)=>{
    checkSchedule()
    .then(async (validation)=>{
        if(!await validation.success){
            res.status(400).send({
                validation,
                token:jwt.sign(validation,process.env.JWT_SECRET)
            });
            return;
        }else{
        const {clabe_origin, clabe_destination, amount} = req.body;
        let clientOrigin,clientDestination = {};

            findAccount(clabe_origin)
            .then(async(dataOrigin)=>{
                clientOrigin = await dataOrigin.data;
                if(!await dataOrigin.success){
                    res.send({
                        dataOrigin,
                        token:jwt.sign(dataOrigin,process.env.JWT_SECRET)
                    });

                    return;
                }
                findAccount(clabe_destination)
                .then(async(dataDestination)=>{
                    if(!await dataDestination.success){
                        res.send({
                            dataDestination,
                            token:jwt.sign(dataDestination,process.env.JWT_SECRET)
                        });
                        return;
                    }
                    clientDestination = await dataDestination.data;
                    if(parseFloat(amount) > parseFloat(clientOrigin.amount)){
                        res.status(400).send({
                            success:false,
                            message:'The amount exceeds the limit of the origin account',
                            token:jwt.sign( {success:false},process.env.JWT_SECRET)
                        });
                        return;
                    }
                    const newAmountDestination = parseFloat(clientDestination.amount) + parseFloat(amount);
                    const newAmountOrigin = parseFloat(clientOrigin.amount) - parseFloat(amount);
                    updateAmountAccount(clientOrigin._id,newAmountOrigin)
                    .then(async (updOrigin) => {
                        if(await updOrigin.success){
                            updateAmountAccount(clientDestination._id,newAmountDestination)
                            .then(async (updDestination) => {
                                if(await updDestination.success){
                                addTransaction(clabe_destination,clabe_origin,newAmountDestination,newAmountOrigin,clientDestination.amount,clientOrigin.amount,amount)
                                .then(async (resultTransaction)=>{
                                    if(await resultTransaction.success){
                                        res.status(201).send({
                                            resultTransaction,
                                            token:jwt.sign(resultTransaction,process.env.JWT_SECRET)
                                        });
                                    }else{
                                        res.status(500).send({
                                            resultTransaction, 
                                            token:jwt.sign(resultTransaction,process.env.JWT_SECRET)
                                        });
                                        return;
                                    }
                                });
                                }
                            });
                        }
                    });
                });
            });
        }
    });
    function findAccount(CLABE){
        const dataClient = new Promise((resolve,reject) => {
            Client.exists({CLABE:CLABE},async (err,value)=>{
                if (err){
                    reject({
                        success:false,
                        message:err
                    });
                }
                if(!value ){
                    resolve({
                        success:false,
                        message:'Account not found by CLABE'
                    });
                }else{
                const {_id} = await value;
                Client.findOne({'_id':_id})
                .then( data => {
                    resolve({
                        success:true,
                        data:data
                    });    
                });
                }
            });
        });
        return dataClient;
    }

    function checkSchedule(){
        let available = new Promise((resolve,reject) => {
            const daysOfWeek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
            let timeZone = "America/Mexico_City";
            const currentDate = new Date().toLocaleString("en-US",{timeZone:timeZone});
            const dayToday = daysOfWeek[new Date(currentDate).getDay()];
            const segmentDate = currentDate.replace(',','').split(' ');
            const minTimeValidate = segmentDate[0] +', '+ '08:00:00 AM';
            const maxTimeValidate = segmentDate[0] +', '+'06:00:00 PM';
            if( new Date(currentDate) >= new Date(minTimeValidate) && new Date(currentDate) <= new Date(maxTimeValidate) && dayToday != 'Sunday' && dayToday != 'Saturday'  ){
               resolve({
                success:true,
                currentDate:currentDate
            });
            }else{
                resolve({
                    success:false,
                    message:'You can only make a transaction from Monday to Friday, and from 8:00 AM to 6:00 PM',
                    currentDate: dayToday + ' ' + currentDate
                });
            }      
            reject('Some error ocurrs');
            
        })
        return available;
    }    

    function updateAmountAccount(_id,newAmount){
        const dataClient = new Promise((resolve,reject) => {
            Client.findByIdAndUpdate(_id,{amount:newAmount,updated_at:new Date().toUTCString()}, async (err,resultUpdate)=>{
                
                if (err){
                    reject({
                        success:false,
                        message:err.message 
                    });
                }
                if (await !resultUpdate){
                    resolve({
                        success:false,
                        message:"Some error ocurred updating amount account"
                    });
                }
                resolve({
                    success:true,
                    data:resultUpdate
                });
            });

        });
        return dataClient;
    }

    function addTransaction(clabeDestination,clabeOrigin,newAmountDestination,newAmountOrigin,lastAmountDestination,lastAmountOrigin,amount){
        const dataTransaction = new Promise((resolve,reject) => {
            const transaction = new Transaction({
                clabeDestination:clabeDestination,
                clabeOrigin:clabeOrigin,
                newAmountDestination:newAmountDestination,
                newAmountOrigin:newAmountOrigin,
                lastAmountDestination:lastAmountDestination,
                lastAmountOrigin:lastAmountOrigin,
                amount:amount
            });
            transaction
            .save(transaction)
            .then( async data => {
                resolve({
                    success:true,
                    data: await data
                });
            })
            .catch(err => {
                reject({
                    success:false,
                    message:err.message
                });
            });
        });
    return dataTransaction;
    }
   
}
module.exports = transactionController;