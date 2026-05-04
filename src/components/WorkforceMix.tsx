import type { Role, RoleMix } from '../types';

interface Props {
  roles: Role[];
  roleMix: RoleMix[];
  mixSum: number;
  mixIsValid: boolean;
  onUpdateMix: (roleId: string, pct: number) => void;
  onNormalize: () => void;
}

export default function WorkforceMix({
  roles,
  roleMix,
  mixSum,
  mixIsValid,
  onUpdateMix,
  onNormalize,
}: Props) {
  const deviation = Math.abs(mixSum - 100);

  const sumColor = mixIsValid
    ? 'text-green-600'
    : deviation <= 5
    ? 'text-orange-500'
    : 'text-red-500';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
          Workforce Mix
        </h2>
        {!mixIsValid && roles.length > 0 && (
          <button
            onClick={onNormalize}
            className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded hover:bg-orange-200 transition-colors"
          >
            Normalize to 100%
          </button>
        )}
      </div>

      {roles.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-4">Add roles first</p>
      ) : (
        <>
          <div className="space-y-2">
            {roleMix.map(mix => {
              const role = roles.find(r => r.id === mix.roleId);
              if (!role) return null;
              return (
                <div key={mix.roleId} className="flex items-center gap-3">
                  <span className="text-sm text-gray-700 w-24 truncate" title={role.name}>
                    {role.name}
                  </span>
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full pr-6 tabular-nums"
                      value={mix.mixPct}
                      min={0}
                      max={100}
                      step={1}
                      onChange={e => onUpdateMix(mix.roleId, Number(e.target.value))}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">%</span>
                  </div>
                  <div className="w-24 bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(mix.mixPct, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className={`mt-3 pt-3 border-t border-gray-200 flex justify-between items-center`}>
            <span className="text-xs text-gray-500">Total:</span>
            <span className={`text-sm font-semibold ${sumColor}`}>
              {mixSum.toFixed(1)}%
              {!mixIsValid && (
                <span className="ml-1 text-xs font-normal">
                  ({mixSum < 100 ? `+${(100 - mixSum).toFixed(1)}% needed` : `−${(mixSum - 100).toFixed(1)}% excess`})
                </span>
              )}
            </span>
          </div>

          {!mixIsValid && (
            <p className="mt-2 text-xs text-orange-600 bg-orange-50 rounded p-2">
              Workforce mix must total exactly 100% to enable calculations.
            </p>
          )}
        </>
      )}
    </div>
  );
}
