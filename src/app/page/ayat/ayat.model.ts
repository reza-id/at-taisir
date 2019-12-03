import { AyatTranslation } from './ayat-translation.model';
import { Word } from './word/word.model';

export interface Ayat {
    _id: string;
    verse_number: number;
    chapter_id: number;
    juz_number: number;
    page_number: number;
    verse_key: string;
    text_simple: string;
    translations: AyatTranslation[];
    words: Word[];
}