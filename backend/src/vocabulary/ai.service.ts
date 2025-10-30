import { GoogleGenAI } from '@google/genai';
import { Injectable } from '@nestjs/common';
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
    const sampleQuestion = `Generate 6 English vocabulary items for language learners. Follow this exact format:
      1. Phrasal verbs
      - "come across" = find by chance or seem/appear
      - "I came across an interesting article yesterday."

      2. Fixed expressions
      - "for the time being" = temporarily, for now
      - "For the time being, I'll work from home."

      3. Binomials
      - "pros and cons" = advantages and disadvantages
      - "Let's weigh the pros and cons before deciding."

      4. Proverbs/sayings
      - "Better late than never" = it's better to do something late than not at all
      - "I finally finished the book—better late than never!"

      5. Discourse markers
      - "having said that" = however, but (used to contrast with previous statement)
      - "The movie was long. Having said that, it was entertaining."

      6. Register-specific vocabulary
      - "get in touch" (neutral/informal) vs. "contact" (formal) vs. "reach out" (business informal)
      - "Feel free to get in touch if you have questions." (friendly email)
      - "Please contact us for further information." (formal)

      Requirements:
      - Use diverse, practical vocabulary
      - Provide clear, concise definitions
      - Include realistic example sentences
      - Avoid repetition of previously used terms
      - Make examples natural and conversational
      - Do NOT use any markdown formatting (no **, *, or _)
      - Use plain text only`;

    const response = await this.genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: sampleQuestion,
    });

    return response.text;
  }
}
