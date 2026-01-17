/**
 * Pie Chart Component
 *
 * CSS-based donut chart for displaying proportional data.
 */

interface PieChartData {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieChartData[];
  title?: string;
  size?: number;
}

// Default color palette for pie slices
const DEFAULT_COLORS = [
  'rgb(59, 130, 246)',   // blue-500
  'rgb(34, 197, 94)',    // green-500
  'rgb(168, 85, 247)',   // purple-500
  'rgb(249, 115, 22)',   // orange-500
  'rgb(236, 72, 153)',   // pink-500
  'rgb(14, 165, 233)',   // sky-500
  'rgb(234, 179, 8)',    // yellow-500
  'rgb(99, 102, 241)',   // indigo-500
  'rgb(239, 68, 68)',    // red-500
  'rgb(20, 184, 166)',   // teal-500
];

export function PieChart({ data, title, size = 200 }: PieChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  // Add colors if not provided
  const dataWithColors = data.map((item, index) => ({
    ...item,
    color: item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
  }));

  // Calculate conic gradient stops
  let currentAngle = 0;
  const gradientStops = dataWithColors.map((item) => {
    const startAngle = currentAngle;
    const percentage = total > 0 ? (item.value / total) * 100 : 0;
    currentAngle += percentage;
    return `${item.color} ${startAngle}% ${currentAngle}%`;
  });

  const gradientValue =
    total > 0 ? `conic-gradient(${gradientStops.join(', ')})` : 'none';

  if (data.length === 0 || total === 0) {
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

      <div className="flex items-center gap-6">
        {/* Donut chart */}
        <div
          className="relative rounded-full flex-shrink-0"
          style={{
            width: size,
            height: size,
            background: gradientValue,
          }}
        >
          {/* Inner circle (donut hole) */}
          <div
            className="absolute bg-white rounded-full flex items-center justify-center"
            style={{
              width: size * 0.6,
              height: size * 0.6,
              top: size * 0.2,
              left: size * 0.2,
            }}
          >
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {total.toLocaleString('sv-SE')}
              </p>
              <p className="text-xs text-gray-500">Totalt</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2">
          {dataWithColors.map((item, index) => {
            const percentage = total > 0 ? (item.value / total) * 100 : 0;
            return (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-700 truncate flex-1" title={item.label}>
                  {item.label}
                </span>
                <span className="text-gray-500 flex-shrink-0">
                  {percentage.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
