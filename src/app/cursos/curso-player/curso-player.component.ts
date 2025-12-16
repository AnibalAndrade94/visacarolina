import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CursoService } from '../curso.service';

@Component({
  selector: 'app-curso-player',
  templateUrl: './curso-player.component.html',
  styleUrls: ['./curso-player.component.scss']
})
export class CursoPlayerComponent implements OnInit {

  curso: any = null;
  currentLesson: any = null;
  safeVideoUrl: SafeResourceUrl | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cursoService: CursoService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.curso = this.cursoService.getCurso(slug);
    }

    if (!this.curso) {
      this.router.navigate(['/cursos/lista']);
      return;
    }

    // Seleccionar la primera lección por default
    const firstModule = this.curso.modulos?.[0];
    const firstLesson = firstModule?.lecciones?.[0];

    if (firstLesson) {
      this.setCurrentLesson(firstLesson);
    }
  }

  setCurrentLesson(lesson: any): void {
    this.currentLesson = lesson;
    if (lesson.videoUrl) {
      this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        lesson.videoUrl
      );
    } else {
      this.safeVideoUrl = null;
    }
  }
}
