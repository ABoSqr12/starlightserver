const KEY = 'starlight_leaderboard_v1';

export class LeaderboardSystem {
  static load() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
  }

  static save(entries) { localStorage.setItem(KEY, JSON.stringify(entries)); }

  static buildBadges(e) {
    const b = [];
    if (e.تم_ختم_اللعبة) b.push('خاتم النجوم');
    if (e.عدد_السقطات === 0) b.push('بلا سقوط');
    if (e.محادثات_الشخصيات && Object.values(e.محادثات_الشخصيات).every(Boolean)) b.push('سامع الحكمة');
    if (e.تم_ختم_اللعبة && e.أفضل_جولة >= 30) b.push('كاسر المرآة');
    if (e.تم_ختم_اللعبة && e.وقت_الختم > 0) b.push('ما دون النجوم');
    return b;
  }

  static submit(entry) {
    const rows = this.load();
    const full = { ...entry, الشارات: this.buildBadges(entry) };
    rows.push(full);
    this.sort(rows);
    this.save(rows);
    return full;
  }

  static sort(rows) {
    rows.sort((a,b)=>{
      if (a.تم_ختم_اللعبة && b.تم_ختم_اللعبة) {
        if (a.وقت_الختم !== b.وقت_الختم) return a.وقت_الختم - b.وقت_الختم;
      } else if (a.تم_ختم_اللعبة !== b.تم_ختم_اللعبة) return a.تم_ختم_اللعبة ? -1 : 1;
      if ((b.أفضل_جولة||0)!==(a.أفضل_جولة||0)) return (b.أفضل_جولة||0)-(a.أفضل_جولة||0);
      return (a.عدد_السقطات||0)-(b.عدد_السقطات||0);
    });
    return rows;
  }

  static clear() { localStorage.removeItem(KEY); }
}
