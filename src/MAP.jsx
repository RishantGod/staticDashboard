import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import shapesData from './UWC.json';

// You'll need to get a Mapbox access token from https://account.mapbox.com/access-tokens/
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoicmdvZGFyIiwiYSI6ImNtZGlxN3pkMTBmNHIybXNmaTRua2I5OTYifQ.KZiyF7KnHVi31iM3zdmK4A'; // Replace with your actual token

export default function Map() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng] = useState(103.9320);
    const [lat] = useState(1.3585);
    const [zoom] = useState(17);

    // Show setup message if no valid token is provided
    if (!MAPBOX_TOKEN || MAPBOX_TOKEN === 'pk.your_mapbox_token_here') {
        return (
            <div className="map" style={{ 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center',
                padding: '20px',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
            }}>
                <h3 style={{ margin: '0 0 16px 0' }}>🗺️ Campus Map</h3>
                <p style={{ margin: '0 0 12px 0', fontSize: '14px', opacity: 0.9 }}>
                    To display the interactive campus buildings map, you need a Mapbox token.
                </p>
                <p style={{ margin: '0 0 16px 0', fontSize: '13px', opacity: 0.8 }}>
                    Check <strong>MAPBOX_SETUP.md</strong> for setup instructions.
                </p>
                <div style={{
                    background: 'rgba(255,255,255,0.1)',
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    border: '1px solid rgba(255,255,255,0.2)'
                }}>
                    Get your free token at: account.mapbox.com
                </div>
            </div>
        );
    }

    useEffect(() => {
        if (map.current) return; // Initialize map only once
        
        mapboxgl.accessToken = MAPBOX_TOKEN;
        
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/standard',
            center: [lng, lat],
            zoom: zoom
        });

        map.current.on('load', () => {
            // Add the buildings source
            map.current.addSource('buildings', {
                type: 'geojson',
                data: shapesData
            });

            // Add building fill layer
            map.current.addLayer({
                id: 'buildings-fill',
                type: 'fill',
                source: 'buildings',
                paint: {
                    'fill-color': [
                        'case',
                        ['==', ['get', 'Name'], 'Block A'], '#4CAF50', // Green for Block A
                        ['==', ['get', 'Name'], 'Block B'], '#FF9800', // Orange for Block B
                        ['==', ['get', 'Name'], 'Block C'], '#9C27B0', // Purple for Block C
                        ['==', ['get', 'Name'], 'Block D'], '#F44336', // Red for Block D
                        '#2196F3' // Blue for other buildings (Infant School, Tampines House, Sports)
                    ],
                    'fill-opacity': 0.6
                }
            });

            // Add building outline layer
            map.current.addLayer({
                id: 'buildings-outline',
                type: 'line',
                source: 'buildings',
                paint: {
                    'line-color': '#ffffff',
                    'line-width': 2
                }
            });

            // Add building labels layer (only for buildings with names)
            map.current.addLayer({
                id: 'buildings-labels',
                type: 'symbol',
                source: 'buildings',
                layout: {
                    'text-field': ['get', 'Name'],
                    'text-size': 12,
                    'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold']
                },
                paint: {
                    'text-color': '#333333',
                    'text-halo-color': '#ffffff',
                    'text-halo-width': 1
                },
                filter: ['!=', ['get', 'Name'], ''] // Only show non-empty names
            });

            // Add click event for building info
            map.current.on('click', 'buildings-fill', (e) => {
                const properties = e.features[0].properties;
                const name = properties.Name || `Building ${properties.id}`;
                
                new mapboxgl.Popup()
                    .setLngLat(e.lngLat)
                    .setHTML(`
                        <div style="padding: 8px;">
                            <h4 style="margin: 0 0 4px 0;">${name}</h4>
                            <p style="margin: 0; font-size: 12px; color: #666;">
                                Building ID: ${properties.id}
                            </p>
                        </div>
                    `)
                    .addTo(map.current);
            });

            // Change cursor on hover
            map.current.on('mouseenter', 'buildings-fill', () => {
                map.current.getCanvas().style.cursor = 'pointer';
            });

            map.current.on('mouseleave', 'buildings-fill', () => {
                map.current.getCanvas().style.cursor = '';
            });
        });

        // Cleanup function
        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, [lng, lat, zoom]);

    return (
        <div className="map" style={{ position: 'relative' }}>
            <div ref={mapContainer} style={{ height: '100%', width: '100%' }} />
            
            {/* Map legend */}
            <div style={{
                position: 'absolute',
                top: 10,
                left: 10,
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                backdropFilter: 'blur(4px)'
            }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#333' }}>Campus Buildings</h4>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ 
                        width: '12px', 
                        height: '12px', 
                        backgroundColor: '#4CAF50', 
                        marginRight: '6px',
                        border: '1px solid #fff',
                        borderRadius: '2px'
                    }}></div>
                    <span style={{ color: '#333', fontSize: '11px' }}>Block A</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ 
                        width: '12px', 
                        height: '12px', 
                        backgroundColor: '#FF9800', 
                        marginRight: '6px',
                        border: '1px solid #fff',
                        borderRadius: '2px'
                    }}></div>
                    <span style={{ color: '#333', fontSize: '11px' }}>Block B</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ 
                        width: '12px', 
                        height: '12px', 
                        backgroundColor: '#9C27B0', 
                        marginRight: '6px',
                        border: '1px solid #fff',
                        borderRadius: '2px'
                    }}></div>
                    <span style={{ color: '#333', fontSize: '11px' }}>Block C</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ 
                        width: '12px', 
                        height: '12px', 
                        backgroundColor: '#F44336', 
                        marginRight: '6px',
                        border: '1px solid #fff',
                        borderRadius: '2px'
                    }}></div>
                    <span style={{ color: '#333', fontSize: '11px' }}>Block D</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ 
                        width: '12px', 
                        height: '12px', 
                        backgroundColor: '#2196F3', 
                        marginRight: '6px',
                        border: '1px solid #fff',
                        borderRadius: '2px'
                    }}></div>
                    <span style={{ color: '#333', fontSize: '11px' }}>Other Buildings</span>
                </div>
                <p style={{ 
                    margin: '6px 0 0 0', 
                    fontSize: '9px', 
                    color: '#666',
                    fontStyle: 'italic'
                }}>
                    Click buildings for details
                </p>
            </div>
        </div>
    );
}