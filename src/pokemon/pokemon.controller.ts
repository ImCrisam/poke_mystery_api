import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get("riddle")
  CreateRiddle() {
    return this.pokemonService.CreateRiddle();
  }

  @Post('validate')
  async validateAnswer(
    @Body() body: { gameId: string; pokemonId: number },
  ) {
    return this.pokemonService.validateAnswer(body.gameId, body.pokemonId);
  }

}
