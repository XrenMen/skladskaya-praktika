const prefix = 'skladskaya-praktika:calculator:';

export function readDraft(key) {
  try {
    const raw = sessionStorage.getItem(prefix + key);
    return raw === null ? null : JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveDraft(key, data) {
  try {
    sessionStorage.setItem(prefix + key, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function clearDraft(key) {
  try {
    sessionStorage.removeItem(prefix + key);
  } catch {
    // The calculator can still work when the browser blocks storage.
  }
}
