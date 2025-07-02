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

  // Obtiene la lista de Pokémon con paginación
  getPokemons(limit: number, offset: number): Observable<any> {
    return this.http.get(`${this.apiUrl}?limit=${limit}&offset=${offset}`);
  }

  // Obtiene detalles desde una URL completa
  getPokemonDetails(url: string): Observable<any> {
    return this.http.get(url);
  }

  // Obtiene detalles por nombre o ID para el buscador
  getPokemonByNameOrId(nameOrId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${nameOrId}`);
  }

  // Obtiene la descripción desde el endpoint de "species"
  getPokemonDescription(id: number | string): Observable<any> {
    return this.http.get(`${this.speciesUrl}/${id}`);
  }

  // NUEVO: Obtiene la URL de la cadena evolutiva
  getEvolutionChainUrl(speciesUrl: string): Observable<any> {
    return this.http.get(speciesUrl);
  }

  // NUEVO: Obtiene los datos de la cadena evolutiva
  getEvolutionChain(evolutionChainUrl: string): Observable<any> {
    return this.http.get(evolutionChainUrl);
  }
}
