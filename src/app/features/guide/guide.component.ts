import { Component } from '@angular/core';

@Component({
  selector: 'app-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.scss']
})
export class GuideComponent {


  constructor(){}

  toolSelected = 2; // por defecto muestra el mapa

setTool(value: number) {
  this.toolSelected = value;
}

}
