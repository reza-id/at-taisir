import { WordTranslation } from './word-translation.model';

export interface Word {
    id: number;
    ayatPositionInPage: number;
    wordPositionInPage: number;
    isNewLine: boolean;
    isHidden: boolean;
    isAyatNumber: boolean;
    position: number;
    line_number: number;
    page_number: number;
    code: string;
    verse_key: string;
    translation: WordTranslation[];
}