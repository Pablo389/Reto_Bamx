import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import RegisterForm from "../register"; // Ruta según tu estructura de carpetas.

jest.mock("expo-router", () => ({
  useRouter: () => ({ back: jest.fn(), replace: jest.fn() }),
}));



describe("RegisterForm", () => {
  it("renders all input fields correctly", () => {
    const { getByPlaceholderText } = render(<RegisterForm />);

    expect(getByPlaceholderText("Ingresa tu nombre")).toBeTruthy();
    expect(getByPlaceholderText("(331) 538-4179")).toBeTruthy();
    expect(getByPlaceholderText("nombre@ejemplo.com")).toBeTruthy();
    expect(getByPlaceholderText("************")).toBeTruthy();
    expect(getByPlaceholderText("4202 Glencrest St")).toBeTruthy();
  });

  it("updates input values on change", () => {
    const { getByPlaceholderText } = render(<RegisterForm />);

    const nameInput = getByPlaceholderText("Ingresa tu nombre");
    fireEvent.changeText(nameInput, "Juan Pérez");

    expect(nameInput.props.value).toBe("Juan Pérez");
  });

 
});
