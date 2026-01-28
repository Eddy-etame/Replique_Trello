import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjetService } from '../../services/projet.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-projet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-projet.html',
  styleUrl: './detail-projet.scss',
})
export class DetailProjet implements OnInit {
  projet: any;

  constructor(
    private route: ActivatedRoute,
    private projetService: ProjetService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.projet = this.projetService.getProjet(id);
  }
}