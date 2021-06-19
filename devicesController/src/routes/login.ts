import {Router} from 'express';
import {LoginController} from '../controllers';

const loginRoutes = Router();

loginRoutes
    .route('/login')
        .post(async (req,res)=>{

            const {username,password} = req.body;

            await LoginController.login(username,password)
                .then(response=>{
                    res.send(response);
                })
                .catch(err=>{
                    console.log(err);
                    res.status(500).send();
                })

            res.status(400).send();
        })

export default loginRoutes