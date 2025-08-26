import { User } from "../types/user";

export function UserProfile({ user }: { user: User }) {
  return (
    <div>
      <p>닉네임: {user.nickname}</p>
      <p>이메일: {user.email}</p>
      {user.profileImageUrl && (
        <img src={user.profileImageUrl} alt="프로필 이미지" style={{ width: 80, height: 80, borderRadius: 40 }} />
      )}
      {/* 기타 정보 출력 가능 */}
    </div>
  );
}
