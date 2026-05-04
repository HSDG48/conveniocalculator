import type { GlobalInputs, ScenarioColumn } from '../types';
import { formatEuro, formatPercent } from '../utils/formatting';
import { computeEmployerCostPerHour } from '../utils/calculations';
import type { Role, RoleMix } from '../types';

interface Props {
  blendedLabourCostPerHour: number;
  globalInputs: GlobalInputs;
  roles: Role[];
  roleMix: RoleMix[];
  mixIsValid: boolean;
  referenceColumn: ScenarioColumn | undefined;
}

interface KpiCardProps {
  label: string;
  value: string;
  sub?: string;
  accent?: 'blue' | 'green' | 'red' | 'gray';
}

function KpiCard({ label, value, sub, accent = 'gray' }: KpiCardProps) {
  const valueColors = {
    blue: 'text-blue-700',
    green: 'text-green-700',
    red: 'text-red-600',
    gray: 'text-gray-900',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
        {label}
      </span>
      <span className={`text-xl font-bold tabular-nums block ${valueColors[accent]}`}>{value}</span>
      {sub && <span className="text-xs text-gray-400 mt-0.5 block">{sub}</span>}
    </div>
  );
}

export default function SummaryMetrics({
  blendedLabourCostPerHour,
  globalInputs,
  roles,
  roleMix,
  mixIsValid,
  referenceColumn,
}: Props) {
  const { marginPct, monthlyFixedCost, hoursPerWorkerMonth } = globalInputs;
  const blendedSellingPrice = isFinite(blendedLabourCostPerHour)
    ? blendedLabourCostPerHour / (1 - marginPct)
    : NaN;

  if (!mixIsValid || roles.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-3">
          Summary
        </h2>
        <p className="text-xs text-gray-400">Set a valid 100% workforce mix to see summary metrics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-3">
          Summary Metrics
        </h2>
        <div className="space-y-2">
          <KpiCard
            label="Blended Labour Cost/h"
            value={formatEuro(blendedLabourCostPerHour)}
            sub="Weighted avg employer cost"
            accent="gray"
          />
          <KpiCard
            label="Selling Price/h (labour only)"
            value={formatEuro(blendedSellingPrice)}
            sub={`At ${formatPercent(marginPct)} margin, no overhead`}
            accent="blue"
          />
          <KpiCard
            label="Target Margin"
            value={formatPercent(marginPct)}
            sub="Price = Cost ÷ (1 − margin)"
            accent="blue"
          />
          <KpiCard
            label="Monthly Fixed Cost"
            value={formatEuro(monthlyFixedCost)}
            sub="Distributed across all workers"
            accent="gray"
          />
          <KpiCard
            label="Hours / Worker / Month"
            value={`${hoursPerWorkerMonth}h`}
            accent="gray"
          />
        </div>
      </div>

      {referenceColumn && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-1">
            At {referenceColumn.workers} Workers
          </h2>
          <p className="text-xs text-gray-400 mb-3">Reference scenario</p>
          <div className="space-y-2">
            <KpiCard
              label="Selling Price / h"
              value={formatEuro(referenceColumn.sellingPricePerHour)}
              accent="blue"
            />
            <KpiCard
              label="Total Invoiced / Month"
              value={formatEuro(referenceColumn.totalInvoiced)}
              accent="blue"
            />
            <KpiCard
              label="Monthly Profit"
              value={formatEuro(referenceColumn.profit)}
              accent={referenceColumn.profit >= 0 ? 'green' : 'red'}
            />
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-3">
          Role Costs
        </h2>
        <div className="space-y-1.5">
          {roles.map(role => {
            const mix = roleMix.find(m => m.roleId === role.id);
            return (
              <div key={role.id} className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-medium text-gray-700">{role.name}</span>
                  <span className="text-gray-400 ml-1">({mix?.mixPct ?? 0}%)</span>
                </div>
                <span className="tabular-nums text-gray-600 font-medium">
                  {formatEuro(computeEmployerCostPerHour(role))}/h
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
