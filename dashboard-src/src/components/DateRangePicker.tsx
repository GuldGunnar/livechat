/**
 * Date Range Picker Component
 *
 * Simple date range selector with preset options.
 */

import { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

interface DateRangePickerProps {
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
}

// Preset date ranges
const PRESETS = [
  { label: 'Idag', days: 0 },
  { label: 'Senaste 7 dagarna', days: 7 },
  { label: 'Senaste 30 dagarna', days: 30 },
  { label: 'Senaste 90 dagarna', days: 90 },
  { label: 'Senaste året', days: 365 },
];

export function DateRangePicker({ from, to, onChange }: DateRangePickerProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [customFrom, setCustomFrom] = useState(from);
  const [customTo, setCustomTo] = useState(to);

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Apply preset
  const applyPreset = (days: number) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const fromStr = startDate.toISOString().split('T')[0];
    const toStr = endDate.toISOString().split('T')[0];

    onChange(fromStr, toStr);
    setShowDropdown(false);
    setShowCustom(false);
  };

  // Apply custom range
  const applyCustomRange = () => {
    if (customFrom && customTo) {
      onChange(customFrom, customTo);
      setShowDropdown(false);
      setShowCustom(false);
    }
  };

  // Determine current preset label
  const getCurrentLabel = () => {
    const diffDays = Math.round(
      (new Date(to).getTime() - new Date(from).getTime()) / (1000 * 60 * 60 * 24)
    );

    const preset = PRESETS.find((p) => p.days === diffDays);
    if (preset) return preset.label;

    return `${formatDate(from)} – ${formatDate(to)}`;
  };

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
      >
        <Calendar className="w-4 h-4 text-gray-500" />
        <span className="text-gray-700">{getCurrentLabel()}</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setShowDropdown(false);
              setShowCustom(false);
            }}
          />

          {/* Menu */}
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
            <div className="p-2">
              {/* Preset options */}
              {PRESETS.map((preset) => (
                <button
                  key={preset.days}
                  onClick={() => applyPreset(preset.days)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
                >
                  {preset.label}
                </button>
              ))}

              {/* Custom option */}
              <button
                onClick={() => setShowCustom(!showCustom)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
              >
                Anpassat intervall
              </button>

              {/* Custom date inputs */}
              {showCustom && (
                <div className="mt-2 p-3 border-t border-gray-200">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Från</label>
                      <input
                        type="date"
                        value={customFrom}
                        max={today}
                        onChange={(e) => setCustomFrom(e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Till</label>
                      <input
                        type="date"
                        value={customTo}
                        max={today}
                        onChange={(e) => setCustomTo(e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <button
                      onClick={applyCustomRange}
                      className="w-full px-3 py-2 bg-primary-600 text-white text-sm rounded hover:bg-primary-700 transition"
                    >
                      Tillämpa
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
