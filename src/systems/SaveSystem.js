const PROFILE_KEY = 'starlight_profile_v1';

export class SaveSystem {
  static loadProfile() {
    try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}'); } catch { return {}; }
  }

  static saveProfile(data) {
    const prev = this.loadProfile();
    const next = { ...prev, ...data };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
    return next;
  }
}
