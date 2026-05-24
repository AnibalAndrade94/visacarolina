import { Component } from '@angular/core';

@Component({
  selector: 'app-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.scss']
})
export class GuideComponent {


  guideSelected: 'pasaporte' | 'usa' | 'canada' = 'usa';
toolSelected = 1;

setGuide(guide: 'pasaporte' | 'usa' | 'canada') {
  this.guideSelected = guide;
  this.toolSelected = 1;
}

setTool(tool: number) {
  this.toolSelected = tool;
}

getGuideTitle(): string {
  switch (this.guideSelected) {
    case 'pasaporte':
      return 'Guía para pasaporte mexicano';
    case 'usa':
      return 'Guía para visa americana';
    case 'canada':
      return 'Guía para visa canadiense';
    default:
      return 'Guías para tus trámites';
  }
}

getThirdToolTitle(): string {
  switch (this.guideSelected) {
    case 'pasaporte':
      return 'Recomendaciones para tu cita';
    case 'usa':
      return 'Mapa de embajadas y consulados';
    case 'canada':
      return 'Recomendaciones para el trámite';
    default:
      return 'Información adicional';
  }
}
}
