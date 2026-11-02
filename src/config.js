// 구글시트 연결 주소 (Apps Script 웹 앱 URL, …/exec 로 끝나는 주소)
// 시트 "BHDS 홈페이지 내용"의 내용이 이 주소를 통해 사이트에 표시됩니다.
export const SHEET_API_URL =
  'https://script.google.com/macros/s/AKfycbx0MJJRRUJ7nXKNxsRvd3ec8zI5Z9SfCnUm7JsQWeGxweMQQQ-Urv7CeFQF7j0DxGYL/exec';

// 사진: 드라이브 파일 ID로 이미지 주소를 만듭니다. (w = 가로 픽셀)
export const photoUrl = (fileId, w = 600) =>
  fileId ? `https://lh3.googleusercontent.com/d/${fileId}=w${w}` : null;
