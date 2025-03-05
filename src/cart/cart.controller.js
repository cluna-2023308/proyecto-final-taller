import Cart from "./cart.model.js";
import Product from "../product/product.model.js";

export const addProductToCart = async (req, res) => {
    try {
      const usuario = req.usuario._id;
      const { productId, quantity } = req.body;
  
      if (quantity <= 0 || quantity > 10) {
        return res.status(400).json({
          success: false,
          message: "La cantidad debe estar entre 1 y 10 productos",
        });
      }
  
      console.log("Product ID recibido:", productId);
  
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Producto no encontrado",
        });
      }
      console.log("Producto encontrado:", product);

      let cart = await Cart.findOne({ user: usuario }).populate("products.product");
  
      console.log("Carrito encontrado:", cart);
  
      if (cart) {
        const productIndex = cart.products.findIndex(
          (item) => item.product._id.toString() === productId
        );
  
        if (productIndex > -1) {
          cart.products[productIndex].quantity += quantity;
        } else {
          cart.products.push({ product: productId, quantity });
        }
      } else {
        cart = new Cart({
          user: usuario,
          products: [{ product: productId, quantity }],
          totalPrice: 0,
        });
      }
  
      const totalPrice = await Promise.all(
        cart.products.map(async (item) => {
          const prod = await Product.findById(item.product);
          if (!prod) throw new Error("Producto no encontrado en la base de datos");
          return prod.price * item.quantity;
        })
      ).then(prices => prices.reduce((total, price) => total + price, 0));
  
      cart.totalPrice = totalPrice;
  
      await cart.save();
  
      res.status(200).json({
        success: true,
        message: "Producto agregado al carrito",
        cart,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al agregar el producto al carrito",
        error: error.message,
      });
    }
  };

export const removeProductFromCart = async (req, res) => {
    try {
      const usuario = req.usuario._id;
      const { productId } = req.body;

      let cart = await Cart.findOne({ user: usuario });
  
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: "Carrito no encontrado",
        });
      }
  
      const productIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId
      );
  
      if (productIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Producto no encontrado en el carrito",
        });
      }
  
      cart.products.splice(productIndex, 1);
  
      cart.totalPrice = cart.products.reduce((total, item) => {
        const prod = item.product;
        return total + prod.precio * item.quantity;
      }, 0);
  
      await cart.save();
  
      res.status(200).json({
        success: true,
        message: "Producto eliminado del carrito",
        cart,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al eliminar el producto del carrito",
        error: error.message,
      });
    }
  };

  
export const updateProductQuantityInCart = async (req, res) => {
    try {
        const usuario = req.usuario._id;
        const { productId, quantity } = req.body;

        if (quantity <= 0 || quantity > 10) {
            return res.status(400).json({
                success: false,
                message: "La cantidad debe estar entre 1 y 10 productos",
            });
        }

        let cart = await Cart.findOne({ user: usuario }).populate("products.product");

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Carrito no encontrado",
            });
        }

        const productIndex = cart.products.findIndex(
            (item) => item.product._id.toString() === productId
        );

        if (productIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado en el carrito",
            });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado en la base de datos",
            });
        }

        if (typeof product.price !== "number" || isNaN(product.price)) {
            return res.status(500).json({
                success: false,
                message: "El precio del producto no es válido",
            });
        }

        cart.products[productIndex].quantity = quantity;

        cart.totalPrice = cart.products.reduce((total, item) => {
            const prod = item.product;
            const price = typeof prod.price === "number" ? prod.price : 0;
            return total + price * item.quantity;
        }, 0);

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Cantidad actualizada en el carrito",
            cart,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar la cantidad del producto en el carrito",
            error: error.message,
        });
    }
};
