export interface Role {
  id: string;
  name: string;
  baseHourlyRate: number;
  socialSecurityPct: number;
}

export interface RoleMix {
  roleId: string;
  mixPct: number;
}

export interface GlobalInputs {
  hoursPerWorkerMonth: number;
  globalSocialSecurityPct: number;
  marginPct: number;
  monthlyFixedCost: number;
}

export interface ScenarioColumn {
  workers: number;
  labourCostPerHour: number;
  fixedCostPerHour: number;
  totalCostPerHour: number;
  sellingPricePerHour: number;
  totalMonthlyLabourCost: number;
  totalInvoiced: number;
  profit: number;
  actualMarginPct: number;
}

export interface BreakEvenMetrics {
  breakEvenWorkers: number;
  minWorkersToCoverFixed: number;
  breakEvenPricePerHour: number;
}

export interface CalculatorState {
  roles: Role[];
  roleMix: RoleMix[];
  globalInputs: GlobalInputs;
  blendedLabourCostPerHour: number;
  scenarioColumns: ScenarioColumn[];
  breakEven: BreakEvenMetrics;
  mixIsValid: boolean;
  mixSum: number;
}
