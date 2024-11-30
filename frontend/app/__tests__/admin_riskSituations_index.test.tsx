import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import  RiskSituationsScreen from "../(app)/(admin)/(riskSituations)/index";
import { useRouter } from "expo-router";

// Mock de `useRiskSituations` y `useRouter`
jest.mock("@/hooks/riskSituations", () => ({
  useRiskSituations: jest.fn(),
}));

jest.mock("expo-router", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

const mockSituations = [
  {
    id: "1",
    tipoDesastre: "Incendio",
    nombre: "Incendio en zona residencial",
    donar: true,
    voluntarios: true,
    donarDinero: true,
    voluntariosBrigadas: { registrados: 3, maximo: 10 },
  },
  {
    id: "2",
    tipoDesastre: "Inundación",
    nombre: "Inundación en área rural",
    donar: false,
    voluntarios: true,
    donarDinero: false,
    voluntariosBrigadas: { registrados: 5, maximo: 20 },
  },
];

describe("RiskSituationsScreen", () => {
  it("renderiza correctamente el título de la pantalla", () => {
    const mockUseRiskSituations = require("@/hooks/riskSituations");
    mockUseRiskSituations.useRiskSituations.mockReturnValue({
      riskSituations: [],
      isLoading: false,
      error: null,
    });

    render(<RiskSituationsScreen />);
    expect(screen.getByText("Situaciones de Riesgo")).toBeTruthy();
  });

  it("muestra el estado de carga mientras se obtienen los datos", () => {
    const mockUseRiskSituations = require("@/hooks/riskSituations");
    mockUseRiskSituations.useRiskSituations.mockReturnValue({
      riskSituations: [],
      isLoading: true,
      error: null,
    });

    render(<RiskSituationsScreen />);
    expect(screen.getByText("Cargando situaciones de riesgo...")).toBeTruthy();
  });

  it("muestra un mensaje de error si ocurre un problema", () => {
    const mockUseRiskSituations = require("@/hooks/riskSituations");
    mockUseRiskSituations.useRiskSituations.mockReturnValue({
      riskSituations: [],
      isLoading: false,
      error: "Error al cargar datos",
    });

    render(<RiskSituationsScreen />);
    expect(screen.getByText("Error al cargar datos")).toBeTruthy();
  });

  it("muestra un mensaje si no hay situaciones de riesgo", () => {
    const mockUseRiskSituations = require("@/hooks/riskSituations");
    mockUseRiskSituations.useRiskSituations.mockReturnValue({
      riskSituations: [],
      isLoading: false,
      error: null,
    });

    render(<RiskSituationsScreen />);
    expect(screen.getByText("No hay situaciones de riesgo activas")).toBeTruthy();
  });

  it("renderiza correctamente las situaciones de riesgo con datos", () => {
    const mockUseRiskSituations = require("@/hooks/riskSituations");
    mockUseRiskSituations.useRiskSituations.mockReturnValue({
      riskSituations: mockSituations,
      isLoading: false,
      error: null,
    });

    render(<RiskSituationsScreen />);

    expect(screen.getByText("Incendio en zona residencial")).toBeTruthy();
    expect(screen.getByText("Inundación en área rural")).toBeTruthy();
    expect(screen.getByText("Acepta donaciones")).toBeTruthy();
    expect(screen.getByText("Brigadas: 3/10")).toBeTruthy();
  });

});
