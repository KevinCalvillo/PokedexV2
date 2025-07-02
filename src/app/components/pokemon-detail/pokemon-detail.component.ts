import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../../servicios/pokemon.service';
import { Chart, registerables } from 'chart.js';
import { forkJoin } from 'rxjs'; 

Chart.register(...registerables);

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.css']
})
export class PokemonDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() pokemon: any;
  @Output() close = new EventEmitter<void>();

  @ViewChild('statsChart') statsChartRef!: ElementRef<HTMLCanvasElement>;

  description: string = 'Cargando descripción...';
  statsChart: Chart | null = null;
  evolutionChain: any[] = [];

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.loadPokemonData();
  }

  ngAfterViewInit(): void {
    this.createStatsChart();
  }

  ngOnDestroy(): void {
    if (this.statsChart) {
      this.statsChart.destroy();
    }
  }

  loadPokemonData(): void {
    this.pokemonService.getPokemonDescription(this.pokemon.id).subscribe(speciesData => {
      const flavorTextEntry = speciesData.flavor_text_entries.find(
        (entry: any) => entry.language.name === 'es'
      );
      this.description = flavorTextEntry ? flavorTextEntry.flavor_text.replace(/\f/g, ' ') : 'No se encontró descripción en español.';

      if (speciesData.evolution_chain.url) {
        this.loadEvolutionChain(speciesData.evolution_chain.url);
      }
    });
  }

  loadEvolutionChain(url: string): void {
    this.pokemonService.getEvolutionChain(url).subscribe(chainData => {
      const chainNames: string[] = [];
      let currentStage = chainData.chain;

      while (currentStage) {
        chainNames.push(currentStage.species.name);
        if (currentStage.evolves_to.length > 0) {
          currentStage = currentStage.evolves_to[0];
        } else {
          currentStage = null;
        }
      }

      const evolutionObservables = chainNames.map(name => this.pokemonService.getPokemonByNameOrId(name));
      forkJoin(evolutionObservables).subscribe(evolutionDetails => {
        this.evolutionChain = evolutionDetails;
      });
    });
  }

  createStatsChart(): void {
    const ctx = this.statsChartRef.nativeElement.getContext('2d');
    if (ctx) {
      const labels = this.pokemon.stats.map((statInfo: any) => statInfo.stat.name);
      const data = this.pokemon.stats.map((statInfo: any) => statInfo.base_stat);
      const primaryColor = this.getCardColor(this.pokemon.types[0].type.name);

      this.statsChart = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Estadísticas Base',
            data: data,
            backgroundColor: `${primaryColor}40`,
            borderColor: primaryColor,
            pointBackgroundColor: primaryColor,
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: primaryColor
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { r: { angleLines: { color: 'rgba(255, 255, 255, 0.2)' }, grid: { color: 'rgba(255, 255, 255, 0.2)' }, pointLabels: { color: '#fff', font: { size: 12 } }, ticks: { color: '#fff', backdropColor: 'rgba(0, 0, 0, 0.5)', stepSize: 50 } } },
          plugins: { legend: { display: false } }
        }
      });
    }
  }

  closeDetail() {
    this.close.emit();
  }

  getCardColor(type: string): string {
    const colors: { [key: string]: string } = {
      grass: '#78C850', fire: '#F08030', water: '#6890F0', bug: '#A8B820',
      normal: '#A8A878', poison: '#A040A0', electric: '#F8D030', ground: '#E0C068',
      fairy: '#EE99AC', fighting: '#C03028', psychic: '#F85888', rock: '#B8A038',
      ghost: '#705898', ice: '#98D8D8', dragon: '#7038F8', flying: '#A890F0',
      steel: '#B8B8D0', dark: '#705848'
    };
    return colors[type] || '#A8A878';
  }
}
