# TelegramImagePoster

This is a Telegram bot that reads image links of various sources from a source chat and processes it to send the image and a custom-formatted caption to another (or the same) telegram chat/group.

## Supported Sources

At the moment the following sources are supported thanks to the usage of third part libraries:

* Twitter ([twitter-scrapper](https://github.com/the-convocation/twitter-scraper))
* Pixiv ([pixiv.ts](https://github.com/Tenpi/pixiv.ts))
* Booru ([booru](https://github.com/AtoraSuunva/booru))

## Deploy

The bot can be deployed through docker making use of the following docker-compose

```yml
version: '3.4'
//TODO
```
Or downloading the repository and running the command
> npm start

**Note:**

The first time the program is launched telegram will ask through the console for a verification code sent to your account.

## Configuration

The providers to use, their credentials and the caption can be configured through a `config.json` file (which needs to be created). A `config-sample.json` file is provided with dummy data

### Telegram
Telegram configuration needs to include the *AppId* and *AppHash* for your account, which can be found through the following [link](https://my.telegram.org/), loging in with your phone number > developer tools.

The *session* entry needs to be empty, once the first login is performed the session key will be stored in this field for future logins

The *Pin* entry can be left empty if no pin is configured on your telegram account.

### Pixiv
In order to use pixiv provider a valid *AccessToken* and *RefreshToken* need to be provided to it's configuration. Information on how to extract this token can be found on the following [link](https://github.com/stepney141/pixiv-token-extractor)

### Booru
The booru section in config consists on a list of booru websites that you want to process urls from. A complete list of supported sites can be found [here](https://github.com/AtoraSuunva/booru/blob/master/src/sites.json)

## Customization

The caption can be customized with a certain set of variables available for each provider. The caption can also contain markup, which will be interpreted by telegram.

In this example, for the twitter provider the caption will be a the author's name between [brackets] and bolded, and a link to the original source

```json
{
    "caption": "<b>[%author%]</b> <br> <a href='%url%'>Source</a>"
}
```

### Available Variables

#### Twitter:
* %url% -> The URL of the original Post.
* %author% -> The account's name.
* %caption% -> The text of the tween.

#### Pixiv:
* %url% -> The URL of the original Post.
* %author% -> The account's name.
* %caption% -> The caption of the pixiv post.
* %tags% -> comma separated list of tags.

#### Booru:
* %url% -> The URL of the source (if any).
* %posturl% -> The URL of the booru Post.
* %author% -> The account's name.
* %tags% -> comma separated list of tags.