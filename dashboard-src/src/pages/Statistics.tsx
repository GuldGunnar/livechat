/**
 * Statistics Page
 *
 * Displays visitor statistics with charts and date filtering.
 */

import { useState, useEffect } from 'react';
import { Users, Globe, Activity, RefreshCw, TrendingUp } from 'lucide-react';
import { api } from '../api/client';
import { DateRangePicker } from '../components/DateRangePicker';
import { BarChart } from '../components/charts/BarChart';
import { PieChart } from '../components/charts/PieChart';
import { LineChart } from '../components/charts/LineChart';

// Statistics API response types
interface StatisticsSummary {
  total_visits: number;
  unique_visitors: number;
  total_projects: number;
}

interface DateStat {
  date: string;
  visits: number;
  unique_visitors: number;
}

interface CountStat {
  os?: string;
  browser?: string;
  device?: string;
  count: number;
}

interface ProjectStat {
  project: string;
  domain: string;
  visits: number;
  unique_visitors: number;
}

interface PageStat {
  url: string;
  title: string | null;
  visits: number;
}

interface StatisticsResponse {
  period: { from: string; to: string };
  summary: StatisticsSummary;
  by_date: DateStat[];
  by_os: CountStat[];
  by_browser: CountStat[];
  by_device: CountStat[];
  by_project: ProjectStat[];
  top_pages: PageStat[];
}

// Get date 30 days ago
const getDefaultFromDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString().split('T')[0];
};

// Get today's date
const getDefaultToDate = () => {
  return new Date().toISOString().split('T')[0];
};

export function Statistics() {
  const [fromDate, setFromDate] = useState(getDefaultFromDate());
  const [toDate, setToDate] = useState(getDefaultToDate());
  const [stats, setStats] = useState<StatisticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await api.get<StatisticsResponse>(
        `/visitors/statistics?from=${fromDate}&to=${toDate}`
      );
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch statistics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [fromDate, toDate]);

  const handleDateChange = (from: string, to: string) => {
    setFromDate(from);
    setToDate(to);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Statistik</h1>
          <p className="text-gray-500 mt-1">Analysera besöksmönster och trender</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangePicker
            from={fromDate}
            to={toDate}
            onChange={handleDateChange}
          />
          <button
            onClick={fetchStatistics}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
            title="Uppdatera"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Loading state */}
      {isLoading && !stats && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Laddar statistik...</p>
        </div>
      )}

      {/* Statistics content */}
      {stats && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.summary.total_visits.toLocaleString('sv-SE')}
                  </p>
                  <p className="text-sm text-gray-500">Totala besök</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.summary.unique_visitors.toLocaleString('sv-SE')}
                  </p>
                  <p className="text-sm text-gray-500">Unika besökare</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.summary.total_projects.toLocaleString('sv-SE')}
                  </p>
                  <p className="text-sm text-gray-500">Aktiva projekt</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.summary.total_visits > 0 && stats.summary.unique_visitors > 0
                      ? (stats.summary.total_visits / stats.summary.unique_visitors).toFixed(1)
                      : '0'}
                  </p>
                  <p className="text-sm text-gray-500">Besök/besökare</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visits over time chart */}
          <LineChart
            title="Besök över tid"
            data={stats.by_date.map((d) => ({
              date: d.date,
              value: d.visits,
              secondaryValue: d.unique_visitors,
            }))}
            primaryLabel="Totala besök"
            secondaryLabel="Unika besökare"
          />

          {/* Charts grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* OS distribution */}
            <PieChart
              title="Operativsystem"
              data={stats.by_os.map((d) => ({
                label: d.os || 'Okänt',
                value: d.count,
                color: '',
              }))}
            />

            {/* Browser distribution */}
            <PieChart
              title="Webbläsare"
              data={stats.by_browser.map((d) => ({
                label: d.browser || 'Okänt',
                value: d.count,
                color: '',
              }))}
            />

            {/* Device types */}
            <PieChart
              title="Enhetstyp"
              data={stats.by_device.map((d) => ({
                label: d.device || 'Okänt',
                value: d.count,
                color: '',
              }))}
            />

            {/* Projects */}
            <BarChart
              title="Besök per projekt"
              data={stats.by_project.map((d) => ({
                label: d.project,
                value: d.visits,
              }))}
              colorClass="bg-blue-500"
            />
          </div>

          {/* Top pages */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">Mest besökta sidor</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {stats.top_pages.length === 0 ? (
                <p className="px-4 py-8 text-sm text-gray-500 text-center">
                  Ingen data för den valda perioden
                </p>
              ) : (
                stats.top_pages.map((page, index) => (
                  <div key={index} className="px-4 py-3 flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-400 w-6">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {page.title || 'Ingen titel'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{page.url}</p>
                    </div>
                    <span className="text-sm text-gray-600">
                      {page.visits.toLocaleString('sv-SE')} besök
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
