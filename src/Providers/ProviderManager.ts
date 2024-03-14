import { ConfigStore } from "../ConfigStore.js";
import BooruProvider from "./BooruProvider.js";
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

        if (config.BooruConfig != null && config.BooruConfig.Items.length > 0) {
            config.BooruConfig.Items.forEach(x => {
                try {
                    var booru = new BooruProvider();
                    booru.Init(config, x);
                    providers.push(booru);
                } catch {
                    console.log(`Error loading provider ${x}`);
                }
            })
        }
        return providers;
    }
}