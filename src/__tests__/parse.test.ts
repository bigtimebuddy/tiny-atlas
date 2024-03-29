import { parse } from '../parse';

const emptyFrame = { name: null, x: 0, y: 0, width: 1, height: 1, localX: 0, localY: 0, rotated: false };

describe('parse', () => {
  it('should throw errors for non-strings', () => {
    expect(() => parse(1 as unknown as string)).toThrow('Format must be a string');
  });
  it('should throw error with missing f token', () => {
    expect(() => parse('a')).toThrow('Format must start with "f"');
  });
  it('should throw error with missing v token', () => {
    expect(() => parse('f')).toThrow('Format must include "v"');
  });
  it('should throw error with missing v token', () => {
    expect(() => parse('f v')).toThrow('Invalid version');
    expect(() => parse('f v 0')).toThrow('Invalid version');
    expect(() => parse('f v -1')).toThrow('Invalid version');
    expect(() => parse('f v 2')).toThrow('Invalid version');
    expect(() => parse('f v "n/a"')).toThrow('Invalid version');
  });
  it('should throw invalid frame length', () => {
    expect(() => parse('f v 1')).toThrow('Invalid frame length');
    expect(() => parse('f 0 v 1')).toThrow('Invalid frame length');
    expect(() => parse('f 0 0 v 1')).toThrow('Invalid frame length');
    expect(() => parse('f 0 0 1 v 1')).toThrow('Invalid frame length');
    expect(() => parse('f 0 0 1 1 v 1')).toThrow('Invalid frame length');
    expect(() => parse('f 0 0 1 1 0 v 1')).toThrow('Invalid frame length');
    expect(() => parse('f 0 0 1 1 0 0 v 1')).toThrow('Invalid frame length');
  });
  it('should throw for invalid frame values', () => {
    expect(() => parse('f -1 0 1 1 0 0 0 v 1')).toThrow('Invalid frame x');
    expect(() => parse('f null 0 1 1 0 0 0 v 1')).toThrow('Invalid frame x');
    expect(() => parse('f 0 -1 1 1 0 0 0 v 1')).toThrow('Invalid frame y');
    expect(() => parse('f 0 null 1 1 0 0 0 v 1')).toThrow('Invalid frame y');
    expect(() => parse('f 0 0 -1 1 0 0 0 v 1')).toThrow('Invalid frame width');
    expect(() => parse('f 0 0 null 1 0 0 0 v 1')).toThrow('Invalid frame width');
    expect(() => parse('f 0 0 1 -1 0 0 0 v 1')).toThrow('Invalid frame height');
    expect(() => parse('f 0 0 1 null 0 0 0 v 1')).toThrow('Invalid frame height');
    expect(() => parse('f 0 0 1 1 -1 0 0 v 1')).toThrow('Invalid frame localX');
    expect(() => parse('f 0 0 1 1 null 0 0 v 1')).toThrow('Invalid frame localX');
    expect(() => parse('f 0 0 1 1 0 -1 0 v 1')).toThrow('Invalid frame localY');
    expect(() => parse('f 0 0 1 1 0 null 0 v 1')).toThrow('Invalid frame localY');
    expect(() => parse('f 0 0 1 1 0 0 null v 1')).toThrow('Invalid frame rotated');
    expect(() => parse('f 0 0 1 1 0 0 2 v 1')).toThrow('Invalid frame rotated');
    expect(() => parse('f "" 0 0 1 1 0 0 1 v 1')).toThrow('Invalid frame name');
  });
  it('should parse a minimal atlas', () => {
    const atlas = parse('f 0 0 1 1 0 0 0 v 1');
    expect(atlas).toEqual({
      frames: [emptyFrame],
      animations: [],
      version: 1,
    });
  });
  it('should parse a minimal atlas with frame name', () => {
    const atlas = parse('f "frame1" 0 0 1 1 0 0 0 v 1');
    expect(atlas).toEqual({
      frames: [{ ...emptyFrame, name: 'frame1' }],
      animations: [],
      version: 1,
    });
  });
  it('should throw for duplicate frame names', () => {
    expect(() => parse('f "frame1" 0 0 1 1 0 0 0 "frame1" 0 0 1 1 0 0 0 v 1')).toThrow('Duplicate frame name');
  });
  it('should throw invalid animation length', () => {
    expect(() => parse('f 0 0 1 1 0 0 0 a v 1')).toThrow('Invalid animation length');
    expect(() => parse('f 0 0 1 1 0 0 0 a "h" v 1')).toThrow('Invalid animation length');
    expect(() => parse('f 0 0 1 1 0 0 0 a "h" 0 v 1')).toThrow('Invalid animation length');
    expect(() => parse('f 0 0 1 1 0 0 0 a "h" 0 0 v 1')).toThrow('Invalid animation length');
    expect(() => parse('f 0 0 1 1 0 0 0 a "h" 0 0 0 v 1')).toThrow('Invalid animation length');
  });
  it('should throw invalid animation values', () => {
    expect(() => parse('f 0 0 1 1 0 0 0 a 0 0 0 0 0 v 1')).toThrow('Invalid animation name');
    expect(() => parse('f 0 0 1 1 0 0 0 a "" 0 0 0 0 v 1')).toThrow('Invalid animation name');
    expect(() => parse('f 0 0 1 1 0 0 0 a "h" -1 0 0 0 v 1')).toThrow('Invalid animation width');
    expect(() => parse('f 0 0 1 1 0 0 0 a "h" "0" 0 0 0 v 1')).toThrow('Invalid animation width');
    expect(() => parse('f 0 0 1 1 0 0 0 a "h" 0 -1 0 0 v 1')).toThrow('Invalid animation he');
    expect(() => parse('f 0 0 1 1 0 0 0 a "h" 0 "0" 0 0 v 1')).toThrow('Invalid animation he');
    expect(() => parse('f 0 0 1 1 0 0 0 a "h" 0 0 -1 0 v 1')).toThrow('Invalid animation start');
    expect(() => parse('f 0 0 1 1 0 0 0 a "h" 0 0 "0" 0 v 1')).toThrow('Invalid animation start');
    expect(() => parse('f 0 0 1 1 0 0 0 a "h" 0 0 0 -1 v 1')).toThrow('Invalid animation end');
    expect(() => parse('f 0 0 1 1 0 0 0 a "h" 0 0 0 "0" v 1')).toThrow('Invalid animation end');
    expect(() => parse('f 0 0 1 1 0 0 0 a "h" 0 0 0 2 v 1')).toThrow('Invalid animation end');
  });
  it('should throw for duplicate animation names', () => {
    expect(() => parse('f 0 0 1 1 0 0 0 a "h" 0 0 0 0 "h" 0 0 0 0 v 1')).toThrow('Duplicate animation name');
  });
  it('should parse a minimal atlas with animation', () => {
    const atlas = parse('f 0 0 1 1 0 0 0 0 0 1 1 0 0 0 a "h" 1 1 0 1 v 1');
    expect(atlas).toEqual({
      frames: [emptyFrame, emptyFrame],
      animations: [{ name: 'h', width: 1, height: 1, start: 0, end: 1 }],
      version: 1,
    });
  });
});
