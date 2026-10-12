
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { TextInput } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";
import { useUserLoginMutation } from "../redux/Slice/user";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/Slice/authSlice";
import { decodeToken } from "../utils/tokenUtils";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const [userLogin, { isLoading }] = useUserLoginMutation();
  const dispatch = useDispatch();

  // Calculate validity directly from current values.
  const isFormValid =
    email.trim() !== "" &&
    password !== "" &&
    Object.keys(errors).every((key) => !errors[key]);

  const validateForm = () => {
    const newErrors = {};
    const trimmedEmail = email.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,}$/;

    if (!trimmedEmail) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!passwordRegex.test(password)) {
      newErrors.password =
        "Password must contain an uppercase letter, a special character, and a number";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleEmailChange = (value) => {
    setEmail(value);

    setErrors((previous) => ({
      ...previous,
      email: "",
    }));
  };

  const handlePasswordChange = (value) => {
    setPassword(value);

    setErrors((previous) => ({
      ...previous,
      password: "",
    }));
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();

    if (isLoading || !validateForm()) {
      return;
    }

    try {
      const response = await userLogin({
        email: email.trim(),
        password,
      }).unwrap();

      // Check common token locations in the response body.
      const token =
        response?.token ||
        response?.accessToken ||
        response?.data?.token ||
        response?.data?.accessToken;

      if (!token) {
        console.error("Login response did not contain a token.");

        Alert.alert(
          "Login Error",
          "No authentication token was found in the server response."
        );
        return;
      }

      const normalizedToken = token.replace(/^Bearer\s+/i, "");
      const decodedToken = decodeToken(normalizedToken);

      const user =
        response?.user ||
        response?.data?.user ||
        decodedToken;

      dispatch(
        setCredentials({
          token: normalizedToken,
          user,
        })
      );

      setErrors({});
      setPassword("");

      navigation.navigate("MainApp", {
        screen: "Home",
      });
    } catch (error) {
      console.error(
        "Login request failed:",
        error?.status || error?.error
      );

      if (error?.status === "FETCH_ERROR") {
        Alert.alert(
          "Connection Error",
          "Unable to reach the server. Check your internet connection and try again."
        );
      } else if (error?.status === "TIMEOUT_ERROR") {
        Alert.alert(
          "Connection Error",
          "The request took too long. Please try again."
        );
      } else {
        const message =
          error?.data?.message ||
          error?.data?.error ||
          error?.error ||
          "Invalid email or password. Please try again.";

        Alert.alert("Login Failed", message);
      }
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.heading}>
        <Text style={styles.headingText}>Login</Text>
        <Entypo name="user" size={20} color="#25231e" />
      </View>

      <Text style={styles.welcomeText}>Welcome back</Text>

      <Image
        source={require("../../assets/doctor.jpeg")}
        style={styles.image}
        resizeMode="contain"
      />

      <TextInput
        mode="outlined"
        label="Email"
        placeholder="Enter your email"
        activeOutlineColor="#00b2bc"
        value={email}
        onChangeText={handleEmailChange}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        editable={!isLoading}
        style={styles.input}
        accessibilityLabel="Email"
      />

      {errors.email ? (
        <Text style={styles.errorText}>{errors.email}</Text>
      ) : null}

      <TextInput
        mode="outlined"
        label="Password"
        placeholder="Enter your password"
        activeOutlineColor="#00b2bc"
        value={password}
        onChangeText={handlePasswordChange}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        editable={!isLoading}
        style={styles.input}
        accessibilityLabel="Password"
      />

      {errors.password ? (
        <Text style={styles.errorText}>{errors.password}</Text>
      ) : null}

      <TouchableOpacity
        style={[
          styles.button,
          (!isFormValid || isLoading) && styles.buttonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={!isFormValid || isLoading}
        accessibilityRole="button"
        accessibilityState={{
          disabled: !isFormValid || isLoading,
          busy: isLoading,
        }}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>Or</Text>
        <View style={styles.divider} />
      </View>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>
          Don't have an account?{" "}
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("RegisterPage")}
          disabled={isLoading}
          accessibilityRole="button"
        >
          <Text style={styles.signupLink}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
    flexGrow: 1,
  },

  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  headingText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#25231e",
  },

  welcomeText: {
    color: "#b1afa9",
    marginTop: 5,
  },

  image: {
    width: "100%",
    height: 260,
    marginVertical: 15,
  },

  input: {
    width: "100%",
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
  },

  errorText: {
    color: "#DC2626",
    fontSize: 12,
    marginBottom: 12,
    marginTop: -5,
  },

  button: {
    width: "100%",
    minHeight: 50,
    padding: 14,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    backgroundColor: "#00b3bc",
  },

  buttonDisabled: {
    opacity: 0.55,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  dividerContainer: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  divider: {
    height: 1,
    flex: 1,
    backgroundColor: "#b1afa9",
  },

  dividerText: {
    color: "#b1afa9",
    paddingHorizontal: 10,
  },

  signupContainer: {
    marginTop: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
  },

  signupText: {
    color: "#6B7280",
    fontSize: 14,
  },

  signupLink: {
    color: "#00b2bc",
    fontSize: 14,
    fontWeight: "700",
  },
});
