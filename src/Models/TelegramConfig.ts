export default class TelegramConfig {
    public AppId : number;
    public AppHash : string;
    public SourceChatIdOrTitle : string;
    public TargetChatIdOrTitle : string;
    public Session : string;
    public Phone : string;
    public Pin? : string;
    public UseMarkup : boolean;
    public CaptionTemplate : string;

}