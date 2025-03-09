import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";

const UserCartWrapper = ({ cartItems, setOpenCartSheet }) => {
  const navigate = useNavigate();
  const totalCartAmount = cartItems?.reduce((sum, item) => 
    sum + ((item?.salePrice || item?.price) * item?.quantity), 0) || 0;

  return (
    <SheetContent className="sm:max-w-md flex flex-col h-[90vh]">
      <SheetHeader className="border-b pb-4">
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>

      {/* Scrollable Items Container */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
        {cartItems?.length > 0 ? (
          cartItems.map((item) => (
            <UserCartItemsContent key={item.id} cartItem={item} />
          ))
        ) : (
          <div className="text-center py-4 h-full flex items-center justify-center">
            Your cart is empty
          </div>
        )}
      </div>

      {/* Sticky Checkout Section */}
      <div className="sticky bottom-0 bg-background border-t pt-4 space-y-4">
        <div className="flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold">${totalCartAmount.toFixed(2)}</span>
        </div>
        <Button
          onClick={() => {
            navigate("/customers/cuscheckout");
            setOpenCartSheet(false);
          }}
          className="w-full"
          disabled={!cartItems?.length}
        >
          Checkout
        </Button>
      </div>
    </SheetContent>
  );
};

export default UserCartWrapper;