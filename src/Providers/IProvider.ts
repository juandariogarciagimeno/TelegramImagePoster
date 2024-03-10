import { ConfigStore } from '../ConfigStore.js';
import { Image } from '../Models/Image.js';

export default interface Provider {

    Init(config : ConfigStore, ...args :string[]) : void
    CanHandle(text : string) : boolean
    GetImages(url : string) : Promise<Image>
}