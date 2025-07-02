import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';
  private speciesUrl = 'https://pokeapi.co/api/v2/pokemon-species';

  constructor(private http: HttpClient) { }

  getPokemons(limit: number, offset: number): Observable<any> {
    return this.http.get(`${this.apiUrl}?limit=${limit}&offset=${offset}`);
  }

  getPokemonDetails(url: string): Observable<any> {
    return this.http.get(url);
  }

  getPokemonByNameOrId(nameOrId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${nameOrId}`);
  }

  getPokemonDescription(id: number | string): Observable<any> {
    return this.http.get(`${this.speciesUrl}/${id}`);
  }

  getEvolutionChainUrl(speciesUrl: string): Observable<any> {
    return this.http.get(speciesUrl);
  }

  getEvolutionChain(evolutionChainUrl: string): Observable<any> {
    return this.http.get(evolutionChainUrl);
  }
}
