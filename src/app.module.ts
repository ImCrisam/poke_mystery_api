import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PokemonModule } from './pokemon/pokemon.module';
import { IaService } from './ia/ia.service';
import { IaModule } from './ia/ia.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // hace disponible process.env en todo el proyecto
    }),
    PokemonModule,
    IaModule
  ],
  controllers: [AppController],
  providers: [AppService, IaService],
})
export class AppModule {}
