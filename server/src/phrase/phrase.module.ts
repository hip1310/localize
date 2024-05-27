import { Module } from '@nestjs/common';
import { PhraseService } from './phrase.service';
import { PhraseController } from './phrase.controller';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      useFactory: () => ({
        node: 'http://localhost:9200', // TODO: use env
      }),
    }),
  ],
  providers: [PhraseService],
  controllers: [PhraseController],
})
export class PhraseModule {}
