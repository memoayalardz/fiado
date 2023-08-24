const clientsController = {}
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const Client = require('../models/client.model');

clientsController.getClientDataAccount = (req,res)=>{
    const email = req.params.email;
    /* Verificar si existe el usuario: si existe devuelve la información del resultado, si no, lo crea*/
    findAccount(email)
    .then(async(data)=>{
        if(await data.success){
            
            res.send({
                isNew:false,
                data,
                token:jwt.sign(data,process.env.JWT_SECRET)
            });
            return;
        }       
        /* Creación de la CLABE */
        createClabe()
        .then(async (dataClabe)=>{
            if(await !dataClabe.success){
                res.status(500).send(
                    {
                        dataClabe,
                        token:jwt.sign(dataClabe,process.env.JWT_SECRET)
                    });
                return; 
            }
            const client = new Client({
                CLABE:dataClabe.CLABE,
                email:email,
                amount:1000
            });
            /* Creación del usuario */
            client
            .save(client)
            .then(async data => {
                let dataResponse = await data;
                res.status(201).send({
                    isNew:true,
                     dataResponse,
                     token:jwt.sign(dataResponse.toJSON(),process.env.JWT_SECRET)
                });
            })
            .catch(err => {
                res.status(500).send({
                    success:false,
                    test:'error location',
                    message:err.message || "Some error ocurred while save data",
                    token:jwt.sign(err.message,process.env.JWT_SECRET)
                })
            });
        })
    });

   function findAccount(email){
        const dataClient = new Promise((resolve,reject) => {
            Client.exists({email:email},async (err,value)=>{
                if (err){
                    reject({
                        success:false,
                        message:err
                    });
                }
                if(!value ){
                    resolve({
                        success:false,
                        message:'Account not found'
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
    function  createClabe (){
        const clabeGenerated = new Promise((resolve,reject) => {
            const min = 10000000000000000;
            const max = 99999999999999999;
            let valueRandom = Math.random() * (max - min) + min;
            valueRandom = valueRandom.toString().substring(0,13).replace('.','');
            Client.exists({CLABE:valueRandom},  (err, resValue) => {
                if (err){
                    reject({
                        success:false,
                        message:err
                    });
                }
                if(resValue){
                    resolve({
                        success:false,
                        message:'User already created with this CLABE'
                    });
                }
                    resolve({
                        success:true,
                        CLABE:valueRandom
                    });

            });
        }).catch((err)=>{
            reject({
                success:false,
                message:err.message
            });
        });
        return clabeGenerated;
    }
}

clientsController.getAllClients = (req,res)=>{
    
  function getData(){
    const dataClients = new Promise((resolve,reject) => {
        const rows = 0;
        Client.find({})
        .count(
            {},(err,count) =>{
                if(count > 0){
                    Client.find({})
                    .then(clients => {
                        resolve({
                                success:true,
                                rows:count, 
                                data:  clients
                                 
                            })
                    });
                }else{
                    reject({
                        success:false,
                        message:'Records are not found'
                    });
                }
            }
        );
         
    });
    return dataClients;
  }

    getData()
    .then(async (data)=>{
        if(await data.success){
            res.send({
                data
            });
            return;
        }
    })
        
        
    }


module.exports = clientsController;