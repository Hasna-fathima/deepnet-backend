import express from 'express';
import {Signin,Signup,Signout} from '../Controller/adminController.js';
import {upload} from '../middleware/upload.js';
import menuController from '../Controller/menuController.js';
import ItemController from '../Controller/itemController.js';
import adminController from '../Controller/adminController.js';



const adminRouter = express.Router();

adminRouter.post('/signup', Signup);
adminRouter.post('/signin', Signin);
adminRouter.post('/signout',Signout);


          //--------menu---------//
 adminRouter.post('/create-menu', upload.single('file'),menuController.CreateMenu);
 adminRouter.get('/menu/:Id',menuController.deletemenuById);
 adminRouter.get('/menus',menuController.getAllmenu);
 adminRouter.put('/menu/menuId',upload.single('image'),menuController.updatemenu)
 adminRouter.delete('/menudelete/:Id',menuController.deletemenuById);

         //--------Item-----------//

adminRouter.post('/create-item',upload.single('image'),ItemController.createItem);
adminRouter.get("/item",ItemController.getAllItems);
adminRouter.get('/item/:Id',ItemController.deleteItemById);
adminRouter.put('/item/:Id',ItemController.updateItem);
adminRouter.delete("/item/:Id",ItemController.deleteItemById)
     



              //--------user manage----------------//

adminRouter.get('/getalluser',adminController.getAllusers);
adminRouter.get('/getuser/:id',adminController.getuserbyid);
adminRouter.post('/blockuser/:id',adminController.blockedusers);
adminRouter.post('/unblockusers/:id',adminController.unblockedusers)

export default adminRouter