/**
 * Visitor Card Component
 *
 * Displays a single visitor with their current page.
 */

import { Globe, Clock, User } from 'lucide-react';
import type { Visitor } from '../api/client';

interface VisitorCardProps {
  visitor: Visitor;
}

export function VisitorCard({ visitor }: VisitorCardProps) {
  const displayName = visitor.alias || `Besökare #${visitor.id}`;
  const currentPage = visitor.current_page;

  // Calculate time since arrival
  const getTimeSince = (dateStr: string) => {
    const now = new Date();
    const then = new Date(dateStr);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just nu';
    if (diffMins === 1) return '1 minut';
    if (diffMins < 60) return `${diffMins} minuter`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 timme';
    return `${diffHours} timmar`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition">
      <div className="flex items-start justify-between gap-4">
        {/* Visitor info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-green-600" />
          </div>
          <div className="min-w-0">
            <h3 className="font-medium text-gray-900 truncate">{displayName}</h3>
            {visitor.ip_address && (
              <p className="text-sm text-gray-500">{visitor.ip_address}</p>
            )}
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-sm text-green-600 font-medium">Aktiv</span>
        </div>
      </div>

      {/* Current page */}
      {currentPage && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Globe className="w-4 h-4" />
            <span className="font-medium">{currentPage.project}</span>
          </div>
          <p className="text-sm text-gray-900 truncate" title={currentPage.url}>
            {currentPage.title || currentPage.url}
          </p>
          <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{getTimeSince(currentPage.entered_at)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
