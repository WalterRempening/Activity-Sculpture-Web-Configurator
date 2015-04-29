(function ( exports ) {
  'use strict';

  var writeVector = function(dataview, offset, vector, isLittleEndian) {
    offset = writeFloat(dataview, offset, vector.x, isLittleEndian);
    offset = writeFloat(dataview, offset, vector.y, isLittleEndian);
    return writeFloat(dataview, offset, vector.z, isLittleEndian);
  };

  var writeFloat = function(dataview, offset, float, isLittleEndian) {
    dataview.setFloat32(offset, float, isLittleEndian);
    return offset + 4;
  };

  var geometryToDataView = function(geometry) {
    var tris = geometry.faces;
    var verts = geometry.vertices;

    var isLittleEndian = true; // STL files assume little endian, see wikipedia page

    var bufferSize = 84 + (50 * tris.length);
    var buffer = new ArrayBuffer(bufferSize);
    var dv = new DataView(buffer);
    var offset = 0;

    offset += 80; // Header is empty

    dv.setUint32(offset, tris.length, isLittleEndian);
    offset += 4;

    for(var n = 0; n < tris.length; n++) {
      offset = writeVector(dv, offset, tris[n].normal, isLittleEndian);
      offset = writeVector(dv, offset, verts[tris[n].a], isLittleEndian);
      offset = writeVector(dv, offset, verts[tris[n].b], isLittleEndian);
      offset = writeVector(dv, offset, verts[tris[n].c], isLittleEndian);
      offset += 2; // unused 'attribute byte count' is a Uint16
    }

    return dv;
  };

  function save(geometry, filename) {
    var dv = geometryToDataView(geometry);
    var blob = new Blob([dv], {type: 'application/octet-binary'});

    saveAs(blob, filename);
  };

  exports.save = save;
  //return exports;
})( typeof exports === 'undefined' ? this[ 'wcBinarySTLWriter' ] = {} : exports );