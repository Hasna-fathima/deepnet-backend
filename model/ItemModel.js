import  mongoose, { Mongoose } from  'mongoose';
const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: { type: String,
      required:true },
    menu:
        {type:mongoose.Schema.Types.ObjectId, ref:'menu'},
     image:{
          type:String,
        },
        imagePublicId:{
          type:String,
          require:true
      },
        price:{
          type:String,
          required:true
        },
    createdBy: {
      type:String,default:"admin"
    },
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);

export default Item