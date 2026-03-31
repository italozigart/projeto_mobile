import { createStackNavigator } from "@react-navigation/stack";
import HomeScreens from "../../src/screens/HomeScreens";
import LoginUser from "../../src/screens/LoginUser";
import RegisterUser from "../../src/screens/RegisterUser";
import UserHome from "../../src/screens/UserHome";
import UserPerfil from "../../src/screens/UserPerfil";

export type RootStackParamList = {
  HomeScreen: undefined;
  RegisterUser: undefined;
  LoginUser: undefined;
  UserHome: undefined;
  UserPerfil: undefined;
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
    </Stack.Navigator>
  );
}