/**
 * Notifications Hook
 *
 * Handles browser notifications and sound alerts for new visitors.
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import type { Visitor, Project } from '../api/client';

// Notification sound - simple beep using Web Audio API
function playNotificationSound() {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (err) {
    console.error('Failed to play notification sound:', err);
  }
}

// Request notification permission
async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('Browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

// Show browser notification
function showBrowserNotification(visitor: Visitor) {
  if (Notification.permission !== 'granted') return;

  const title = 'Ny besökare';
  const project = visitor.current_page?.project || 'Okänd sajt';
  const page = visitor.current_page?.title || visitor.current_page?.url || 'Okänd sida';

  const notification = new Notification(title, {
    body: `${project}: ${page}`,
    icon: '/favicon.svg',
    tag: `visitor-${visitor.id}`,
    requireInteraction: false,
  });

  // Auto-close after 5 seconds
  setTimeout(() => notification.close(), 5000);

  // Focus window on click
  notification.onclick = () => {
    window.focus();
    notification.close();
  };
}

interface NotificationSettings {
  browser: boolean;
  sound: boolean;
}

interface UseNotificationsOptions {
  visitors: Visitor[];
  projects: Project[];
  enabled: boolean;
}

export function useNotifications({ visitors, projects, enabled }: UseNotificationsOptions) {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const previousVisitorIds = useRef<Set<number>>(new Set());
  const isFirstLoad = useRef(true);

  // Build notification settings map by project
  const getProjectSettings = useCallback((projectName: string): NotificationSettings => {
    const project = projects.find(p => p.name === projectName);
    return {
      browser: Boolean(project?.notification_browser),
      sound: Boolean(project?.notification_sound),
    };
  }, [projects]);

  // Request permission on mount if any project has browser notifications enabled
  useEffect(() => {
    if (!enabled) return;

    const hasAnyBrowserNotifications = projects.some(p => p.notification_browser);
    if (hasAnyBrowserNotifications) {
      requestNotificationPermission().then(setPermissionGranted);
    }
  }, [enabled, projects]);

  // Check for new visitors
  useEffect(() => {
    if (!enabled || visitors.length === 0) return;

    const currentIds = new Set(visitors.map(v => v.id));

    // Skip notifications on first load
    if (isFirstLoad.current) {
      previousVisitorIds.current = currentIds;
      isFirstLoad.current = false;
      return;
    }

    // Find new visitors
    const newVisitors = visitors.filter(v => !previousVisitorIds.current.has(v.id));

    // Process each new visitor
    for (const visitor of newVisitors) {
      const projectName = visitor.current_page?.project || '';
      const settings = getProjectSettings(projectName);

      // Browser notification
      if (settings.browser && permissionGranted) {
        showBrowserNotification(visitor);
      }

      // Sound notification
      if (settings.sound) {
        playNotificationSound();
      }
    }

    // Update tracked IDs
    previousVisitorIds.current = currentIds;
  }, [visitors, enabled, permissionGranted, getProjectSettings]);

  // Return permission status for UI feedback
  return {
    permissionGranted,
    requestPermission: () => requestNotificationPermission().then(setPermissionGranted),
  };
}
