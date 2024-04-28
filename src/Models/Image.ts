export class Image {
    public Images?: Buffer[] | string[];
    public AdditionalValues: Map<string, string>

    public constructor(images?: Buffer[] | string[]) {
        this.Images = images
        this.AdditionalValues = new Map<string,string>();
    }
}