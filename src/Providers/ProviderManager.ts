import { ConfigStore } from "../ConfigStore.js";
import IProvider from "./IProvider.js";
import PixivProvider from "./PixivProvider.js";
import { TwitterProvider } from "./TwitterProvider.js";

export default class ProviderManager {
    public static async GetProviders(config : ConfigStore) : Promise<Array<IProvider>> {
        var providers = new Array<IProvider>();

        if (config.PixivConfig != null) {
            var pixiv = new PixivProvider();
            await pixiv.Init(config);
            providers.push(pixiv);
        }

        if (config.TwitterConfig != null) {
            var twitter = new TwitterProvider();
            await twitter.Init(config);
            providers.push(twitter);
        }

        return providers;
    }
}