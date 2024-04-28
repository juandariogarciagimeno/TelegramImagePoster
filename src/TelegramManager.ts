import { Api, TelegramClient } from "telegram";
import { ConfigStore } from "./ConfigStore.js";
import { StringSession } from "telegram/sessions/StringSession.js";
import input from 'input';
import { NewMessage, NewMessageEvent } from "telegram/events/NewMessage.js";
import { Image } from "./Models/Image.js";
import { CustomFile } from "telegram/client/uploads.js";

export default class TelegramManager {

    public Client : TelegramClient;
    private Config : ConfigStore;
    public Me : Api.User;
    public Source : Api.InputPeerChat;
    public Target : Api.InputPeerChat;

    public async Init (config : ConfigStore) : Promise<boolean> {
        try {
            const stringSession = new StringSession(config.TelegramConfig.Session);

            this.Client = new TelegramClient(stringSession, config.TelegramConfig.AppId, config.TelegramConfig.AppHash, {connectionRetries: 5});

            await this.Client.start({
                phoneNumber: async () => config.TelegramConfig.Phone,
                password: async () => config.TelegramConfig.Pin,
                phoneCode: async () => await input.text("Enter telegram verification code"),
                onError: (err) => console.log(err)
            })

            await config.SetTelegramSession(stringSession.save());

            this.Me = await this.Client.getMe() as Api.User;
            this.Source = await this.FindChat(config.TelegramConfig.SourceChatIdOrTitle);
            this.Target = await this.FindChat(config.TelegramConfig.TargetChatIdOrTitle);

            this.Config = config;

            return this.Client.connected
        }
        catch {
            return false;
        }
    }

    private async FindChat(idOrName : string): Promise<Api.InputPeerChat> {
        try {
            const dialog = (await this.Client.getDialogs()).find(d => (d.title == idOrName || !isNaN(Number(idOrName)) && d.id.eq(idOrName)));
        
            return dialog?.inputEntity as Api.InputPeerChat;
        }
        catch (e) {return null;}
    }

    public AddListener(listener : {(event: NewMessageEvent): void}) {
        this.Client.addEventHandler(listener, new NewMessage({chats : [this.Source.chatId]}))
    }

    public async SendImage(image: Image) {

        if (this.Config.TelegramConfig.UseMarkup)
            this.Client.setParseMode("html");

        var caption = this.Config.TelegramConfig.CaptionTemplate;
        image.AdditionalValues.forEach((v,k) => {
            caption = caption.replace(`%${k}%`, v);
        });

        var [text, entities] = this.Client.parseMode.parse(caption);
    
        var multiImages: Api.TypeInputMedia[] = [];
        if (image.Images.every(x => typeof x === "string")) {
            multiImages = image.Images.map(x => new Api.InputMediaPhotoExternal({url: x, spoiler: false}));
        }
        else if (image.Images.every(x => Buffer.isBuffer(x))) {
            multiImages = await Promise.all(image.Images.map(async x => {
                var uploaded = await this.Client.uploadFile({
                    file: new CustomFile(
                        "up.jpg",
                        x.length,
                        "",
                        x
                    ),
                    workers: 1
                });

                return new Api.InputMediaUploadedPhoto({file: uploaded});
            }));
        }
        else {
            return;
    }

    await multiImages.forEach(async i => {
        await this.Client.invoke(new Api.messages.SendMedia({
            peer: this.Target,
            media: i,
            message: text,
            entities: entities
        }));
    });

    return true;
    }
}