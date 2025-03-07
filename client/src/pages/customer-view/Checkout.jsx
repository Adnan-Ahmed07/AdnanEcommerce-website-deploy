import { useState, useEffect } from "react";
import Address from "@/components/customer-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/customer-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { createNewOrder } from "@/store/customer/order-slice";
import { useToast } from "@/hooks/use-toast";

const CustomerCheckout = () => {
  const { cartItems } = useSelector((state) => state.customerCart);
  const { user } = useSelector((state) => state.auth);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const { approvalURL } = useSelector((state) => state.customerOrder);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  useEffect(() => {
    if (approvalURL) {
      window.location.href = approvalURL;
    }
  }, [approvalURL]);

  const handleInitiatePaypalPaymet = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });
      return;
    }
    if (currentSelectedAddress === null) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        image: singleCartItem?.image,
        title: singleCartItem?.title,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        salePrice: singleCartItem.salePrice,
        quantity: singleCartItem.quantity,
      })),
      addressInfo: {
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        phone: currentSelectedAddress?.phone,
        pincode: currentSelectedAddress?.pincode,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
        setIsPaymemntStart(true);
      } else {
        setIsPaymemntStart(false);
      }
    });
  };

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems &&
            cartItems.items &&
            cartItems.items.length > 0 &&
            cartItems.items.map((item) => (
              <UserCartItemsContent key={item.productId} cartItem={item} />
            ))}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">${totalCartAmount}</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button
              onClick={handleInitiatePaypalPaymet}
              disabled={isPaymentStart}
              className="w-full relative transition-all duration-300 hover:scale-[1.02] bg-blue-600 hover:bg-blue-700"
            >
              <div className="flex items-center justify-center gap-2">
                {isPaymentStart && (
                  <div className="absolute left-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  </div>
                )}
                <span
                  className={`transition-opacity duration-200 ${
                    isPaymentStart ? "opacity-0" : "opacity-100"
                  }`}
                >
                  Paymet with Paypal
                </span>
                <span
                  className={`absolute flex items-center gap-2 transition-opacity duration-200 ${
                    isPaymentStart ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <span className="animate-pulse">Processing Payment</span>
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-white rounded-full animate-bounce delay-100"></div>
                    <div className="w-1 h-1 bg-white rounded-full animate-bounce delay-200"></div>
                  </div>
                </span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerCheckout;