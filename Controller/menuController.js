import Menu from '../model/menumodel.js'


const CreateMenu = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    res.send(req.body)
    console.log('Uploaded file:', req.file); 

    const { name } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    // Create and save menu
    const menu = new Menu({ name, image });
    const savedMenu = await menu.save();

    // Respond with saved menu
    res.status(201).json(savedMenu);
  } catch (err) {
    console.error('Error creating menu:', err);
    res.status(400).send(err);
  }
};

    
 const getAllmenu=async(req,res)=>{
  try {
      const menus = await Menu.find({});
      if (!menus) {
        return res.status(404).json({ error: 'menus are not found' });
      }
      return res.status(200).json(menus);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };




  
const updatemenu=async(req,res)=>{
    const { id } = req.params;
    const { name, slug } = req.body;
  
    try {
      const menu= await Menu.findByIdAndUpdate(
        id,
        { name, slug },
        { new: true, runValidators: true }
      );
  
      if (!menu) {
        return res.status(404).send({ message: 'Menunot found' });
      }
  
      res.json(menu);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
  
  
  const deletemenuById=async(req,res)=>{
    const { id } = req.params;
  
    try {
      const menu= await Menu.findByIdAndDelete(id);
  
      if (!menu) {
        return res.status(404).send({ message: 'Menunot found' });
      }
  
      res.send({ message: 'Menudeleted successfully' });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  
  }
  
  

  const menuController={CreateMenu,getAllmenu,updatemenu,deletemenuById}
  export default menuController