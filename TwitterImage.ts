export class TwitterImage {
    public Url: string;
    public ImageUrls: string[];
    public Author: string;

    public constructor(url: string, imageUrls:string[], author:string) {
        this.Url = url;
        this.ImageUrls = imageUrls;
        this.Author = author;
    }
}