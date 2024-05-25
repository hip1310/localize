import { Injectable, NotFoundException } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { phrases, PHRASES_INDEX, PhraseType } from './phrase.constants';
import { AggregationsAggregate, SearchHit, SearchResponse } from '@elastic/elasticsearch/lib/api/types';

/**
 * Service responsible for handling phrase-related operations.
 */
@Injectable()
export class PhraseService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async onModuleInit() {
    await this.ensureIndexExists();
    await this.indexAll();
  }

  /**
   * Searches for phrases containing the specified text.
   * @param query The text to search for in phrases.
   * @returns An array of phrases matching the search query.
   */
  async searchByQuery(query: string): Promise<PhraseType[]> {
    const body: SearchResponse<PhraseType, Record<string, AggregationsAggregate>> = await this.elasticsearchService.search({
      index: PHRASES_INDEX,
      body: {
        query: {
          bool: {
            should: [
              //Status must be 'active' | 'pending' | 'spam' | 'deleted'
              { match: { status: query } },
              {
                //It will seach *query* in the phrase field and in the translations.fr and translations.es fields
                multi_match: {
                  query: query,
                  type: 'phrase_prefix',
                  fields: ['phrase', 'translations.fr', 'translations.es'],
                },
              },
            ],
          },
        },
      },
    });
    return this.extractSources(body);
  }

  /**
   * Finds a phrase by its ID.
   * @param id The ID of the phrase to find.
   * @returns The found phrase object or undefined if not found.
   */
  async findById(id: string): Promise<PhraseType[]> {
    const body: SearchResponse<PhraseType, Record<string, AggregationsAggregate>> = await this.elasticsearchService.search({
      index: PHRASES_INDEX,
      body: {
        query: {
          ids: { values: [id] },
        },
      },
    });

    return this.extractSources(body);
  }

  // /**
  //  * Finds a translation of a phrase in a specific language.
  //  * @param id The ID of the phrase.
  //  * @param language The language code of the translation.
  //  * @returns The translation text or undefined if not found.
  //  */
  async findByIdAndLanguage(id: string, language: string): Promise<string> {
    const body: SearchResponse<PhraseType, Record<string, AggregationsAggregate>> = await this.elasticsearchService.search({
      index: PHRASES_INDEX,
      body: {
        query: {
          bool: {
            must: [
              { ids: { values: [id] } },
              { exists: { field: `translations.${language}` } },
            ],
          },
        },
      },
    });

    const phrases = this.extractSources(body);
    return phrases?.[0].translations[language];
  }

  /**
   * Ensures the Elasticsearch index exists, creating it if necessary.
   */
  async ensureIndexExists(): Promise<void> {
    const indexExists = await this.elasticsearchService.indices.exists({
      index: PHRASES_INDEX,
    });
    if (!indexExists) {
      await this.elasticsearchService.indices.create({
        index: PHRASES_INDEX,
        body: {
          mappings: {
            properties: {
              id: { type: 'integer' },
              phrase: { type: 'text' },
              status: { type: 'keyword' },
              createdAt: { type: 'date' },
              updatedAt: { type: 'date' },
              translations: { type: 'object' },
            },
          },
        },
      });
    }
  }

  /**
   * Indexes all phrases from the phrases array.
   */
  async indexAll(): Promise<void> {
    // Index each phrase in the phrases array
    for (const phrase of phrases) {
      await this.indexDocument(phrase);
    }
  }

  /**
   * Indexes a single phrase.
   * @param phrase The phrase to index.
   */
  async indexDocument(phrase: PhraseType): Promise<void> {
    await this.elasticsearchService.index({
      index: PHRASES_INDEX,
      id: phrase.id.toString(),
      body: phrase,
    });
  }

  /**
   * Extracts the _source field from Elasticsearch search hits.
   * @param body The search response body.
   * @returns An array of the _source fields from the hits.
   */
  extractSources(body: SearchResponse<PhraseType, Record<string, AggregationsAggregate>>): PhraseType[] {
    const hits = body.hits.hits as SearchHit<PhraseType>[];
    if (hits.length === 0) {
      throw new NotFoundException('Phrase not found');
    }
    return hits.map((item) => item._source);
  }
}
