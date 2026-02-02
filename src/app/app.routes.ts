import { Routes } from '@angular/router';
import { ListeProjets } from './pages/liste-projets/liste-projets';
import { DetailProjet } from './pages/detail-projet/detail-projet';
import { AjouterProjet } from './pages/ajouter-projet/ajouter-projet';
import { Login } from './pages/login/login';
import { Me } from './pages/me/me';
import { Home } from './home/home';

export const routes: Routes = [
    {path:'', component: Home },
    {path:'login', component: Login},
    {path:'me', component: Me},
    {path:'liste-projets', component: ListeProjets},
    {path:'projet/:id', component: DetailProjet},
    {path:'ajouter', component: AjouterProjet},

];
