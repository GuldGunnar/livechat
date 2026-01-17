/**
 * Bar Chart Component
 *
 * CSS-based horizontal bar chart for displaying statistics.
 */

interface BarChartData {
  label: string;
  value: number;
}

interface BarChartProps {
  data: BarChartData[];
  title?: string;
  maxBars?: number;
  colorClass?: string;
}

export function BarChart({
  data,
  title,
  maxBars = 10,
  colorClass = 'bg-primary-500',
}: BarChartProps) {
  const displayData = data.slice(0, maxBars);
  const maxValue = Math.max(...displayData.map((d) => d.value), 1);
  const total = displayData.reduce((sum, d) => sum + d.value, 0);

  if (displayData.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        {title && (
          <h3 className="text-sm font-medium text-gray-900 mb-4">{title}</h3>
        )}
        <p className="text-sm text-gray-500 text-center py-4">Ingen data</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {title && (
        <h3 className="text-sm font-medium text-gray-900 mb-4">{title}</h3>
      )}
      <div className="space-y-3">
        {displayData.map((item, index) => {
          const percentage = (item.value / maxValue) * 100;
          const sharePercentage = total > 0 ? (item.value / total) * 100 : 0;

          return (
            <div key={index}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-700 truncate max-w-[60%]" title={item.label}>
                  {item.label}
                </span>
                <span className="text-gray-500 flex-shrink-0">
                  {item.value.toLocaleString('sv-SE')}{' '}
                  <span className="text-xs text-gray-400">
                    ({sharePercentage.toFixed(1)}%)
                  </span>
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${colorClass} rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
