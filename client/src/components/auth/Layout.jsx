import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen w-full">
    <motion.div 
  className="hidden lg:flex items-center justify-center bg-gradient-to-r from-blue-900 via-indigo-700 to-gray-600 w-1/2 px-12"
  initial={{ opacity: 0, x: -100 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 1 }}
>
  <div className="max-w-md space-y-6 text-center text-white">
    <motion.h1 
      className="text-5xl font-extrabold leading-tight tracking-tight md:text-6xl"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.2 }}
    >
      Welcome to Adnan's Shopping
    </motion.h1>
    <motion.p 
      className="text-lg font-light mt-4"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: 0.4 }}
    >
      Explore high-quality products tailored just for you!
    </motion.p>
  </div>
</motion.div>





      <motion.div 
        className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <Outlet />
      </motion.div>
    </div>
  );
};

export default AuthLayout;