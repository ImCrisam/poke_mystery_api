import { Inject, Injectable,  } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { IaService } from '../ia/ia.service';
import { v4 as uuidv4 } from 'uuid';
const maxIdPokemon:number = 1024
@Injectable()
export class PokemonService {

  constructor(
    private readonly http: HttpService, 
    private readonly iaService:IaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}
  

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
        sprite: p.sprites.front_default,
      };
    });

    const responde =  await this.iaService.createPokemonRiddleFromList(pokemons);
    const gameId = uuidv4();
    console.log(responde)

    return 
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
