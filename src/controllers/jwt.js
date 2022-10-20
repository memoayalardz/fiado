const jwtController = {}
const jwt = require('jsonwebtoken');

jwtController.generateJWT = (req,res)=>{

  let jwtSecretKey = process.env.JWT_SECRET;
  let data = {
      time: Date(),
      userId: 1000,
      type:'admin'
  }

  const token = jwt.sign(data, jwtSecretKey);

  res.send(token);
  
}

jwtController.verifyJWT = (req,res)=>{
  let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
  let jwtSecretKey = process.env.JWT_SECRET;

  try {
      const token = req.header(tokenHeaderKey);

      const verified = jwt.verify(token, jwtSecretKey);
      if(verified){
          return res.send("Successfully Verified");
      }else{
          return res.status(401).send(error);
      }
  } catch (error) {
      return res.status(401).send(error);
  }
}
  
module.exports = jwtController;