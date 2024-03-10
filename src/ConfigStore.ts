import { JsonDB, Config } from 'node-json-db';
import TwitterProviderConfig from './Models/TwitterProviderConfig.js';
import PixivProviderConfig from './Models/PixivProviderConfig.js';
import TelegramConfig from './Models/TelegramConfig.js';

export class ConfigStore {
    private db: JsonDB;

    public TwitterConfig? : TwitterProviderConfig
    public PixivConfig? : PixivProviderConfig
    public TelegramConfig? : TelegramConfig

    public constructor() {
        this.db = new JsonDB(new Config("config.json", true, true));
    }

    public async init() {

        this.TwitterConfig = await this.db.getObjectDefault<TwitterProviderConfig>("/Twitter", null);
        this.TelegramConfig = await this.db.getObject<TelegramConfig>("/Telegram");
        this.PixivConfig = await this.db.getObjectDefault<PixivProviderConfig>("/Pixiv", null);

        // var twitterConfig = await this.db.getData("/Twitter");
        // var telegramConfig = await this.db.getData("/Telegram");
        // var pixivConfig = await this.db.getData("/Pixiv");

        // if (twitterConfig != null) {
        //     this.TwitterConfig = new TwitterProviderConfig()
        //     this.TwitterConfig.Username = twitterConfig.User;
        //     this.TwitterConfig.Pasword = twitterConfig.Pass;
        // }
        
        // if (pixivConfig != null) {
        //     this.PixivConfig = new PixivProviderConfig()
        //     this.PixivConfig.AccessToken = pixivConfig.AccessToken;
        //     this.PixivConfig.RefreshToken = pixivConfig.RefreshToken;
        // }

        // this.TelegramConfig = new TelegramConfig()
        // this.TelegramConfig.Phone = telegramConfig.Phone;
        // this.TelegramConfig.Pin = telegramConfig.Pass;
        // this.TelegramConfig.SourceChatIdOrTitle = telegramConfig.SourceChatName;
        // this.TelegramConfig.TargetChatIdOrTitle = telegramConfig.TargetChatName;
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