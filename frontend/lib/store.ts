import { create } from 'zustand';
import { User, Project } from '@/types';

interface AppState {
  user: User | null;
  projects: Project[];
  activeProject: Project | null;
  setUser: (user: User | null) => void;
  setProjects: (projects: Project[]) => void;
  setActiveProject: (project: Project | null) => void;
  addProject: (project: Project) => void;
  removeProject: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  projects: [],
  activeProject: null,
  setUser: (user) => set({ user }),
  setProjects: (projects) => set({ projects }),
  setActiveProject: (activeProject) => set({ activeProject }),
  addProject: (project) => set((state) => ({ projects: [project, ...state.projects] })),
  removeProject: (id) =>
    set((state) => ({ projects: state.projects.filter((p) => p.id !== id) })),
}));
