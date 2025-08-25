export interface UserInfo {
  nickname?: string;  
  profileImageUrl?: string;
  birthDay?: string;
  domain?: string;
  job?: string;
  interests?: string[];
}
export interface Payload {
  id: string;
  email: string;
  nickname: string;
  profileImageUrl: string;
  role?: string;
}