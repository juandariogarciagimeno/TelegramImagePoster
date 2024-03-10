import { Image } from '../Models/Image.js';
import Pixiv from "pixiv.ts";
import * as fs from 'node:fs/promises';
import IProvider from './IProvider.js';
import { ConfigStore } from '../ConfigStore.js';

export default class PixivProvider implements IProvider{

    private static PixivUrlRegex = /https:\/\/www\.pixiv\.net(\/en)?\/artworks\/(?<id>\d+)/;
    private client:Pixiv.default;

    public async Init(config :ConfigStore) {
        
        Pixiv.default.accessToken = config.PixivConfig.AccessToken;
        this.client = await Pixiv.default.refreshLogin(config.PixivConfig.RefreshToken);

        config.SetPixivRefreshToken(await this.client?.refreshToken());
    }

    public CanHandle (url:string):boolean {
        return PixivProvider.PixivUrlRegex.test(url);
    }

    public async GetImages(url:string) : Promise<Image> {
        var match = PixivProvider.PixivUrlRegex.exec(url);
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
        var img = new Image(imgbuffer);

        img.AdditionalValues.set("url", iurl);
        img.AdditionalValues.set("author", image.user?.name);
        img.AdditionalValues.set("caption", image.caption);
        img.AdditionalValues.set("tags", image.tags.map(x => x.name).join(", "));

        return img;
    }
}