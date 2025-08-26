// 이메일, 닉네임, UUID 등 검증 유틸

export function isValidEmail(email: string): boolean {
  return /^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/.test(email);
}

export function isValidNickname(nickname: string): boolean {
  return nickname.length >= 2 && nickname.length <= 20;
}

export function isValidUUID(id: string): boolean {
  return /^[0-9a-fA-F-]{36}$/.test(id);
}
