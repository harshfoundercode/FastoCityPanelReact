// src/pages/hubs/HubZone.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Search, MapPin, Plus, Minus, Maximize, Edit3, Loader,
    AlertTriangle, ArrowLeft, Save, Radar, Pin, Building2, Navigation
} from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient, { ENDPOINTS } from '../../config/ApiConfig';

const ZONE_COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899', '#14B8A6'];

// ── Helpers ───────────────────────────────────────────────────────────────────
const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// ── Main Component ────────────────────────────────────────────────────────────
export const HubZone = () => {
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [circles, setCircles] = useState([]);
    const [hubZones, setHubZones] = useState([]);
    const [cityZone, setCityZone] = useState(null);
    const [selectedZone, setSelectedZone] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showEdit, setShowEdit] = useState(false);
    const [mapReady, setMapReady] = useState(false);
    const [showAllZonesList, setShowAllZonesList] = useState(false);

    // ✅ Wait for Google Maps to load
    useEffect(() => {
        const check = setInterval(() => {
            if (window.google?.maps) {
                setMapReady(true);
                clearInterval(check);
            }
        }, 200);
        return () => clearInterval(check);
    }, []);

    // ✅ Initialize map
    useEffect(() => {
        if (!mapReady || !mapRef.current || map) return;

        const gMap = new window.google.maps.Map(mapRef.current, {
            center: { lat: 26.8467, lng: 80.9462 },
            zoom: 11,
            zoomControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            styles: [
                { featureType: 'poi', stylers: [{ visibility: 'off' }] },
                { featureType: 'transit', stylers: [{ visibility: 'off' }] },
            ],
        });

        setMap(gMap);
        console.log('✅ Map initialized');
    }, [mapReady]);

    // ✅ Fetch data
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const cityzoneid = user?.cityzoneid || user?.id || 1;

            const [hubRes, cityRes] = await Promise.all([
                apiClient.post('hubzone_list', { cityzoneid }),
                apiClient.get('cityzone_list'),
            ]);

            const zones = hubRes.data?.data || [];
            const cityData = cityRes.data?.data?.[0] || null;

            console.log('📦 Fetched zones:', zones.length, 'City:', cityData?.name);

            setHubZones(zones);
            setCityZone(cityData);

        } catch (err) {
            console.error('Fetch error:', err);
            toast.error('Failed to load zone data');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ✅ Fetch on mount when map is ready
    useEffect(() => {
        if (mapReady) {
            fetchData();
        }
    }, [mapReady, fetchData]);

    // ✅ Build map overlays when map, zones, or city data changes
    useEffect(() => {
        if (map && hubZones.length > 0) {
            console.log('🗺️ Building overlays for', hubZones.length, 'zones');
            buildMapOverlays(hubZones, cityZone, map);
        }
    }, [map, hubZones, cityZone]);

    const buildMapOverlays = (zones, cityData, gMap) => {
        if (!gMap || !window.google) {
            console.log('❌ Map or Google not ready');
            return;
        }

        // Clear existing
        markers.forEach(m => m.setMap(null));
        circles.forEach(c => c.setMap(null));

        const newMarkers = [];
        const newCircles = [];

        // ✅ City zone boundary - MORE VISIBLE
        if (cityData?.lat && cityData?.long) {
            const cityCircle = new window.google.maps.Circle({
                map: gMap,
                center: { lat: parseFloat(cityData.lat), lng: parseFloat(cityData.long) },
                radius: parseFloat(cityData.radiuskm || 10) * 1000,
                fillColor: '#3B82F6',
                fillOpacity: 0.08,
                strokeColor: '#2563EB',
                strokeOpacity: 0.6,
                strokeWeight: 3,
            });
            newCircles.push(cityCircle);
            console.log('🔵 City boundary added');
        }

        // ✅ Hub zones - BRIGHTER COLORS
        zones.forEach((zone, i) => {
            const lat = zone.latitude || parseFloat(zone.lat);
            const lng = zone.longitude || parseFloat(zone.long);

            if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
                console.log('⚠️ Skipping zone (invalid coords):', zone.name);
                return;
            }

            const color = ZONE_COLORS[i % ZONE_COLORS.length];
            const pos = { lat, lng };
            const rKm = zone.radiusInKm || parseFloat(zone.radiuskm) || 1;

            // Zone circle
            newCircles.push(new window.google.maps.Circle({
                map: gMap,
                center: pos,
                radius: rKm * 1000,
                fillColor: color,
                fillOpacity: 0.2,
                strokeColor: color,
                strokeOpacity: 0.9,
                strokeWeight: 3,
            }));

            // Zone marker
            const mk = new window.google.maps.Marker({
                map: gMap,
                position: pos,
                title: zone.name,
                animation: window.google.maps.Animation.DROP,
                icon: {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 14,
                    fillColor: color,
                    fillOpacity: 1,
                    strokeColor: '#fff',
                    strokeWeight: 3,
                },
                label: {
                    text: (zone.name || '').substring(0, 2).toUpperCase(),
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: 'bold',
                },
            });

            mk.addListener('click', () => {
                setSelectedZone(zone);
                gMap.panTo(pos);
                gMap.setZoom(radiusToZoom(rKm));
            });

            newMarkers.push(mk);
        });

        setMarkers(newMarkers);
        setCircles(newCircles);
        console.log('✅ Total markers:', newMarkers.length, 'Total circles:', newCircles.length);

        // ✅ Auto-select first zone and zoom
        if (zones.length > 0 && !selectedZone) {
            const firstZone = zones[0];
            const flat = firstZone.latitude || parseFloat(firstZone.lat);
            const flng = firstZone.longitude || parseFloat(firstZone.long);
            if (flat && flng && !isNaN(flat) && !isNaN(flng)) {
                setSelectedZone(firstZone);
                gMap.panTo({ lat: flat, lng: flng });
                gMap.setZoom(radiusToZoom(firstZone.radiusInKm || parseFloat(firstZone.radiuskm) || 1));
            }
        }
    };

    const radiusToZoom = (r) => Math.max(9, Math.min(16, 14 - Math.log(r) / Math.log(2)));

    const fitAllZones = () => {
        if (!map || !hubZones.length) return;
        const valid = hubZones.filter(z => {
            const lat = z.latitude || parseFloat(z.lat);
            const lng = z.longitude || parseFloat(z.long);
            return lat && lng && !isNaN(lat) && !isNaN(lng);
        });
        if (!valid.length) return;

        const bounds = new window.google.maps.LatLngBounds();
        valid.forEach(z => bounds.extend({
            lat: z.latitude || parseFloat(z.lat),
            lng: z.longitude || parseFloat(z.long)
        }));
        if (cityZone?.lat && cityZone?.long) {
            bounds.extend({ lat: parseFloat(cityZone.lat), lng: parseFloat(cityZone.long) });
        }
        map.fitBounds(bounds, 60);
    };

    const onZoneTap = (zone) => {
        setSelectedZone(zone);
        const lat = zone.latitude || parseFloat(zone.lat);
        const lng = zone.longitude || parseFloat(zone.long);
        if (map && lat && lng) {
            map.panTo({ lat, lng });
            map.setZoom(radiusToZoom(zone.radiusInKm || parseFloat(zone.radiuskm) || 1));
        }
        setShowAllZonesList(false);
    };

    const handleEditSave = () => {
        setShowEdit(false);
        fetchData();
    };

    const activeZones = hubZones.filter(z => z.status == 1 || z.status === 'active').length;

    return (
        <div className="h-full flex flex-col bg-gray-100 relative">
            {/* Map Area */}
            <div className="flex-1 relative min-h-120">
                <div ref={mapRef} className="w-full h-full absolute inset-0" />

                {/* Loading Overlay */}
                {isLoading && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-20">
                        <div className="flex flex-col items-center gap-3">
                            <Loader size={40} className="animate-spin text-green-800" />
                            <p className="text-sm text-gray-500 font-medium">Loading zones...</p>
                        </div>
                    </div>
                )}

                {/* Top Header Card */}
                <div className="absolute top-4 left-4 right-4 z-10">
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-4 shadow-xl border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center shadow-sm">
                                <Building2 size={22} className="text-green-800" />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-lg font-extrabold text-gray-900 leading-tight">Hub Zones</h1>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {cityZone?.name || 'City'} • {hubZones.length} zones • {activeZones} active
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1.5 bg-green-50 text-green-800 rounded-full text-xs font-bold border border-green-100">
                                    {hubZones.length} Zones
                                </span>
                                <button
                                    onClick={() => setShowAllZonesList(!showAllZonesList)}
                                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold hover:bg-gray-200 transition-colors"
                                >
                                    {showAllZonesList ? 'Hide List' : 'All Zones'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* All Zones List Dropdown */}
                <AnimatePresence>
                    {showAllZonesList && hubZones.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-28 left-4 right-4 z-10 max-h-[40vh] overflow-y-auto"
                        >
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                                <div className="p-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">All Hub Zones</span>
                                    <span className="text-xs text-gray-400">{hubZones.length} zones</span>
                                </div>
                                <div className="divide-y divide-gray-50">
                                    {hubZones.map((zone, i) => {
                                        const color = ZONE_COLORS[i % ZONE_COLORS.length];
                                        const isActive = zone.status == 1 || zone.status === 'active';
                                        const radius = zone.radiusInKm || parseFloat(zone.radiuskm) || 0;
                                        const isSelected = selectedZone?.id === zone.id;
                                        return (
                                            <button
                                                key={zone.id}
                                                onClick={() => onZoneTap(zone)}
                                                className={`w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors ${isSelected ? 'bg-green-50' : ''}`}
                                            >
                                                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-gray-800 truncate">{zone.name}</p>
                                                    <p className="text-xs text-gray-400 truncate">{zone.address || 'No address'}</p>
                                                </div>
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    <span className="text-xs text-gray-500">{radius.toFixed(1)} km</span>
                                                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Legend Chips */}
                {!isLoading && hubZones.length > 0 && !showAllZonesList && (
                    <div className="absolute top-28 left-4 right-4 z-10">
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {hubZones.map((zone, i) => {
                                const color = ZONE_COLORS[i % ZONE_COLORS.length];
                                const isSelected = selectedZone?.id === zone.id;
                                return (
                                    <button
                                        key={zone.id}
                                        onClick={() => onZoneTap(zone)}
                                        className="flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap shadow-lg flex-shrink-0 transition-all hover:scale-105"
                                        style={{
                                            backgroundColor: isSelected ? color : 'white',
                                            color: isSelected ? 'white' : '#1E293B',
                                            border: `2px solid ${color}`,
                                        }}
                                    >
                                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: isSelected ? 'white' : color }} />
                                        {zone.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Map Controls */}
                <div className="absolute bottom-28 right-4 z-10 flex flex-col gap-2.5">
                    <MapBtn icon={<Plus size={20} />} onClick={() => map?.setZoom((map.getZoom() || 11) + 1)} label="Zoom in" />
                    <MapBtn icon={<Minus size={20} />} onClick={() => map?.setZoom((map.getZoom() || 11) - 1)} label="Zoom out" />
                    <MapBtn icon={<Navigation size={20} />} onClick={fitAllZones} label="Fit all zones" />
                </div>

                {/* City Zone Info Badge */}
                {cityZone?.lat && (
                    <div className="absolute bottom-28 left-4 z-10">
                        <div className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg border border-blue-100 flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                            <span className="text-xs font-semibold text-gray-700">City: {cityZone.name || 'Zone'}</span>
                            <span className="text-xs text-gray-400">• {cityZone.radiuskm || 10} km</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Detail Sheet */}
            <AnimatePresence>
                {selectedZone && !showEdit && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                        className="bg-white rounded-t-3xl shadow-2xl px-5 pt-4 pb-8 flex-shrink-0 relative z-30 border-t border-gray-100"
                    >
                        <div className="flex justify-center mb-4">
                            <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
                        </div>
                        <ZoneDetailSheet
                            zone={selectedZone}
                            zoneColor={ZONE_COLORS[hubZones.findIndex(z => z.id === selectedZone?.id) % ZONE_COLORS.length] || ZONE_COLORS[0]}
                            onClose={() => setSelectedZone(null)}
                            onEdit={() => setShowEdit(true)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit Screen Portal */}
            {showEdit && selectedZone && (
                <HubZoneEditScreen
                    zone={selectedZone}
                    cityZone={cityZone}
                    onClose={() => setShowEdit(false)}
                    onSave={handleEditSave}
                />
            )}
        </div>
    );
};

// ── Map Button ────────────────────────────────────────────────────────────────
const MapBtn = ({ icon, onClick, label }) => (
    <button onClick={onClick} title={label}
        className="w-11 h-11 bg-white rounded-2xl shadow-lg flex items-center justify-center hover:bg-gray-50 hover:shadow-xl transition-all active:scale-95">
        <span className="text-gray-700">{icon}</span>
    </button>
);

// ── Zone Detail Sheet ─────────────────────────────────────────────────────────
const ZoneDetailSheet = ({ zone, zoneColor, onClose, onEdit }) => {
    const isActive = zone.status == 1 || zone.status === 'active';
    const radius = zone.radiusInKm || parseFloat(zone.radiuskm) || 0;
    const lat = zone.latitude || parseFloat(zone.lat) || 0;
    const lng = zone.longitude || parseFloat(zone.long) || 0;

    return (
        <div>
            <div className="flex items-start gap-4 mb-5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md" style={{ backgroundColor: `${zoneColor}20` }}>
                    <Building2 size={22} style={{ color: zoneColor }} />
                </div>
                <div className="flex-1">
                    <h3 className="text-base font-extrabold text-gray-900">{zone.name || 'Unnamed Zone'}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className={`text-xs font-bold ${isActive ? 'text-green-600' : 'text-red-500'}`}>{isActive ? 'Active' : 'Inactive'}</span>
                        <span className="text-xs text-gray-400">• Zone ID: #{zone.id}</span>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100"><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
                <DetailCard icon={<Radar size={18} />} label="Coverage Radius" value={`${radius.toFixed(1)} km`} color={zoneColor} />
                <DetailCard icon={<Pin size={18} />} label="Pincode" value={zone.pincode || 'N/A'} color="#6366F1" />
            </div>
            <DetailCard icon={<MapPin size={18} />} label="Full Address" value={zone.address || 'No address provided'} color="#EF4444" fullWidth />
            <div className="mt-4 p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                <span className="text-xs text-gray-500 font-mono">{lat.toFixed(5)}, {lng.toFixed(5)}</span>
                <span className="text-xs text-gray-400">Lat, Lng</span>
            </div>
            <button onClick={onEdit}
                className="w-full mt-5 py-3 rounded-2xl text-white text-sm font-extrabold flex items-center justify-center gap-2.5 shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
                style={{ backgroundColor: zoneColor }}>
                <Edit3 size={18} />Edit Zone
            </button>
        </div>
    );
};

const DetailCard = ({ icon, label, value, color, fullWidth }) => (
    <div className={`bg-gray-50 rounded-2xl p-3.5 flex items-start gap-3 border border-gray-100 ${fullWidth ? 'col-span-2' : ''}`}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}15` }}>
            <span style={{ color }}>{icon}</span>
        </div>
        <div className="min-w-0">
            <p className="text-xs text-gray-400 font-medium">{label}</p>
            <p className="text-sm font-bold text-gray-800 mt-0.5 truncate">{value}</p>
        </div>
    </div>
);

// ── Hub Zone Edit Screen (Portal) ─────────────────────────────────────────────
const HubZoneEditScreen = ({ zone, cityZone, onClose, onSave }) => {
    const editMapRef = useRef(null);
    const [editMap, setEditMap] = useState(null);
    const [editMapReady, setEditMapReady] = useState(false);
    const markerRef = useRef(null);
    const hubCircleRef = useRef(null);
    const cityCircleRef = useRef(null);

    const [formData, setFormData] = useState({
        name: zone.name || '', address: zone.address || '', pincode: zone.pincode || '',
        radiusKm: (zone.radiusInKm || parseFloat(zone.radiuskm) || 1).toString(),
        lat: (zone.latitude || parseFloat(zone.lat) || 26.8467).toString(),
        lng: (zone.longitude || parseFloat(zone.long) || 80.9462).toString(),
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [isOutside, setIsOutside] = useState(false);
    const [showOutsideBanner, setShowOutsideBanner] = useState(false);

    const cityCenter = cityZone?.lat ? { lat: parseFloat(cityZone.lat), lng: parseFloat(cityZone.long) } : { lat: parseFloat(formData.lat), lng: parseFloat(formData.lng) };
    const cityRadiusKm = parseFloat(cityZone?.radiuskm) || 10;
    const isInsideCity = (pos) => !cityZone?.lat || getDistanceFromLatLonInKm(pos.lat, pos.lng, cityCenter.lat, cityCenter.lng) <= cityRadiusKm;

    useEffect(() => { const c = setInterval(() => { if (window.google?.maps) { setEditMapReady(true); clearInterval(c); } }, 200); return () => clearInterval(c); }, []);

    useEffect(() => {
        if (!editMapReady || !editMapRef.current || editMap) return;
        const pos = { lat: parseFloat(formData.lat), lng: parseFloat(formData.lng) };
        const gMap = new window.google.maps.Map(editMapRef.current, { center: pos, zoom: 14, zoomControl: false, mapTypeControl: false, streetViewControl: false, fullscreenControl: false });

        if (cityZone?.lat) cityCircleRef.current = new window.google.maps.Circle({ map: gMap, center: cityCenter, radius: cityRadiusKm * 1000, fillColor: '#3B82F6', fillOpacity: 0.05, strokeColor: '#3B82F6', strokeOpacity: 0.5, strokeWeight: 2.5 });

        hubCircleRef.current = new window.google.maps.Circle({ map: gMap, center: pos, radius: parseFloat(formData.radiusKm) * 1000, fillColor: '#14532D', fillOpacity: 0.12, strokeColor: '#14532D', strokeOpacity: 0.7, strokeWeight: 2.5 });

        markerRef.current = new window.google.maps.Marker({ map: gMap, position: pos, draggable: true, animation: window.google.maps.Animation.DROP, icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 12, fillColor: '#14532D', fillOpacity: 1, strokeColor: '#fff', strokeWeight: 3 } });

        markerRef.current.addListener('drag', (e) => {
            const lat = e.latLng.lat(), lng = e.latLng.lng(), outside = !isInsideCity({ lat, lng }), c = outside ? '#EF4444' : '#14532D';
            markerRef.current?.setIcon({ path: window.google.maps.SymbolPath.CIRCLE, scale: 12, fillColor: c, fillOpacity: 1, strokeColor: '#fff', strokeWeight: 3 });
            hubCircleRef.current?.setOptions({ fillColor: c, strokeColor: c });
            if (cityCircleRef.current) cityCircleRef.current.setOptions({ strokeColor: outside ? '#EF4444' : '#3B82F6', strokeWeight: outside ? 3 : 2.5 });
        });
        markerRef.current.addListener('dragend', (e) => onLocationPicked(e.latLng.lat(), e.latLng.lng()));
        gMap.addListener('click', (e) => { markerRef.current?.setPosition(e.latLng); onLocationPicked(e.latLng.lat(), e.latLng.lng()); });
        setEditMap(gMap);
    }, [editMapReady]);

    useEffect(() => { if (hubCircleRef.current) hubCircleRef.current.setRadius(parseFloat(formData.radiusKm) * 1000); }, [formData.radiusKm]);

    const onLocationPicked = (lat, lng) => {
        const outside = cityZone?.lat ? !isInsideCity({ lat, lng }) : false;
        setIsOutside(outside); setShowOutsideBanner(outside);
        setFormData(p => ({ ...p, lat: lat.toFixed(6), lng: lng.toFixed(6) }));
        editMap?.panTo({ lat, lng });
        if (outside) toast.error('Location is outside the city zone!');
    };

    const resetToCenter = () => {
        const lat = cityCenter.lat, lng = cityCenter.lng;
        setIsOutside(false); setShowOutsideBanner(false);
        setFormData(p => ({ ...p, lat: lat.toFixed(6), lng: lng.toFixed(6) }));
        markerRef.current?.setPosition({ lat, lng }); editMap?.panTo({ lat, lng });
        toast.success('Location reset to city zone center.');
    };

    const handleSearch = async (q) => {
        setSearchQuery(q);
        if (q.trim().length < 2) { setSuggestions([]); return; }
        setSearchLoading(true);
        try { const r = await apiClient.get(`place_autocomplete?query=${encodeURIComponent(q)}`); setSuggestions(r.data?.data || []); } catch { setSuggestions([]); } finally { setSearchLoading(false); }
    };

    const selectPlace = async (placeId) => {
        setSuggestions([]); setSearchLoading(true);
        try {
            const r = await apiClient.get(`place_details?place_id=${placeId}`), d = r.data?.data || r.data;
            if (d?.lat && d?.lng) {
                const lat = parseFloat(d.lat), lng = parseFloat(d.lng);
                setFormData(p => ({ ...p, lat: lat.toFixed(6), lng: lng.toFixed(6), address: d.address || d.formatted_address || p.address, pincode: d.pincode || p.pincode }));
                setSearchQuery(d.address || d.formatted_address || '');
                markerRef.current?.setPosition({ lat, lng }); onLocationPicked(lat, lng);
                editMap?.panTo({ lat, lng }); editMap?.setZoom(15);
            }
        } catch { toast.error('Failed to load place details'); } finally { setSearchLoading(false); }
    };

    const handleSubmit = async () => {
        console.log('handleSubmit called');

        if (!formData.name.trim()) {
            toast.error('Zone name required');
            return;
        }
        if (isOutside && cityZone?.lat) {
            toast.error('Location outside city zone');
            return;
        }

        setIsSubmitting(true);

        const payload = {
            id: zone.id.toString(),
            cityzoneid: zone.cityzoneid?.toString() || cityZone?.id?.toString() || '1',
            name: formData.name.trim(),
            address: formData.address.trim(),
            pincode: String(formData.pincode || '').trim(),
            radiuskm: formData.radiusKm,
            lat: formData.lat,
            long: formData.lng
        };

        console.log('📤 Payload:', payload);

        try {
            const r = await apiClient.post('hubzone/update', payload);
            console.log('📥 Status:', r.status);
            console.log('📥 Data:', r.data);

            if (r.status === 200 || r.status === 201) {
                toast.success('Zone updated successfully!');
                onSave();
            } else {
                toast.error(r.data?.message || 'Update failed');
            }
        } catch (err) {
            console.error('❌ Error:', err);
            console.error('❌ Response:', err?.response?.data);
            toast.error(err?.response?.data?.message || 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    return ReactDOM.createPortal(
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 99999 }} className="bg-gray-50 flex flex-col">
            <div className="bg-white border-b px-5 py-4 flex items-center gap-4 flex-shrink-0 shadow-sm">
                <button onClick={onClose} className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200"><ArrowLeft size={20} className="text-gray-700" /></button>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center shadow-sm"><Edit3 size={18} className="text-green-800" /></div>
                <div className="flex-1"><h2 className="text-lg font-extrabold text-gray-900">Edit Hub Zone</h2><p className="text-xs text-gray-500">{zone.name}</p></div>
                <span className="px-3 py-1.5 bg-green-50 text-green-800 rounded-full text-xs font-bold border border-green-100">ID #{zone.id}</span>
            </div>
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                <div className="lg:w-[55%] h-64 lg:h-full relative flex-shrink-0 border-b lg:border-b-0 lg:border-r border-gray-200">
                    <div ref={editMapRef} className="w-full h-full absolute inset-0" />
                    {showOutsideBanner && <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2.5 text-xs font-bold flex items-center gap-2 z-10 shadow-lg"><AlertTriangle size={16} /> Pin is OUTSIDE the city zone boundary!</div>}
                    <div className={`absolute ${showOutsideBanner ? 'top-12' : 'top-3'} left-3 z-10`}>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg bg-white/95 backdrop-blur-sm border ${isOutside ? 'text-red-600 border-red-200' : 'text-green-700 border-green-200'}`}>{isOutside ? '🔴 Outside city zone' : '✅ Tap or drag pin'}</span>
                    </div>
                    {cityZone?.lat && <div className="absolute bottom-3 left-3 z-10"><span className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white/95 shadow border border-blue-200 text-blue-700">● City boundary • {cityRadiusKm} km</span></div>}
                </div>
                <div className="flex-1 overflow-y-auto p-5 lg:p-6 space-y-5">
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Search Location</label>
                        <div className="relative">
                            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="text" value={searchQuery} onChange={e => handleSearch(e.target.value)} placeholder="Search for a place or address..." disabled={searchLoading}
                                className="w-full h-12 pl-10 pr-10 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition-all bg-gray-50" />
                            {searchLoading && <Loader size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin text-green-800" />}
                            {searchQuery && !searchLoading && <button onClick={() => { setSearchQuery(''); setSuggestions([]); }} className="absolute right-3.5 top-1/2 -translate-y-1/2"><X size={16} className="text-gray-400" /></button>}
                            {suggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border shadow-2xl z-30 max-h-64 overflow-y-auto">
                                    {suggestions.map((s, i) => (
                                        <button key={i} onClick={() => selectPlace(s.place_id)} className="w-full px-4 py-3.5 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-50 last:border-0">
                                            <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0"><MapPin size={16} className="text-green-700" /></div>
                                            <div className="min-w-0"><p className="text-sm font-bold text-gray-800 truncate">{s.main_text || s.description}</p>{s.secondary_text && <p className="text-xs text-gray-400 truncate mt-0.5">{s.secondary_text}</p>}</div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    {showOutsideBanner && cityZone?.lat && (
                        <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0"><AlertTriangle size={18} className="text-red-600" /></div>
                            <div className="flex-1"><p className="text-sm font-extrabold text-red-700">Outside City Zone</p><p className="text-xs text-red-600 mt-1">Move the pin inside the blue circle to save changes.</p></div>
                            <button onClick={resetToCenter} className="px-3.5 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors flex-shrink-0">Reset</button>
                        </div>
                    )}
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Coordinates & Radius</label>
                        <div className="grid grid-cols-3 gap-3">
                            <EF label="Latitude" v={formData.lat} onChange={v => setFormData(p => ({ ...p, lat: v }))} />
                            <EF label="Longitude" v={formData.lng} onChange={v => setFormData(p => ({ ...p, lng: v }))} />
                            <EF label="Radius (km)" v={formData.radiusKm} onChange={v => setFormData(p => ({ ...p, radiusKm: v }))} />
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Zone Details</label>
                        <div className="space-y-3">
                            <EF label="Zone Name" v={formData.name} onChange={v => setFormData(p => ({ ...p, name: v }))} />
                            <EF label="Address" v={formData.address} onChange={v => setFormData(p => ({ ...p, address: v }))} />
                            <EF label="Pincode" v={formData.pincode} onChange={v => setFormData(p => ({ ...p, pincode: v }))} maxLength={6} />
                        </div>
                    </div>
                    <button onClick={() => {
                        console.log('BUTTON CLICKED');
                        handleSubmit();
                    }} disabled={isSubmitting || (isOutside && cityZone?.lat)}
                        className={`w-full py-3.5 rounded-2xl text-white text-sm font-extrabold flex items-center justify-center gap-2.5 shadow-lg transition-all active:scale-[0.98] ${isOutside && cityZone?.lat ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-green-700 to-green-800 hover:from-green-800 hover:to-green-900'} disabled:opacity-60`}>
                        {isSubmitting ? <Loader size={20} className="animate-spin" /> : <Save size={20} />}
                        {isOutside && cityZone?.lat ? '⚠ Cannot Save — Outside City Zone' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </motion.div>,
        document.body
    );
};

const EF = ({ label, v, onChange, maxLength }) => (
    <div>
        <label className="text-xs text-gray-400 font-medium mb-1.5 block">{label}</label>
        <input type="text" value={v} onChange={e => onChange(e.target.value)} maxLength={maxLength}
            className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 focus:bg-white transition-all" />
    </div>
);