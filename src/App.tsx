import { useCalculator } from './hooks/useCalculator';
import GlobalInputs from './components/GlobalInputs';
import RoleBuilder from './components/RoleBuilder';
import WorkforceMix from './components/WorkforceMix';
import ScenarioTable from './components/ScenarioTable';
import SummaryMetrics from './components/SummaryMetrics';
import BreakEvenPanel from './components/BreakEvenPanel';

export default function App() {
  const {
    roles,
    roleMix,
    globalInputs,
    blendedLabourCostPerHour,
    scenarioColumns,
    breakEven,
    mixIsValid,
    mixSum,
    actions,
  } = useCalculator();

  const referenceColumn = scenarioColumns.find(c => c.workers === 100);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 text-white px-6 py-3 flex items-center gap-4">
        <div>
          <h1 className="text-base font-bold tracking-tight">
            Workforce Cost Calculator
          </h1>
          <p className="text-xs text-gray-400">Spain Construction Staffing — Internal Tool</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {mixIsValid ? (
            <span className="text-xs bg-green-800 text-green-200 px-2 py-1 rounded font-medium">
              Mix valid
            </span>
          ) : (
            <span className="text-xs bg-orange-800 text-orange-200 px-2 py-1 rounded font-medium">
              Mix: {mixSum.toFixed(0)}%
            </span>
          )}
        </div>
      </header>

      {/* Global Inputs Bar */}
      <GlobalInputs
        globalInputs={globalInputs}
        onUpdate={actions.updateGlobal}
        onReset={actions.resetToDefaults}
      />

      {/* Main layout */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[320px_1fr_280px] gap-3 p-3 overflow-hidden min-h-0">
        {/* Left column */}
        <div className="flex flex-col gap-3 overflow-y-auto">
          <RoleBuilder
            roles={roles}
            globalSocialSecurityPct={globalInputs.globalSocialSecurityPct}
            onAddRole={actions.addRole}
            onRemoveRole={actions.removeRole}
            onUpdateRole={actions.updateRole}
          />
          <WorkforceMix
            roles={roles}
            roleMix={roleMix}
            mixSum={mixSum}
            mixIsValid={mixIsValid}
            onUpdateMix={actions.updateMix}
            onNormalize={actions.normalizeMix}
          />
        </div>

        {/* Center column — Scenario Table */}
        <div className="overflow-hidden flex flex-col min-h-0">
          <ScenarioTable
            scenarioColumns={scenarioColumns}
            mixIsValid={mixIsValid}
          />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-3 overflow-y-auto">
          <SummaryMetrics
            blendedLabourCostPerHour={blendedLabourCostPerHour}
            globalInputs={globalInputs}
            roles={roles}
            roleMix={roleMix}
            mixIsValid={mixIsValid}
            referenceColumn={referenceColumn}
          />
          <BreakEvenPanel
            breakEven={breakEven}
            mixIsValid={mixIsValid}
          />
        </div>
      </main>
    </div>
  );
}
