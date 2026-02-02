import { computed, Injectable, signal } from '@angular/core';
import { Project } from '../models/project';
import { ColumnStatus, ProgressStatus, Subtask } from '../models/subtask';
import { AuthService } from './auth.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})

export class ProjetService {
  nom = '';
  statut = '';
  dateEcheance = '';
  projets = signal<Project[]>([
    new Project(
      Date.now(),
      'projet 1',
      'premier projet 2026',
      '2026-12-31',
      false,
      'todo',
      [],
      null,
      []
    ),
  ]);

  projectsByColumn = computed(() => this.groupProjects());

  constructor(private authService: AuthService) {}

  addProjet(projet: { nom: string; statut: string; dateEcheance: string }) {
    const nouveauProjet = new Project(
      Date.now(),
      projet.nom,
      projet.statut,
      projet.dateEcheance,
      false,
      'todo',
      [],
      this.authService.getUserId(),
      []
    );
    this.projets.update((projets) => [...projets, nouveauProjet]);
  } 

  getProjets() {
    return this.projets();
  }

  getProjet(id: number) {
    return this.projets().find((projet) => projet.id === id);
  }

  addSubtask(projetId: number, titre: string, dateEcheance: string) {
    const trimmedTitre = titre.trim();
    if (!trimmedTitre) {
      return false;
    }

    const nouvelleSousTache = new Subtask(
      Date.now(),
      trimmedTitre,
      dateEcheance,
      false,
      'todo'
    );

    this.updateProject(projetId, (projet) => ({
      ...projet,
      sousTaches: [...projet.sousTaches, nouvelleSousTache],
    }));
    return true;
  }

  toggleProjectDone(projectId: number, done: boolean) {
    this.updateProject(projectId, (projet) => ({
      ...projet,
      done,
    }));
  }

  setProjectProgress(projectId: number, progress: ProgressStatus) {
    this.updateProject(projectId, (projet) => ({
      ...projet,
      done: false,
      progress,
    }));
  }

  toggleSubtaskDone(projectId: number, subtaskId: number, done: boolean) {
    this.updateProject(projectId, (projet) => ({
      ...projet,
      sousTaches: projet.sousTaches.map((task) =>
        task.id === subtaskId
          ? new Subtask(
              task.id,
              task.titre,
              task.dateEcheance,
              done,
              task.progress,
              task.assigneeId
            )
          : task
      ),
    }));
  }

  setSubtaskProgress(projectId: number, subtaskId: number, progress: ProgressStatus) {
    this.updateProject(projectId, (projet) => ({
      ...projet,
      sousTaches: projet.sousTaches.map((task) =>
        task.id === subtaskId
          ? new Subtask(
              task.id,
              task.titre,
              task.dateEcheance,
              false,
              progress,
              task.assigneeId
            )
          : task
      ),
    }));
  }

  getSubtasksByColumn(projectId: number) {
    const projet = this.getProjet(projectId);
    const grouped = this.createColumnGroup<Subtask>();
    if (!projet) {
      return grouped;
    }
    projet.sousTaches.forEach((task) => {
      grouped[task.getColumn()].push(task);
    });
    return grouped;
  }

  addCollaborator(projectId: number, userId: number) {
    this.updateProject(projectId, (projet) => {
      if (projet.collaboratorIds.includes(userId)) {
        return projet;
      }
      return {
        ...projet,
        collaboratorIds: [...projet.collaboratorIds, userId],
      };
    });
  }

  getAssignableUsers(projectId: number): User[] {
    const projet = this.getProjet(projectId);
    if (!projet) {
      return [];
    }

    const ids = new Set<number>();
    if (projet.ownerId) {
      ids.add(projet.ownerId);
    }
    projet.collaboratorIds.forEach((id) => ids.add(id));

    return this.authService.getUsers().filter((user) => ids.has(user.id));
  }

  getUserName(userId: number | null) {
    const user = this.authService.getUserById(userId);
    return user?.name ?? 'Non assigné';
  }

  assignSubtask(projectId: number, subtaskId: number, userId: number | null) {
    this.updateProject(projectId, (projet) => ({
      ...projet,
      sousTaches: projet.sousTaches.map((task) =>
        task.id === subtaskId
          ? new Subtask(
              task.id,
              task.titre,
              task.dateEcheance,
              task.done,
              task.progress,
              userId
            )
          : task
      ),
    }));
  }

  private groupProjects() {
    const grouped = this.createColumnGroup<Project>();
    this.projets().forEach((projet) => {
      grouped[projet.getColumn()].push(projet);
    });
    return grouped;
  }

  private createColumnGroup<T>() {
    return {
      todo: [] as T[],
      ongoing: [] as T[],
      overdue: [] as T[],
      done: [] as T[],
    } satisfies Record<ColumnStatus, T[]>;
  }

  private updateProject(
    projectId: number,
    updater: (projet: Project) => Project | Partial<Project>
  ) {
    this.projets.update((projets) =>
      projets.map((projet) => {
        if (projet.id !== projectId) {
          return projet;
        }
        const updated = updater(projet);
        return updated instanceof Project
          ? updated
          : new Project(
              projet.id,
              updated.nom ?? projet.nom,
              updated.statut ?? projet.statut,
              updated.dateEcheance ?? projet.dateEcheance,
              updated.done ?? projet.done,
              updated.progress ?? projet.progress,
              updated.sousTaches ?? projet.sousTaches,
              updated.ownerId ?? projet.ownerId,
              updated.collaboratorIds ?? projet.collaboratorIds
            );
      })
    );
  }
}
