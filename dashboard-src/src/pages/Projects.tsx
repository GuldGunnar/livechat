/**
 * Projects Page
 *
 * Manage tracked projects/sites.
 */

import { useState, useEffect } from 'react';
import { Plus, Globe, Users, Settings, Trash2, Check, X } from 'lucide-react';
import { api, type Project, type ProjectsResponse } from '../api/client';
import { ProjectSettingsModal } from '../components/ProjectSettingsModal';

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const fetchProjects = async () => {
    try {
      const data = await api.get<ProjectsResponse>('/projects');
      setProjects(data.projects);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const toggleProject = async (project: Project) => {
    try {
      await api.put(`/projects/${project.id}`, {
        enabled: project.enabled ? 0 : 1,
      });
      fetchProjects();
    } catch (err) {
      console.error('Failed to toggle project:', err);
    }
  };

  const deleteProject = async (project: Project) => {
    if (!confirm(`Är du säker på att du vill ta bort "${project.name}"?`)) {
      return;
    }
    try {
      await api.delete(`/projects/${project.id}`);
      fetchProjects();
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projekt</h1>
          <p className="text-gray-500 mt-1">Hantera dina trackade webbplatser</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          <Plus className="w-4 h-4" />
          Nytt projekt
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      )}

      {/* Projects list */}
      {!isLoading && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Projekt</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Domän</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Besökare</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Notiser</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Åtgärder</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Globe className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-900">{project.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{project.domain}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{project.active_visitors || 0}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {project.notification_browser ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Browser</span>
                      ) : null}
                      {project.notification_ntfy ? (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">ntfy</span>
                      ) : null}
                      {project.notification_sound ? (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Ljud</span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleProject(project)}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                        project.enabled
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {project.enabled ? (
                        <>
                          <Check className="w-3 h-3" />
                          Aktiv
                        </>
                      ) : (
                        <>
                          <X className="w-3 h-3" />
                          Inaktiv
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                        title="Inställningar"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteProject(project)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                        title="Ta bort"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {projects.length === 0 && (
            <div className="text-center py-12">
              <Globe className="w-12 h-12 text-gray-400 mx-auto" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Inga projekt</h3>
              <p className="mt-2 text-gray-500">Skapa ditt första projekt för att börja tracka besökare.</p>
            </div>
          )}
        </div>
      )}

      {/* Add Project Modal */}
      {showAddModal && (
        <AddProjectModal
          onClose={() => setShowAddModal(false)}
          onSave={() => {
            setShowAddModal(false);
            fetchProjects();
          }}
        />
      )}

      {/* Project Settings Modal */}
      {selectedProject && (
        <ProjectSettingsModal
          project={selectedProject}
          isOpen={true}
          onClose={() => setSelectedProject(null)}
          onSave={() => {
            setSelectedProject(null);
            fetchProjects();
          }}
        />
      )}
    </div>
  );
}

function AddProjectModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post('/projects', { name, domain });
      onSave();
    } catch (err) {
      console.error('Failed to create project:', err);
      alert('Kunde inte skapa projektet');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Nytt projekt</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Projektnamn
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Min webbplats"
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
                placeholder="example.com"
                required
              />
            </div>
          </div>
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              Avbryt
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Skapar...' : 'Skapa projekt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
