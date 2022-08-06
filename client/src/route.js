import Admin from "./pages/Admin";
import {ADMIN_ROUTE, ITEMDETAIL_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE} from "./utils/consts";
import Auth from "./pages/Auth";
import Shop from "./pages/Shop";
import ItemDetailPage from "./pages/ItemDetailPage";

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: Admin
    }

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
        Component: ItemDetailPage
    },
]