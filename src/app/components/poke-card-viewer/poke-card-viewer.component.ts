import { Component, ElementRef, HostListener, Input, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-poke-card-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './poke-card-viewer.component.html',
  styleUrls: ['./poke-card-viewer.component.css']
})
export class PokeCardViewerComponent implements AfterViewInit {
  @Input() pokemon: any;
  @Output() pokemonSelected = new EventEmitter<any>();

  @ViewChild('card') cardRef!: ElementRef<HTMLDivElement>;

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const card = this.cardRef.nativeElement;
    const { offsetWidth: width, offsetHeight: height } = card;
    const { clientX, clientY } = event;

    const x = clientX - card.getBoundingClientRect().left - width / 2;
    const y = clientY - card.getBoundingClientRect().top - height / 2;

    const rotateY = (x / width) * 20;
    const rotateX = -(y / height) * 20;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.cardRef.nativeElement.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
  }

  ngAfterViewInit() {
    this.cardRef.nativeElement.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
  }

  onCardClick() {
    this.pokemonSelected.emit(this.pokemon);
  }
}
