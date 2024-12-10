import { cloudinaryInstance } from '../config/coludinary.js';
import Item from '../model/ItemModel.js'
import mongoose from 'mongoose';


 const uploadImageToCloudinary = async (filePath) => {
  try {
    console.log('Starting image upload:', filePath);
    const result = await cloudinaryInstance.uploader.upload(filePath, { folder: 'uploads' });
    console.log('Upload successful:', result);
    
    const publicId = result.public_id;
    console.log('Image Public ID:', publicId);

    return publicId;
  } catch (error) {
    console.error('Error in uploading image to Cloudinary:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};




 const createItem = async (req, res) => {
  try {
    const { name,price, menu, description} = req.body;

    
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }
    const imagePath = req.file.path;
    
    
    const publicId = await uploadImageToCloudinary(imagePath);
    console.log('Upload process finished, public ID:', publicId);

    const newItem = new Item({
      name,
      price,
      menu,
      description,
      image: req.file.path, 
      imagePublicId: publicId 
    });
    console.log('New Item object:', newItem);
    const savedItem = await newItem.save();
    console.log('New Item created:', savedItem);

    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Item creation failed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



const getAllItems = async (req, res) => {
  try {
    const Items = await Item.find();
    console.log('Items',Items)
    res.status(200).json(Items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const updateItem = async (req, res) => {
  try {

    const { ItemId } = req.params;
    const { name, description, price} = req.body;
    const uploadedImage = req.file;
    let Item = await Item.findById(ItemId);
    if (!Item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    Item.name = name;
    Item.description = description;
    Item.price = price;
    Item.menu= menu;

    
    if (uploadedImage) {
      const cloudinaryResult = await uploadImageToCloudinary(uploadedImage.path)
      Item.image=cloudinaryResult.secure_url 
    }

    await Item.save();

    res.json({ message: 'Item details and image updated successfully', Item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


 const deleteItemById = async (req, res) => {
  const { ItemId } = req.params;

  if (!ItemId) {
    return res.status(400).json({ error: 'Item ID is required' });
  }

  try {
  
    const Item = await Item.findById(ItemId);
    if (!Item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    const imagePublicId = Item.imagePublicId;
    if (imagePublicId) {
      const cloudinaryResult = await cloudinaryInstance.uploader.destroy(imagePublicId);
      console.log('Cloudinary deletion result:', cloudinaryResult);
    }
    const result = await Item.deleteOne({ _id: ItemId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.status(200).json({ message: 'Item and image deleted successfully' });
  } catch (error) {
    console.error('Error deleting Item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const getItemById=async(req,res)=>{
  const {Id}=req.params;
    try {
    
        const Item = await Item.findById(Id);
        if (!Item) {
            return res.status(404).send('Item not found');
        }
        res.status(200).send(Item);
    } catch (err) {
        res.status(500).send(err);
    }
}



 const getItemsByCategoryOrPrice = async (req, res) => {
  try {
    const category = req.query.category;
    const price = req.query.price;

    let query = {};

    if (category && !price) {
      query.category = category;
    }

    if (!category && price) {
      query.price = price;
    }

    const Items = await Item.find(query);

    if (!Items || Items.length === 0) {
      return res.status(404).json({ error: 'Items not found' });
    }

    res.json(Items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const ItemController={createItem,getItemById,getAllItems,updateItem,deleteItemById,getItemsByCategoryOrPrice}
export default ItemController;
