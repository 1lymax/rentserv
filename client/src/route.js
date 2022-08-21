import {ADMIN_ROUTE, ITEMDETAIL_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE} from "./utils/consts";
import Auth from "./pages/Auth";
import Shop from "./pages/Shop";
import VehicleDetailPage from "./pages/VehicleDetailPage";
import Catalogs from "./pages/Admin/Catalogs";
import Admin from "./pages/Admin";
import MainPage from "./pages/Admin/MainPage";

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
        Component: Catalogs,
        title: 'Транспорт'
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
        path: LOGIN_ROUTE,
        Component: Auth
    },
    {
        path: ITEMDETAIL_ROUTE + '/:id',
        Component: VehicleDetailPage
    },
]