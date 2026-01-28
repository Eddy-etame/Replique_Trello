import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjetService, Projet } from '../../services/projet.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detail-projet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detail-projet.html',
  styleUrl: './detail-projet.scss',
})
export class DetailProjet implements OnInit {
  projet?: Projet;
  nouveauTitre = '';
  private projetId = 0;

  constructor(
    private route: ActivatedRoute,
    private projetService: ProjetService
  ) {}

  ngOnInit() {
    this.projetId = Number(this.route.snapshot.paramMap.get('id'));
    this.projet = this.projetService.getProjet(this.projetId);
  }

  ajouterSousTache() {
    if (!this.projet) {
      return;
    }

    const added = this.projetService.addSubtask(this.projetId, this.nouveauTitre);
    if (added) {
      this.nouveauTitre = '';
      this.projet = this.projetService.getProjet(this.projetId);
    }
  }
}