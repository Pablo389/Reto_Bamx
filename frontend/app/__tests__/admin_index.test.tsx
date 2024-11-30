import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import  AdminDashboard  from "../(app)/(admin)/index";


// Mock de Firebase y las funciones externas
jest.mock("firebase/firestore", () => ({
  query: jest.fn(),
  collection: jest.fn(),
  where: jest.fn(),
  onSnapshot: jest.fn((_, callback) =>
    callback({
      docs: [
        { id: "1", data: () => mockUser1 },
        { id: "2", data: () => mockUser2 },
      ],
    })
  ),
}));


// Mock de datos
const mockUser1 = {
  id: "1",
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "123456789",
  address: "123 Main St",
  gender: "Male",
  role: "user",
  birthday: "2000-01-01",
  createdAt: "2023-01-01",
  updatedAt: "2023-01-02",
};

const mockUser2 = {
  id: "2",
  name: "Jane Smith",
  email: "jane.smith@example.com",
  phone: "987654321",
  address: "456 Elm St",
  gender: "Female",
  role: "user",
  birthday: "1995-01-01",
  createdAt: "2023-01-01",
  updatedAt: "2023-01-02",
};

describe("AdminDashboard", () => {
  it("renderiza el título del dashboard", () => {
    render(<AdminDashboard />);
    expect(screen.getByText("Usuarios Registrados")).toBeTruthy();
  });

  it("muestra el número correcto de usuarios en las estadísticas", async () => {
    render(<AdminDashboard />);
    expect(await screen.findByText("2")).toBeTruthy(); // Total usuarios
    expect(screen.getByText("Total Usuarios")).toBeTruthy();
  });

  it("renderiza los datos de un usuario correctamente", async () => {
    render(<AdminDashboard />);

    // Verificar detalles del primer usuario
    expect(await screen.findByText("John Doe")).toBeTruthy();
    expect(screen.getByText("john.doe@example.com")).toBeTruthy();
    expect(screen.getByText("123456789")).toBeTruthy();
    expect(screen.getByText("123 Main St")).toBeTruthy();

    // Verificar detalles del segundo usuario
    expect(await screen.findByText("Jane Smith")).toBeTruthy();
    expect(screen.getByText("jane.smith@example.com")).toBeTruthy();
    expect(screen.getByText("987654321")).toBeTruthy();
    expect(screen.getByText("456 Elm St")).toBeTruthy();
  });

});

