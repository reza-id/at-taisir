import { AyatTranslation } from './ayat-translation.model';
import { Word } from './word/word.model';

export interface Ayat {
    _id: string;
    verse_number: number;
    chapter_id: number;
    juz_number: number;
    page_number: number;
    translations: AyatTranslation[];
    words: Word[];
}