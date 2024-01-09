import { Scraper } from '@the-convocation/twitter-scraper';
import { Image } from '../Image.js';

export class TwitterManager {
    private static UrlRegex = /http(?:s)?:\/\/(?:www\.)?(fx)?(twitter|x)\.com\/(?<user>[a-zA-Z0-9_]+)\/status\/(?<id>.*)/
    private static IdExtract = /\/status\/(\d+)/;
    private static scrapper: Scraper;

    public static async Init(data: {username:string, password:string}) 
    {
        this.scrapper = new Scraper({fetch:fetch}); 
        await this.scrapper.login(data.username, data.password);
    }

    public static IsTwitterURL(url:string):boolean {
        var result =this.UrlRegex.test(url);
        return result;
    }

    public static async GetImages (url:string): Promise<Image> {
        var match = this.IdExtract.exec(url);
        var tweetid = match[1];
        tweetid = tweetid.split('?')[0];
        var tweet = await this.scrapper.getTweet(tweetid);

        var imgurls = tweet.photos.map(x => x.url);

        return new Image(tweet.permanentUrl ?? url, tweet.username, "", imgurls);
    }
}