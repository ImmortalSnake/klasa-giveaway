import { Language, LanguageStore, util } from 'klasa';
import { join } from 'path';
import { pathExists } from 'fs-nextra';

export default class extends Language {

	public constructor(store: LanguageStore, file: string[], directory: string) {
		super(store, file, directory);

		this.language = {
			COMMAND_CREATE_DESCRIPTION: 'nothin here'
		};
	}

	public async init() {
		// @ts-ignore
		for (const core of this.store.coreDirectories) {
			const loc = join(core, ...this.file);
			if (this.directory !== core && await pathExists(loc)) {
				console.log(core);
				try {
					// eslint-disable-next-line @typescript-eslint/no-var-requires
					const CorePiece = (req => req.default || req)(require(loc));
					if (!util.isClass(CorePiece)) return;
					const coreLang = new CorePiece(this.store, this.file, true);
					this.language = util.mergeDefault(coreLang.language, this.language);
				} catch (error) {
					return;
				}
			}
		}
	}

}
