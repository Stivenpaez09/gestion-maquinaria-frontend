import { Component } from '@angular/core';
import { Sidebar } from '../../../../../shared/components/sidebar/sidebar';
import { Header } from '../../../../../shared/components/header/header';

@Component({
  selector: 'app-crear-maquinaria',
  imports: [Sidebar, Header],
  templateUrl: './crear-maquinaria.html',
  styleUrl: './crear-maquinaria.scss',
})
export class CrearMaquinaria {}
