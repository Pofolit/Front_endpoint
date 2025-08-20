import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // URL에서 토큰, 유저 정보, 에러 파라미터 추출
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const user = params.get('user');
    const error = params.get('error');
    const message = params.get('message');

    if (token) {
      // 토큰을 localStorage에 저장 (보안 정책에 따라 변경 가능)
      localStorage.setItem('accessToken', token);
      localStorage.setItem('user', user ?? '');
      window.history.replaceState({}, document.title, window.location.pathname);
      // 로그인 후 메인 페이지로 이동
      // router.replace('/');
    } else if (error) {
      // 에러 발생 시 에러 메시지 표시
      alert(message || '인증에 실패했습니다.');
      router.replace('/login');
    }
    if (user) {
      // 유저 정보가 있다면 추가 처리 가능
      setForm((prev) => ({ ...prev, aka: decodeURIComponent(user) }));
    }
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f6fa' }}>
      <div style={{ background: '#fff', borderRadius: '18px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '40px 32px', width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 16 }}>로그인 처리 중...</h2>
        <p style={{ color: '#888', fontSize: 15 }}>잠시만 기다려 주세요.</p>
      </div>
    </div>
  );
}
function setForm(arg0: (prev: any) => any) {
  throw new Error('Function not implemented.');
}

