import { BooruClass as Booru, Post } from "booru";
import { auth } from "telegram/client/index.js";

export default class BooruPost extends Post {

    constructor (post : BooruPost) {
        super(post.data, post.booru);
    }

    public async getAuthor() : Promise<string[]> {
        try {
            if (Array.isArray(this.data.tag_string_artist))
            return this.data.tag_string_artist;

            if (this.data.tag_string_artist)
                return this.data.tag_string_artist.split(' ');

            var searchUrl = this.booru.getSearchUrl();
            if (searchUrl.includes("php") && this.tags) {
                var uri = new URL(searchUrl);
                uri.searchParams.set("s", "tag")
                uri.searchParams.set("q", "index")
                uri.searchParams.set("json", "1")
                try {
                    uri.searchParams.delete("tags")
                    uri.searchParams.delete("limit")
                    uri.searchParams.delete("pid")
                }catch{}

                var taglist = this.tags;
                var author : string = null;
                var index = 0;
                do {
                    author = await this.searchForAuthorTag(uri, taglist[index]);
                    index++;
                } while(author == null && index <= taglist.length);

                return [author];
            }
        }
        catch (e){
            return null;
        }
    }

    private async searchForAuthorTag(url : URL, tag : string) : Promise<string>{
        try {
            url.searchParams.set("name", tag);
            var result = await fetch(url);
    
            var content = await result.json();
            if (content.tag[0].type == 1)
                return tag;
        }
        catch {return null;}

        return null;
    }

    public get PixivUrl() : string {
        try {
            if (this.data.pixiv_id) {
                return `https://pixiv.net/artworks/${this.data.pixiv_id}`
            }
        }
        catch {
            return null;
        }
    }
}