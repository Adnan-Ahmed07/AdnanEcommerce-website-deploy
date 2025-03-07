
import { Route, Routes } from 'react-router-dom'

import AuthLayout from './components/auth/Layout'

import AuthRegister from './pages/auth/register'
import AuthLogin from './pages/auth/login'
import AdminMlayout from './components/admin-view/AdminMlayout'
import AdminDashboard from './pages/admin-view/dashboard'
import AdminProducts from './pages/admin-view/products'
import AdminOrders from './pages/admin-view/orders'
import AdminFeatures from './pages/admin-view/features'
import CustomerMlayout from './components/customer-view/CustomerMlayout'
import NotFound from './pages/not-found/NotFound'
import CustomerHome from './pages/customer-view/CustomerHome'
import ProductListing from './pages/customer-view/ProductListing'
import CustomerCheckout from './pages/customer-view/Checkout'
import CustomerAccount from './pages/customer-view/account'
import CheckAuth from './components/common/check-auth'
import UnAuthPage from './pages/unAuth-page/UnAuthPage'
import { useDispatch, useSelector } from 'react-redux'
import { checkAuth } from './store/auth-slice'
import { useEffect } from 'react'
import { Skeleton } from './components/ui/skeleton'
import PaypalReturnPage from './pages/customer-view/paypal-retun'
import PaymentSuccessPage from './pages/customer-view/paymet-success'
import SearchProducts from './pages/customer-view/search'


function App() {
  // const isAuthenticated =false;
  // const user=null;
  const {isAuthenticated,user,isLoading}=useSelector((state)=>state.auth)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) return <Skeleton className="w-[800] bg-black h-[600px]" />;

  console.log(isLoading, user);

  return (
   <div className='flex flex-col overflow-hidden bg-white' >
    {/* <h1>header com is working or not</h1> */}

   <Routes>
    <Route path="/" element={
     <CheckAuth isAuthenticated={isAuthenticated} user={user}>
      </CheckAuth>
} />

    <Route path="/auth" element={
     <CheckAuth isAuthenticated={isAuthenticated} user={user}>
      <AuthLayout/>
     </CheckAuth>

    }>
    <Route path="login" element={<AuthLogin/>} />
    <Route path="register" element={<AuthRegister/>}/>
    </Route>
    {/* admin work adnan */}
    <Route path="/admin" element={
      <CheckAuth isAuthenticated={isAuthenticated} user={user}>
        <AdminMlayout/>
      </CheckAuth>
    }>
     <Route path="dashboard" element={<AdminDashboard/>} />
     <Route path="products" element={<AdminProducts/>} />
     <Route path="orders" element={<AdminOrders/>}/>
     <Route path="features" element={<AdminFeatures/>}/>
    </Route>
    {/* custormer side work */}
    <Route path="/customers" element={
     <CheckAuth isAuthenticated={isAuthenticated} user={user}>
      <CustomerMlayout/>
     </CheckAuth>

    }>
      <Route path="cushome" element={<CustomerHome/>}/>
      <Route path="prlisting" element={<ProductListing/>}/>
      <Route path="cuscheckout" element={<CustomerCheckout/>}/>
      <Route path="cusaccounts" element={<CustomerAccount/>}/>
      <Route path="paypal-return" element={<PaypalReturnPage/>}/>
      <Route path="paypal-success" element={<PaymentSuccessPage/>}/>
      <Route path="search" element={<SearchProducts/>}/>
    </Route>
    <Route path="/unauth-page" element={<UnAuthPage/>}  />
    <Route path="*" element={<NotFound/>}  />
   
   </Routes>


   </div>
  )
}

export default App
