/** Spec format tokesn */
const enum AtlasToken {
  /** Represents the start of the frames */
  Frames = 'f',
  /** Represents the start of animations, optional */
  Animations = 'a',
  /** Represents the spec format version */
  Version = 'v',
}

/** Single frame data */
interface Frame {
  /** Source X-position on the image */
  x: number;
  /** Source Y-position on the image */
  y: number;
  /** Source width on the image */
  width: number;
  /** Source height on the image */
  height: number;
  /** Destination X-position for output */
  localX: number;
  /** Destination Y-position for output */
  localY: number;
  /** Whether the frame is rotate 90 degrees CCW */
  rotated: boolean;
}

/** Single animation sequence */
interface Animation {
  /** Name of the sequence */
  name: string;
  /** Width of the the sprite */
  width: number;
  /** Height of the sprite */
  height: number;
  /** Zero-index starting frame number */
  start: number;
  /** Zero-index ending frame number */
  end: number;
}

/** Data structure that represents TinyAtlas spec */
interface TinyAtlas {
  /** Collection of frame objects */
  frames: Frame[];
  /** Definition of animated sequences */
  animations: Animation[];
  /** Spec version number */
  version: number;
}

/** Maximum version */
const MAX_VERSION = 1;

/** Check for valid number inputs */
function isValidInt(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && isFinite(value) && value >= 0 && value % 1 === 0;
}

/**
 * Parse a string into a TinyAtlas object.
 */
function parse(format: string): TinyAtlas {
  if (typeof format !== 'string') {
    throw new Error('Format must be a string');
  }
  const values = format.split(' ');
  if (values[0] !== AtlasToken.Frames) {
    throw new Error(`Format must start with "${AtlasToken.Frames}"`);
  }
  if (!values.includes(AtlasToken.Version)) {
    throw new Error(`Format must include "${AtlasToken.Version}"`);
  }

  const frameIndex = values.indexOf(AtlasToken.Frames);
  const animationIndex = values.indexOf(AtlasToken.Animations);
  const versionIndex = values.indexOf(AtlasToken.Version);
  const frameEndIndex = animationIndex === -1 ? versionIndex : animationIndex;
  const framesRaw: number[] = values.slice(frameIndex + 1, frameEndIndex).map((v) => JSON.parse(v));
  const animationsRaw: (string | number)[] =
    animationIndex > -1 ? values.slice(animationIndex + 1, versionIndex).map((v) => JSON.parse(v)) : [];
  const version: number = values[versionIndex + 1] !== undefined ? JSON.parse(values[versionIndex + 1]) : 0;

  if (typeof version !== 'number' || version < 1 || version > MAX_VERSION) {
    throw new Error('Invalid version');
  }
  if (!framesRaw.length || !(framesRaw.length % 7 === 0)) {
    throw new Error('Invalid frame length');
  }
  const frames: Frame[] = [];
  for (let i = 0; i < framesRaw.length; i += 7) {
    const x = framesRaw[i] as number;
    const y = framesRaw[i + 1] as number;
    const width = framesRaw[i + 2] as number;
    const height = framesRaw[i + 3] as number;
    const localX = framesRaw[i + 4] as number;
    const localY = framesRaw[i + 5] as number;
    const rotated = framesRaw[i + 6] as number;
    if (!isValidInt(x)) {
      throw new Error('Invalid frame x');
    }
    if (!isValidInt(y)) {
      throw new Error('Invalid frame y');
    }
    if (!isValidInt(width)) {
      throw new Error('Invalid frame width');
    }
    if (!isValidInt(height)) {
      throw new Error('Invalid frame height');
    }
    if (!isValidInt(localX)) {
      throw new Error('Invalid frame localX');
    }
    if (!isValidInt(localY)) {
      throw new Error('Invalid frame localY');
    }
    if (!isValidInt(rotated) || (rotated !== 0 && rotated !== 1)) {
      throw new Error('Invalid frame rotated');
    }
    frames.push({ x, y, width, height, localX, localY, rotated: Boolean(rotated) });
  }
  if (animationIndex > -1 && (!animationsRaw.length || !(animationsRaw.length % 5 === 0))) {
    throw new Error('Invalid animation length');
  }
  const animations: Animation[] = [];
  for (let i = 0; i < animationsRaw.length; i += 5) {
    const name = animationsRaw[i] as string;
    const width = animationsRaw[i + 1] as number;
    const height = animationsRaw[i + 2] as number;
    const start = animationsRaw[i + 3] as number;
    const end = animationsRaw[i + 4] as number;
    if (typeof name !== 'string' || !name.length) {
      throw new Error('Invalid animation name');
    }
    if (!isValidInt(width)) {
      throw new Error('Invalid animation width');
    }
    if (!isValidInt(height)) {
      throw new Error('Invalid animation height');
    }
    if (!isValidInt(start)) {
      throw new Error('Invalid animation start');
    }
    if (!isValidInt(end) || end > frames.length - 1) {
      throw new Error('Invalid animation end');
    }
    animations.push({ name, width, height, start, end });
  }

  return {
    frames,
    animations,
    version,
  };
}

export { AtlasToken, parse };
