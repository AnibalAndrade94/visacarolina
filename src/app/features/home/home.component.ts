import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  constructor(private title: Title, private meta: Meta) {}

  ngOnInit(): void {
    this.title.setTitle('Visa americana y canadiense en México | VisaCarolina');
    this.meta.updateTag({
      name: 'description',
      content: 'Te ayudamos con visa americana, visa canadiense, eTA y pasaporte. Acompañamiento paso a paso desde cualquier ciudad de México.'
    });
  }
}