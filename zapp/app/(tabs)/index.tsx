import { createStackNavigator } from "@react-navigation/stack";
import HomeScreens from "../../src/screens/HomeScreens";
import LoginUser from "../../src/screens/LoginUser";
import RegisterUser from "../../src/screens/RegisterUser";
import UserHome from "../../src/screens/UserHome";
import UserPerfil from "../../src/screens/UserPerfil";
import RegisterProduct from "../../src/screens/RegisterProduct";
import ProductList from "../../src/screens/ProductList";
import CartScreen from "../../src/screens/CartScreen";

export type RootStackParamList = {
    HomeScreen: undefined;
    RegisterUser: undefined;
    LoginUser: { fromRegister?: boolean } | undefined;
    UserHome: undefined;
    UserPerfil: undefined;
    RegisterProduct: undefined;
    ProductList: undefined;
    CartScreen: undefined;
}

const Stack = createStackNavigator<RootStackParamList>();

export default function RootStack() {
    return (
        <Stack.Navigator
            initialRouteName="HomeScreen"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="HomeScreen" component={HomeScreens} />
            <Stack.Screen name="RegisterUser" component={RegisterUser} />
            <Stack.Screen name="LoginUser" component={LoginUser} />
            <Stack.Screen name="UserHome" component={UserHome} />
            <Stack.Screen name="UserPerfil" component={UserPerfil} />
            <Stack.Screen name="RegisterProduct" component={RegisterProduct} />
            <Stack.Screen name="ProductList" component={ProductList} />
            <Stack.Screen name="CartScreen" component={CartScreen} />
        </Stack.Navigator>
    );
}