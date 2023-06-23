import ClipperLib from "clipper-lib";
import { FPoint } from "clipper-lib-fpoint";

export const polygonContainsPoint = (polygon, latLng) => {
  // Exclude points outside of bounds as there is no way they are in the poly

  var inPoly = false,
    lat, lng,
    numPaths, p, path, numPoints,
    i, j, vertex1, vertex2;

  lat = latLng.lat;
  lng = latLng.lng;

  numPaths = polygon.getPaths().getLength();
  for (p = 0; p < numPaths; p++) {
    path = polygon.getPaths().getAt(p);
    numPoints = path.getLength();
    j = numPoints - 1;

    for (i = 0; i < numPoints; i++) {
      vertex1 = path.getAt(i);
      vertex2 = path.getAt(j);

      if (
        (vertex1.lng() <  lng &&
        vertex2.lng() >= lng) ||
        (vertex2.lng() <  lng &&
        vertex1.lng() >= lng)
      ) {
        if (
          vertex1.lat() +
          (lng - vertex1.lng()) /
          (vertex2.lng() - vertex1.lng()) *
          (vertex2.lat() - vertex1.lat()) <
          lat
        ) {
          inPoly = !inPoly;
        }
      }

      j = i;
    }
  }

  return inPoly;
};

export const _polyComplete = (poly) => {
  let bounds = [];
  const paths = poly.getPaths();
  paths.forEach((path) => {
    const ar = path.getArray();
    for (let i = 0, l = ar.length; i < l; i++) {
      const lat = ar[i].lat();
      const lng = ar[i].lng();
      bounds.push({
          lat, lng
      });
    }
    // Appending the first coords as last to make a complete polygon
    if (ar[0]) {
      bounds.push({
          lat: ar[0].lat(), 
          lng: ar[0].lng()
      });
    }
  });
};

export const returnBounds = (poly) => {
  let bounds = [];
  const paths = poly.getPaths();
  paths.forEach((path) => {
    const ar = path.getArray();
    for (let i = 0, l = ar.length; i < l; i++) {
      const lat = ar[i].lat();
      const lng = ar[i].lng();
      bounds.push({
          lat, lng
      });
    }
    // Appending the first coords as last to make a complete polygon
    if (ar[0]) {
      bounds.push({
          lat: ar[0].lat(), 
          lng: ar[0].lng()
      });
    }
  });

  return bounds;
}

export function createarray_clipper_polygon(array) {
  var subj_polygon = new ClipperLib.Path();
  for (let i = 0; i < array.length; i++) {
      var latx = array[i].lat();
      var lngx = array[i].lng();
      subj_polygon.push(new FPoint(latx * 100000000, lngx * 100000000));
  }
  return subj_polygon;
}

export function mergePolygons(polygons, maps) {
  let cpr = new ClipperLib.Clipper(),
      array_polygon_clipper = [],
      subj_polygons = new ClipperLib.Paths(),
      solution_polygons = new ClipperLib.Paths(),
      array_polygon = [],
      parcelleHeig = [],
      newPolygons = [],
      polygoneParcelleHeig;

  //convert google map polygons to ClipperLib polygons

  polygons.forEach(function (polygon) {
      array_polygon.push(polygon.getPath().getArray());
  });

  for (let j = 0; j < array_polygon.length; j++) {
      array_polygon_clipper = createarray_clipper_polygon(array_polygon[j]);
      if (ClipperLib.JS.AreaOfPolygon(array_polygon_clipper) < 0) {
          array_polygon_clipper.reverse();
      }
      subj_polygons.push(array_polygon_clipper);
  }

  //merge polygons
  cpr.AddPaths(subj_polygons, ClipperLib.PolyType.ptSubject, true);
  cpr.Execute(ClipperLib.ClipType.ctUnion, solution_polygons, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);

  solution_polygons = ClipperLib.Clipper.SimplifyPolygons(solution_polygons, ClipperLib.PolyFillType.pftNonZero);

  //convert merged polygon back to google maps polygon
  for (let i = 0; i < solution_polygons.length; i++) {
      var tempArray = [];
      for (let j = 0; j < solution_polygons[i].length; j++) {
          tempArray.push(new maps.LatLng(solution_polygons[i][j].X / 100000000, solution_polygons[i][j].Y / 100000000));
      }
      parcelleHeig.push(tempArray);
  }

  polygoneParcelleHeig = new maps.Polygon({
      paths: parcelleHeig,
      strokeColor: "#42A5F5",
      strokeWeight: 3,
      fillColor: "#42A5F5",
      fillOpacity: 0.25,
      clickable: false
  });
  newPolygons.push(polygoneParcelleHeig);

  return polygoneParcelleHeig;
}