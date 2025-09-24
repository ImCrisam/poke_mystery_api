import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenAI, GenerateContentResponse, Type } from '@google/genai';

@Injectable()
export class IaService {
  private readonly logger = new Logger(IaService.name);
  private readonly ai: GoogleGenAI;

  constructor() {
    const apiKey = process.env.API_TOKEN;
    if (!apiKey) {
      throw new Error(
        '❌ No se encontró API_TOKEN en las variables de entorno',
      );
    }

    this.ai = new GoogleGenAI({ apiKey });
  }

  async createPokemonRiddleFromList(pokemons: any[]): Promise<any> {
    const prompt = `
    Tienes la siguiente lista de Pokémon con información básica:

    ${pokemons
      .map(
        (p, i) => `
      idPokemon: ${p.id}
      Nombre: ${p.name}
      Tipos: ${p.types.join(', ')}
      Peso: ${p.weight}
      Altura: ${p.height}
      Estadisticas: ${p.stats}
    `,
      )
      .join('\n')}

    Instrucciones:
    - Escoge 4 id Pokemon de esta lista.
    - Al elegir los 4, procura que sean Pokémon con similitudes entre sí (por ejemplo: tipos iguales o parecidos, tamaños similares, estilos relacionados), para aumentar la dificultad de la adivinanza.
    - De esos 4, selecciona 1 que será el correcto para la adivinanza.
    - Crea una adivinanza basada en la información de ese Pokémon.
    - No menciones directamente su nombre.
    
    Instrucciones:
  - Escoge 4 Pokémon de la lista provista (usa sus datos, no inventes).
  - Selecciona Pokémon que tengan características similares (tipo, peso, altura, estadisticas).
  - Entre esos 4, elige 1 como respuesta correcta.
  - Genera una adivinanza basada en su descripción (tipo, peso, altura, estadisticas).
  - La adivinanza debe ser ambigua, sin mencionar nombres ni pistas obvias.
  - Aumenta la dificultad: haz que los otros 3 Pokémon también encajen parcialmente con la descripción, para que no sea evidente.
  
    `;

    try {
      const response: GenerateContentResponse =
        await this.ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.NUMBER },
                },
                answer: {
                  type: Type.NUMBER,
                },
                riddle: {
                  type: Type.STRING,
                },
              },
              propertyOrdering: ['options', 'answer', 'riddle'],
            },
          },
        });

      this.logger.debug(
        `Gemini raw response: ${JSON.stringify(response, null, 2)}`,
      );

      const candidate =
        response.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // Intentamos parsear JSON
      try {
        return JSON.parse(candidate);
      } catch {
        return { raw: candidate };
      }
    } catch (error: any) {
      this.logger.error(
        `Error en createPokemonRiddleFromList: ${error.message}`,
      );
      throw error;
    }
  }
}
