export interface User {
  id: string;
  email: string;
  nickname: string;
  profileImageUrl?: string;
  birthDay?: string;
  job?: string;
  domain?: string;
}
export interface UserInfo {
  nickname?: string;
  profileImageUrl?: string;
  birthDay?: Date;
  domain?: string;
  job?: string;

}
export interface Payload {
  domain: any;
  birthDay: Date;
  id: string; // UUID
  email?: string;
  nickname?: string;
  profileImageUrl?: string;
  role?: string;
}