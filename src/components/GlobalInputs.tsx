import type { GlobalInputs as GlobalInputsType } from '../types';

interface Props {
  globalInputs: GlobalInputsType;
  onUpdate: (patch: Partial<GlobalInputsType>) => void;
  onReset: () => void;
}

const inputClass =
  'border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-28 tabular-nums';
const labelClass = 'text-xs font-medium text-gray-500 uppercase tracking-wide';

export default function GlobalInputs({ globalInputs, onUpdate, onReset }: Props) {
  const { hoursPerWorkerMonth, globalSocialSecurityPct, marginPct, monthlyFixedCost } =
    globalInputs;

  function handleMarginBlur(value: number) {
    const clamped = Math.min(Math.max(value / 100, 0.001), 0.999);
    onUpdate({ marginPct: clamped });
  }

  function handleSsBlur(value: number) {
    const clamped = Math.min(Math.max(value / 100, 0), 0.99);
    onUpdate({ globalSocialSecurityPct: clamped });
  }

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm px-6 py-3">
      <div className="flex flex-wrap gap-6 items-end">
        <div className="flex flex-col gap-1">
          <span className={labelClass}>Hours / Worker / Month</span>
          <input
            type="number"
            className={inputClass}
            value={hoursPerWorkerMonth}
            min={1}
            max={744}
            step={1}
            onChange={e => onUpdate({ hoursPerWorkerMonth: Number(e.target.value) })}
          />
        </div>

        <div className="flex flex-col gap-1">
          <span className={labelClass}>Social Security % (default)</span>
          <div className="relative">
            <input
              type="number"
              className={`${inputClass} pr-6`}
              value={Math.round(globalSocialSecurityPct * 1000) / 10}
              min={0}
              max={99}
              step={0.1}
              onBlur={e => handleSsBlur(Number(e.target.value))}
              onChange={e => onUpdate({ globalSocialSecurityPct: Number(e.target.value) / 100 })}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">%</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className={labelClass}>Target Margin %</span>
          <div className="relative">
            <input
              type="number"
              className={`${inputClass} pr-6`}
              value={Math.round(marginPct * 1000) / 10}
              min={0.1}
              max={99.9}
              step={0.1}
              onBlur={e => handleMarginBlur(Number(e.target.value))}
              onChange={e => onUpdate({ marginPct: Number(e.target.value) / 100 })}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">%</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className={labelClass}>Monthly Fixed Cost</span>
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">€</span>
            <input
              type="number"
              className={`${inputClass} pl-5 w-36`}
              value={monthlyFixedCost}
              min={0}
              step={1000}
              onChange={e => onUpdate({ monthlyFixedCost: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="ml-auto flex items-end">
          <button
            onClick={onReset}
            className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 rounded px-3 py-1.5 hover:border-gray-300 transition-colors"
          >
            Reset to defaults
          </button>
        </div>
      </div>
    </div>
  );
}
