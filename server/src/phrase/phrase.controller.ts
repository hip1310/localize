import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { PhraseService } from './phrase.service';

/**
 * Controller for handling phrase-related HTTP requests.
 */
@ApiTags('Phrase')
@Controller('phrase')
export class PhraseController {
  constructor(private readonly phraseService: PhraseService) {}

  /**
   * Searches for phrases containing the specified text.
   * @Query query The text to search for in phrases.
   * @Query sort in phrases.
   * @returns An array of phrases matching the search query.
   */
  @Get('search')
  @ApiQuery({ name: 'query', description: 'Text to search for in phrases' })
  @ApiQuery({ name: 'sortBy', description: 'Sort in phrases', required: false })
  @ApiResponse({
    status: 200,
    description: 'Returns phrases containing the specified text',
  })
  @ApiResponse({ status: 404, description: 'Phrase not found' })
  async searchByQuery(
    @Query('query') query: string,
    @Query('sortBy') sortBy: string,
  ) {
    return this.phraseService.searchByQuery(query, sortBy);
  }

  /**
   * Finds a phrase by its ID.
   * @param id - The ID of the phrase to find.
   * @returns A Promise that resolves to the found phrase.
   */
  @Get(':id')
  @ApiParam({ name: 'id', description: 'ID of the phrase' })
  @ApiResponse({
    status: 200,
    description: 'Returns a phrase object without translations',
  })
  @ApiResponse({ status: 404, description: 'Phrase not found' })
  async findById(@Param('id') id: string) {
    return this.phraseService.findById(id);
  }

  /**
   * Retrieves a translation of a phrase in a specific language.
   * @param id The ID of the phrase.
   * @param language The language code of the translation.
   * @returns The translation text.
   */
  @Get(':id/:language')
  @ApiParam({ name: 'id', description: 'ID of the phrase' })
  @ApiParam({ name: 'language', description: 'Language code for translation' })
  @ApiResponse({
    status: 200,
    description: 'Returns a translation of a phrase',
  })
  @ApiResponse({ status: 404, description: 'Phrase not found' })
  async findByIdAndLanguage(
    @Param('id') id: string,
    @Param('language') language: string,
  ) {
    return this.phraseService.findByIdAndLanguage(id, language);
  }
}
