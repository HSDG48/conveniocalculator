import type { BreakEvenMetrics } from '../types';
import { formatEuro, formatNumber } from '../utils/formatting';

interface Props {
  breakEven: BreakEvenMetrics;
  mixIsValid: boolean;
}

export default function BreakEvenPanel({ breakEven, mixIsValid }: Props) {
  const { minWorkersToCoverFixed, breakEvenWorkers, breakEvenPricePerHour } = breakEven;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-1">
        Break-Even Analysis
      </h2>
      <p className="text-xs text-gray-400 mb-3">
        Minimum scale to cover fixed overhead
      </p>

      {!mixIsValid ? (
        <p className="text-xs text-gray-400 text-center py-2">Fix mix to 100% first</p>
      ) : (
        <div className="space-y-3">
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
            <span className="text-xs font-medium text-amber-700 uppercase tracking-wide block mb-1">
              Min Workers to Cover Fixed Cost
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-amber-800 tabular-nums">
                {isNaN(minWorkersToCoverFixed) ? '—' : formatNumber(minWorkersToCoverFixed)}
              </span>
              <span className="text-sm text-amber-600">workers</span>
            </div>
            {!isNaN(breakEvenWorkers) && (
              <span className="text-xs text-amber-600 mt-1 block">
                Exact: {breakEvenWorkers.toFixed(1)} workers
              </span>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <span className="text-xs font-medium text-blue-700 uppercase tracking-wide block mb-1">
              Break-Even Price / Hour
            </span>
            <span className="text-2xl font-bold text-blue-800 tabular-nums block">
              {formatEuro(breakEvenPricePerHour)}
            </span>
            <span className="text-xs text-blue-600 mt-1 block">
              Labour cost only, at target margin
            </span>
          </div>

          <div className="text-xs text-gray-400 bg-gray-50 rounded p-2.5 leading-relaxed">
            <strong className="text-gray-500">Formula:</strong> Break-even workers = Fixed Cost ÷ (Blended Cost × Hours/Month).
            At this scale, labour margin exactly absorbs the fixed overhead.
          </div>
        </div>
      )}
    </div>
  );
}
