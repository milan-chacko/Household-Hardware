import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Authapi from '../../utils/Authapi';
import Signin from './Signin';
import Signup from './Signup';
import Products from './Products';
import Dashboard from './Dashboard';
import Homepage from '../Homepage';
import Category from './Category';
import ProductPage from './Productpage';
import CategoriesPage from './CategoriesPage';
import EditCatProduct from './EditCatProduct';
import Catproduct from '../attach/Catproduct';
import ProductDetail from '../attach/ProductDetail';
import MyCart from '../attach/MyCart';
import CheckoutPage from '../attach/CheckoutPage';
import CheckOut from '../attach/CheckOut';
import OrderSummaryPage from '../attach/OrderSummaryPage';
import UserProfile from '../attach/UserProfile';
import OrderSummary from '../attach/OrderSummary';
import UserOrderPage from '../attach/UserOrderPage';
import Profile from '../attach/Profile';
import OrderDetailsPage from '../attach/OrderDetailsPage';
import UserOrder from '../attach/UserOrder';
import OrdersAdmin from './OrdersAdmin';
import DispatchedOrdersPage from './DispatchedOrdersPage';
import DeliveredOrders from './DeliveredOrders';
import NewOrders from './NewOrders';
import Dispatched from './Dispatched';
import Delivered from './Delivered';
import OrderBillPage from '../attach/OrderBillPage';
import Layout from '../components/Layout';
import SalesChart from './SalesChart';
import Sales from './Sales';
import OrderSearch from './OrderSearch';
import Search from './Search';
import ContactUs from '../attach/ContactUs';
import AdminQueries from './AdminQueries';
import Query from './Query';

const Roter = () => {
  const authApi = React.useContext(Authapi); // Get authentication status

  return (
    // <Layout>
    <Routes>
      {/* Public Routes */}
      {/* <Route path="/signin" element={!authApi.auth ? <Signin /> : <Navigate to="/dashboard" />} />
      <Route path="/signup" element={!authApi.auth ? <Signup /> : <Navigate to="/dashboard" />} /> */}
      <Route path="/" element={<Homepage/>} />
      <Route path="/filter" element={<Search/>} />

      {/* Protected Route */}
      {/* <Route path="/dashboard" element={authApi.auth ? <Dashboard /> : <Navigate to="/signin" />} /> */}
      <Route path="/signin" element={<Signin />} />
<Route path="/signup" element={<Signup />} />
<Route path="/catproduct" element={<Catproduct />} />
<Route path="/dashboard" element={<Dashboard />} />
<Route path="/products" element={<Products />} />
<Route path="/add-category" element={<Category />} />
<Route path="/category" element={<EditCatProduct/>}/>
<Route path="/categories" element={<CategoriesPage />} />
<Route path="/product" element={<ProductPage />} />
<Route path="/cart" element={<MyCart/>} />
<Route path="/checkout" element={<CheckOut/>} />
<Route path="/order-summary" element={<OrderSummary />} />
<Route path="/user/orders" element={<UserOrder />} />
<Route path="/order-details/:orderId" element={<OrderDetailsPage />} />
<Route path="/admin/orders" element={<NewOrders/>} />
<Route path="/profile" element={<Profile />} />
<Route path='/admin/dispatched-order' element={<Dispatched/>}/>
<Route path="/admin/delivered-orders" element={<Delivered />} />
<Route path="/product-detail" element={<ProductDetail/>} />
<Route path="/order/:orderId/bill" element={<OrderBillPage />} />
<Route path="/contact-us" element={<ContactUs />} />
<Route path="/sales" element={<Sales/>}/>
<Route path="/query" element={<Query/>}/>
</Routes>
// </Layout>
  );
};

export default Roter;
