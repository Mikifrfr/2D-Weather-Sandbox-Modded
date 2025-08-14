// Configuration Management System for 2D Weather Sandbox
// This file centralizes all settings, constants, and configuration options

export const CONFIG = {
  // Performance Settings
  PERFORMANCE: {
    TARGET_FPS: 60,
    MIN_FPS: 30,
    MAX_ITERATIONS_PER_FRAME: 50,
    MIN_ITERATIONS_PER_FRAME: 1,
    AUTO_ITERATION_ADJUSTMENT: true,
    FRAME_TIME_SAMPLES: 60,
    MEMORY_CHECK_INTERVAL: 1000, // ms
  },

  // Precipitation Settings
  PRECIPITATION: {
    BASE_DIVIDER: 25,
    MIN_PARTICLES: 1000,
    MAX_PARTICLES: 100000,
    ZOOM_THRESHOLDS: [0.5, 1.0, 2.0, 5.0, 10.0],
    ZOOM_MULTIPLIERS: [0.1, 0.25, 0.5, 0.75, 1.0],
    PERFORMANCE_THRESHOLDS: [20, 30, 45, 60],
    PERFORMANCE_MULTIPLIERS: [0.3, 0.5, 0.7, 1.0],
    INACTIVE_CHECK_INTERVAL: 1200, // Reduced from 600
  },

  // Rendering Settings
  RENDERING: {
    BATCH_SIZE: 100,
    MAX_POOL_SIZE: 50,
    SHADER_CACHE_ENABLED: true,
    TEXTURE_POOL_ENABLED: true,
    BATCH_RENDERING_ENABLED: true,
    BLOOM_ENABLED: true,
    HDR_ENABLED: true,
    POST_PROCESSING_ENABLED: true,
  },

  // Memory Management
  MEMORY: {
    MAX_TEXTURES: 100,
    MAX_FRAMEBUFFERS: 20,
    MAX_BUFFERS: 50,
    CLEANUP_INTERVAL: 5000, // ms
    MEMORY_WARNING_THRESHOLD: 0.8, // 80% of available memory
  },

  // Simulation Settings
  SIMULATION: {
    DEFAULT_RES_X: 512,
    DEFAULT_RES_Y: 512,
    DEFAULT_HEIGHT: 10000,
    MAX_RES_X: 2048,
    MAX_RES_Y: 2048,
    MIN_RES_X: 128,
    MIN_RES_Y: 128,
    TIME_STEP: 1.0,
    GRAVITY: 9.81,
    DRY_LAPSE_RATE: 0.0098, // K/m
  },

  // Camera Settings
  CAMERA: {
    MIN_ZOOM: 0.1,
    MAX_ZOOM: 10.0,
    ZOOM_SPEED: 0.1,
    PAN_SPEED: 0.01,
    SMOOTH_FACTOR: 0.1,
    WRAP_HORIZONTALLY: true,
  },

  // UI Settings
  UI: {
    PERFORMANCE_DISPLAY_ENABLED: true,
    PERFORMANCE_DISPLAY_KEY: 'F12',
    GUI_VISIBLE: true,
    GUI_TOGGLE_KEY: 'H',
    SOUND_ENABLED: true,
    AUTOPILOT_ENABLED: true,
  },

  // Weather Settings
  WEATHER: {
    DEFAULT_TEMPERATURE: 20, // Celsius
    DEFAULT_HUMIDITY: 50, // %
    DEFAULT_PRESSURE: 1013.25, // hPa
    LIGHTNING_ENABLED: true,
    THUNDER_ENABLED: true,
    WIND_ENABLED: true,
    PRECIPITATION_ENABLED: true,
  },

  // File Paths
  PATHS: {
    SHADERS: 'shaders/',
    TEXTURES: 'resources/img/',
    SOUNDS: 'resources/sounds/',
    SAVES: 'saves/',
    DOCS: 'docs/',
  },

  // Debug Settings
  DEBUG: {
    ENABLED: false,
    LOG_LEVEL: 'info', // 'error', 'warn', 'info', 'debug'
    SHOW_FPS: true,
    SHOW_MEMORY: true,
    SHOW_BATCH_STATS: false,
    SHOW_CACHE_STATS: false,
  }
};

// Environment-specific overrides
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  CONFIG.DEBUG.ENABLED = true;
  CONFIG.DEBUG.LOG_LEVEL = 'debug';
}

// Performance presets
export const PERFORMANCE_PRESETS = {
  LOW: {
    ...CONFIG.PERFORMANCE,
    TARGET_FPS: 30,
    MAX_ITERATIONS_PER_FRAME: 20,
  },
  MEDIUM: {
    ...CONFIG.PERFORMANCE,
    TARGET_FPS: 45,
    MAX_ITERATIONS_PER_FRAME: 35,
  },
  HIGH: {
    ...CONFIG.PERFORMANCE,
    TARGET_FPS: 60,
    MAX_ITERATIONS_PER_FRAME: 50,
  },
  ULTRA: {
    ...CONFIG.PERFORMANCE,
    TARGET_FPS: 60,
    MAX_ITERATIONS_PER_FRAME: 100,
  }
};

// Configuration utility functions
export class ConfigManager {
  constructor() {
    this.config = { ...CONFIG };
    this.loadFromStorage();
  }

  // Get configuration value
  get(path) {
    return path.split('.').reduce((obj, key) => obj?.[key], this.config);
  }

  // Set configuration value
  set(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const obj = keys.reduce((obj, key) => obj[key] = obj[key] || {}, this.config);
    obj[lastKey] = value;
    this.saveToStorage();
  }

  // Load configuration from localStorage
  loadFromStorage() {
    try {
      const stored = localStorage.getItem('weatherSandboxConfig');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.config = { ...this.config, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load configuration from storage:', error);
    }
  }

  // Save configuration to localStorage
  saveToStorage() {
    try {
      localStorage.setItem('weatherSandboxConfig', JSON.stringify(this.config));
    } catch (error) {
      console.warn('Failed to save configuration to storage:', error);
    }
  }

  // Reset to defaults
  reset() {
    this.config = { ...CONFIG };
    this.saveToStorage();
  }

  // Get performance preset
  getPerformancePreset(preset) {
    return PERFORMANCE_PRESETS[preset] || PERFORMANCE_PRESETS.MEDIUM;
  }

  // Apply performance preset
  applyPerformancePreset(preset) {
    const presetConfig = this.getPerformancePreset(preset);
    this.config.PERFORMANCE = { ...this.config.PERFORMANCE, ...presetConfig };
    this.saveToStorage();
  }
}

// Global configuration manager instance
export const configManager = new ConfigManager();
