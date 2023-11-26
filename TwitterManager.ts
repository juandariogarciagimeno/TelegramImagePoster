import { Scraper, Tweet } from '@the-convocation/twitter-scraper';
import { TwitterImage } from './TwitterImage.js';

export class TwitterManager {
    private static UrlRegex = /http(?:s)?:\/\/(?:www\.)?(fx)?(twitter|x)\.com\/(?<user>[a-zA-Z0-9_]+)\/status\/(?<id>.*)/
    private static IdExtract = /\/status\/(\d+)/;
    private static scrapper = new Scraper({fetch:fetch});

    public static IsTwitterURL(url:string):boolean {
        var result =this.UrlRegex.test(url);
        return result;
    }

    public static async GetTweetImages (url:string): Promise<TwitterImage> {
        var match = this.IdExtract.exec(url);
        var tweetid = match[1];
        tweetid = tweetid.split('?')[0];
        var tweet = await this.scrapper.getTweet(tweetid);

        var imgurls = tweet.photos.map(x => x.url);

        return new TwitterImage(tweet.permanentUrl ?? url, imgurls, tweet.username);
    }
}