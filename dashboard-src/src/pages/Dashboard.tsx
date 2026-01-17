/**
 * Dashboard Page
 *
 * Shows active visitors in real-time.
 */

import { useState, useEffect } from 'react';
import { Users, Globe, Activity, RefreshCw } from 'lucide-react';
import { api, type Visitor, type VisitorsResponse } from '../api/client';
import { VisitorCard } from '../components/VisitorCard';
import { VisitorDetailModal } from '../components/VisitorDetailModal';

export function Dashboard() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);

  const fetchVisitors = async () => {
    try {
      const data = await api.get<VisitorsResponse>('/visitors');
      setVisitors(data.visitors);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch visitors');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();

    // Poll every 5 seconds
    const interval = setInterval(fetchVisitors, 5000);
    return () => clearInterval(interval);
  }, []);

  // Group visitors by project
  const visitorsByProject = visitors.reduce((acc, visitor) => {
    const project = visitor.current_page?.project || 'Okänt';
    if (!acc[project]) acc[project] = [];
    acc[project].push(visitor);
    return acc;
  }, {} as Record<string, Visitor[]>);

  const projectCount = Object.keys(visitorsByProject).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Aktiva besökare</h1>
          <p className="text-gray-500 mt-1">
            Senast uppdaterad: {lastUpdate.toLocaleTimeString('sv-SE')}
          </p>
        </div>
        <button
          onClick={fetchVisitors}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          <RefreshCw className="w-4 h-4" />
          Uppdatera
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{visitors.length}</p>
              <p className="text-sm text-gray-500">Aktiva besökare</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{projectCount}</p>
              <p className="text-sm text-gray-500">Aktiva sajter</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {visitors.length > 0 ? 'Live' : 'Ingen'}
              </p>
              <p className="text-sm text-gray-500">Aktivitet</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Laddar besökare...</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && visitors.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Users className="w-12 h-12 text-gray-400 mx-auto" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Inga aktiva besökare</h3>
          <p className="mt-2 text-gray-500">
            Besökare visas här när någon besöker dina trackade sidor.
          </p>
        </div>
      )}

      {/* Visitors by project */}
      {!isLoading && Object.entries(visitorsByProject).map(([project, projectVisitors]) => (
        <div key={project}>
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Globe className="w-5 h-5 text-gray-400" />
            {project}
            <span className="text-sm font-normal text-gray-500">
              ({projectVisitors.length} besökare)
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projectVisitors.map((visitor) => (
              <VisitorCard
                key={visitor.id}
                visitor={visitor}
                onClick={() => setSelectedVisitor(visitor)}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Visitor detail modal */}
      {selectedVisitor && (
        <VisitorDetailModal
          visitor={selectedVisitor}
          isOpen={true}
          onClose={() => setSelectedVisitor(null)}
          onUpdate={(updatedVisitor) => {
            setVisitors((prev) =>
              prev.map((v) => (v.id === updatedVisitor.id ? updatedVisitor : v))
            );
            setSelectedVisitor(updatedVisitor);
          }}
        />
      )}
    </div>
  );
}
