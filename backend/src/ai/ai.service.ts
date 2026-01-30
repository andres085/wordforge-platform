import { GoogleGenAI } from '@google/genai';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UpdateUserVocabularyItemDto } from '../vocabulary/dto/user/update-user-vocabulary-item.dto';
import { GlobalVocabularyItem } from '../vocabulary/entities';

@Injectable()
export class AiService {
  private genAI: GoogleGenAI;
  private readonly logger: Logger;
  private readonly VALID_CATEGORIES = [
    'Phrasal verbs',
    'Fixed expressions',
    'Binomials',
    'Proverbs/sayings',
    'Discourse markers',
    'Register-specific vocabulary',
  ];

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
      this.logger.error(error.message);
      throw new InternalServerErrorException(
        'Failed to parse response from AI service',
      );
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

    const uniqueCategories = new Set();
    for (let vocabularyItem of vocabularyItems) {
      if (!this.VALID_CATEGORIES.includes(vocabularyItem.category)) {
        this.logger.debug(
          `Validation failed: unknown category "${vocabularyItem.category}"`,
        );
        return false;
      }
      uniqueCategories.add(vocabularyItem.category);
    }

    if (uniqueCategories.size !== 6) {
      const missing = this.VALID_CATEGORIES.filter(
        (cat) => !uniqueCategories.has(cat),
      );
      this.logger.debug(
        `Validation failed: missing or duplicate categories. Got: ${Array.from(uniqueCategories)}, Missing: ${missing}`,
      );
      return false;
    }

    return true;
  }

  private reorderAndSanitize(
    items: GlobalVocabularyItem[],
  ): GlobalVocabularyItem[] {
    const itemsByCategory = new Map<string, GlobalVocabularyItem>();
    for (let item of items) {
      itemsByCategory.set(item.category, item);
    }

    const reorderedItems: GlobalVocabularyItem[] = [];

    for (let i = 0; i < this.VALID_CATEGORIES.length; i++) {
      const category = this.VALID_CATEGORIES[i];
      const item = itemsByCategory.get(category) as GlobalVocabularyItem;

      reorderedItems.push({
        ...item,
        position: i + 1,
      });
    }

    return reorderedItems;
  }

  async generateVocabularyItem(
    updateUserVocabularyItemDto: UpdateUserVocabularyItemDto,
  ) {
    const prompt = `You are a vocabulary enrichment assistant. Generate a new English vocabulary item to update this one:

      - ${updateUserVocabularyItemDto.category}
      - ${updateUserVocabularyItemDto.term}
      - ${updateUserVocabularyItemDto.definition}

      Requirements:
      - It should be of the same category
      - Use diverse, practical vocabulary
      - Provide clear, concise definitions
      - Include realistic example sentences
      - Avoid repetition of the previous vocabularyItem
      - Make examples natural and conversational

      IMPORTANT: RETURN ONLY THE JAVASCRIPT OBJECT, NO ADDITIONAL TEXT OR MARKDOWN TAGS LIKE THE JSON, OR JAVASCRIPT AT THE START JUST THE PLAIN OBJECT, AND FOLLOW THIS STRUCTURE:

        {
          "category": "Phrasal verbs",
          "term": "look forward to",
          "definition": "eagerly anticipate",
          "example": "I'm really looking forward to my vacation next month."
        }
      `;

    const response = await this.genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    if (!response.text)
      throw new InternalServerErrorException('Failed to get question from AI');

    try {
      const parsedResponse = JSON.parse(response.text);

      return parsedResponse;
    } catch (error) {
      throw new BadRequestException('Failed to parse response from AI service');
    }
  }
}
