import { Component } from '@angular/core';
import { Header } from '../../../../../shared/components/header/header';
import { Sidebar } from '../../../../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-maquinaria',
  imports: [Header, Sidebar],
  templateUrl: './maquinaria.html',
  styleUrl: './maquinaria.scss',
})
export class Maquinaria {}
