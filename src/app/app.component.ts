import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, query, style, stagger, animate, AnimationEvent, group } from '@angular/animations'; // Importa 'group'
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PokemonService } from './servicios/pokemon.service';

import { PokeCardViewerComponent } from './components/poke-card-viewer/poke-card-viewer.component';
import { PokemonDetailComponent } from './components/pokemon-detail/pokemon-detail.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, PokeCardViewerComponent,PokemonDetailComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [

    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(30px) scale(0.9)' }),
        ], { optional: true }),
        query(':enter', stagger('80ms', [
          animate('400ms cubic-bezier(0.35, 0, 0.25, 1)',
          style({ opacity: 1, transform: 'none' }))
        ]), { optional: true }),
        query(':leave', [
          animate('300ms ease-out',
          style({ opacity: 0, transform: 'translateY(-30px) scale(0.9)' }))
        ], { optional: true })
      ])
    ]),

    trigger('viewAnimation', [
      transition('grid => detail', [
        group([
          query(':enter', [
            style({ opacity: 0, transform: 'translateX(100%)' }),
            animate('400ms ease-out', style({ opacity: 1, transform: 'translateX(0%)' }))
          ]),
          query(':leave', [
            animate('400ms ease-in', style({ opacity: 0, transform: 'translateX(-100%)' }))
          ], { optional: true })
        ])
      ]),
      transition('detail => grid', [
        group([
          query(':enter', [
            style({ opacity: 0, transform: 'translateX(-100%)' }),
            animate('400ms ease-out', style({ opacity: 1, transform: 'translateX(0%)' }))
          ]),
          query(':leave', [
            animate('400ms ease-in', style({ opacity: 0, transform: 'translateX(100%)' }))
          ])
        ])
      ])
    ])
  ]
})
export class AppComponent implements OnInit {
  title = 'pokedex-v2';
  pokemons: any[] = [];
  selectedPokemon: any | null = null;

  offset = 0;
  limit = 24;
  totalPokemons = 0;

  searchTerm: string = '';
  lastSearchTerm: string = '';
  searchError = false;

  isPageLoading = false;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit() {
    this.pokemonService.getPokemons(1, 0).subscribe(response => {
      this.totalPokemons = response.count;
    });
    this.loadPokemons();
  }

  loadPokemons() {
    this.searchError = false;
    this.pokemonService.getPokemons(this.limit, this.offset).subscribe((response: any) => {
      const detailObservables = response.results.map((p: any) =>
        this.pokemonService.getPokemonDetails(p.url)
      );
      forkJoin(detailObservables).subscribe((pokemonDetails: any) => {
        this.pokemons = pokemonDetails;
      });
    });
  }

  previousPage() {
    if (this.offset > 0 && !this.isPageLoading) {
      this.isPageLoading = true;
      this.offset -= this.limit;
      this.pokemons = [];
    }
  }

  nextPage() {
    if (this.offset + this.limit < this.totalPokemons && !this.isPageLoading) {
      this.isPageLoading = true;
      this.offset += this.limit;
      this.pokemons = [];
    }
  }

  onAnimationDone(event: AnimationEvent) {
    if (this.pokemons.length === 0 && this.isPageLoading) {
      this.loadPokemons();
      this.isPageLoading = false;
    }
  }

  onPokemonSelected(pokemon: any) {
    this.selectedPokemon = pokemon;
  }

  onDetailClose() {
    this.selectedPokemon = null;
  }

  onSearch() {
    this.lastSearchTerm = this.searchTerm;
    if (this.searchTerm.trim() === '') {
      this.clearSearch();
      return;
    }

    this.isPageLoading = true;
    this.pokemonService.getPokemonByNameOrId(this.searchTerm.toLowerCase())
      .pipe(
        catchError(error => {
          this.searchError = true;
          this.pokemons = [];
          this.isPageLoading = false;
          return of(null);
        })
      )
      .subscribe(pokemon => {
        if (pokemon) {
          this.pokemons = [pokemon];
          this.searchError = false;
        }
        this.isPageLoading = false;
      });
  }

  clearSearch() {
    if (this.isPageLoading) return;
    this.searchTerm = '';
    this.lastSearchTerm = '';
    this.searchError = false;
    this.offset = 0;

    this.isPageLoading = true;
    this.pokemons = [];
  }
}
