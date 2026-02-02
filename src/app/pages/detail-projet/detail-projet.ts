import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjetService } from '../../services/projet.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InviteService } from '../../services/invite.service';

@Component({
  selector: 'app-detail-projet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detail-projet.html',
  styleUrl: './detail-projet.scss',
})
export class DetailProjet implements OnInit {
  nouveauTitre = '';
  nouvelleDateEcheance = '';
  inviteEmail = '';
  inviteRole = 'Collaborateur';
  inviteMessage = '';
  inviteError = false;
  assignMessage = '';
  assignError = false;
  private projetId = 0;
  columns = [
    { key: 'todo', label: 'To-do' },
    { key: 'ongoing', label: 'En cours' },
    { key: 'overdue', label: 'En retard' },
    { key: 'done', label: 'Fini' },
  ] as const;

  constructor(
    private route: ActivatedRoute,
    private projetService: ProjetService,
    private inviteService: InviteService
  ) {}

  ngOnInit() {
    this.projetId = Number(this.route.snapshot.paramMap.get('id'));
  }

  get projet() {
    return this.projetService.getProjet(this.projetId);
  }

  ajouterSousTache() {
    if (!this.projet) {
      return;
    }

    const added = this.projetService.addSubtask(
      this.projetId,
      this.nouveauTitre,
      this.nouvelleDateEcheance
    );
    if (added) {
      this.nouveauTitre = '';
      this.nouvelleDateEcheance = '';
    }
  }

  getSubtasksForColumn(column: 'todo' | 'ongoing' | 'overdue' | 'done') {
    return this.projetService.getSubtasksByColumn(this.projetId)[column];
  }

  toggleProjectDone(done: boolean) {
    this.projetService.toggleProjectDone(this.projetId, done);
  }

  setProjectProgress(progress: 'todo' | 'ongoing') {
    this.projetService.setProjectProgress(this.projetId, progress);
  }

  toggleSubtaskDone(subtaskId: number, done: boolean) {
    this.projetService.toggleSubtaskDone(this.projetId, subtaskId, done);
  }

  setSubtaskProgress(subtaskId: number, progress: 'todo' | 'ongoing') {
    this.projetService.setSubtaskProgress(this.projetId, subtaskId, progress);
  }

  getAssignableUsers() {
    return this.projetService.getAssignableUsers(this.projetId);
  }

  getAssigneeName(userId: number | null) {
    return this.projetService.getUserName(userId);
  }

  async assignSubtask(subtaskId: number, userIdValue: string) {
    const userId = userIdValue ? Number(userIdValue) : null;
    const response = await this.inviteService.assignSubtaskWithEmail(
      this.projetId,
      subtaskId,
      userId
    );
    this.assignMessage = response.message;
    this.assignError = !response.success;
  }

  async sendInvite() {
    const response = await this.inviteService.sendInvite(
      this.projetId,
      this.inviteEmail,
      this.inviteRole
    );
    this.inviteMessage = response.message;
    this.inviteError = !response.success;
    if (response.success) {
      this.inviteEmail = '';
    }
  }
}