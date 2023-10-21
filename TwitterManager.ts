import { Scraper, Tweet } from '@the-convocation/twitter-scraper';
import { TwitterImage } from './TwitterImage.js';

export class TwitterManager {
    private static UrlRegex = new RegExp("http(?:s)?:\/\/(?:www\.)?(twitter|x)\.com\/(?<user>[a-zA-Z0-9_]+)\/status\/(?<id>.*)");
    private static scrapper = new Scraper({fetch:fetch});

    public static IsTwitterURL(url:string):boolean {
        var result =this.UrlRegex.test(url);
        return result;
    }

    public static async GetTweetImages (url:string): Promise<TwitterImage> {
        var tweetid = this.UrlRegex.exec(url).groups["id"];
        tweetid = tweetid.split('?')[0];
        var tweet = await this.scrapper.getTweet(tweetid);

        var imgurls = tweet.photos.map(x => x.url);

        return new TwitterImage(url, imgurls, tweet.username);
    }
}