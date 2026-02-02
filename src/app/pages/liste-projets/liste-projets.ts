import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjetService } from '../../services/projet.service';

@Component({
  selector: 'app-liste-projets',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './liste-projets.html',
  styleUrl: './liste-projets.scss',
})
export class ListeProjets {
  columns = [
    { key: 'todo', label: 'To-do' },
    { key: 'ongoing', label: 'En cours' },
    { key: 'overdue', label: 'En retard' },
    { key: 'done', label: 'Fini' },
  ] as const;

  constructor(private projetService: ProjetService) {
  }

  get columnsData() {
    return this.projetService.projectsByColumn();
  }

  getProjectsForColumn(column: 'todo' | 'ongoing' | 'overdue' | 'done') {
    return this.columnsData[column];
  }

  toggleProjectDone(projectId: number, done: boolean) {
    this.projetService.toggleProjectDone(projectId, done);
  }

  setProjectProgress(projectId: number, progress: 'todo' | 'ongoing') {
    this.projetService.setProjectProgress(projectId, progress);
  }
}