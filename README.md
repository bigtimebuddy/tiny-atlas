# Tiny Atlas

A atlas is a small piece of supplemental data that ships alongside an image file and create a "spritesheet". The atlas tells a rendering system how to carve up the image into various textures (i.e., sprites). These files tend to be computer-generated and computer-read. Generally, the format options tend to be pretty verbose. What if we could create a terse format AND encode it the image itself? Enter Tiny Atlas.

Tiny Atlas is a format specification for spritesheets but also some tooling for optionally encoding the altas into an image's metadata.

## Format Spec

Data format is a single-line string that contains tokens `f` (frames), `a` (animations, _optional_) and `v` (version). Generally, here's the format:

```
f [name? x y width height localX localY rotated ...]
a [name width height start end ...]
v [version]
```

| Frame Property | Type     | Description                                           |
| -------------- | -------- | ----------------------------------------------------- |
| **name**       | _string_ | The frame name, optional.                             |
| **x**          | _number_ | The X-position on the image where to source the frame |
| **y**          | _number_ | The Y-position on the image where to source the frame |
| **width**      | _number_ | The source width of the frame                         |
| **height**     | _number_ | The source height of the frame                        |
| **localX**     | _number_ | The destination X-Position when drawing the frame     |
| **localY**     | _number_ | The destination Y-Position when drawing the frame     |
| **rotated**    | _number_ | Either 1 (rotated 90 degrees CCW) or 0 (no rotation)  |

| Animation Property | Type     | Description                                                                                                    |
| ------------------ | -------- | -------------------------------------------------------------------------------------------------------------- |
| **name**           | _string_ | The human-readable name of the animation state, must be double-quoted                                          |
| **width**          | _number_ | The output width of the animation sequence                                                                     |
| **height**         | _number_ | The output height of the animation sequence                                                                    |
| **start**          | _number_ | The zero-based starting frame number. The total number of frames can be found by dividing the length of f by 7 |
| **end**            | _number_ | The zero-based ending frame number                                                                             |

### Example

For example, here's a Tiny Atlas which contains 70 frames and 3 animations (_begin_, _idle_, and _done_).

`f 114 1 42 40 3 4 1 130 130 41 41 3 3 0 1 132 42 41 1 3 0 44 132 42 41 0 3 0 145 87 41 41 0 3 0 1 174 41 41 0 3 0 43 174 41 41 0 3 0 85 174 41 41 0 3 0 127 174 41 41 1 3 0 114 44 42 40 3 4 1 196 1 41 41 6 3 0 196 43 41 41 7 3 0 196 85 41 41 7 3 0 169 172 41 41 7 3 0 172 129 41 41 6 3 0 1 216 41 41 1 3 0 43 216 41 41 0 3 0 85 216 41 41 0 3 0 127 216 41 41 0 3 0 169 214 41 41 1 3 0 238 1 41 41 6 3 0 238 43 41 41 7 3 0 238 85 41 41 7 3 0 87 132 42 41 4 3 0 214 127 41 41 3 3 0 214 169 41 41 2 3 0 211 211 41 41 2 3 0 1 258 41 41 2 3 0 43 258 41 41 3 3 0 85 258 41 41 4 3 0 127 258 41 41 5 3 0 169 256 41 41 5 3 0 211 253 41 41 5 3 0 145 129 0 0 0 0 0 145 129 0 0 0 0 0 297 120 10 13 6 24 0 297 134 10 13 6 24 0 297 148 10 13 6 24 0 274 264 13 13 6 24 0 295 249 14 13 6 24 1 295 249 14 13 6 24 1 295 249 14 13 6 24 1 295 249 14 13 6 24 1 295 249 14 13 6 24 1 278 249 16 14 4 24 0 253 281 24 15 3 24 0 92 95 34 21 2 18 1 280 1 40 28 2 12 1 1 100 45 31 1 9 0 1 1 46 32 1 8 0 1 34 46 32 1 8 0 1 34 46 32 1 8 0 48 1 46 32 1 8 1 48 48 46 32 1 8 1 1 67 46 32 1 8 0 81 1 46 32 1 8 1 81 48 46 32 1 8 1 47 100 44 31 2 9 0 114 87 42 30 2 10 1 280 42 40 27 2 12 1 280 83 36 24 3 15 1 253 249 31 20 3 19 1 145 129 0 0 0 0 0 145 129 0 0 0 0 0 145 129 0 0 0 0 0 256 127 40 39 4 4 0 256 167 40 40 4 4 0 256 208 40 40 4 4 0 155 1 42 40 3 4 1 155 44 42 40 3 4 1 a "begin" 48 48 0 40 "idle" 48 48 41 50 "done" 48 48 51 69 v 1`

## Usage

Use `parse` to generate a data object that's much easier to use.

```ts
import { parse } from 'tiny-atlas';

const atlas = parse('f 0 0 100 100 0 0 0 v 1');
```
