/**
 * Project Settings Modal
 *
 * Modal for editing project settings including notifications.
 */

import { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { api, type Project } from '../api/client';
import {
  Bell,
  BellRing,
  Volume2,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';

interface ProjectSettingsModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function ProjectSettingsModal({
  project,
  isOpen,
  onClose,
  onSave,
}: ProjectSettingsModalProps) {
  const [name, setName] = useState(project.name);
  const [domain, setDomain] = useState(project.domain);
  const [notificationBrowser, setNotificationBrowser] = useState(
    Boolean(project.notification_browser)
  );
  const [notificationNtfy, setNotificationNtfy] = useState(
    Boolean(project.notification_ntfy)
  );
  const [notificationSound, setNotificationSound] = useState(
    Boolean(project.notification_sound)
  );
  const [ntfyTopic, setNtfyTopic] = useState(project.ntfy_topic || '');
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  // Reset form when project changes
  useEffect(() => {
    setName(project.name);
    setDomain(project.domain);
    setNotificationBrowser(Boolean(project.notification_browser));
    setNotificationNtfy(Boolean(project.notification_ntfy));
    setNotificationSound(Boolean(project.notification_sound));
    setNtfyTopic(project.ntfy_topic || '');
  }, [project]);

  // Generate embed code
  const embedCode = `<script src="https://qrplan.eu/widget/tracker.js" data-project-id="${project.id}"></script>`;

  const handleCopyEmbed = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await api.put(`/visitors/projects/${project.id}`, {
        name,
        domain,
        notification_browser: notificationBrowser ? 1 : 0,
        notification_ntfy: notificationNtfy ? 1 : 0,
        notification_sound: notificationSound ? 1 : 0,
        ntfy_topic: ntfyTopic || null,
      });
      onSave();
    } catch (err) {
      console.error('Failed to save project:', err);
      alert('Kunde inte spara projektet');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Projektinställningar" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">
            Grundinformation
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Projektnamn
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Domän
            </label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
        </div>

        {/* Notifications */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">
            Notifikationer
          </h3>

          {/* Browser notifications */}
          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
            <input
              type="checkbox"
              checked={notificationBrowser}
              onChange={(e) => setNotificationBrowser(e.target.checked)}
              className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
            />
            <Bell className="w-5 h-5 text-gray-500" />
            <div>
              <p className="font-medium text-gray-900">Webbläsarnotiser</p>
              <p className="text-sm text-gray-500">Visa notiser i webbläsaren vid nya besökare</p>
            </div>
          </label>

          {/* Sound notifications */}
          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
            <input
              type="checkbox"
              checked={notificationSound}
              onChange={(e) => setNotificationSound(e.target.checked)}
              className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
            />
            <Volume2 className="w-5 h-5 text-gray-500" />
            <div>
              <p className="font-medium text-gray-900">Ljudnotis</p>
              <p className="text-sm text-gray-500">Spela ett ljud vid nya besökare</p>
            </div>
          </label>

          {/* ntfy notifications */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
              <input
                type="checkbox"
                checked={notificationNtfy}
                onChange={(e) => setNotificationNtfy(e.target.checked)}
                className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
              />
              <BellRing className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900">ntfy-notiser</p>
                <p className="text-sm text-gray-500">Skicka push-notiser via ntfy.sh</p>
              </div>
            </label>

            {notificationNtfy && (
              <div className="ml-8">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ntfy-topic
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={ntfyTopic}
                    onChange={(e) => setNtfyTopic(e.target.value)}
                    placeholder="mitt-topic"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                  />
                  <a
                    href="https://ntfy.sh/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-gray-600 transition"
                    title="Läs mer om ntfy"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Topic-namn på ntfy.sh (t.ex. "visitor-alerts")
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Embed code */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">
            Widget-kod
          </h3>
          <p className="text-sm text-gray-600">
            Lägg till denna kod på din webbplats för att börja tracka besökare:
          </p>
          <div className="relative">
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
              {embedCode}
            </pre>
            <button
              type="button"
              onClick={handleCopyEmbed}
              className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white bg-gray-800 rounded transition"
              title="Kopiera"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            Avbryt
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
          >
            {isSaving ? 'Sparar...' : 'Spara ändringar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
