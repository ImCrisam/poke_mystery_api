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

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePokemonDto: UpdatePokemonDto) {
  //   return this.pokemonService.update(+id, updatePokemonDto);
  // }

}
