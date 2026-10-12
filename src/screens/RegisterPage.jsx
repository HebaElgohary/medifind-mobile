import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  ActivityIndicator,
  StatusBar,
} from "react-native";

import {MyButton} from "../components/MyButton";
import {MyTextInput} from "../components/MyTextInput";
import { useUserRegisterMutation } from "../redux/Slice/user";

const RegisterPage = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDoctor, setIsDoctor] = useState(false);

  const [errors, setErrors] = useState({});
  const [userRegister, { isLoading }] = useUserRegisterMutation();

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

    if (!password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(password)) {
      newErrors.password =
        "Password must be at least 8 characters and contain a letter, a number, and a special character";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    Keyboard.dismiss();

    if (!validateForm()) {
      return;
    }

    try {
      setErrors({});

      await userRegister({
        name: name.trim(),
        email: email.trim(),
        password,
        role: isDoctor ? "doctor" : "user",
      }).unwrap();

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setIsDoctor(false);

      navigation.navigate("Login");
    } catch (error) {
      const message =
        error?.data?.message ||
        error?.data?.error ||
        error?.error ||
        "Registration failed. Please try again.";

      setErrors({ api: message });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor="#01AEB8" />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join MediFind and get started</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Register</Text>
            <Text style={styles.formSubtitle}>
              Enter your details to create your account
            </Text>

            <MyTextInput
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChangeText={(value) => {
                setName(value);
                setErrors((previous) => ({
                  ...previous,
                  name: "",
                  api: "",
                }));
              }}
              autoCapitalize="words"
            />

            {errors.name ? (
              <Text style={styles.errorText}>{errors.name}</Text>
            ) : null}

            <MyTextInput
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                setErrors((previous) => ({
                  ...previous,
                  email: "",
                  api: "",
                }));
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {errors.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}

            <MyTextInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                setErrors((previous) => ({
                  ...previous,
                  password: "",
                  confirmPassword: "",
                  api: "",
                }));
              }}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />

            <Pressable
              style={styles.showPasswordButton}
              onPress={() => setShowPassword((previous) => !previous)}
            >
              <Text style={styles.showPasswordText}>
                {showPassword ? "Hide password" : "Show password"}
              </Text>
            </Pressable>

            {errors.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}

            <MyTextInput
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={(value) => {
                setConfirmPassword(value);
                setErrors((previous) => ({
                  ...previous,
                  confirmPassword: "",
                  api: "",
                }));
              }}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
            />

            <Pressable
              style={styles.showPasswordButton}
              onPress={() => setShowConfirmPassword((previous) => !previous)}
            >
              <Text style={styles.showPasswordText}>
                {showConfirmPassword ? "Hide password" : "Show password"}
              </Text>
            </Pressable>

            {errors.confirmPassword ? (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            ) : null}

            {/* Register as a doctor checkbox */}
            <Pressable
              style={styles.doctorCheckboxContainer}
              onPress={() => setIsDoctor((previous) => !previous)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isDoctor }}
            >
              <View
                style={[styles.checkbox, isDoctor && styles.checkboxChecked]}
              >
                {isDoctor ? <Text style={styles.checkmark}>✓</Text> : null}
              </View>

              <Text style={styles.doctorCheckboxLabel}>
                Register as a doctor
              </Text>
            </Pressable>

            {errors.api ? (
              <Text style={styles.errorText}>{errors.api}</Text>
            ) : null}

            <MyButton
              title={isLoading ? "Creating Account..." : "Create Account"}
              onPress={handleRegister}
              disabled={isLoading}
            />

            {isLoading ? (
              <ActivityIndicator
                size="small"
                color="#01AEB8"
                style={styles.loader}
              />
            ) : null}

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>

              <Pressable onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginLink}>Login</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default RegisterPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#01AEB8",
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },

  header: {
    backgroundColor: "#01AEB8",
    paddingTop: 55,
    paddingBottom: 35,
    paddingHorizontal: 25,
    alignItems: "center",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
  },

  subtitle: {
    color: "#FFFFFF",
    fontSize: 15,
    opacity: 0.9,
  },

  formContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingBottom: 30,
  },

  formTitle: {
    color: "#111827",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
  },

  formSubtitle: {
    color: "#6B7280",
    fontSize: 14,
    marginBottom: 25,
  },

  errorText: {
    color: "#DC2626",
    fontSize: 12,
    marginTop: -10,
    marginBottom: 15,
  },

  showPasswordButton: {
    alignSelf: "flex-end",
    marginTop: -12,
    marginBottom: 15,
    paddingVertical: 4,
  },

  showPasswordText: {
    color: "#01AEB8",
    fontSize: 13,
    fontWeight: "600",
  },

  doctorCheckboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderColor: "#9CA3AF",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  checkboxChecked: {
    backgroundColor: "#01AEB8",
    borderColor: "#01AEB8",
  },

  checkmark: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 19,
  },

  doctorCheckboxLabel: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "500",
  },

  loader: {
    marginTop: 12,
  },

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },

  loginText: {
    color: "#6B7280",
    fontSize: 14,
  },

  loginLink: {
    color: "#01AEB8",
    fontSize: 14,
    fontWeight: "700",
  },
});
