import { createStackNavigator } from "@react-navigation/stack";
import HomeScreens from "../../src/screens/HomeScreens";
import RegisterUser from "../../src/screens/RegisterUser";
import LoginUser from "../../src/screens/LoginUser";
import UserHome from "../../src/screens/UserHome";

export type RootStackParamList = {
  HomeScreen: undefined;
  RegisterUser: undefined;
  LoginUser: undefined;
  UserHome: undefined;
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
    </Stack.Navigator>
  );
}