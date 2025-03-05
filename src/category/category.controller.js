import Category from "../category/category.model.js";
import Product from "../product/product.model.js";
import mongoose from "mongoose";

export const createCategory = async (req, res) => {
    try{
        const { usuario } = req;
        const { name, description, typeCategory } = req.body;

        const category = new Category({name, description, typeCategory});
        await category.save();

        return res.status(200).json({
            sucess: true,
            msg: `Categorian creada con exito`
        })
    }catch (error){
        return res.status(500).json({
            sucess: false,
            msg: "Error al crear la categoria",
            error
        })
    }
}

export const getCategory = async (req, res) => {
    try{
        const { usuario } = req; 
        const { limite = 5, desde = 0 } = req.query
        const query = { status: true }

        const [total, categories ] = await Promise.all([
            Category.countDocuments(query),
            Category.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        return res.status(200).json({
            success: true,
            total,
            categories
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Error al obtener las categorias",
            error: err.message
        })
    }
}

export const updateCategory = async (req, res) => {
    try {
        const { usuario } = req;
        const { id } = req.params;
        const data = req.body;

        const updateCategory = await Category.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: "Categoría actualizada",
            category: updateCategory,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: "Error al actualizar la categoría",
            error: err.message,
        });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        
        const category = await Category.findByIdAndUpdate(id, { status: false }, { new: true });
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Categoría no encontrada"
            });
        }
        
        const defaultCategoryId = "679cedc00c50f098afb74105";
        await Product.updateMany({ category: id }, { category: defaultCategoryId });
        
        return res.status(200).json({
            success: true,
            message: "Categoría eliminada y productos actualizados",
            category,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al eliminar la categoría",
            error: err.message,
        });
    }
};

const createCategoryDefault = async () => {
      try {
        const customId = new mongoose.Types.ObjectId("679cedc00c50f098afb74105");
  
        const categoryExist = await Category.findOne({_id: customId});
        
    
        if (categoryExist) {
          console.log("La categoria por defecto ya fue creada");
          return;
        } 
  
        const categoryDefault = new Category({
            _id: customId,
            name: "categoryDefault",
            description: "Categoria por defecto a productos sin categoria",
            typeCategory: "OTHER_CATEGORY",
            status: true
        });
    
        await categoryDefault.save();
        console.log("La categoria por defecto a sido creada correctamente");

    } catch (error) {
        console.error("Error al crear la categoria por defecto:", error.message);
    }
};
    
export default createCategoryDefault;