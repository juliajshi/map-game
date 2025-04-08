'use client';

import { Feature, LineString, Point } from 'geojson';
import React, { useCallback, useEffect, useState } from 'react';
import Map, { Layer, Marker, Source, ViewState } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

const initialViewState = {
  longitude: -73.9853326880174, // NYC longitude
  latitude: 40.6913874260183, // NYC latitude
  zoom: 21.74,
  bearing: -175,
  pitch: 80,
  padding: { top: 0, bottom: 0, left: 0, right: 0 },
};

const initialGamePath: Feature<LineString> = {
  type: 'Feature',
  properties: {
    name: "Fisherman's Wharf to Golden Gate Bridge",
    description: "Scenic path along San Francisco's northern waterfront",
  },
  geometry: {
    type: 'LineString',
    coordinates: [
      [-73.9853326880174, 40.6913874260183], // Recurse Center
      [-73.9953326880174, 40.7013874260183], // Recurse Center
    ],
  },
};

const test: number[][] = [
  [-73.9853326880174, 40.6913874260183], // Recurse Center
  [-73.9953326880174, 40.7013874260183], // Recurse Center
];

const distance = (pt_prev: number[], pt_next: number[]) => {
  const d_x = pt_next[0] - pt_prev[0];
  const d_y = pt_next[1] - pt_prev[1];
  return Math.sqrt(d_x * d_x + d_y * d_y);
};

export default function Home() {
  const [viewState, setViewState] = useState<ViewState>(initialViewState);
  // const [currentCoordinates, setCurrentCoodinates] = useState([]);
  const [pathCoordinates, setPathCoordinates] = useState([
    [-73.9853326880174, 40.6913874260183], // Recurse Center
  ]);

  const [gamePath, setGamePath] = useState<Feature<LineString>>({
    type: 'Feature',
    properties: {
      name: "Fisherman's Wharf to Golden Gate Bridge",
      description: "Scenic path along San Francisco's northern waterfront",
    },
    geometry: {
      type: 'LineString',
      coordinates: [
        [-73.9853326880174, 40.6913874260183], // Recurse Center
        [-73.9953326880174, 40.7013874260183], // Recurse Center
      ],
    },
  });

  const returnGamePath = (input: number[][]): Feature<LineString> => {
    return {
      type: 'Feature',
      properties: {
        name: "Fisherman's Wharf to Golden Gate Bridge",
        description: "Scenic path along San Francisco's northern waterfront",
      },
      geometry: {
        type: 'LineString',
        coordinates: input,
      },
    };
  };

  const startPoint: Feature<Point> = {
    type: 'Feature',
    properties: {
      name: "Fisherman's Wharf to Golden Gate Bridge",
      description: "Scenic path along San Francisco's northern waterfront",
    },
    geometry: {
      type: 'Point',
      coordinates: [-73.9853326880174, 40.6913874260183], // Fisherman's Wharf
    },
  };

  const initialGamePath: Feature<LineString> = {
    type: 'Feature',
    properties: {
      name: "Fisherman's Wharf to Golden Gate Bridge",
      description: "Scenic path along San Francisco's northern waterfront",
    },
    geometry: {
      type: 'LineString',
      coordinates: [
        [-73.9853326880174, 40.6913874260183], // Recurse Center
      ],
    },
  };

  const samplePath: Feature<LineString> = {
    type: 'Feature',
    properties: {
      name: "Fisherman's Wharf to Golden Gate Bridge",
      description: "Scenic path along San Francisco's northern waterfront",
    },
    geometry: {
      type: 'LineString',
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

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (['q', 'w'].includes(event.key.toLowerCase())) {
      event.preventDefault();

      // Update bearing based on Q and W keys
      setViewState((prev) => {
        const bearingChange = 5; // degrees to rotate per key press
        let newBearing = prev.bearing;

        if (event.key.toLowerCase() === 'q') {
          newBearing = (prev.bearing - bearingChange) % 360;
        } else if (event.key.toLowerCase() === 'w') {
          newBearing = (prev.bearing + bearingChange) % 360;
        }

        return {
          ...prev,
          bearing: newBearing,
        };
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  console.log('path coordinates', pathCoordinates);

  return (
    <div>
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
        initialViewState={{
          longitude: -122.4,
          latitude: 37.8,
          zoom: 14,
        }}
        {...viewState}
        onMove={(evt) => {
          console.log('we are moving to:', evt);

          const lastCoordinate = pathCoordinates[pathCoordinates.length - 1];
          const nextCoordinate = [
            evt.viewState.longitude,
            evt.viewState.latitude,
          ];

          const lastDistance = distance(lastCoordinate, nextCoordinate);
          console.log('last distance', lastDistance);
          if (lastDistance > 0.00005) {
            console.log('in the distance checker');
            setPathCoordinates((prev) => [...prev, nextCoordinate]);
          }
          evt.viewState.latitude;
          setViewState(evt.viewState);
        }}
        style={{ width: '100vw', height: '100vh' }}
        mapStyle='mapbox://styles/iamnotreddy/cm98oiazk002701s0b0j68mpr'
        maxPitch={85}
        minPitch={80}
        minZoom={0}
        maxZoom={22.5}
      >
        <Source
          id='game-path'
          type='geojson'
          data={returnGamePath(pathCoordinates)}
        >
          <Layer
            id='path-layer'
            type='line'
            paint={{
              'line-color': 'pink',
              'line-width': 10,
            }}
          />
        </Source>
        <Source id='start-point' type='geojson' data={startPoint}>
          <Layer
            id='start-point-layer'
            type='circle'
            paint={{ 'circle-color': 'red' }}
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
