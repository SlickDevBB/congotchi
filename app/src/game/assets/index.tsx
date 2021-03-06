export interface Asset {
  key: string;
  src: string;
  type: 'IMAGE' | 'SVG' | 'SPRITESHEET' | 'AUDIO' | 'ATLAS';
  atlasSrc?: string;
  data?: {
    frameWidth?: number;
    frameHeight?: number;
  };
}

export interface SpritesheetAsset extends Asset {
  type: 'SPRITESHEET';
  data: {
    frameWidth: number;
    frameHeight: number;
  };
}

export interface AtlasAsset extends Asset {
  type: 'ATLAS';
  atlasSrc: string;
  data: {
    frameWidth: number;
    frameHeight: number;
  };
}


export const BG = 'bg';
export const FULLSCREEN = 'fullscreen';
// export const LEFT_CHEVRON = 'left_chevron';

export const SOUND_CLICK = 'sound_click';
export const SOUND_POP = 'sound_pop';
export const SOUND_SLURP = 'sound_slurp'
export const SOUND_EXPLOSION = 'sound_explosion';
export const SOUND_PORTAL_OPEN = 'sound_portal_open';
export const SOUND_BELL = 'sound_bell';
export const SOUND_VICTORY = 'sound_victory';
export const SOUND_DEFEAT = 'sound_defeat';
export const SOUND_CONGA = 'sound_conga';
export const SOUND_SOFT_RESET = 'sound_soft_reset';
export const SOUND_SEND = 'sound_send';
export const SOUND_BOMB_COUNT = 'sound_bomb_count';

export const MUSIC_WORLD_MAP = 'music_world_map';
export const MUSIC_GRID_LEVEL_A = 'music_grid_level_a';

export const ICON_HAND_POINTING = 'icon_hand_pointing';
export const ICON_HAND_CLOSED = 'icon_hand_closed';

export const ARROW_DOWN = 'arrow_down';
export const M67_GRENADE = 'm67_grenade';
export const MILKSHAKE = 'milkshake';
export const UNCOMMON_CACTII = 'uncommon_cacti';
export const PORTAL_OPEN = 'portal_open';
export const PORTAL_CLOSED = 'portal_closed';

export const COMMON_DOWN_ROFL = 'common_down_rofl';
export const COMMON_LEFT_ROFL = 'common_left_rofl';
export const COMMON_UP_ROFL = 'common_up_rofl';
export const COMMON_RIGHT_ROFL = 'common_right_rofl';


export const BLACK_CIRCLE_SHADED = 'black-circle-shaded';
export const WHITE_CIRCLE_SHADED = 'white-circle-shaded';
export const PINK_CIRCLE_SHADED = 'pink-circle-shaded';
export const RED_CIRCLE_SHADED = 'red-circle-shaded';
export const GREEN_CIRCLE_SHADED = 'green-circle-shaded';
export const BLUE_CIRCLE_SHADED = 'blue-circle-shaded';
export const GREY_CIRCLE_SHADED = 'grey-circle-shaded';

export const BLACK_SQUARE = 'black_square';
export const WHITE_SQUARE = 'white_square';

export const GRID_BG_COBBLE_STONES = 'grid_bg_cobble_stones';
export const GRID_BG_COBBLE_STONES_RECTANGLE = 'grid_bg_cobble_stones_rectangle';
export const GRID_BG_DIRT = 'grid_bg_dirt';
export const GRID_BG_DIRT_ROUNDED = 'grid_bg_dirt_rounded';
export const GRID_BG_GRASS = 'grid_bg_grass';
export const GRID_BG_SAND_STONE = 'grid_bg_sand_stone';

export const BLUE_BLOCK = 'blue_block';
export const RED_BLOCK = 'red_block';
export const GREEN_BLOCK = 'green_block';
export const PINK_BLOCK = 'pink_block';

export const MOVE_ICON = 'move_icon';
export const QUESTION_MARK_ICON = 'question_mark_icon';
// export const ROTATE_ICON = 'rotate_icon';
// export const SHUFFLE_ICON = 'shuffle_icon';
// export const BONUS_ICON = 'bonus_icon';
export const ARROW_ICON = 'arrow_icon';
export const RED_BUTTON = 'red_button';
export const PURPLE_BUTTON = 'purple_button';
export const GREEN_BUTTON = 'green_button';
export const GUI_PANEL_5 = 'gui_panel_5';
export const GUI_LEVEL_SELECT_RIBBON = 'gui_level_select_ribbon';
export const GUI_BUTTON_CROSS = 'gui_button_cross';
export const GUI_BUTTON_TICK = 'gui_button_tick';
export const GUI_BUTTON_PLAY = 'gui_button_play';
export const GUI_BUTTON_FAST_FORWARD = 'gui_button_fast_forward';
export const GUI_BUTTON_RESET = 'gui_button_reset';
// export const GUI_BUTTON_FORWARD = 'gui_button_foward';
// export const GUI_BUTTON_BACK = 'gui_button_back';
export const GUI_SCORE_PANEL = 'gui_score_panel';
export const GUI_0_STARS = 'gui_0_stars';
export const GUI_1_STARS = 'gui_1_stars';
export const GUI_2_STARS = 'gui_2_stars';
export const GUI_3_STARS = 'gui_3_stars';
// export const CW_ROTATE_MOVE_ICON = 'cw_rotate_move_icon';
// export const ACW_ROTATE_MOVE_ICON = 'acw_rotate_move_icon';
export const PIXEL_EXPLOSION = 'pixel_explosion';
export const PIXEL_PINK_SPLASH = 'pixel_pink_splash'

export const PARTICLE_CONFETTI = 'particle_confetti';

// Save all in game assets in the public folder
export const assets: Array<Asset | SpritesheetAsset> = [
  {
    key: BG,
    src: 'assets/bg/map_reaalm_nolabels.png',
    type: 'IMAGE',
  },
  // {
  //   key: LEFT_CHEVRON,
  //   src: 'assets/icons/chevron_left.svg',
  //   type: 'SVG',
  // },
  {
    key: SOUND_CLICK,
    src: 'assets/sounds/click.mp3',
    type: 'AUDIO',
  },
  {
    key: SOUND_POP,
    src: 'assets/sounds/pop.ogg',
    type: 'AUDIO',
  },
  {
    key: SOUND_SLURP,
    src: 'assets/sounds/slurp.ogg',
    type: 'AUDIO',
  },
  {
    key: SOUND_EXPLOSION,
    src: 'assets/sounds/explosion.ogg',
    type: 'AUDIO',
  },
  {
    key: SOUND_PORTAL_OPEN,
    src: 'assets/sounds/portalOpenShort.ogg',
    type: 'AUDIO',
  },
  {
    key: SOUND_BELL,
    src: 'assets/sounds/bell.ogg',
    type: 'AUDIO',
  },
  {
    key: SOUND_VICTORY,
    src: 'assets/sounds/sfx-victory1.mp3',
    type: 'AUDIO',
  },
  {
    key: SOUND_DEFEAT,
    src: 'assets/sounds/sfx-defeat4.mp3',
    type: 'AUDIO',
  },
  {
    key: SOUND_CONGA,
    src: 'assets/sounds/conga_130bpm.ogg',
    type: 'AUDIO',
  },
  {
    key: SOUND_SOFT_RESET,
    src: 'assets/sounds/sending.mp3',
    type: 'AUDIO',
  },
  {
    key: SOUND_SEND,
    src: 'assets/sounds/send.mp3',
    type: 'AUDIO',
  },
  {
    key: SOUND_BOMB_COUNT,
    src: 'assets/sounds/bomb_count.ogg',
    type: 'AUDIO',
  },


  {
    key: MUSIC_WORLD_MAP,
    src: 'assets/music/Music_World_Map_Bassa Island Game Loop.ogg',
    type: 'AUDIO',
  },
  {
    key: MUSIC_GRID_LEVEL_A,
    src: 'assets/music/Grid_Level_Carnivale Intrigue.ogg',
    type: 'AUDIO',
  },

  // declare some move tip icons
  {
    key: ICON_HAND_POINTING,
    src: 'assets/icons/hand_pointer_icon.png',
    type: 'IMAGE',
  },
  {
    key: ICON_HAND_CLOSED,
    src: 'assets/icons/hand_closed_icon.png',
    type: 'IMAGE',
  },

  {
    key: ARROW_DOWN,
    src: 'assets/images/arrow_down.png',
    type: 'IMAGE',
  },
  {
    key: M67_GRENADE,
    src: 'assets/images/grenade.png',
    type: 'IMAGE',
  },
  {
    key: MILKSHAKE,
    src: 'assets/images/milkshake.png',
    type: 'IMAGE',
  },
  {
    key: UNCOMMON_CACTII,
    src: 'assets/images/cacti.png',
    type: 'IMAGE',
  },
  // add in the rofls
  {
    key: COMMON_DOWN_ROFL,
    src: 'assets/rofls/151_CommonRoflFront.png',
    type: 'IMAGE',
  },
  {
    key: COMMON_LEFT_ROFL,
    src: 'assets/rofls/151_CommonRoflLeft.png',
    type: 'IMAGE',
  },
  {
    key: COMMON_UP_ROFL,
    src: 'assets/rofls/151_CommonRoflBack.png',
    type: 'IMAGE',
  },
  {
    key: COMMON_RIGHT_ROFL,
    src: 'assets/rofls/151_CommonRoflRight.png',
    type: 'IMAGE',
  },

  {
    key: PORTAL_OPEN,
    src: 'assets/images/h1_open.png',
    type: 'IMAGE',
  },
  {
    key: PORTAL_CLOSED,
    src: 'assets/images/h1_closed.png',
    type: 'IMAGE',
  },
  {
    key: BLACK_CIRCLE_SHADED,
    src: 'assets/icons/black-circle-shaded.png',
    type: 'IMAGE',
  },
  {
    key: WHITE_CIRCLE_SHADED,
    src: 'assets/icons/white-circle-shaded.png',
    type: 'IMAGE',
  },
  {
    key: PINK_CIRCLE_SHADED,
    src: 'assets/icons/sphere-pink.png',
    type: 'IMAGE',
  },
  {
    key: RED_CIRCLE_SHADED,
    src: 'assets/icons/sphere-red.png',
    type: 'IMAGE',
  },
  {
    key: GREEN_CIRCLE_SHADED,
    src: 'assets/icons/sphere-green.png',
    type: 'IMAGE',
  },
  {
    key: BLUE_CIRCLE_SHADED,
    src: 'assets/icons/sphere-blue.png',
    type: 'IMAGE',
  },
  {
    key: GREY_CIRCLE_SHADED,
    src: 'assets/icons/sphere-grey.png',
    type: 'IMAGE',
  },

  {
    key: BLACK_SQUARE,
    src: 'assets/icons/black_square.png',
    type: 'IMAGE',
  },

  {
    key: WHITE_SQUARE,
    src: 'assets/icons/white_square.png',
    type: 'IMAGE',
  },

  {
    key: GRID_BG_COBBLE_STONES,
    src: 'assets/gridTextures/cobble_stones_rounded.png',
    type: 'IMAGE',
  },
  {
    key: GRID_BG_COBBLE_STONES_RECTANGLE,
    src: 'assets/gridTextures/cobble_stones_rectangle_dark.png',
    type: 'IMAGE',
  },
  {
    key: GRID_BG_DIRT,
    src: 'assets/gridTextures/dirt.png',
    type: 'IMAGE',
  },
  {
    key: GRID_BG_DIRT_ROUNDED,
    src: 'assets/gridTextures/dirt_rounded.png',
    type: 'IMAGE',
  },
  {
    key: GRID_BG_GRASS,
    src: 'assets/gridTextures/grass_dark.png',
    type: 'IMAGE',
  },
  {
    key: GRID_BG_SAND_STONE,
    src: 'assets/gridTextures/sand_stone.png',
    type: 'IMAGE',
  },

  {
    key: BLUE_BLOCK,
    src: 'assets/icons/blue_block.png',
    type: 'IMAGE',
  },
  {
    key: RED_BLOCK,
    src: 'assets/icons/red_block.png',
    type: 'IMAGE',
  },
  {
    key: GREEN_BLOCK,
    src: 'assets/icons/green_block.png',
    type: 'IMAGE',
  },
  {
    key: PINK_BLOCK,
    src: 'assets/icons/pink_block.png',
    type: 'IMAGE',
  },

  {
    key: MOVE_ICON,
    src: 'assets/icons/white_hand_drag_icon_v2.png',
    type: 'IMAGE',
  },
  {
    key: QUESTION_MARK_ICON,
    src: 'assets/icons/question-mark-icon.png',
    type: 'IMAGE',
  },
  // {
  //   key: ROTATE_ICON,
  //   src: 'assets/icons/rotate.png',
  //   type: 'IMAGE',
  // },
  {
    key: RED_BUTTON,
    src: 'assets/images/level-button-small-red.png',
    type: 'IMAGE',
  },
  {
    key: PURPLE_BUTTON,
    src: 'assets/images/level-button-small-purple.png',
    type: 'IMAGE',
  },
  {
    key: GREEN_BUTTON,
    src: 'assets/images/level-button-small-green.png',
    type: 'IMAGE',
  },
  {
    key: GUI_PANEL_5,
    src: 'assets/gui/panel-5.png',
    type: 'IMAGE',
  },
  {
    key: GUI_LEVEL_SELECT_RIBBON,
    src: 'assets/gui/level-select-ribbon.png',
    type: 'IMAGE',
  },
  {
    key: GUI_BUTTON_CROSS,
    src: 'assets/gui/cross.png',
    type: 'IMAGE',
  },
  {
    key: GUI_BUTTON_TICK,
    src: 'assets/gui/tick.png',
    type: 'IMAGE',
  },
  {
    key: GUI_BUTTON_PLAY,
    src: 'assets/gui/play-button.png',
    type: 'IMAGE',
  },
  {
    key: GUI_BUTTON_FAST_FORWARD,
    src: 'assets/gui/fast-forward-button.png',
    type: 'IMAGE',
  },
  {
    key: GUI_BUTTON_RESET,
    src: 'assets/gui/reset-button.png',
    type: 'IMAGE',
  },
  {
    key: GUI_SCORE_PANEL,
    src: 'assets/gui/score-panel-2.png',
    type: 'IMAGE',
  },
  {
    key: GUI_0_STARS,
    src: 'assets/gui/0-stars.png',
    type: 'IMAGE',
  },
  {
    key: GUI_1_STARS,
    src: 'assets/gui/1-stars.png',
    type: 'IMAGE',
  },
  {
    key: GUI_2_STARS,
    src: 'assets/gui/2-stars.png',
    type: 'IMAGE',
  },
  {
    key: GUI_3_STARS,
    src: 'assets/gui/3-stars.png',
    type: 'IMAGE',
  },
  {
    key: ARROW_ICON,
    src: 'assets/icons/arrow-icon_v2.png',
    type: 'IMAGE',
  },
  {
    key: PIXEL_EXPLOSION,
    src: 'assets/effects/pixel-explosion.png',
    type: 'IMAGE',
  },
  {
    key: PIXEL_PINK_SPLASH,
    src: 'assets/effects/pink-splash.png',
    type: 'IMAGE',
  },

  {
    key: PARTICLE_CONFETTI,
    src: 'assets/effects/confetti.png',
    atlasSrc: 'assets/effects/flares.json',
    type: 'ATLAS',
  },
];
