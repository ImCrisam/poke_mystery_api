import { Injectable } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
const maxIdPokemon:number = 1024
@Injectable()
export class PokemonService {

  constructor(private readonly http: HttpService) {}
  

  async CreateRiddle() {
    const idsPokemons = this.getRandomPokemonIds(maxIdPokemon)

        const requests = Array.from(idsPokemons).map((id) =>
      firstValueFrom(this.http.get(`https://pokeapi.co/api/v2/pokemon/${id}`)),
    );

    const responses = await Promise.all(requests);

    const pokemons = responses.map((res) => {
      const p = res.data;
      return {
        id: p.id,
        name: p.name,
        height: p.height,
        weight: p.weight,
        types: p.types.map((t) => t.type.name),
        abilities: p.abilities.map((a) => a.ability.name),
        sprite: p.sprites.front_default,
      };
    });
    console.log({pokemons})
    return pokemons
  }



  private getRandomPokemonIds(max: number): Set<number> {
  const ids = new Set<number>();

  while (ids.size < 12) {
    const random = Math.floor(Math.random() * max) + 1;
    ids.add(random);
  }

  return ids;
}

}
