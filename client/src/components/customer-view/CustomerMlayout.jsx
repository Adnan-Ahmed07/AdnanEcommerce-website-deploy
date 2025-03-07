import { Outlet } from "react-router-dom";
import CustomerMheader from "./CustomerMheader";

const CustomerMlayout = () => {
  return (
    <div className="flex flex-col bg-white overflow-hidden">
    
    <CustomerMheader/>
    <main className="flex flex-col w-full">
      <Outlet />
    </main>
  </div>
  )
}

export default CustomerMlayout;