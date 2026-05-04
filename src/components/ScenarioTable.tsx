import type { ScenarioColumn } from '../types';
import { formatEuro, formatPercent } from '../utils/formatting';

interface Props {
  scenarioColumns: ScenarioColumn[];
  mixIsValid: boolean;
}

type RowKey = keyof Omit<ScenarioColumn, 'workers'>;

interface RowDefinition {
  key: RowKey;
  label: string;
  format: (v: number) => string;
  conditional?: boolean;
  divider?: boolean;
}

const ROW_DEFINITIONS: RowDefinition[] = [
  { key: 'labourCostPerHour', label: 'Labour Cost / h', format: formatEuro },
  { key: 'fixedCostPerHour', label: 'Fixed Cost / h', format: formatEuro },
  { key: 'totalCostPerHour', label: 'Total Cost / h', format: formatEuro, divider: true },
  { key: 'sellingPricePerHour', label: 'Selling Price / h', format: formatEuro, divider: true },
  { key: 'totalMonthlyLabourCost', label: 'Monthly Labour Cost', format: formatEuro },
  { key: 'totalInvoiced', label: 'Total Invoiced / Month', format: formatEuro },
  { key: 'profit', label: 'Profit (PNL)', format: formatEuro, conditional: true, divider: true },
  { key: 'actualMarginPct', label: 'Actual Margin %', format: formatPercent },
];

export default function ScenarioTable({ scenarioColumns, mixIsValid }: Props) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 flex flex-col h-full">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
          Scenario Projections
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Cost & pricing model across workforce sizes
        </p>
      </div>

      <div className="overflow-x-auto flex-1">
        {!mixIsValid ? (
          <div className="flex items-center justify-center h-full min-h-48 text-gray-400">
            <div className="text-center">
              <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm">Fix workforce mix to 100% to see projections</p>
            </div>
          </div>
        ) : (
          <table className="w-full border-collapse text-sm min-w-max">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider sticky left-0 bg-gray-800 whitespace-nowrap min-w-44">
                  Metric
                </th>
                {scenarioColumns.map(col => (
                  <th
                    key={col.workers}
                    className="px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wider whitespace-nowrap"
                  >
                    {col.workers} workers
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROW_DEFINITIONS.map((row, rowIdx) => (
                <tr
                  key={row.key}
                  className={`${rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${row.divider ? 'border-t-2 border-gray-200' : ''}`}
                >
                  <td className={`px-4 py-2 font-medium text-gray-600 text-xs sticky left-0 whitespace-nowrap ${rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    {row.label}
                  </td>
                  {scenarioColumns.map(col => {
                    const value = col[row.key];
                    let cellClass = 'px-4 py-2 text-right tabular-nums text-sm';

                    if (row.conditional) {
                      if (value >= 0) {
                        cellClass += ' text-green-700 font-semibold bg-green-50';
                      } else {
                        cellClass += ' text-red-700 font-semibold bg-red-50';
                      }
                    } else {
                      cellClass += row.key === 'sellingPricePerHour'
                        ? ' text-blue-700 font-semibold'
                        : ' text-gray-800';
                    }

                    return (
                      <td key={col.workers} className={cellClass}>
                        {row.format(value)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
