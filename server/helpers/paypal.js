const axios = require("axios");

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_IDS;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRETS;
const PAYPAL_API_BASE = process.env.PAYPAL_API_BASES; // Use "https://api.paypal.com" for production

// Get PayPal OAuth 2.0 access token
const getAccessToken = async () => {
  try {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");
    const response = await axios.post(
      `${PAYPAL_API_BASE}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("Error getting PayPal access token:", error.response?.data || error.message);
    throw error;
  }
};

// Create a PayPal order
const createPayPalOrder = async (orderData) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios.post(
      `${PAYPAL_API_BASE}/v2/checkout/orders`,
      orderData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating PayPal order:", error.response?.data || error.message);
    throw error;
  }
};

module.exports = {
  getAccessToken,
  createPayPalOrder,
};