import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import RegisterForm from "../register"; // Ruta según tu estructura de carpetas.
import { Alert } from "react-native";

jest.mock("expo-router", () => ({
  useRouter: () => ({ back: jest.fn(), replace: jest.fn() }),
}));

afterEach(() => {
    jest.restoreAllMocks(); // Limpia todos los mocks después de cada prueba.
  });

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

  it("shows an alert when required fields are missing", async () => {
    jest.spyOn(Alert, "alert"); // Espiar el método Alert.alert.
  
    const { getByText } = render(<RegisterForm />);
  
    const registerButton = getByText("Registrarse");
    fireEvent.press(registerButton); // Simula el clic en el botón.
  
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Por favor, rellena todos los campos obligatorios."
      );
    });

  });

  it("shows an alert when the password is too short", async () => {
    jest.spyOn(Alert, "alert");
  
    const { getByPlaceholderText, getByText } = render(<RegisterForm />);
  
    fireEvent.changeText(getByPlaceholderText("Ingresa tu nombre"), "Juan Pérez");
    fireEvent.changeText(getByPlaceholderText("nombre@ejemplo.com"), "juan.perez@example.com");
    fireEvent.changeText(getByPlaceholderText("(331) 538-4179"), "3315384179");
    fireEvent.changeText(getByPlaceholderText("************"), "123"); // Contraseña corta.
  
    const registerButton = getByText("Registrarse");
    fireEvent.press(registerButton);
  
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "La contraseña debe tener al menos 6 caracteres."
      );
    });
  
    jest.restoreAllMocks();
  });
  

  
 
});
