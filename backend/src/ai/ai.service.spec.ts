import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from './ai.service';

describe('AiService', () => {
  let service: AiService;
  let mockGenAI: any;

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn().mockReturnValue('fake-api-key'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AiService>(AiService);

    mockGenAI = {
      models: {
        generateContent: jest.fn(),
      },
    };
    (service as any).genAI = mockGenAI;
  });

  describe('generateVocabulary', () => {
    it('should generate 6 vocabulary items successfully', async () => {
      const mockResponse = {
        text: JSON.stringify([
          {
            position: 1,
            category: 'Phrasal verbs',
            term: 'look forward to',
            definition: 'eagerly anticipate',
            example: 'Example sentence',
          },
          {
            position: 2,
            category: 'Fixed expressions',
          },
          {
            position: 3,
            category: 'Binomials',
          },
          {
            position: 4,
            category: 'Proverbs/sayings',
          },
          {
            position: 5,
            category: 'Discourse markers',
          },
          {
            position: 6,
            category: 'Register-specific vocabulary',
          },
        ]),
      };

      mockGenAI.models.generateContent.mockResolvedValue(mockResponse);

      const result = await service.generateVocabulary();

      expect(result).toHaveLength(6);
      expect(result[0].position).toBe(1);
      expect(mockGenAI.models.generateContent).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException when AI returns invalid JSON', async () => {
      mockGenAI.models.generateContent.mockResolvedValue({
        text: 'invalid json',
      });

      await expect(service.generateVocabulary()).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw InternalServerErrorException when returned items are less than 6', async () => {
      const mockResponse = {
        text: JSON.stringify([
          {
            category: 'Phrasal verbs',
            term: 'test',
            definition: 'test',
            example: 'test',
          },
          {
            category: 'Fixed expressions',
            term: 'test',
            definition: 'test',
            example: 'test',
          },
          {
            category: 'Binomials',
            term: 'test',
            definition: 'test',
            example: 'test',
          },
        ]),
      };

      mockGenAI.models.generateContent.mockResolvedValue(mockResponse);

      await expect(service.generateVocabulary()).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw InternalServerErrorException when there are repeated items fails', async () => {
      const mockResponse = {
        text: JSON.stringify([
          {
            position: 1,
            category: 'Phrasal verbs',
            term: 'look forward to',
            definition: 'eagerly anticipate',
            example: 'Example sentence',
          },
          {
            position: 2,
            category: 'Fixed expressions',
          },
          {
            position: 3,
            category: 'Binomials',
          },
          {
            position: 4,
            category: 'Proverbs/sayings',
          },
          {
            position: 5,
            category: 'Proverbs/sayings',
          },
          {
            position: 6,
            category: 'Register-specific vocabulary',
          },
        ]),
      };

      mockGenAI.models.generateContent.mockResolvedValue(mockResponse);

      await expect(service.generateVocabulary()).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw InternalServerErrorException when if the response is not an array of items', async () => {
      const mockResponse = {
        text: JSON.stringify({}),
      };

      mockGenAI.models.generateContent.mockResolvedValue(mockResponse);

      await expect(service.generateVocabulary()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
