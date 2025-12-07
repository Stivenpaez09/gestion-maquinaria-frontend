import { Component } from '@angular/core';
import { Sidebar } from '../../../../shared/components/sidebar/sidebar';
import { Header } from '../../../../shared/components/header/header';

@Component({
  selector: 'app-dashbord',
  imports: [Sidebar, Header],
  templateUrl: './dashbord.html',
  styleUrl: './dashbord.scss',
})
export class Dashbord {}
