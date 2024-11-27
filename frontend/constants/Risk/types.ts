export interface DonationItem {
    id: string;
    name: string;
    quantifiable: boolean;
    unit?: string;
    limit?: number;
    current: number;
    active?: boolean;
    type: 'Esenciales' | 'Emergencia' | 'Especie';
  }
  
  export interface TransportRoute {
    id: string;
    pointA: string;
    pointB: string;
    requiredPeople: number;
    currentPeople: number;
  }
  
  export interface VolunteerGroup {
    maximo: number;
    registrados: number;
  }
  
  export interface RiskSituation {
    id?: string;
    nombre: string;
    tipoDesastre: string;
    donar: boolean;
    donarDinero: boolean;
    donarEsenciales: boolean;
    donarEmergencia: boolean;
    donarEspecie: boolean;
    voluntarios: boolean;
    instruccionesDinero: string;
    itemsEsenciales: DonationItem[];
    itemsEmergencia: DonationItem[];
    itemsEspecie: DonationItem[];
    voluntariosBrigadas: VolunteerGroup;
    voluntariosEnfermeria: VolunteerGroup;
    voluntariosTransporte: TransportRoute[];
  }
  
  export interface PredefinedItems {
    Esenciales: DonationItem[];
    Emergencia: DonationItem[];
    Especie: DonationItem[];
  }
  