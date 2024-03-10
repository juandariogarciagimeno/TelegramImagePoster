import { ConfigStore } from './src/ConfigStore.js'
import { Api } from 'telegram/tl/index.js';
import { NewMessageEvent } from 'telegram/events/NewMessage.js';
import ProviderManager from './src/Providers/ProviderManager.js';
import TelegramManager from './src/TelegramManager.js';
import IProvider from './src/Providers/IProvider.js';

var store = new ConfigStore();
await store.init()

var telegramManager = new TelegramManager();
if (!await telegramManager.Init(store)) {
    throw new Error("Couldn't open Telegram Session. Please check console output in case it's asking for account verification");
}

var providers = await ProviderManager.GetProviders(store);

if (providers == null || providers.length == 0) {
    throw new Error("No providers configured");
}


function CheckMessage(event: NewMessageEvent): IProvider {
    var found : IProvider = null;

    if (event.isGroup && !event.isChannel) {
        var sender = event.message.sender as Api.User
        if (sender?.username == telegramManager.Me.username) {
            var chat = event.message.chat as Api.Chat
            if (chat?.id.eq(telegramManager.Source.chatId)) {
                providers.forEach(x => {
                    if (x.CanHandle(event.message.text)) {
                        found = x;
                    }
                })
            }
        }
    }

    return found;
}

async function HandleNewMessage(event: NewMessageEvent) {
    try {
        var foundProvider = CheckMessage(event);
        if (foundProvider == null) return;

        var url = event.message.text;
        
        var image = await foundProvider.GetImages(url);

        if (await telegramManager.SendImage(image)) {
            await telegramManager.Client.deleteMessages(event.chat, [event.message.id], {});
        }
    } catch (e) {
        await telegramManager.Client.sendMessage(event.message.chat, {message: `Error Handling message: ${e}`});
    }
}

telegramManager.AddListener(HandleNewMessage);