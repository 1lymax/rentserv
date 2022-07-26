import {ADMIN_ROUTE, ITEMDETAIL_ROUTE, LOGIN_ROUTE, MAIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE} from "./utils/consts";
import Auth from "./pages/Auth/Auth";
import Shop from "./pages/Shop";
import VehicleDetailPage from "./pages/VehicleDetailPage";
import Catalogs from "./pages/Admin/Catalogs";
import Admin from "./pages/Admin";
import MainPage from "./pages/Admin/MainPage";
import StoresAdmin from "./pages/Admin/StoresAdmin";
import VehiclesAdmin from "./pages/Admin/VehiclesAdmin";
import Main from "./pages/Main";
import OrdersAdmin from "./pages/Admin/OrdersAdmin";

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: Admin,
        title: 'Админ-панель'
    },
    {
        path: ADMIN_ROUTE + '/title/',
        Component: MainPage,
        title: 'Админ-панель'
    },
    {
        path: ADMIN_ROUTE + '/catalogs/' ,
        Component: Catalogs,
        title: 'Справочники'
    },
    {
        path: ADMIN_ROUTE + '/vehicles/' ,
        Component: VehiclesAdmin,
        title: 'Транспорт'
    },
    {
        path: ADMIN_ROUTE + '/stores/' ,
        Component: StoresAdmin,
        title: 'Хранение'
    },
    {
        path: ADMIN_ROUTE + '/orders/' ,
        Component: OrdersAdmin,
        title: 'Orders'
    },
]

export const publicRoutes = [
    {
        path: REGISTRATION_ROUTE,
        Component: Auth
    },
    {
        path: SHOP_ROUTE,
        Component: Shop
    },
    {
        path: MAIN_ROUTE,
        Component: Main
    },
    {
        path: LOGIN_ROUTE,
        Component: Auth
    },
    {
        path: ITEMDETAIL_ROUTE + '/:id',
        Component: VehicleDetailPage
    },
]