import PDFDocument from "pdfkit";
import Cart from "../cart/cart.model.js";
import User from "../user/user.model.js";

export const generateInvoice = async (req, res) => {
    try {
      const { cartId } = req.params; // Obtener cartId desde la URL
      const cart = await Cart.findById(cartId).populate("products.product");
  
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: "Carrito no encontrado",
        });
      }
  
      const user = await User.findById(cart.user);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado",
        });
      }
  
      const doc = new PDFDocument();
      let filename = `Factura_${user.username}_${Date.now()}.pdf`;
      filename = encodeURIComponent(filename);
  
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );
  
      doc.pipe(res);
  
      // Encabezado de la factura
      doc.fontSize(18).text("Factura de la Compra", { align: "center" });
      doc.moveDown();
  
      doc.fontSize(12).text(`Cliente: ${user.name} ${user.surname} - NIT: ${user.NIT}`, {
        align: "left",
      });
      doc.moveDown();
  
      doc.fontSize(12).text("Productos Comprados:", { align: "left" });
      doc.moveDown();
  
      let total = 0;
      
      for (let item of cart.products) {
        const product = item.product; // Producto ya populado
        if (product) {
          const subTotal = product.price * item.quantity;
          total += subTotal;
  
          // Escribir producto en la factura
          doc.text(
            `${product.name} - Cantidad: ${item.quantity} - Subtotal: Q${subTotal.toFixed(2)}`,
            { align: "left" }
          );
  
          // **Reducir stock del producto**
          if (product.stock >= item.quantity) {
            product.stock -= item.quantity;
            await product.save();
          } else {
            return res.status(400).json({
              success: false,
              message: `Stock insuficiente para el producto: ${product.nameProducto}`,
            });
          }
        }
      }
  
      doc.moveDown();
      doc.fontSize(12).text(`Total: Q${total.toFixed(2)}`, { align: "right" });
  
      doc.end();
  
      // **Vaciar el carrito después de la compra**
      cart.products = [];
      cart.totalPrice = 0;
      await cart.save();
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al generar la factura",
        error: error.message,
      });
    }
  };