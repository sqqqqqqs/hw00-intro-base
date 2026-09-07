import {vec3, vec4} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';

class Cube extends Drawable {
  indices: Uint32Array;
  positions: Float32Array;
  normals: Float32Array;
  center: vec4;

  constructor(center: vec3) {
    super(); // Call the constructor of the super class. This is required.
    this.center = vec4.fromValues(center[0], center[1], center[2], 1);
  }

  create() {

  let idx: number[] = [];
  for (let i = 0; i < 6; i++) {
    let o = i * 4;
    idx.push(o, o + 1, o + 2,  o, o + 2, o + 3);
  }
  this.indices = new Uint32Array(idx);
  this.normals = new Float32Array([
    0, 0, 1, 0,   0, 0, 1, 0,   0, 0, 1, 0,   0, 0, 1, 0,
    0, 0, -1, 0,  0, 0, -1, 0,  0, 0, -1, 0,  0, 0, -1, 0,
    1, 0, 0, 0,   1, 0, 0, 0,   1, 0, 0, 0,   1, 0, 0, 0,
    -1, 0, 0, 0,  -1, 0, 0, 0,  -1, 0, 0, 0,  -1, 0, 0, 0,
    0, 1, 0, 0,   0, 1, 0, 0,   0, 1, 0, 0,   0, 1, 0, 0,
    0, -1, 0, 0,  0, -1, 0, 0,  0, -1, 0, 0,  0, -1, 0, 0,
    ]);
  const cx = this.center[0];
  const cy = this.center[1];
  const cz = this.center[2];
  this.positions = new Float32Array([
  // +Z
  cx - 1, cy - 1, cz + 1, 1,
  cx + 1, cy - 1, cz + 1, 1,
  cx + 1, cy + 1, cz + 1, 1,
  cx - 1, cy + 1, cz + 1, 1,
  // -Z
  cx + 1, cy - 1, cz - 1, 1,
  cx - 1, cy - 1, cz - 1, 1,
  cx - 1, cy + 1, cz - 1, 1,
  cx + 1, cy + 1, cz - 1, 1,
  // +X
  cx + 1, cy - 1, cz + 1, 1,
  cx + 1, cy - 1, cz - 1, 1,
  cx + 1, cy + 1, cz - 1, 1,
  cx + 1, cy + 1, cz + 1, 1,
  // -X
  cx - 1, cy - 1, cz - 1, 1,
  cx - 1, cy - 1, cz + 1, 1,
  cx - 1, cy + 1, cz + 1, 1,
  cx - 1, cy + 1, cz - 1, 1,
  // +Y
  cx - 1, cy + 1, cz + 1, 1,
  cx + 1, cy + 1, cz + 1, 1,
  cx + 1, cy + 1, cz - 1, 1,
  cx - 1, cy + 1, cz - 1, 1,
// -Y
  cx - 1, cy - 1, cz - 1, 1,
  cx + 1, cy - 1, cz - 1, 1,
  cx + 1, cy - 1, cz + 1, 1,
  cx - 1, cy - 1, cz + 1, 1,
]);

    this.generateIdx();
    this.generatePos();
    this.generateNor();

    this.count = this.indices.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
    gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
    gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);

    console.log(`Created cube`);
  }
};

export default Cube;