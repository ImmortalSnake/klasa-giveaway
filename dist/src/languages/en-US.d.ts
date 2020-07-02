import { Language, LanguageValue } from 'klasa';
export default class extends Language {
    language: Record<string, LanguageValue> & {
        DEFAULT: (term: string) => string;
    };
}
