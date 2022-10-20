const express = require("express");
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const clients = require('./src/routes/clients.routes');
const transactions = require('./src/routes/transactions.routes');
const tokens = require('./src/routes/tokens.routes');
const jwt = require('jsonwebtoken');
mongoose.connect(process.env.DB_CONNECTION);
app.use(express.json());
app.use(express.urlencoded({extended:true}));
//Middleware
function jwtVerify(req,res,next){

    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
  let jwtSecretKey = process.env.JWT_SECRET;
      const token = req.header(tokenHeaderKey);

      try {
        const token = req.header(tokenHeaderKey);
  
        const verified = jwt.verify(token, jwtSecretKey);
        if(verified){
            console.log("Successfully Verified");
        }else{
            // Access Denied
            return res.status(401).send({
                error:error,
                message:'Access Denied'
            });
        }
    } catch (error) {
        // Access Denied
        return res.status(401).send({
            error:error,
            message:'Access Denied'
        });
    }

    next();
}
/* 
    Para hacer las peticiones se necesita generar un token: /api/tokens/generateToken
    -Agregar en el header el token, control_token_access:"token"

    Para validar el token: /api/tokens/validateToken
    -Agregar en el header el token, control_token_access:"token"
*/
app.use("/api/tokens",tokens);
app.use(jwtVerify);
/* 
    Para verificar si existe y/o consultar un usuario se hace por un email /account/:email 
    -Agregar en el header el token, control_token_access:"token"
*/
app.use("/api/clients",clients);

/* 
    Para realizar una transacción se necesita una CLABE de origen, una CLABE destino y el monto  /api/transactions
    -Agregar en el header el token, control_token_access:"token"
    -Agregar al body
        {
            "clabe_origin":2010960006940,
            "clabe_destination":1666232956490, 
            "amount":1000
        }
*/
app.use("/api/transactions",transactions);

app.get("/api/",(req,res) => {
    return console.log("Welcome");
});

module.exports = app;