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
  constructor(private projetService: ProjetService) {
  }

  get projets() {
    return this.projetService.projets;
  }
}