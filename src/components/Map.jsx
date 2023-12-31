import GoogleMapReact from "google-map-react";
import { useEffect, useState } from "react";
import DrawingDisabled from "../assets/draw-icon-disabled.svg";
import DrawingEnabled from "../assets/draw-icon-enabled.svg";
import { _polyComplete, getPointsOfCircle, mergePolygons, polygonContainsPoint, returnBounds } from "../utils/map-utils";

const DrawButton = (props) => {
    const { drawingDisabled, setDrawingDisabled } = props;
    return (
        <div className="draw-button pointer">
            <img
                src={drawingDisabled ? DrawingDisabled : DrawingEnabled}
                alt={`draw-icon-${drawingDisabled ? "disabled" : "enabled"}`}
                onClick={() => setDrawingDisabled(!drawingDisabled)}
            />
        </div>
    )
}

const Marker = ({ children }) => children;

export default function Map (props) {
    const { setGoogleLoaded, navigatorLocation, searchRadius, pins, triggerDrawSearch } = props;

    const [map, setMap] = useState(null);
    const [maps, setMaps] = useState(null);
    const [drawingDisabled, setDrawingDisabled] = useState(true);
    const [polygonsDrawn, setPolygonsDrawn] = useState([]);
    const [surroundingCircle, setSurroundingCircle] = useState(null);

    useEffect(() => {
        if (maps) {
          const _enableDrawableHelper = () => {
            // Clear the old Listeners if exits and attach a new 'mousedown' listener on Map
            if (map) {
              maps.event.clearListeners(map, "mousedown");
              maps.event.addDomListener(map, "mousedown", _drawFreeHand);
            }
          };
    
          const _drawFreeHand = () => {
            const poly = new maps.Polyline({
              clickable: false,
              map: map,
              strokeColor: "#42A5F5",
              strokeWeight: 3,
            });
            // Added mousemove listener to track the user's mouse movement
            const move = maps.event.addListener(map, "mousemove", (e) => {
              poly.getPath().push(e.latLng);
            });
    
            // Added mouseup listener to check when the user releases the mouse button
            maps.event.addListenerOnce(map, "mouseup", (e) => {
              maps.event.removeListener(move);
              const path = poly.getPath();
              poly.setMap(null);
              let polygon = new maps.Polygon({
                clickable: false,
                fillColor: "#42A5F5",
                fillOpacity: 0.25,
                path,
                strokeColor: "#42A5F5",
                strokeWeight: 3,
              });
    
              let intersectionFlag = false;
              let intersectedPolygons = [];
              for (let p of polygonsDrawn) {
                const intersectionCoords = returnBounds(polygon)
                  .map((latlng) =>
                    polygonContainsPoint(p, latlng) ? latlng : null
                  )
                  .filter((res) => res);
                const isIntersected = intersectionCoords.length > 0;
    
                if (isIntersected) {
                  intersectionFlag = true;
                  intersectedPolygons.push(p);
                } else {
                  continue;
                }
              }
    
              if (!intersectionFlag) {
                polygon.setMap(map);
                _polyComplete(polygon);
                const polygonsCopy = polygonsDrawn;
                polygonsCopy.push(polygon);
                const coordinates = polygonsCopy.map((p) => returnBounds(p));
                console.log(coordinates); // TRIGGER SEARCH WITH THIS
                triggerDrawSearch(coordinates);

                setPolygonsDrawn(polygonsCopy);
    
                if (!drawingDisabled) {
                  setDrawingDisabled(true);
                }
              } else {
                let merged = null;
                for (let ip of intersectedPolygons) {
                  ip.setMap(null);
                  merged = mergePolygons([...intersectedPolygons, polygon], maps);
                  const polygonsDrawnCopy = polygonsDrawn;
    
                  const index = polygonsDrawnCopy.findIndex(
                    (pc) => pc.getPath() === ip.getPath()
                  );
                  if (index !== -1) {
                    polygonsDrawn[index].setMap(null);
                    polygonsDrawnCopy.splice(index, 1);
                  }
                }
    
                if (merged) {
                  merged.setMap(map);
                  const polygonsCopy = polygonsDrawn;
                  polygonsCopy.push(merged);
                  const coordinates = polygonsCopy.map((p) => returnBounds(p));
                  console.log(coordinates);
                  triggerDrawSearch(coordinates);
                  setPolygonsDrawn(polygonsCopy);
    
                  if (!drawingDisabled) {
                    setDrawingDisabled(true);
                  }
                }
              }
            });
          };
    
          if (!drawingDisabled) {
            _enableDrawableHelper();
          } else {
            maps.event.clearListeners(map, "mousedown");
          }
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [drawingDisabled, polygonsDrawn, map, maps]);

      // eslint-disable-next-line react-hooks/exhaustive-deps
      const fitNewBounds = (points) => {
        if (points.length && map) {
          const boundsS = new maps.LatLngBounds();
    
          points.forEach((point) => {
            boundsS.extend(point);
          });
          map.fitBounds(boundsS);
        }
      };
  
      useEffect (() => {
        if (navigatorLocation) {
          const circlePaths = getPointsOfCircle(navigatorLocation, searchRadius / 1000);
    
          fitNewBounds(
            circlePaths.map((point) => new maps.LatLng(point.lat, point.lng))
          );
    
          const circle = new maps.Circle({
            strokeColor: "#0BAEB7",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#0BAEB7",
            fillOpacity: 0.2,
            center: navigatorLocation,
            radius: searchRadius,
          });
          if (surroundingCircle) {
            surroundingCircle.setMap(null);
          }
          circle.setMap(map);
          setSurroundingCircle(circle);
        } else {
          if (surroundingCircle) {
            surroundingCircle.setMap(null);
            setSurroundingCircle(null);
          }
        }
  
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [navigatorLocation, searchRadius]);

      useEffect(() => {
        if (polygonsDrawn && polygonsDrawn.length) {
          let polygonPoints = [];
          polygonsDrawn.forEach((polygon) => {
            polygon
              .getPath()
              .getArray()
              .forEach((point) => {
                polygonPoints.push(point);
              });
          });
          fitNewBounds(polygonPoints);
        }
      }, [fitNewBounds, polygonsDrawn]);

      const clearPolys = () => {
        for(let poly of polygonsDrawn) {
          poly.setMap(null);
        }
        setPolygonsDrawn([]);
      }

    return (
        <div className="map">
            <DrawButton
                drawingDisabled={drawingDisabled}
                setDrawingDisabled={setDrawingDisabled}
            />
            {<div className="clear-button pointer" onClick={() => { setDrawingDisabled(true); clearPolys(); }} style={{ display: polygonsDrawn.length === 0 ? "none" : "flex"}}>
                X
            </div>}
            <GoogleMapReact
              bootstrapURLKeys={{
                  key: process.env.REACT_APP_GOOGLE_API_KEY,
                  libraries: ["visualization", "drawing", "places"],
                  language: "en",
              }}
              defaultCenter={{ lat: 45.24492, lng: 19.84771 }}
              defaultZoom={14}
              onGoogleApiLoaded={({ map, maps }) => {
                  // handleMapLoaded(map, maps);
                  // mapRef.current = map;
                  setMaps(maps);
                  setMap(map);
                  setGoogleLoaded(true);
                  // dispatch(search());
              }}
              draggable={drawingDisabled}
              yesIWantToUseGoogleMapApiInternals
            >
              {pins.map((pin, i) => (
                <Marker
                  key={i}
                  lat={pin.lat}
                  lng={pin.lng}
                >
                  <div className="marker"></div>
                </Marker>
              ))}
            </GoogleMapReact>
        </div>
    )
}