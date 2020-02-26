import { Argument, KlasaMessage, Possible } from 'klasa';
export default class extends Argument {
    run(arg: string, possible: Possible, message: KlasaMessage): number;
}
