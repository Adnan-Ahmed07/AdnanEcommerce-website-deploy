import { HousePlug, Menu,ShoppingCart,UserCheck,LogOut} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useState } from "react";
import { Label } from "../ui/label";

const MenuItems = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams()

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? {
            Category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("prlisting") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`?Category=${getCurrentMenuItem.id}`)
        )
      : navigate(getCurrentMenuItem.path);
  }


  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
         <Label
         onClick={() => handleNavigate(menuItem)}
         className="text-sm font-medium cursor-pointer"
         key={menuItem.id}
       >
         {menuItem.label}
       </Label>
      ))}
    </nav>
  );
};
const HeaderRightContent = () => {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.customerCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }
  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
     <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
     <Button 
  onClick={() => setOpenCartSheet(true)} 
  variant="outline" 
  size="icon" 
  className="relative rounded-full h-12 w-12 hover:bg-accent/80 transition-colors shadow-lg border-2 border-primary/20"
>
  <ShoppingCart className="h-7 w-7 text-primary" />
  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full min-w-[24px] min-h-[24px] flex items-center justify-center text-xs font-bold border-2 border-background shadow-md">
    {cartItems?.items?.length || 0}
  </span>
  <span className="sr-only">User cart</span>
</Button>
      <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
     </Sheet>
      <DropdownMenu>
        <DropdownMenuTrigger as asChild>
        <Avatar className="bg-black">
        <AvatarFallback className="bg-black text-white font-extrabold">
             {user?.userName[0].toUpperCase()}
            </AvatarFallback>
        </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56">
        <DropdownMenuLabel>Logged in as {user.userName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/customers/cusaccounts")}>
        <UserCheck className="mr-2 h-4 w-4"/>
        Account
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
        <LogOut className="mr-2 h-4 w-4" />
        Logout
        </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const CustomerMheader = () => {
  const { isAuthenticated,user } = useSelector((state) => state.auth);
  console.log(user,"Adnan");
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/customers/cushome" className="flex items-center gap-2">
          <HousePlug className="h-6 w-6" />
          <span className="font-bold">Adnan's Shopping House</span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            <MenuItems />
            <HeaderRightContent/>
          </SheetContent>
        </Sheet>
        <div className="hidden lg:block">
          <MenuItems />
        </div>
   
   <div className="hidden lg:block">
      <HeaderRightContent />
      </div> 
     
   
        
      </div>
    </header>
  );
};

export default CustomerMheader;
