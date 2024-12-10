import  mongoose, { Mongoose } from  'mongoose';
const MenuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      
    },
    description:
     { type: String },
    items:[
        {type:mongoose.Schema.Types.ObjectId, ref:'Item'}
    ],
    image:{
      type:String,

    },
    createdBy: {
      type:String,default:"admin"
    },
  },
  { timestamps: true }
);

const Menu = mongoose.model("Menu", MenuSchema);

export default Menu