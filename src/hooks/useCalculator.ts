import { useReducer, useMemo } from 'react';
import type { Role, RoleMix, GlobalInputs } from '../types';
import {
  SCENARIO_WORKERS,
  computeBlendedLabourCost,
  computeMixSum,
  computeScenarioColumn,
  computeBreakEven,
  normalizeMix,
} from '../utils/calculations';

interface AppState {
  roles: Role[];
  roleMix: RoleMix[];
  globalInputs: GlobalInputs;
}

type Action =
  | { type: 'ADD_ROLE' }
  | { type: 'REMOVE_ROLE'; id: string }
  | { type: 'UPDATE_ROLE'; id: string; patch: Partial<Role> }
  | { type: 'UPDATE_MIX'; roleId: string; pct: number }
  | { type: 'NORMALIZE_MIX' }
  | { type: 'UPDATE_GLOBAL'; patch: Partial<GlobalInputs> }
  | { type: 'RESET_TO_DEFAULTS' };

const DEFAULT_GLOBAL: GlobalInputs = {
  hoursPerWorkerMonth: 180,
  globalSocialSecurityPct: 0.33,
  marginPct: 0.15,
  monthlyFixedCost: 50000,
};

const DEFAULT_STATE: AppState = {
  roles: [
    { id: 'peon', name: 'Peón', baseHourlyRate: 9.5, socialSecurityPct: 0.33 },
    { id: 'oficial', name: 'Oficial', baseHourlyRate: 12.0, socialSecurityPct: 0.33 },
  ],
  roleMix: [
    { roleId: 'peon', mixPct: 60 },
    { roleId: 'oficial', mixPct: 40 },
  ],
  globalInputs: DEFAULT_GLOBAL,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_ROLE': {
      const newId = crypto.randomUUID();
      return {
        ...state,
        roles: [
          ...state.roles,
          {
            id: newId,
            name: 'New Role',
            baseHourlyRate: 10,
            socialSecurityPct: state.globalInputs.globalSocialSecurityPct,
          },
        ],
        roleMix: [...state.roleMix, { roleId: newId, mixPct: 0 }],
      };
    }

    case 'REMOVE_ROLE':
      return {
        ...state,
        roles: state.roles.filter(r => r.id !== action.id),
        roleMix: state.roleMix.filter(m => m.roleId !== action.id),
      };

    case 'UPDATE_ROLE':
      return {
        ...state,
        roles: state.roles.map(r =>
          r.id === action.id ? { ...r, ...action.patch } : r
        ),
      };

    case 'UPDATE_MIX':
      return {
        ...state,
        roleMix: state.roleMix.map(m =>
          m.roleId === action.roleId ? { ...m, mixPct: action.pct } : m
        ),
      };

    case 'NORMALIZE_MIX':
      return { ...state, roleMix: normalizeMix(state.roleMix) };

    case 'UPDATE_GLOBAL':
      return {
        ...state,
        globalInputs: { ...state.globalInputs, ...action.patch },
      };

    case 'RESET_TO_DEFAULTS':
      return DEFAULT_STATE;

    default:
      return state;
  }
}

export function useCalculator() {
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE);
  const { roles, roleMix, globalInputs } = state;

  const mixSum = useMemo(() => computeMixSum(roleMix), [roleMix]);
  const mixIsValid = useMemo(() => Math.abs(mixSum - 100) < 0.01, [mixSum]);

  const blendedLabourCostPerHour = useMemo(
    () => computeBlendedLabourCost(roles, roleMix, mixIsValid),
    [roles, roleMix, mixIsValid]
  );

  const scenarioColumns = useMemo(
    () =>
      SCENARIO_WORKERS.map(w =>
        computeScenarioColumn(w, blendedLabourCostPerHour, globalInputs)
      ),
    [blendedLabourCostPerHour, globalInputs]
  );

  const breakEven = useMemo(
    () => computeBreakEven(blendedLabourCostPerHour, globalInputs),
    [blendedLabourCostPerHour, globalInputs]
  );

  const actions = {
    addRole: () => dispatch({ type: 'ADD_ROLE' }),
    removeRole: (id: string) => dispatch({ type: 'REMOVE_ROLE', id }),
    updateRole: (id: string, patch: Partial<Role>) =>
      dispatch({ type: 'UPDATE_ROLE', id, patch }),
    updateMix: (roleId: string, pct: number) =>
      dispatch({ type: 'UPDATE_MIX', roleId, pct }),
    normalizeMix: () => dispatch({ type: 'NORMALIZE_MIX' }),
    updateGlobal: (patch: Partial<GlobalInputs>) =>
      dispatch({ type: 'UPDATE_GLOBAL', patch }),
    resetToDefaults: () => dispatch({ type: 'RESET_TO_DEFAULTS' }),
  };

  return {
    roles,
    roleMix,
    globalInputs,
    blendedLabourCostPerHour,
    scenarioColumns,
    breakEven,
    mixIsValid,
    mixSum,
    actions,
  };
}
