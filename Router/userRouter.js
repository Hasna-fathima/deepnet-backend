import express from 'express';
import {Signin,Signup} from '../Controller/userController.js';
import menuController from '../Controller/menuController.js';
import ItemController from '../Controller/itemController.js';



const userRouter = express.Router();

userRouter.post('/signup', Signup);
userRouter.post('/signin', Signin);



          //--------menu---------//

 userRouter.get('/menu/:Id',menuController.deletemenuById);
 userRouter.get('/menus',menuController.getAllmenu);
 

         //--------Item-----------//

userRouter.get("/item",ItemController.getAllItems);




export default userRouter