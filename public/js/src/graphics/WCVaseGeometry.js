var WCVaseGeometry = function ( data, outerRadius, innerRadius, height,
                                radialSegments,
                                heightSegments ) {

  THREE.Geometry.call( this );

  this.parameters = {
    data: data,
    outerRadius: outerRadius,
    innerRadius: innerRadius,
    height: height,
    radialSegemnts: radialSegments,
    heightSegments: heightSegments
  };

  data = data !== undefined ? data : 1;

  outerRadius = outerRadius !== undefined ? outerRadius : 20;
  innerRadius = innerRadius !== undefined ? innerRadius : 15;
  height = height !== undefined ? height : 100;

  radialSegments = radialSegments || 8;
  heightSegments = heightSegments || 1;

  var heightHalf = height / 2;
  var x, y, vertices = [], uvs = [];

  for ( y = 0; y <= heightSegments; y++ ) {

    var verticesRow = [];
    var uvsRow = [];

    var v = y / heightSegments;
    var radius = data[ 1 ][ y ] + outerRadius;

    for ( x = 0; x <= radialSegments; x++ ) {
      var u = x / radialSegments;
      var vertex = new THREE.Vector3();
      vertex.x = radius * Math.sin( u * 2 * Math.PI ); // Math.PI is for thetaLength
      vertex.y = -v * height + heightHalf;
      vertex.z = radius * Math.cos( u * 2 * Math.PI );

      this.vertices.push( vertex );

      verticesRow.push( this.vertices.length - 1 );
      uvsRow.push( new THREE.Vector2( u, 1 - v ) );
    }

    vertices.push( verticesRow );
    uvs.push( uvsRow );

  }

  var tanTheta = (outerRadius) / height;
  var na, nb;

  for ( x = 0; x < radialSegments; x++ ) {

    na = this.vertices[ vertices[ 1 ][ x ] ].clone();
    nb = this.vertices[ vertices[ 1 ][ x + 1 ] ].clone();

    na.setY( Math.sqrt( na.x * na.x + na.z * na.z ) * tanTheta ).normalize();
    nb.setY( Math.sqrt( nb.x * nb.x + nb.z * nb.z ) * tanTheta ).normalize();

    for ( y = 0; y < heightSegments; y++ ) {

      var v1 = vertices[ y ][ x ];
      var v2 = vertices[ y + 1 ][ x ];
      var v3 = vertices[ y + 1 ][ x + 1 ];
      var v4 = vertices[ y ][ x + 1 ];

      var n1 = na.clone();
      var n2 = na.clone();
      var n3 = nb.clone();
      var n4 = nb.clone();

      var uv1 = uvs[ y ][ x ].clone();
      var uv2 = uvs[ y + 1 ][ x ].clone();
      var uv3 = uvs[ y + 1 ][ x + 1 ].clone();
      var uv4 = uvs[ y ][ x + 1 ].clone();

      this.faces.push( new THREE.Face3( v1, v2, v4, [ n1, n2, n4 ] ) );
      this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv4 ] );

      this.faces.push( new THREE.Face3( v2, v3, v4,
        [ n2.clone(), n3, n4.clone() ] ) );
      this.faceVertexUvs[ 0 ].push( [ uv2.clone(), uv3, uv4.clone() ] );

    }
  }
  // top cap
  this.vertices.push( new THREE.Vector3( 0, heightHalf, 0 ) );

  for ( x = 0; x < radialSegments; x++ ) {

    var v1 = vertices[ 0 ][ x ];
    var v2 = vertices[ 0 ][ x + 1 ];
    var v3 = this.vertices.length - 1;

    var n1 = new THREE.Vector3( 0, 1, 0 );
    var n2 = new THREE.Vector3( 0, 1, 0 );
    var n3 = new THREE.Vector3( 0, 1, 0 );

    var uv1 = uvs[ 0 ][ x ].clone();
    var uv2 = uvs[ 0 ][ x + 1 ].clone();
    var uv3 = new THREE.Vector2( uv2.x, 0 );

    this.faces.push( new THREE.Face3( v1, v2, v3, [ n1, n2, n3 ] ) );
    this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv3 ] );

  }

  // bottom cap
  this.vertices.push( new THREE.Vector3( 0, -heightHalf, 0 ) );

  for ( x = 0; x < radialSegments; x++ ) {

    var v1 = vertices[ heightSegments ][ x + 1 ];
    var v2 = vertices[ heightSegments ][ x ];
    var v3 = this.vertices.length - 1;

    var n1 = new THREE.Vector3( 0, -1, 0 );
    var n2 = new THREE.Vector3( 0, -1, 0 );
    var n3 = new THREE.Vector3( 0, -1, 0 );

    var uv1 = uvs[ heightSegments ][ x + 1 ].clone();
    var uv2 = uvs[ heightSegments ][ x ].clone();
    var uv3 = new THREE.Vector2( uv2.x, 1 );

    this.faces.push( new THREE.Face3( v1, v2, v3, [ n1, n2, n3 ] ) );
    this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv3 ] );

  }

  this.computeFaceNormals();

}

WCVaseGeometry.prototype = Object.create( THREE.Geometry.prototype );
WCVaseGeometry.prototype.constructor = WCVaseGeometry;
