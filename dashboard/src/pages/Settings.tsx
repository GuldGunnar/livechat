/**
 * Settings Page
 *
 * Notification and dashboard settings.
 */

import { useState } from 'react';
import { Bell, Smartphone, Volume2, Save } from 'lucide-react';

export function Settings() {
  const [browserNotifications, setBrowserNotifications] = useState(true);
  const [ntfyEnabled, setNtfyEnabled] = useState(false);
  const [ntfyTopic, setNtfyTopic] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setBrowserNotifications(true);
        new Notification('Notiser aktiverade', {
          body: 'Du kommer nu få notiser när besökare anländer.',
          icon: '/visitors/favicon.svg',
        });
      }
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Save settings to API
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSaving(false);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inställningar</h1>
        <p className="text-gray-500 mt-1">Anpassa notiser och dashboard</p>
      </div>

      {/* Browser Notifications */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Bell className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Browser-notiser</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Få push-notiser i webbläsaren när besökare anländer
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={browserNotifications}
                  onChange={(e) => {
                    if (e.target.checked) {
                      requestNotificationPermission();
                    } else {
                      setBrowserNotifications(false);
                    }
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            {browserNotifications && Notification.permission !== 'granted' && (
              <button
                onClick={requestNotificationPermission}
                className="mt-3 text-sm text-primary-600 hover:text-primary-700"
              >
                Aktivera notiser i webbläsaren
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ntfy.sh */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Mobila notiser (ntfy.sh)</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Få push-notiser på mobilen via ntfy.sh
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={ntfyEnabled}
                  onChange={(e) => setNtfyEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            {ntfyEnabled && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ntfy Topic
                </label>
                <input
                  type="text"
                  value={ntfyTopic}
                  onChange={(e) => setNtfyTopic(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="visitor-tracker"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Prenumerera på detta topic i ntfy-appen
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sound */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Volume2 className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Ljudnotiser</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Spela upp ett ljud när besökare anländer (när dashboard är öppet)
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Sparar...' : 'Spara inställningar'}
        </button>
      </div>
    </div>
  );
}
