import { Image } from '../Image.js';
import Pixiv from "pixiv.ts";
import * as fs from 'node:fs/promises';

export default class PixivManager {

    private static PixivUrlRegex = /https:\/\/www\.pixiv\.net(\/en)?\/artworks\/(?<id>\d+)/;
    private static client:Pixiv.default;

    public static async Init(data: {accesstoken:string, refreshtoken:string}) {
        
        Pixiv.default.accessToken = data.accesstoken;
        this.client = await Pixiv.default.refreshLogin(data.refreshtoken);

        data.refreshtoken = await this.client?.refreshToken();
    }

    public static IsPixivURL (url:string):boolean {
        return this.PixivUrlRegex.test(url);
    }

    public static async GetPixivImages(url:string) : Promise<Image> {
        var match = this.PixivUrlRegex.exec(url);
        var id = match.groups["id"];
        var illustid = Number.parseInt(id);

        var image = await this.client.illust.detail({illust_id: illustid});

        var imgurls:string[] = [];

        if (image?.meta_pages != null && image.meta_pages.length > 0) {
            imgurls = image.meta_pages.map((x) => x.image_urls.original)
        }
        else if (image?.meta_single_page?.original_image_url) {
            imgurls.push(image.meta_single_page.original_image_url);
        } else {
            imgurls.push(image?.image_urls?.large ?? image?.image_urls?.medium ?? image?.image_urls?.square_medium);
        }

        await this.client.util.downloadIllust(image, "./images", "original");
        var imgList = await fs.readdir("./images");
        var imgbuffer = await Promise.all(imgList.map(async (x) => {var img = await fs.readFile(`./images/${x}`); await fs.unlink(`./images/${x}`); return img}));


        var iurl = image.url ?? url;
        return new Image(iurl, image.user?.name, image.caption, null, imgbuffer);
    }
}