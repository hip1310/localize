import { Test, TestingModule } from '@nestjs/testing';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { PhraseController } from './phrase.controller';
import { PhraseService } from './phrase.service';
import { phrases } from './phrase.constants';

describe('PhraseController', () => {
  let controller: PhraseController;
  let service: PhraseService;
  const mockElasticsearchService = {
    search: jest.fn(),
    index: jest.fn(),
    delete: jest.fn(),
  };
  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhraseController],
      providers: [PhraseService,{
        provide: ElasticsearchService,
        useValue: mockElasticsearchService,
      },],
    }).compile();

    controller = module.get<PhraseController>(PhraseController);
    service = module.get<PhraseService>(PhraseService);
  });

  describe('searchByQuery', () => {
    it('should call phraseService.searchByQuery and return the result', async () => {
      
      const query = 'Hello, world!';
      const expectedResult = phrases;

      jest.spyOn(service, 'searchByQuery').mockResolvedValue(expectedResult);

      // Act
      const result = await controller.searchByQuery(query);

      // Assert
      expect(service.searchByQuery).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findById', () => {
    it('should call phraseService.findById and return the result', async () => {
      
      const id = '1';
      const expectedResult = [phrases[0]];

      jest.spyOn(service, 'findById').mockResolvedValue(expectedResult);

      // Act
      const result = await controller.findById(id);

      // Assert
      expect(service.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findByIdAndLanguage', () => {
    it('should call phraseService.findByIdAndLanguage and return the result', async () => {
      
      const id = '1';
      const language = 'fr';
      const expectedResult = 'Bonjour, le monde!';

      jest.spyOn(service, 'findByIdAndLanguage').mockResolvedValue(expectedResult);

      // Act
      const result = await controller.findByIdAndLanguage(id, language);

      // Assert
      expect(service.findByIdAndLanguage).toHaveBeenCalledWith(id, language);
      expect(result).toEqual(expectedResult);
    });
  });
});