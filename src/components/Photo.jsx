import { useState, useEffect } from 'react';

// lh3 주소가 잠깐 막히면(요청이 몰릴 때 구글이 가끔 거절) 드라이브 미리보기 주소로 한 번 더 시도
const backupUrl = (src) => {
  const m = /lh3\.googleusercontent\.com\/d\/([^=?/]+)(?:=w(\d+))?/.exec(src || '');
  return m ? `https://drive.google.com/thumbnail?id=${m[1]}&sz=w${m[2] || 1000}` : null;
};

/** 드라이브 사진. 불러오지 못하면 예비 주소로 다시 시도하고, 그래도 안 되면 이니셜(또는 아무것도) 보여줍니다. */
export default function Photo({ src, alt, className = '', fallback = null, style }) {
  const [tries, setTries] = useState(0);
  useEffect(() => { setTries(0); }, [src]);
  const url = tries === 0 ? src : tries === 1 ? backupUrl(src) : null;
  if (!url) return fallback;
  return (
    <img
      key={url}
      src={url}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setTries((n) => n + 1)}
    />
  );
}
