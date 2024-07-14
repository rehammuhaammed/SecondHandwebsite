import { ProfileUser } from "./profile-user";

export interface chat{
    id:string;
    lastMessage:string;
    userIds:string[];
    users:ProfileUser[];
    chatname:any;
    messages?: string;
    sender:String;
}

export interface messages{
    text:string;
    senderId:string;
    sendDate:string;
}