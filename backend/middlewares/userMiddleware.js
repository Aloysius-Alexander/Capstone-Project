import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();

function authenticateUser (req, res, next) {



    const token = req.cookies.token;

    console.log(token);

    if (!token) {
        return res.status(401).send('No token provided');
     }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

    
        console.log(err)

     
        if (err) {

            return res.status(401).send({ message: 'User verification error' });
        }

        req.user = user;
    
        console.log(req.user);
    
        next();
   
    });
  
}
 
export default authenticateUser;
