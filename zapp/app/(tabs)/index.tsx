import { createStackNavigator } from "@react-navigation/stack";
import HomeScreens from "../../src/screens/HomeScreens";
import RegisterUser from "../../src/screens/RegisterUser";

export type RootStackParamList = {
  HomeScreen: undefined;
  RegisterUser: undefined;
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
</Stack.Navigator>
  );
}