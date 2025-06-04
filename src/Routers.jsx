import { Route, Routes } from "react-router-dom"
import Login from "./auth/login/Login"
import Register from "./auth/register/Register"
import PublicRoute from "./routers/PublicRoute"
import Layout from "./components/layouts/Layout"
import ProtectedRoute from "./routers/ProtectedRoute"
import NotFound from "./routers/NotFound"
import Dashboard from "./pages/admin_pages/dashboard/Dashboard"
import Buyurtma from "./pages/admin_pages/buyurtma/BuyurtmaAdmin"
import Kpi from "./pages/admin_pages/kpi/Kpis"
import UserAdmin from "./pages/admin_pages/users/UserAdmin"
import Master from "./pages/admin_pages/master/MasterAdmin"
import Profile from "./pages/profile/Profile"
import UserDashboard from "./pages/user_pages/dashboard/UserDashboard"
import MasterDashboard from "./pages/master_pages/dashboard/MasterDashboard"
import MasterBuyurtma from "./pages/master_pages/buyurtma/MasterBuyurtma"
import BuyurtmaView from "./pages/other/buyurtma/BuyurtmaView"
import MasterKpis from "./pages/master_pages/kpi/MasterKpis"
import MasterQismlar from "./pages/master_pages/qismlar/MasterQismlar"
import EditOrder from "./pages/other/buyurtma/EditOrder"
import Buyurtmalarim from "./pages/user_pages/buyurtmalarim/Buyurtmalarim"
import OrderDetails from "./pages/other/user_pages/OrderDetails"
import OrderEdit from "./pages/other/user_pages/OrderEdit"
import OrderUserAdd from "./pages/user_pages/buyurtmalarim/OrderUserAdd"
function Routers() {
    return (
        <Routes>
            <Route path="/login" element={
                <PublicRoute>
                    <Login />
                </PublicRoute>
            } />
            <Route path="/register" element={
                <PublicRoute>
                    <Register />
                </PublicRoute>
            } />

            {/* Protected routes */}
            <Route element={<Layout />}>
                {/* Admin routes */}
                <Route path="/dashboard/admin" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                <Route path="buyurtma/admin" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <Buyurtma />
                    </ProtectedRoute>
                } />
                <Route path="kpi/admin" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <Kpi />
                    </ProtectedRoute>
                } />
                <Route path="users/admin" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <UserAdmin />
                    </ProtectedRoute>
                } />
                <Route path="master/admin" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <Master />
                    </ProtectedRoute>
                } />
                <Route path="profile" element={
                    <ProtectedRoute allowedRoles={['admin', 'master', 'user']}>
                        <Profile />
                    </ProtectedRoute>
                } />

                {/* master */}
                <Route path="dashboard/master" element={
                    <ProtectedRoute allowedRoles={['master']}>
                        <MasterDashboard />
                    </ProtectedRoute>
                } />
                <Route path="buyurtma/master" element={
                    <ProtectedRoute allowedRoles={['master']}>
                        <MasterBuyurtma />
                    </ProtectedRoute>
                } />
                <Route path="kpi/master" element={
                    <ProtectedRoute allowedRoles={['master']}>
                        <MasterKpis />
                    </ProtectedRoute>
                } />
                <Route path="parts/master" element={
                    <ProtectedRoute allowedRoles={['master']}>
                        <MasterQismlar />
                    </ProtectedRoute>
                } />
                <Route path="orders/:id" element={
                    <ProtectedRoute allowedRoles={['master', 'admin']}>
                        <BuyurtmaView />
                    </ProtectedRoute>
                } />
                <Route path="/orders/:id/edit" element={
                    <ProtectedRoute allowedRoles={['master', 'admin']}>
                        <EditOrder />
                    </ProtectedRoute>
                } />

                {/* user */}
                <Route path="dashboard/user" element={
                    <ProtectedRoute allowedRoles={['user']}>
                        <UserDashboard />
                    </ProtectedRoute>
                } />

                <Route path="buyurtma/user" element={
                    <ProtectedRoute allowedRoles={['user']}>
                        <Buyurtmalarim />
                    </ProtectedRoute>
                } />

                <Route path="/user-orders/:id" element={
                    <ProtectedRoute allowedRoles={['user']}>
                        <OrderDetails />
                    </ProtectedRoute>
                } />

                <Route path="/user-orders/:id/edit" element={
                    <ProtectedRoute allowedRoles={['user']}>
                        <OrderEdit />
                    </ProtectedRoute>
                } />
                <Route path="/orders/add" element={
                    <ProtectedRoute allowedRoles={['user']}>
                        <OrderUserAdd />
                    </ProtectedRoute>
                } />
            </Route>

            <Route path="*" element={<NotFound />} />
            <Route path="/unauthorized" element={<NotFound />} />
            {/* <Route path="/verify-password-change" element={<VerifyPasswordChange />} /> */}
            {/* <Route path="/verify-email-change" element={<VerifyEmailChange />} /> */}
        </Routes>
    )
}

export default Routers