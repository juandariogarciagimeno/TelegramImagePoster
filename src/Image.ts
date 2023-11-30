export class Image {
    public Url: string;
    public ImageUrls?: string[];
    public Author: string;
    public Caption?:string;
    public Images?: Buffer[];

    public constructor(url: string, author:string, caption? :string, imagesUrl?:string[], images?: Buffer[]) {
        this.Url = url;
        this.Author = author;
        this.Caption = caption;

        this.ImageUrls = imagesUrl;
        this.Images = images
    }
}