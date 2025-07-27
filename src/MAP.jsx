import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import shapesData from './UWC.json';

// You'll need to get a Mapbox access token from https://account.mapbox.com/access-tokens/
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoicmdvZGFyIiwiYSI6ImNtZGlxN3pkMTBmNHIybXNmaTRua2I5OTYifQ.KZiyF7KnHVi31iM3zdmK4A'; // Replace with your actual token

export default function Map() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng] = useState(103.93205);
    const [lat] = useState(1.35858);
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
            style: 'mapbox://styles/rgodar/cmdkbzv71004m01s94qyegi0x',
            center: [lng, lat],
            zoom: zoom,
            bearing: 27
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
                        ['==', ['get', 'Name'], 'Block A'], '#48cae4', // Light Blue for Block A
                        ['==', ['get', 'Name'], 'Block B'], '#ff758f', // Pink for Block B
                        ['==', ['get', 'Name'], 'Block C'], '#74c69d', // Green for Block C
                        ['==', ['get', 'Name'], 'Block D'], '#b8b8ff', // Purple for Block D
                        ['==', ['get', 'Name'], 'Infant School'], '#ffd23f', // Yellow for Infant School
                        ['==', ['get', 'Name'], 'Tampines House'], '#a4cefc', // Orange for Tampines House
                        ['==', ['get', 'Name'], 'Sports'], '#e7bc91', // Mint Green for Sports
                        '#2196F3' // Default blue for any other buildings
                    ],
                    'fill-opacity': 0.7
                }
            });

            // Add building outline layer
            map.current.addLayer({
                id: 'buildings-outline',
                type: 'line',
                source: 'buildings',
                paint: {
                    'line-color': [
                        'case',
                        ['==', ['get', 'Name'], 'Block A'], '#48cae4', // Light Blue for Block A
                        ['==', ['get', 'Name'], 'Block B'], '#ff758f', // Pink for Block B
                        ['==', ['get', 'Name'], 'Block C'], '#74c69d', // Green for Block C
                        ['==', ['get', 'Name'], 'Block D'], '#b8b8ff', // Purple for Block D
                        ['==', ['get', 'Name'], 'Infant School'], '#ffd23f', // Yellow for Infant School
                        ['==', ['get', 'Name'], 'Tampines House'], '#a4cefc', // Orange for Tampines House
                        ['==', ['get', 'Name'], 'Sports'], '#e7bc91', // Mint Green for Sports
                        '#2196F3' // Default blue for any other buildings
                    ],
                    'line-width': 2,
                    'line-opacity': 1
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
        <div className="map" style={{ position: 'relative', overflow: 'hidden' }}>
            <div ref={mapContainer} style={{ height: '100%', width: '100%' }} />
            
            {/* Map legend */}
            <div style={{
                position: 'absolute',
                top: 10,
                right: 20,
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                backdropFilter: 'blur(4px)'
            }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#333' }}>Campus Buildings</h4>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ 
                        width: '15px', 
                        height: '15px', 
                        backgroundColor: 'rgba(72, 202, 228, 0.3)', 
                        marginRight: '6px',
                        border: '2px solid #48cae4',
                        borderRadius: '2px'
                    }}></div>
                    <span style={{ color: '#333', fontSize: '14px' }}>Block A</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ 
                        width: '15px', 
                        height: '15px', 
                        backgroundColor: 'rgba(255, 117, 143, 0.3)', 
                        marginRight: '6px',
                        border: '2px solid #ff758f',
                        borderRadius: '2px'
                    }}></div>
                    <span style={{ color: '#333', fontSize: '14px' }}>Block B</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ 
                        width: '15px', 
                        height: '15px', 
                        backgroundColor: 'rgba(116, 198, 157, 0.3)', 
                        marginRight: '6px',
                        border: '2px solid #74c69d',
                        borderRadius: '2px'
                    }}></div>
                    <span style={{ color: '#333', fontSize: '14px' }}>Block C</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ 
                        width: '15px', 
                        height: '15px', 
                        backgroundColor: 'rgba(184, 184, 255, 0.3)', 
                        marginRight: '6px',
                        border: '2px solid #b8b8ff',
                        borderRadius: '2px'
                    }}></div>
                    <span style={{ color: '#333', fontSize: '14px' }}>Block D</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ 
                        width: '15px', 
                        height: '15px', 
                        backgroundColor: 'rgba(255, 210, 63, 0.3)', 
                        marginRight: '6px',
                        border: '2px solid #ffd23f',
                        borderRadius: '2px'
                    }}></div>
                    <span style={{ color: '#333', fontSize: '14px' }}>Infant School</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ 
                        width: '15px', 
                        height: '15px', 
                        backgroundColor: 'rgba(164, 206, 252, 0.3)', 
                        marginRight: '6px',
                        border: '2px solid #a4cefc',
                        borderRadius: '2px'
                    }}></div>
                    <span style={{ color: '#333', fontSize: '14px' }}>Tampines House</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ 
                        width: '15px', 
                        height: '15px', 
                        backgroundColor: 'rgba(231, 188, 145, 0.3)', 
                        marginRight: '6px',
                        border: '2px solid #e7bc91',
                        borderRadius: '2px'
                    }}></div>
                    <span style={{ color: '#333', fontSize: '14px' }}>Sports</span>
                </div>
            </div>
        </div>
    );
}