import { WordTranslation } from './word-translation.model';

export interface Word {
    id: number;
    isNewLine: boolean;
    position: number;
    line_number: number;
    page_number: number;
    code: string;
    translations: WordTranslation[];
}