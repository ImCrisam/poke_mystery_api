import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { IaService } from '../ia/ia.service';
import { v4 as uuidv4 } from 'uuid';
import { options } from 'axios';
const maxIdPokemon: number = 1024;
@Injectable()
export class PokemonService {
  constructor(
    private readonly http: HttpService,
    private readonly iaService: IaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async CreateRiddle() {
    const idsPokemons = this.getRandomPokemonIds(maxIdPokemon, 10);

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
        hp:p.stats[0].base_stat,
        attack:p.stats[1].base_stat,
        defense:p.stats[2].base_stat,
        specialAttack:p.stats[3].base_stat,
        specialDefense:p.stats[4].base_stat,
        speed:p.stats[5].base_stat
      };
    });

    const geminiData =
      await this.iaService.createPokemonRiddleFromList(pokemons);
    const gameId = uuidv4();

    await this.cacheManager.set(gameId, {
      answer: geminiData.answer,
    });

    const optionsFull = pokemons.filter((pokemon) =>
      geminiData.options.includes(pokemon.id),
    );

    console.log({ optionsFull });

    return {
      gameId,
      riddle: geminiData.riddle,
      options: optionsFull,
    };
  }

  private getRandomPokemonIds(max: number, count: number): Set<number> {
    const ids = new Set<number>();

    while (ids.size < count) {
      const random = Math.floor(Math.random() * max) + 1;
      ids.add(random);
    }

    return ids;
  }
}
