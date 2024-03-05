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
  sx: number;
  /** Source Y-position on the image */
  sy: number;
  /** Source width on the image */
  sw: number;
  /** Source height on the image */
  sh: number;
  /** Destination X-position for output */
  dx: number;
  /** Destination Y-position for output */
  dy: number;
}

/** Single animation sequence */
interface Animation {
  /** Name of the sequence */
  name: string;
  /** Width of the the sprite */
  w: number;
  /** Height of the sprite */
  h: number;
  /** Zero-index starting frame number */
  start: number;
  /** Zero-index ending frame number */
  end: number;
}

/** Data structure that represents TinyAtlas spec */
interface TinyAtlas {
  /** Collection of frame objects */
  f: Frame[];
  /** Definition of animated sequences */
  a: Animation[];
  /** Spec version number */
  v: number;
}

/**
 * Parse a string into a TinyAtlas object.
 */
function parse(format: string): TinyAtlas {
  if (typeof format !== 'string') {
    throw new Error('Atlas format must be a string');
  }
  const values = format.split(' ');
  if (values[0] !== AtlasToken.Frames) {
    throw new Error(`Atlas format must start with "${AtlasToken.Frames}"`);
  }
  if (!values.includes(AtlasToken.Version)) {
    throw new Error(`Atlas format must include "${AtlasToken.Version}"`);
  }

  const frameIndex = values.indexOf(AtlasToken.Frames);
  const animationIndex = values.indexOf(AtlasToken.Animations);
  const versionIndex = values.indexOf(AtlasToken.Version);
  const frameEndIndex = animationIndex === -1 ? versionIndex : animationIndex;
  const framesRaw: number[] = values.slice(frameIndex + 1, frameEndIndex).map((v) => JSON.parse(v));
  const animationsRaw: (string | number)[] =
    animationIndex > -1 ? values.slice(animationIndex + 1, versionIndex).map((v) => JSON.parse(v)) : [];
  const version: number = JSON.parse(values[versionIndex + 1]);

  if (!(framesRaw.length % 6 === 0)) {
    throw new Error('Invalid frame length');
  }
  const frames: Frame[] = [];
  for (let i = 0; i < framesRaw.length; i += 6) {
    const sx = framesRaw[i] as number;
    const sy = framesRaw[i + 1] as number;
    const sw = framesRaw[i + 2] as number;
    const sh = framesRaw[i + 3] as number;
    const dx = framesRaw[i + 4] as number;
    const dy = framesRaw[i + 5] as number;
    if (typeof sx !== 'number' || sx < 0) {
      throw new Error('Invalid frame sourceX');
    }
    if (typeof sx !== 'number' || sx < 0) {
      throw new Error('Invalid frame sourceY');
    }
    if (typeof sw !== 'number' || sw < 0) {
      throw new Error('Invalid frame sourceWidth');
    }
    if (typeof sh !== 'number' || sh < 0) {
      throw new Error('Invalid frame sourceHeight');
    }
    if (typeof dx !== 'number' || dx < 0) {
      throw new Error('Invalid frame destinationX');
    }
    if (typeof dy !== 'number' || dy < 0) {
      throw new Error('Invalid frame destinationY');
    }

    frames.push({ sx, sy, sw, sh, dx, dy });
  }
  if (!(animationsRaw.length % 5 === 0)) {
    throw new Error('Invalid animation length');
  }
  const animations: Animation[] = [];
  for (let i = 0; i < animationsRaw.length; i += 5) {
    const name = animationsRaw[i] as string;
    const w = animationsRaw[i + 1] as number;
    const h = animationsRaw[i + 2] as number;
    const start = animationsRaw[i + 3] as number;
    const end = animationsRaw[i + 4] as number;
    if (typeof name !== 'string') {
      throw new Error('Invalid animation name');
    }
    if (typeof w !== 'number' || w < 0) {
      throw new Error('Invalid animation width');
    }
    if (typeof h !== 'number' || h < 0) {
      throw new Error('Invalid animation height');
    }
    if (typeof start !== 'number' || start < 0) {
      throw new Error('Invalid animation start');
    }
    if (typeof end !== 'number' || end > frames.length - 1 || end < 0) {
      throw new Error('Invalid animation end');
    }
    animations.push({ name, w, h, start, end });
  }

  return {
    v: version,
    f: frames,
    a: animations,
  };
}

export { AtlasToken, parse };
