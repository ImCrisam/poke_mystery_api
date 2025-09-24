import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { HttpModule } from '@nestjs/axios';
import { IaModule } from '../ia/ia.module';
import { GameStore } from './gameStore';

@Module({
  imports: [
    HttpModule,
    IaModule,
  ],
  controllers: [PokemonController],
  providers: [PokemonService, GameStore],
})
export class PokemonModule {}
