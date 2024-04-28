import { JsonDB, Config } from 'node-json-db';
import TwitterProviderConfig from './Models/TwitterProviderConfig.js';
import PixivProviderConfig from './Models/PixivProviderConfig.js';
import TelegramConfig from './Models/TelegramConfig.js';
import BooruProviderConfig from './Models/BooruProviderConfig.js';

export class ConfigStore {
    private db: JsonDB;

    public TwitterConfig? : TwitterProviderConfig
    public PixivConfig? : PixivProviderConfig
    public TelegramConfig? : TelegramConfig
    public BooruConfig? : BooruProviderConfig

    public constructor() {
        this.db = new JsonDB(new Config("config.json", true, true));
    }

    public async init() {

        this.TwitterConfig = await this.db.getObjectDefault<TwitterProviderConfig>("/Twitter", null);
        this.TelegramConfig = await this.db.getObject<TelegramConfig>("/Telegram");
        this.PixivConfig = await this.db.getObjectDefault<PixivProviderConfig>("/Pixiv", null);
        var booruItems = await this.db.getObjectDefault<Array<string>>("/Booru", null);
        if (booruItems != null && booruItems.length > 0) {
            this.BooruConfig = new BooruProviderConfig();
            this.BooruConfig.Items = booruItems;
        }
    }

    public async SetTelegramSession (session:string) {
        await this.db.push("/Telegram/Session", session);
        this.TelegramConfig.Session = await this.db.getData("/Telegram/Session");
    }

    public async SetPixivRefreshToken (token:string) {
        await this.db.push("/Pixiv/RefreshToken", token);
        this.PixivConfig.RefreshToken = await this.db.getData("/Pixiv/RefreshToken");
    }
}