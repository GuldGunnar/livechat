/**
 * Visitor Detail Modal
 *
 * Shows detailed information about a visitor including alias editing and visit history.
 */

import { useState } from 'react';
import { Modal } from './ui/Modal';
import { api, type Visitor } from '../api/client';
import {
  User,
  Globe,
  Clock,
  Monitor,
  Smartphone,
  Tablet,
  Edit2,
  Check,
  X,
  MapPin,
  History,
} from 'lucide-react';

interface VisitorDetailModalProps {
  visitor: Visitor;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (updatedVisitor: Visitor) => void;
}

export function VisitorDetailModal({
  visitor,
  isOpen,
  onClose,
  onUpdate,
}: VisitorDetailModalProps) {
  const [isEditingAlias, setIsEditingAlias] = useState(false);
  const [alias, setAlias] = useState(visitor.alias || '');
  const [isSaving, setIsSaving] = useState(false);

  const displayName = visitor.alias || `Besökare #${visitor.id}`;

  // Format date/time
  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('sv-SE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get time since last seen
  const getTimeSince = (dateStr: string) => {
    const now = new Date();
    const then = new Date(dateStr);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just nu';
    if (diffMins === 1) return '1 minut sedan';
    if (diffMins < 60) return `${diffMins} minuter sedan`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 timme sedan';
    if (diffHours < 24) return `${diffHours} timmar sedan`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return '1 dag sedan';
    return `${diffDays} dagar sedan`;
  };

  // Get device icon based on screen size or user agent
  const getDeviceIcon = () => {
    const width = visitor.screen_width || 0;
    if (width < 768) return Smartphone;
    if (width < 1024) return Tablet;
    return Monitor;
  };

  const DeviceIcon = getDeviceIcon();

  // Save alias
  const handleSaveAlias = async () => {
    setIsSaving(true);
    try {
      await api.put(`/visitors/${visitor.id}`, { alias: alias || null });
      setIsEditingAlias(false);
      if (onUpdate) {
        onUpdate({ ...visitor, alias: alias || null });
      }
    } catch (err) {
      console.error('Failed to save alias:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setAlias(visitor.alias || '');
    setIsEditingAlias(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Besökardetaljer" size="lg">
      <div className="space-y-6">
        {/* Visitor header */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-7 h-7 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            {isEditingAlias ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  placeholder="Ange alias..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                  autoFocus
                />
                <button
                  onClick={handleSaveAlias}
                  disabled={isSaving}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                  title="Spara"
                >
                  <Check className="w-5 h-5" />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition"
                  title="Avbryt"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold text-gray-900 truncate">
                  {displayName}
                </h3>
                <button
                  onClick={() => setIsEditingAlias(true)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition"
                  title="Redigera alias"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm text-green-600 font-medium">Aktiv</span>
              <span className="text-sm text-gray-500">
                • {getTimeSince(visitor.last_seen)}
              </span>
            </div>
          </div>
        </div>

        {/* Info sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* IP Address */}
          {visitor.ip_address && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <MapPin className="w-4 h-4" />
                IP-adress
              </div>
              <p className="font-mono text-gray-900">{visitor.ip_address}</p>
            </div>
          )}

          {/* Device */}
          {(visitor.os || visitor.browser) && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <DeviceIcon className="w-4 h-4" />
                Enhet
              </div>
              <p className="text-gray-900">
                {visitor.os || 'Okänt OS'}
                {visitor.browser && ` • ${visitor.browser}`}
              </p>
            </div>
          )}

          {/* Screen resolution */}
          {visitor.screen_width && visitor.screen_height && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <Monitor className="w-4 h-4" />
                Skärmupplösning
              </div>
              <p className="text-gray-900">
                {visitor.screen_width} × {visitor.screen_height}
              </p>
            </div>
          )}

          {/* Visitor token */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <User className="w-4 h-4" />
              Besökar-ID
            </div>
            <p className="font-mono text-xs text-gray-700 truncate">
              {visitor.visitor_token}
            </p>
          </div>
        </div>

        {/* Current page */}
        {visitor.current_page && (
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
              <Globe className="w-4 h-4" />
              Nuvarande sida
            </div>
            <div className="space-y-2">
              <p className="font-medium text-gray-900">
                {visitor.current_page.title || 'Ingen titel'}
              </p>
              <p className="text-sm text-gray-600 break-all">
                {visitor.current_page.url}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" />
                  {visitor.current_page.project}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDateTime(visitor.current_page.entered_at)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Visit history placeholder */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
            <History className="w-4 h-4" />
            Besökshistorik
          </div>
          <p className="text-sm text-gray-500 italic">
            Besökshistorik kommer i framtida version.
          </p>
        </div>
      </div>
    </Modal>
  );
}
