import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit{
 constructor(private seo: SeoService) {}

 ngOnInit(): void {
     this.seo.update({ title: 'Preguntas frecuentes sobre visas | VisaCarolina',
  description: 'Resolvemos las dudas más comunes del trámite de visa americana, canadiense y eTA.',
  path: '/info/faq' });

}
}
