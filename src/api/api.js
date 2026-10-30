const API_URL = 'https://api.favorit-parts.ru/hs/hsprice/';
const KEY = '00000000-0000-0000-0000-000000000001';

export async function fetchGoods(params, signal) {
  const searchParams = new URLSearchParams();
  for (const prop in params) {
    searchParams.append(prop, encodeURIComponent(params[prop]));
  }

  const res = await fetch(`${API_URL}?${searchParams.toString()}`, { signal });

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      if (import.meta.env?.DEV) {
        console.warn('fetchGoods: non-JSON response', res.status, text.slice(0, 200));
      }
    }
  }

  if (!res.ok) {
    const error = Error(data?.error || `HTTP ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

export function fetchGoodsWithDefaultKeyAndInfo(params, signal) {
  params.key = KEY;
  params.info = 'on';
  return fetchGoods(params, signal);
} 