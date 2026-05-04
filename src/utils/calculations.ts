import type { Role, RoleMix, GlobalInputs, ScenarioColumn, BreakEvenMetrics } from '../types';

export const SCENARIO_WORKERS = [10, 50, 75, 100, 150, 200, 300] as const;

export function computeEmployerCostPerHour(role: Role): number {
  return role.baseHourlyRate * (1 + role.socialSecurityPct);
}

export function computeBlendedLabourCost(
  roles: Role[],
  roleMix: RoleMix[],
  mixIsValid: boolean
): number {
  if (!mixIsValid || roles.length === 0) return NaN;

  return roleMix.reduce((sum, mix) => {
    const role = roles.find(r => r.id === mix.roleId);
    if (!role) return sum;
    return sum + computeEmployerCostPerHour(role) * (mix.mixPct / 100);
  }, 0);
}

export function computeMixSum(roleMix: RoleMix[]): number {
  return roleMix.reduce((sum, m) => sum + m.mixPct, 0);
}

export function computeFixedCostPerHour(
  monthlyFixedCost: number,
  workers: number,
  hoursPerWorkerMonth: number
): number {
  const denominator = workers * hoursPerWorkerMonth;
  if (denominator <= 0) return Infinity;
  return monthlyFixedCost / denominator;
}

export function computeSellingPrice(totalCostPerHour: number, marginPct: number): number {
  const clampedMargin = Math.min(Math.max(marginPct, 0.001), 0.999);
  return totalCostPerHour / (1 - clampedMargin);
}

export function computeScenarioColumn(
  workers: number,
  blendedLabourCostPerHour: number,
  globalInputs: GlobalInputs
): ScenarioColumn {
  const { hoursPerWorkerMonth, marginPct, monthlyFixedCost } = globalInputs;

  const fixedCostPerHour = computeFixedCostPerHour(monthlyFixedCost, workers, hoursPerWorkerMonth);
  const totalCostPerHour = blendedLabourCostPerHour + fixedCostPerHour;
  const sellingPricePerHour = computeSellingPrice(totalCostPerHour, marginPct);
  const totalMonthlyLabourCost = blendedLabourCostPerHour * workers * hoursPerWorkerMonth;
  const totalInvoiced = sellingPricePerHour * workers * hoursPerWorkerMonth;
  const profit = totalInvoiced - totalMonthlyLabourCost - monthlyFixedCost;
  const actualMarginPct = totalInvoiced > 0 ? profit / totalInvoiced : NaN;

  return {
    workers,
    labourCostPerHour: blendedLabourCostPerHour,
    fixedCostPerHour,
    totalCostPerHour,
    sellingPricePerHour,
    totalMonthlyLabourCost,
    totalInvoiced,
    profit,
    actualMarginPct,
  };
}

export function computeBreakEven(
  blendedLabourCostPerHour: number,
  globalInputs: GlobalInputs
): BreakEvenMetrics {
  const { hoursPerWorkerMonth, marginPct, monthlyFixedCost } = globalInputs;

  if (!isFinite(blendedLabourCostPerHour) || blendedLabourCostPerHour <= 0) {
    return { breakEvenWorkers: NaN, minWorkersToCoverFixed: NaN, breakEvenPricePerHour: NaN };
  }

  const breakEvenWorkers = monthlyFixedCost / (blendedLabourCostPerHour * hoursPerWorkerMonth);
  const minWorkersToCoverFixed = Math.ceil(breakEvenWorkers);
  const clampedMargin = Math.min(Math.max(marginPct, 0.001), 0.999);
  const breakEvenPricePerHour = blendedLabourCostPerHour / (1 - clampedMargin);

  return { breakEvenWorkers, minWorkersToCoverFixed, breakEvenPricePerHour };
}

export function normalizeMix(roleMix: RoleMix[]): RoleMix[] {
  const total = computeMixSum(roleMix);
  if (total === 0) return roleMix;
  return roleMix.map(m => ({ ...m, mixPct: Math.round((m.mixPct / total) * 100 * 10) / 10 }));
}
