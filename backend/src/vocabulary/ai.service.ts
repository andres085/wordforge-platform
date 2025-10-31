import { GoogleGenAI } from '@google/genai';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
  private genAI: GoogleGenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }

    this.genAI = new GoogleGenAI({});
  }

  async generateVocabulary() {
    const prompt = `You are a vocabulary enrichment assistant. Generate 6 diverse English vocabulary items for the week.
      Categories to include (one of each):
      1. Phrasal verbs
      2. Fixed expressions
      3. Binomials
      4. Proverbs/sayings
      5. Discourse markers
      6. Register-specific vocabulary

      Requirements:
      - Use diverse, practical vocabulary
      - Provide clear, concise definitions
      - Include realistic example sentences
      - Avoid repetition of previously used terms
      - Make examples natural and conversational

      Return ONLY a valid JSON array with this exact structure:

      [
        {
          "position": 1,
          "category": "Phrasal verbs",
          "term": "look forward to",
          "definition": "eagerly anticipate",
          "example": "I'm really looking forward to my vacation next month."
        },
        {
          "position": 2,
          "category": "Fixed expressions",
          "term": "out of the blue",
          "definition": "suddenly and unexpectedly",
          "example": "My old friend called me out of the blue last night."
        }
        // ... 4 more items
      ]

      Return ONLY the JSON array, no additional text or markdown like the json tag at the start.`;

    const response = await this.genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    if (!response.text)
      throw new InternalServerErrorException('Failed to get questions from AI');

    try {
      const parsedResponse = JSON.parse(response.text as string);

      return parsedResponse;
    } catch (error) {
      throw new BadRequestException('Failed to parse response from AI service');
    }
  }
}
