import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/customer/order-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

const PaypalReturnPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paypalOrderId = params.get("paypalOrderId");
  const payerId = params.get("PayerID");
  useEffect(() => {
    if ( payerId) {
      const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

      dispatch(capturePayment({ paypalOrderId, payerId, orderId })).then((data) => {
        if (data?.payload?.success) {
          sessionStorage.removeItem("currentOrderId");
          window.location.href = "/customers/paypal-success";
        }
      });
    }
  }, [paypalOrderId, payerId, dispatch]);
  return(
    <Card>
      <CardHeader>
        <CardTitle>Processing Payment...Please wait!</CardTitle>
      </CardHeader>
    </Card>
  );
}
export default PaypalReturnPage;