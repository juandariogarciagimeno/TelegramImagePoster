import { SecretStore } from './SecretStore.js'
import { TelegramClient } from 'telegram';
import { StringSession } from "telegram/sessions/index.js";
import { Api } from 'telegram/tl/index.js';
import input from 'input';
import { NewMessage, NewMessageEvent } from 'telegram/events/NewMessage.js';
import { TwitterManager } from './TwitterManager.js';
import { TwitterImage } from './TwitterImage.js';

var store = new SecretStore();
await store.init()

const stringSession = new StringSession(store.TelegramSession);

const client = new TelegramClient(stringSession, store.TelegramAppId, store.TelegramAppHash, {connectionRetries: 5});

await client.start({
    phoneNumber: async () => store.TelegramPhone,
    password: async () => store.TelegramPass,
    phoneCode: async () => await input.text("Enter telegram verification code"),
    onError: (err) => console.log(err)
})

await store.SetTelegramSession(stringSession.save())

const me = await client.getMe() as Api.User;
const target = await GetTargetChannel();

if (!target) {
    throw "Target Channel not found!";
}

async function GetTargetChannel(): Promise<Api.TypeInputPeer> {
    try {
        var target: Api.TypeInputPeer = null;

        const dialogs = (await client.getDialogs()).filter(d => d.isChannel && !d.isGroup);
        var i = 0;
        do {
            if (dialogs[i].title == store.TelegramTargetGroupName)  {
                target = dialogs[i].inputEntity;
            }
            i++;
        } while(target == null && i <= dialogs.length);
    
        return target;
    }
    catch {return null;}
}

function CheckMessage(event: NewMessageEvent): boolean {
    if (event.isGroup && !event.isChannel) {
        var sender = event.message.sender as Api.User
        if (sender?.username == me.username) {
            var chat = event.message.chat as Api.Chat
            if (chat?.title == store.TelegramSourceGroupName) {
                return TwitterManager.IsTwitterURL(event.message.text);
            }
        }
    }

    return false;
}

async function HandleNewMessage(event: NewMessageEvent) {
    try {
        if (!CheckMessage(event)) return;

        var url = event.message.text;
        var image = await TwitterManager.GetTweetImages(url);
        if (await SendImage(image)) {
            await client.deleteMessages(event.chat, [event.message.id], {});
        }
    } catch (e) {
        await client.sendMessage(event.message.chat, {message: `Error Handling message: ${e}`});
    }
}

async function SendImage(image:TwitterImage): Promise<boolean> {
    client.setParseMode("html");
        var [text, entities] = client.parseMode.parse(`<b>[${image.Author}]</b> <br> <a href='${image.Url}'>Source</a>`);
        
        var multiImages = image.ImageUrls.map(x => new Api.InputMediaPhotoExternal({url: x, spoiler: false}));

        await multiImages.forEach(async i => {
            await client.invoke(new Api.messages.SendMedia({
                peer: target,
                media: i,
                message: text,
                entities: entities
            }));
        });

        return true;
}

client.addEventHandler(HandleNewMessage, new NewMessage({}))



//await client.sendMessage("Ecchi Lounge", {message: "Esta es una prueba de mensaje enviado por un bot"});