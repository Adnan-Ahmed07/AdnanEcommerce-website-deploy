import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useSelector } from "react-redux";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { orderDetails } = useSelector((state) => state.customerOrder);

 
  const handleViewOrders = () => {
    
    const isValidRoute = window.location.pathname.includes('customers') || 
                        window.location.pathname.includes('cusaccounts');
    
    if (isValidRoute) {
      navigate("/customers/cusaccounts");
    } else {
      toast({
        title: "Navigation Error",
        description: "Orders page not found. Redirecting to homepage...",
        variant: "destructive",
      });
      setTimeout(() => navigate("/"), 3000);
    }
  };

  
  useEffect(() => {
    if (!orderDetails) {
      toast({
        title: "Order Processing",
        description: "Your order is being finalized...",
      });
    }
  }, [orderDetails, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        <Card className="p-8 max-w-md w-full shadow-xl relative overflow-hidden">
          {/* Checkmark animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="mb-6 text-center"
          >
            <svg 
              className="h-20 w-20 text-green-600 mx-auto" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>

          <CardHeader className="p-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <CardTitle className="text-3xl md:text-4xl text-center text-gray-800">
                Payment Successful! 
              </CardTitle>
            </motion.div>
          </CardHeader>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <Button 
              className="mt-5 w-full py-6 text-lg bg-green-600 hover:bg-green-700 transition-all duration-300"
              onClick={handleViewOrders}
            >
              View Orders
            </Button>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentSuccessPage;