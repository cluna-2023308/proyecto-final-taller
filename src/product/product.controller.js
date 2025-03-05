import Product from "./product.model.js";
import Category from "../category/category.model.js"

export const createProduct = async (req, res) => {
    try {
        const { usuario } = req; 
        const { name, description, stock, price, category } = req.body;

        const product = new Product({ name, description, stock, price, category });
        await product.save();

        return res.status(200).json({
            success: true,
            msg: "Producto creado con éxito",
            product
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al crear el producto",
            error
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { usuario } = req; 
        const { id } = req.params;
        const data = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: "Producto actualizado",
            product: updatedProduct,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: "Error al actualizar el producto",
            error: err.message,
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { usuario } = req; 
        const { id } = req.params;

        const product = await Product.findByIdAndUpdate(id, { status: false }, { new: true });

        return res.status(200).json({
            success: true,
            message: "Producto eliminado",
            product,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al eliminar el producto",
            error: err.message,
        });
    }
};

// CLIENT AND ADMIN
export const getProducts = async (req, res) => {
    try {
        const { usuario } = req; 
        const { limite = 5, desde = 0 } = req.query;
        const query = { status: true };

        const [total, products] = await Promise.all([
            Product.countDocuments(query),
            Product.find(query)
                .populate("category", "name")
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        return res.status(200).json({
            success: true,
            total,
            products
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener los productos",
            error: err.message
        });
    }
};

export const searchProductByName = async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Debe proporcionar un nombre para la búsqueda"
            });
        }
        
        const products = await Product.find({ name: { $regex: name, $options: "i" } });
        return res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error al buscar productos por nombre",
            error: error.message
        });
    }
};

export const searchProductsByTypeCategory = async (req, res) => {
    try {
        const { typeCategory } = req.query;
        if (!typeCategory) {
            return res.status(400).json({
                success: false,
                message: "Debe proporcionar un typeCategory para la búsqueda",
            });
        }

        const categories = await Category.find({ typeCategory });

        if (categories.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No se encontraron categorías con el typeCategory especificado",
            });
        }

        const categoryIds = categories.map(category => category._id);

        const products = await Product.find({ category: { $in: categoryIds } });

        return res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error al buscar productos por typeCategory",
            error: error.message,
        });
    }
};


export const listProductsFilter = async (req, res) => {
    try {
        const { FilterFor = '', categorySpecific = '' } = req.query;

        let sortCriterion = {};
        let query = {};

        if (FilterFor === 'category') {
            if (!categorySpecific) {
                return res.status(400).json({
                    message: "No se proporcionó una categoría",
                });
            }

            const category = await Category.findOne({ name: categorySpecific });
            if (!category) {
                return res.status(404).json({
                    message: "Categoría no encontrada",
                });
            }
            query.category = category._id;
        } else {
            switch (FilterFor) {
                case 'A-Z':
                    sortCriterion = { name: 1 };
                    break;
                case 'Z-A':
                    sortCriterion = { name: -1 };
                    break;
                case 'priceAscendant':
                    sortCriterion = { price: 1 };
                    break;
                case 'priceDescendant':
                    sortCriterion = { price: -1 };
                    break;
            }
        }

        const products = await Product.find(query).sort(sortCriterion);

        return res.status(200).json({
            message: "Productos obtenidos correctamente",
            products,
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            message: "Error interno del servidor",
            error: error.message,
        });
    }
};
