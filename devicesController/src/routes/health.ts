import {Router} from 'express';

const healthRoutes = Router();

healthRoutes
    .route('/health')
        .get(async (req,res)=>{

            res.send();
        })

export default healthRoutes