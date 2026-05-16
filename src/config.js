import { BootScene } from './scenes/BootScene.js';
import { SplashScene } from './scenes/SplashScene.js';
import { MainMenuScene } from './scenes/MainMenuScene.js';
import { ModeSelectScene } from './scenes/ModeSelectScene.js';
import { CharacterSelectScene } from './scenes/CharacterSelectScene.js';
import { ClassSelectScene } from './scenes/ClassSelectScene.js';
import { StoryIntroScene } from './scenes/StoryIntroScene.js';
import { ArenaScene } from './scenes/ArenaScene.js';
import { RestGateScene } from './scenes/RestGateScene.js';
import { LeaderboardScene } from './scenes/LeaderboardScene.js';
import { SettingsScene } from './scenes/SettingsScene.js';
import { AboutScene } from './scenes/AboutScene.js';
import { GameOverScene } from './scenes/GameOverScene.js';
import { EndingScene } from './scenes/EndingScene.js';

export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 540;

export const gameConfig = {
  type: Phaser.AUTO,
  parent: 'game-root',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#060810',
  pixelArt: true,
  scene: [
    BootScene,
    SplashScene,
    MainMenuScene,
    ModeSelectScene,
    CharacterSelectScene,
    ClassSelectScene,
    StoryIntroScene,
    ArenaScene,
    RestGateScene,
    LeaderboardScene,
    SettingsScene,
    AboutScene,
    GameOverScene,
    EndingScene,
  ],
};
