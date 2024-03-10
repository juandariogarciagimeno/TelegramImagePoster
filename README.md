# TelegramImagePoster

This is a Telegram bot that reads image links of various sources from a source chat and processes it to send the image and a custom-formatted caption to another (or the same) telegram chat/group.

## Supported Sources

At the moment the following sources are supported thanks to the usage of third part libraries:

* Twitter ([twitter-scrapper](https://github.com/the-convocation/twitter-scraper))
* Pixiv ([pixiv.ts](https://github.com/Tenpi/pixiv.ts))
* Booru ([BooruJS](https://github.com/lsTheFur/Booru))

## Deploy

The bot can be deployed through docker making use of the following docker-compose

```yml
version: '3.4'
//TODO
```
Or downloading the repository and running the command
> npm start

## Configuration

The providers to use, their credentials and the caption can be configured through a config.json file (which needs to be created). A `config-sample.json` file is provided with dummy data

## Customization

The caption for each provider can be customized with a certain set of variables available for each provider. The caption can also contain markup, which will be interpreted by telegram.

In this example, for the twitter provider the caption will be a the author's name between [brackets] and bolded, and a link to the original source

```json
{
    "caption": "**[%author%]** [Source](%link%)"
}
```

## Pixiv Token

In order to use pixiv provider to it's full extent and be able to post private/age restricted images, a valid token and refresh token need to be provided to it's configuration. Information on how to extract this token can be found on the following [link](https://github.com/stepney141/pixiv-token-extractor)