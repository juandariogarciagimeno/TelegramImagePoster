import Booru, {BooruClass, forSite }  from "booru";
import { ConfigStore } from "../ConfigStore.js";
import { Image } from "../Models/Image.js";
import IProvider from "./IProvider.js";
import BooruPost from "../Models/BooruPost.js";

export default class BooruProvider implements IProvider{

    private Client : BooruClass;
    private Config : ConfigStore;

    Init(config: ConfigStore, ...args: any[]): void {
        this.Config = config;
        this.Client = Booru.forSite(args[0]);

        if (this.Client == null)
            throw new Error(`Booru provider ${args[0]} not valid`);
    }
    CanHandle(text: string): boolean {
        try {
            var url = new URL(text);

            return url.host == this.Client.domain;
        }
        catch {
            return false;
        }
    }
    async GetImages(url: string): Promise<Image> {
        var id = url.split('/').find(x => /^\d+$/.test(x));
        if (id == null || id == "") {
            var uri = new URL(url);
            id = uri.searchParams.get('id');
        }

        if (id == null || id == "") {
            throw new Error(`Couldn't parse url ${url}`);
        }

        var result = await this.Client.search([`id:${id}`]);
        if (result == null || result.length <= 0)
            throw new Error("Couldn't find post in the provider");

        var item = new BooruPost(result[0] as BooruPost);

        if (!item.available)
            throw new Error("Image is not available at the provider");

        var image : Image = null;
        if (this.Client.site.nsfw) {
            var buffer = await fetch(item.file_url);
            var img = Buffer.from(await buffer.arrayBuffer())
            image = new Image([img])
        }
        else {
            image = new Image([item.fileUrl]);
        }
        
        image.AdditionalValues.set("url",  item.PixivUrl ?? this.getSource(item.source) ?? url);
        image.AdditionalValues.set("posturl", url);
        image.AdditionalValues.set("tags", item.tags.join(", "));
        image.AdditionalValues.set("author", (await item.getAuthor())?.join(", "));

        return image;
    }

    private getSource?(src : string | string[]) : string {
        if (Array.isArray(src))
            return src.length > 0 ? src[0] : null;

        return src;
    }

}