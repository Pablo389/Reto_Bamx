import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LoginScreen from "../sign-in";



jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
}));

const mockSignIn = jest.fn();

jest.mock("@/hooks/ctx", () => ({
  useSession: () => ({
    signIn: mockSignIn,
  }),
}));

describe("LoginScreen", () => {
  it("renders all components correctly", () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    expect(getByPlaceholderText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Contraseña")).toBeTruthy();
    expect(getByText("Login")).toBeTruthy();
    expect(getByText("Sign in with Apple")).toBeTruthy();
    expect(getByText("Sign in with Google")).toBeTruthy();
    expect(getByText("Eres nuevo?")).toBeTruthy();
  });

  
  it("handles login flow correctly", async () => {
    mockSignIn.mockResolvedValueOnce(undefined); // Simula inicio de sesión exitoso
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Contraseña");
    const loginButton = getByText("Login");

    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "password123");
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith("test@example.com", "password123");
    });
  });

  
});
