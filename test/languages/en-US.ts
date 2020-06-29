import { Language, LanguageStore } from 'klasa';

export default class extends Language {

	public constructor(store: LanguageStore, file: string[], directory: string) {
		super(store, file, directory);

		this.language = {
			COMMAND_CREATE_DESCRIPTION: 'nothin here'
		};
	}

}
