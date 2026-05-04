import type { Role } from '../types';
import { computeEmployerCostPerHour } from '../utils/calculations';
import { formatEuro } from '../utils/formatting';

interface Props {
  roles: Role[];
  globalSocialSecurityPct: number;
  onAddRole: () => void;
  onRemoveRole: (id: string) => void;
  onUpdateRole: (id: string, patch: Partial<Role>) => void;
}

const inputClass =
  'border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full tabular-nums';

export default function RoleBuilder({
  roles,
  onAddRole,
  onRemoveRole,
  onUpdateRole,
}: Props) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
          Role Builder
        </h2>
        <button
          onClick={onAddRole}
          className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors font-medium"
        >
          + Add Role
        </button>
      </div>

      {roles.length === 0 ? (
        <div className="text-center py-6 text-gray-400 text-sm">
          <p>No roles defined.</p>
          <button
            onClick={onAddRole}
            className="mt-2 text-blue-500 hover:text-blue-700 underline text-xs"
          >
            Add your first role
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {roles.map(role => {
            const employerCost = computeEmployerCostPerHour(role);
            return (
              <div key={role.id} className="bg-gray-50 rounded-md p-3 border border-gray-100">
                <div className="flex gap-2 items-start">
                  <div className="flex-1 flex flex-col gap-1">
                    <label className="text-xs text-gray-500">Role Name</label>
                    <input
                      type="text"
                      className={inputClass}
                      value={role.name}
                      onChange={e => onUpdateRole(role.id, { name: e.target.value })}
                      placeholder="e.g. Peón"
                    />
                  </div>
                  <button
                    onClick={() => onRemoveRole(role.id)}
                    className="mt-5 text-red-400 hover:text-red-600 p-1 transition-colors flex-shrink-0"
                    title="Remove role"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500">Base Rate (€/h)</label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">€</span>
                      <input
                        type="number"
                        className={`${inputClass} pl-5`}
                        value={role.baseHourlyRate}
                        min={0}
                        step={0.01}
                        onChange={e =>
                          onUpdateRole(role.id, { baseHourlyRate: Number(e.target.value) })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500">SS % (override)</label>
                    <div className="relative">
                      <input
                        type="number"
                        className={`${inputClass} pr-6`}
                        value={Math.round(role.socialSecurityPct * 1000) / 10}
                        min={0}
                        max={99}
                        step={0.1}
                        onChange={e =>
                          onUpdateRole(role.id, {
                            socialSecurityPct: Number(e.target.value) / 100,
                          })
                        }
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-xs text-gray-500">Employer cost/hour:</span>
                  <span className="text-xs font-semibold text-blue-700">
                    {formatEuro(employerCost)}/h
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
