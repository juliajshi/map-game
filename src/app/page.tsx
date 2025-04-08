"use client";

import { Feature, LineString } from "geojson";
import React, { useState } from "react";
import Map, { Layer, Marker, Source, ViewState } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

const initialViewState = {
  longitude: -122.4,
  latitude: 37.8,
  zoom: 14,
  bearing: 0,
  pitch: 80,
  padding: { top: 0, bottom: 0, left: 0, right: 0 },
};

export default function Home() {
  const [viewState, setViewState] = useState<ViewState>(initialViewState);

  console.log("viewState zoom", viewState.zoom);

  const samplePath: Feature<LineString> = {
    type: "Feature",
    properties: {
      name: "Fisherman's Wharf to Golden Gate Bridge",
      description: "Scenic path along San Francisco's northern waterfront",
    },
    geometry: {
      type: "LineString",
      coordinates: [
        [-122.417482, 37.808414], // Fisherman's Wharf
        [-122.422481, 37.807207], // Aquatic Park
        [-122.425873, 37.805872], // Fort Mason
        [-122.431435, 37.805958], // Marina Green
        [-122.43799, 37.80653], // Palace of Fine Arts
        [-122.443736, 37.803883], // Crissy Field East
        [-122.456333, 37.802029], // Crissy Field West
        [-122.466429, 37.80438], // Fort Point
        [-122.478417, 37.811758], // Golden Gate Bridge Vista Point
      ],
    },
  };

  return (
    <div>
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
        initialViewState={{
          longitude: -122.4,
          latitude: 37.8,
          zoom: 14,
        }}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/iamnotreddy/cm98oiazk002701s0b0j68mpr"
        maxPitch={85}
        minPitch={80}
        minZoom={20}
        maxZoom={21}
      >
        <Source id="sample-path" type="geojson" data={samplePath}>
          <Layer
            id="path-layer"
            type="line"
            paint={{
              "line-color": "#0080ff",
              "line-width": 3,
            }}
          />
        </Source>
        <Marker
          latitude={viewState.latitude}
          longitude={viewState.longitude}
        ></Marker>
      </Map>
    </div>
  );
}

//
