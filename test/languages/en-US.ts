import { Language, LanguageStore, KlasaClient } from 'klasa';

export default class extends Language {

	public constructor(client: KlasaClient, store: LanguageStore, file: string[], directory: string) {
		super(client, store, file, directory);

		this.language = {
			COMMAND_CREATE_DESCRIPTION: 'nothin here'
		};
	}

}
