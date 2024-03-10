import { Scraper } from '@the-convocation/twitter-scraper';
import { Image } from '../Models/Image.js';
import { ConfigStore } from '../ConfigStore.js';
import IProvider from './IProvider.js';

export class TwitterProvider implements IProvider{
    private static UrlRegex = /http(?:s)?:\/\/(?:www\.)?(fx)?(twitter|x)\.com\/(?<user>[a-zA-Z0-9_]+)\/status\/(?<id>.*)/
    private static IdExtract = /\/status\/(\d+)/;
    private scrapper: Scraper;

    public async Init(config : ConfigStore)
    {
        this.scrapper = new Scraper({fetch:fetch}); 
        await this.scrapper.login(config.TwitterConfig.Username, config.TwitterConfig.Pasword);
    }

    public CanHandle(url:string):boolean {
        var result = TwitterProvider.UrlRegex.test(url);
        return result;
    }

    public async GetImages (url:string): Promise<Image> {
        var match = TwitterProvider.IdExtract.exec(url);
        var tweetid = match[1];
        tweetid = tweetid.split('?')[0];
        var tweet = await this.scrapper.getTweet(tweetid);

        var imgurls = tweet.photos.map(x => x.url);

        var img = new Image(imgurls);

        img.AdditionalValues.set("url", tweet.permanentUrl ?? url);
        img.AdditionalValues.set("author", tweet.username);
        img.AdditionalValues.set("caption", tweet.text);

        return img;
    }
}