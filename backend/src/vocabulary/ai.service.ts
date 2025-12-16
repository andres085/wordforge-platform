import { GoogleGenAI } from '@google/genai';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UpdateGlobalVocabularyDto } from './dto/global/update-global-vocabulary.dto';
import { GlobalVocabularyItem } from './entities';

@Injectable()
export class AiService {
  private genAI: GoogleGenAI;
  private readonly logger: Logger;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }

    this.genAI = new GoogleGenAI({});
    this.logger = new Logger();
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

      Return ONLY the JSON array, no additional text or markdown like the json tag at the start. IMPORTANT: every item should have his postion number in it going from 1 to 6 based on the list.`;

    const response = await this.genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    if (!response.text)
      throw new InternalServerErrorException('Failed to get questions from AI');

    try {
      const parsedResponse = JSON.parse(response.text as string);

      const isValid = this.validateVocabularyItemsCategory(parsedResponse);
      if (!isValid)
        throw new InternalServerErrorException(
          'Vocabulary Items list is not valid',
        );

      return this.reorderAndSanitize(parsedResponse);
    } catch (error) {
      throw new BadRequestException('Failed to parse response from AI service');
    }
  }

  private validateVocabularyItemsCategory(
    vocabularyItems: GlobalVocabularyItem[],
  ): boolean {
    if (!Array.isArray(vocabularyItems)) {
      this.logger.debug('Validation failed: not an array');
      return false;
    }

    if (vocabularyItems.length !== 6) {
      this.logger.debug(
        `Validation failed: expected 6 items, got ${vocabularyItems.length}`,
      );
      return false;
    }

    const expectedCategories = [
      'Phrasal verbs',
      'Fixed expressions',
      'Binomials',
      'Proverbs/sayings',
      'Discourse markers',
      'Register-specific vocabulary',
    ];

    const uniqueCategories = new Set();
    for (let vocabularyItem of vocabularyItems) {
      if (!expectedCategories.includes(vocabularyItem.category)) {
        this.logger.debug(
          `Validation failed: unknown category "${vocabularyItem.category}"`,
        );
        return false;
      }
      uniqueCategories.add(vocabularyItem.category);
    }

    if (uniqueCategories.size !== 6) {
      const missing = expectedCategories.filter(
        (cat) => !uniqueCategories.has(cat),
      );
      this.logger.debug(
        `Validation failed: missing or duplicate categories. Got: ${Array.from(uniqueCategories)}`,
      );
      return false;
    }

    return true;
  }

  private reorderAndSanitize(
    items: GlobalVocabularyItem[],
  ): GlobalVocabularyItem[] {
    const expectedOrder = [
      'Phrasal verbs',
      'Fixed expressions',
      'Binomials',
      'Proverbs/sayings',
      'Discourse markers',
      'Register-specific vocabulary',
    ];

    const itemsByCategory = new Map<string, GlobalVocabularyItem>();
    for (let item of items) {
      itemsByCategory.set(item.category, item);
    }

    const reorderedItems: GlobalVocabularyItem[] = [];

    for (let i = 0; i < expectedOrder.length; i++) {
      const category = expectedOrder[i];
      const item = itemsByCategory.get(category) as GlobalVocabularyItem;

      reorderedItems.push({
        ...item,
        position: i + 1,
      });
    }

    return reorderedItems;
  }

  async generateVocabularyItem(updateVocabularyDto: UpdateGlobalVocabularyDto) {
    const prompt = `You are a vocabulary enrichment assistant. Generate a new English vocabulary item to update this one:

      - ${updateVocabularyDto.category}
      - ${updateVocabularyDto.term}
      - ${updateVocabularyDto.definition}

      Requirements:
      - It should be of the same category
      - Use diverse, practical vocabulary
      - Provide clear, concise definitions
      - Include realistic example sentences
      - Avoid repetition of the previous vocabularyItem
      - Make examples natural and conversational

      Return ONLY a valid JSON object with this exact structure:

        {
          "category": "Phrasal verbs",
          "term": "look forward to",
          "definition": "eagerly anticipate",
          "example": "I'm really looking forward to my vacation next month."
        }

      Return ONLY the JSON object, no additional text or markdown like the json tag at the start.`;

    const response = await this.genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    if (!response.text)
      throw new InternalServerErrorException('Failed to get question from AI');

    try {
      const parsedResponse = JSON.parse(response.text as string);

      return parsedResponse;
    } catch (error) {
      throw new BadRequestException('Failed to parse response from AI service');
    }
  }
}
