import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { HttpModule } from '@nestjs/axios';
import { IaModule } from '../ia/ia.module';

@Module({
  imports: [HttpModule, IaModule],
  controllers: [PokemonController],
  providers: [PokemonService],
})
export class PokemonModule {}
