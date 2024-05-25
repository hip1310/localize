import { Module } from '@nestjs/common';
import { PhraseModule } from './phrase/phrase.module';

@Module({
  imports: [
    PhraseModule,
  ],
})
export class AppModule {}
