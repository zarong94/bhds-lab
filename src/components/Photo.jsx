import { useState } from 'react';

/** 드라이브 사진. 불러오지 못하면 이니셜(또는 아무것도) 보여줍니다. */
export default function Photo({ src, alt, className = '', fallback = null }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return fallback;
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}
