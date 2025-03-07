const { createPayPalOrder } = require("../../helpers/paypal");
const Order = require("../../models/Order");
const Product = require("../../models/Product");
const Cart = require("../../models/Cart");
const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      orderDate,
      orderUpdateDate,
      paypalOrderId,
      payerId,
      cartId
    } = req.body;

    // Validate required fields
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart items are required",
      });
    }

    // Calculate total amount from cart items
    const calculatedTotal = cartItems.reduce(
      (sum, item) => sum + (Number(item.price) * Number(item.quantity)),
      0
    );

    // Build PayPal order payload
    const orderData = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: calculatedTotal.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: calculatedTotal.toFixed(2),
              },
            },
          },
          items: cartItems.map((item) => ({
            name: item.title.substring(0, 127), // PayPal's max length
            sku: item.productId.substring(0, 127),
            category: "PHYSICAL_GOODS", // REQUIRED field
            unit_amount: {
              currency_code: "USD",
              value: Number(item.price).toFixed(2),
            },
            quantity: Number(item.quantity).toString(),
          })),
        },
      ],
      application_context: {
        return_url: "http://localhost:5173/customers/paypal-return",
        cancel_url: "http://localhost:5173/customers/paypal-cancel",
        shipping_preference: "NO_SHIPPING", // Add if no shipping needed
      },
    };

    console.log("PayPal Order Data:", JSON.stringify(orderData, null, 2));

    // Create PayPal order FIRST
    const paypalOrder = await createPayPalOrder(orderData);

    // Only save to DB after successful PayPal creation
    const newlyCreatedOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus: "PENDING", // Default status
      paymentMethod,
      paymentStatus: "UNPAID", // Default status
      totalAmount: calculatedTotal,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paypalOrderId: paypalOrder.id, // Store PayPal's order ID
    });

    await newlyCreatedOrder.save();

    // Find approval URL
    const approvalURL = paypalOrder.links.find(
      (link) => link.rel === "approve"
    )?.href;

    if (!approvalURL) {
      throw new Error("No approval URL found in PayPal response");
    }

    res.status(201).json({
      success: true,
      approvalURL,
      orderId: newlyCreatedOrder._id,
      paypalOrderId: paypalOrder.id,
    });
  } catch (e) {
    console.error("Order Creation Error:", e);

    // Handle PayPal API errors specifically
    const statusCode = e.response?.status || 500;
    const errorMessage = e.response?.data?.message || e.message;

    res.status(statusCode).json({
      success: false,
      message: "Order creation failed",
      error: errorMessage,
      details: e.response?.data?.details,
    });
  }
};

// Basic capture payment implementation
const capturePayment = async (req, res) => {
  try {
    const { paypalOrderId, payerId, orderId } = req.body;

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paypalOrderId = paypalOrderId;
    order.payerId = payerId;

    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Not enough stock for this product ${product.title}`,
        });
      }

      product.totalStock -= item.quantity;

      await product.save();
    }

    const getCartId = order.cartId;
    await Cart.findByIdAndDelete(getCartId);

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  } catch (e) {
    console.error("Capture Payment Error:", e);
    res.status(500).json({
      success: false,
      message: "Payment capture failed",
      error: e.message,
    });
  }
};
const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log("Server Error:", e);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: e.message,
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log("Server Error:", e);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: e.message,
    });
  }
};
// Add implementations for getAllOrdersByUser and getOrderDetails as needed

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};