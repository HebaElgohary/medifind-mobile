import "react-native-gesture-handler";
import React, { lazy, Suspense } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Provider as PaperProvider } from "react-native-paper";
import { ActivityIndicator, View, TouchableOpacity } from "react-native";
import { Colors } from "../constants/RootColor";
import { DrawerContent } from "../components/MyDrawer";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { ROLES } from "../hooks/useAuth";
import { BottomTabBar } from "../components/BottomTabBar";
import Icon from "react-native-vector-icons/FontAwesome5";

// Loading component for Suspense
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <ActivityIndicator size="large" color={Colors.mainColor} />
  </View>
);

// Lazy loaded components

const Home = lazy(() =>
  import("./Home").then((module) => ({ default: module.Home })),
);
const AddMedicine = lazy(() =>
  import("./AddMedicine").then((module) => ({ default: module.AddMedicine })),
);
const Donations = lazy(() =>
  import("./Donations").then((module) => ({ default: module.Donations })),
);
const Login = lazy(() => import("./Login"));
const RegisterPage = lazy(() => import("./RegisterPage"));
const ProfilePage = lazy(() =>
  import("./Profile").then((module) => ({ default: module.ProfilePage })),
);
const RequestMedicine = lazy(() =>
  import("./RequestMedicine").then((module) => ({
    default: module.RequestMedicine,
  })),
);
const Orders = lazy(() =>
  import("./Orders").then((module) => ({ default: module.Orders })),
);
const RequestsReview = lazy(() =>
  import("./RequestsReview").then((module) => ({
    default: module.RequestsReview,
  })),
);
const OffersReview = lazy(() =>
  import("./OffersReview").then((module) => ({ default: module.OffersReview })),
);

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Wrapper component for screens with BottomTabBar
const ScreenWithBottomBar = ({ children, navigation }) => (
  <View style={{ flex: 1 }}>
    {children}
    <BottomTabBar navigation={navigation} />
  </View>
);

// Main App Stack with Drawer
const MainAppStack = () => (
  <Drawer.Navigator
    drawerContent={(props) => <DrawerContent {...props} />}
    screenOptions={({ navigation }) => ({
      headerShown: true,
      headerStyle: {
        backgroundColor: Colors.mainColor,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: "#fff",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 16 }}
        >
          <Icon
            name="arrow-left"
            size={20}
            color="#fff"
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
      ),
      drawerStyle: {
        width: "80%",
      },
      drawerType: "front",
      overlayColor: "rgba(0, 0, 0, 0.5)",
      gestureEnabled: true,
      swipeEnabled: true,
      animationEnabled: true,
      detachInactiveScreens: false,
    })}
  >
    <Drawer.Screen
      name="Home"
      options={{
        headerLeft: () => null, // Remove back button for Home screen
      }}
    >
      {(props) => (
        <ScreenWithBottomBar navigation={props.navigation}>
          <Suspense fallback={<LoadingScreen />}>
            <ProtectedRoute
              component={Home}
              allowedRoles={[ROLES.USER, ROLES.DOCTOR]}
              {...props}
            />
          </Suspense>
        </ScreenWithBottomBar>
      )}
    </Drawer.Screen>

    <Drawer.Screen
      name="AddMedicine"
      options={{
        title: "Add Medicine",
      }}
    >
      {(props) => (
        <ScreenWithBottomBar navigation={props.navigation}>
          <Suspense fallback={<LoadingScreen />}>
            <ProtectedRoute
              component={AddMedicine}
              allowedRoles={[ROLES.USER]}
              {...props}
            />
          </Suspense>
        </ScreenWithBottomBar>
      )}
    </Drawer.Screen>

    <Drawer.Screen
      name="Donations"
      options={{
        title: "Donations",
      }}
    >
      {(props) => (
        <ScreenWithBottomBar navigation={props.navigation}>
          <Suspense fallback={<LoadingScreen />}>
            <ProtectedRoute
              component={Donations}
              allowedRoles={[ROLES.USER]}
              {...props}
            />
          </Suspense>
        </ScreenWithBottomBar>
      )}
    </Drawer.Screen>

    <Drawer.Screen
      name="ProfilePage"
      options={{
        title: "Profile",
      }}
    >
      {(props) => (
        <ScreenWithBottomBar navigation={props.navigation}>
          <Suspense fallback={<LoadingScreen />}>
            <ProtectedRoute
              component={ProfilePage}
              allowedRoles={[ROLES.USER]}
              {...props}
            />
          </Suspense>
        </ScreenWithBottomBar>
      )}
    </Drawer.Screen>

    <Drawer.Screen
      name="RequestMedicine"
      options={{
        title: "Request Medicine",
      }}
    >
      {(props) => (
        <ScreenWithBottomBar navigation={props.navigation}>
          <Suspense fallback={<LoadingScreen />}>
            <ProtectedRoute
              component={RequestMedicine}
              allowedRoles={[ROLES.USER]}
              {...props}
            />
          </Suspense>
        </ScreenWithBottomBar>
      )}
    </Drawer.Screen>

    <Drawer.Screen name="Orders">
      {(props) => (
        <ScreenWithBottomBar navigation={props.navigation}>
          <Suspense fallback={<LoadingScreen />}>
            <ProtectedRoute
              component={Orders}
              allowedRoles={[ROLES.USER]}
              {...props}
            />
          </Suspense>
        </ScreenWithBottomBar>
      )}
    </Drawer.Screen>

    <Drawer.Screen name="RequestsReview">
      {(props) => (
        <ScreenWithBottomBar navigation={props.navigation}>
          <Suspense fallback={<LoadingScreen />}>
            <ProtectedRoute
              component={RequestsReview}
              allowedRoles={[ROLES.DOCTOR]}
              {...props}
            />
          </Suspense>
        </ScreenWithBottomBar>
      )}
    </Drawer.Screen>

    <Drawer.Screen name="OffersReview">
      {(props) => (
        <ScreenWithBottomBar navigation={props.navigation}>
          <Suspense fallback={<LoadingScreen />}>
            <ProtectedRoute
              component={OffersReview}
              allowedRoles={[ROLES.DOCTOR]}
              {...props}
            />
          </Suspense>
        </ScreenWithBottomBar>
      )}
    </Drawer.Screen>
  </Drawer.Navigator>
);

const MainScreen = () => {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: true,
            headerStyle: {
              backgroundColor: Colors.mainColor,
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            gestureEnabled: false,
          }}
        >
          {/* Auth Screens */}
          <Stack.Screen
            name="Login"
            options={{
              headerShown: false,
            }}
          >
            {(props) => (
              <Suspense fallback={<LoadingScreen />}>
                <Login {...props} />
              </Suspense>
            )}
          </Stack.Screen>

          <Stack.Screen
            name="RegisterPage"
            options={{
              title: "Register",
              headerShown: false,
            }}
          >
            {(props) => (
              <Suspense fallback={<LoadingScreen />}>
                <RegisterPage {...props} />
              </Suspense>
            )}
          </Stack.Screen>

          {/* Main App Stack */}
          <Stack.Screen
            name="MainApp"
            component={MainAppStack}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default MainScreen;
