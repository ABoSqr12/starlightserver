const STORAGE_KEY = 'starlight_below_stars_save_v1';

const initialState = {
  النمط_المختار: null,
  الشخصية_المختارة: null,
  الكلاس_المختار: null,
  الجولة_الحالية: 1,
  الصحة: 100,
  الصحة_القصوى: 100,
  السهام: 20,
  القتلى: 0,
  السقطات: 0,
  الوقت: 0,
  تم_ختم_اللعبة: false,
  أفضل_جولة: 1,
  محادثات_الشخصيات: {
    حارس_البوابة: false,
    مرشدة_النجوم: false,
    ناسك_الفجر: false,
  },
};

export const gameState = structuredClone(initialState);

export function resetGameState() {
  Object.assign(gameState, structuredClone(initialState));
}

export function setSelectedMode(mode) {
  gameState.النمط_المختار = mode;
}

export function setSelectedCharacter(character) {
  gameState.الشخصية_المختارة = character;
}

export function setSelectedClass(playerClass) {
  gameState.الكلاس_المختار = playerClass;
}

export function addKill(amount = 1) {
  gameState.القتلى += Math.max(0, amount);
}

export function addDeath(amount = 1) {
  gameState.السقطات += Math.max(0, amount);
}

export function setRound(round) {
  gameState.الجولة_الحالية = Math.max(1, round);
  gameState.أفضل_جولة = Math.max(gameState.أفضل_جولة, gameState.الجولة_الحالية);
  gameState.تم_ختم_اللعبة = gameState.الجولة_الحالية > 30;
}

export function advanceRound() {
  setRound(gameState.الجولة_الحالية + 1);
}

export function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
}

export function loadProgress() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;

  try {
    const parsed = JSON.parse(raw);
    Object.assign(gameState, structuredClone(initialState), parsed);
    gameState.أفضل_جولة = Math.max(gameState.أفضل_جولة, gameState.الجولة_الحالية);
    return true;
  } catch {
    return false;
  }
}
