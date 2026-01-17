/**
 * Line Chart Component
 *
 * CSS/SVG-based line chart for time series data.
 */

interface LineChartData {
  date: string;
  value: number;
  secondaryValue?: number;
}

interface LineChartProps {
  data: LineChartData[];
  title?: string;
  height?: number;
  primaryColor?: string;
  secondaryColor?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
}

export function LineChart({
  data,
  title,
  height = 200,
  primaryColor = 'rgb(59, 130, 246)',
  secondaryColor = 'rgb(34, 197, 94)',
  primaryLabel = 'Besök',
  secondaryLabel = 'Unika besökare',
}: LineChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        {title && (
          <h3 className="text-sm font-medium text-gray-900 mb-4">{title}</h3>
        )}
        <p className="text-sm text-gray-500 text-center py-4">Ingen data</p>
      </div>
    );
  }

  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = 600;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxValue = Math.max(
    ...data.map((d) => Math.max(d.value, d.secondaryValue || 0)),
    1
  );

  // Generate SVG path for a series
  const generatePath = (values: number[]): string => {
    if (values.length === 0) return '';

    const points = values.map((value, index) => {
      const x = padding.left + (index / (values.length - 1 || 1)) * chartWidth;
      const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  };

  // Generate area fill path
  const generateAreaPath = (values: number[]): string => {
    if (values.length === 0) return '';

    const linePath = generatePath(values);
    const lastX = padding.left + chartWidth;
    const firstX = padding.left;
    const bottomY = padding.top + chartHeight;

    return `${linePath} L ${lastX},${bottomY} L ${firstX},${bottomY} Z`;
  };

  const primaryValues = data.map((d) => d.value);
  const secondaryValues = data.map((d) => d.secondaryValue || 0);
  const hasSecondary = secondaryValues.some((v) => v > 0);

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' });
  };

  // Y-axis ticks
  const yTicks = [0, Math.round(maxValue / 2), maxValue];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {title && (
        <h3 className="text-sm font-medium text-gray-900 mb-4">{title}</h3>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: primaryColor }}
          />
          <span className="text-gray-600">{primaryLabel}</span>
        </div>
        {hasSecondary && (
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: secondaryColor }}
            />
            <span className="text-gray-600">{secondaryLabel}</span>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <svg width={width} height={height} className="min-w-full">
          {/* Y-axis ticks and labels */}
          {yTicks.map((tick, index) => {
            const y = padding.top + chartHeight - (tick / maxValue) * chartHeight;
            return (
              <g key={index}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + chartWidth}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeDasharray="4,4"
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="text-xs fill-gray-400"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* X-axis labels (show first, middle, last) */}
          {data.length > 0 && (
            <>
              <text
                x={padding.left}
                y={padding.top + chartHeight + 20}
                textAnchor="start"
                className="text-xs fill-gray-400"
              >
                {formatDate(data[0].date)}
              </text>
              {data.length > 2 && (
                <text
                  x={padding.left + chartWidth / 2}
                  y={padding.top + chartHeight + 20}
                  textAnchor="middle"
                  className="text-xs fill-gray-400"
                >
                  {formatDate(data[Math.floor(data.length / 2)].date)}
                </text>
              )}
              <text
                x={padding.left + chartWidth}
                y={padding.top + chartHeight + 20}
                textAnchor="end"
                className="text-xs fill-gray-400"
              >
                {formatDate(data[data.length - 1].date)}
              </text>
            </>
          )}

          {/* Primary area and line */}
          <path
            d={generateAreaPath(primaryValues)}
            fill={primaryColor}
            fillOpacity={0.1}
          />
          <path
            d={generatePath(primaryValues)}
            fill="none"
            stroke={primaryColor}
            strokeWidth={2}
          />

          {/* Secondary line (if data exists) */}
          {hasSecondary && (
            <>
              <path
                d={generateAreaPath(secondaryValues)}
                fill={secondaryColor}
                fillOpacity={0.1}
              />
              <path
                d={generatePath(secondaryValues)}
                fill="none"
                stroke={secondaryColor}
                strokeWidth={2}
              />
            </>
          )}

          {/* Data points */}
          {primaryValues.map((value, index) => {
            const x =
              padding.left + (index / (data.length - 1 || 1)) * chartWidth;
            const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
            return (
              <circle
                key={`primary-${index}`}
                cx={x}
                cy={y}
                r={3}
                fill={primaryColor}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}
