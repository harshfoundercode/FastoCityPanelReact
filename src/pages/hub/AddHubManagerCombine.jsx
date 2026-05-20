// // src/pages/hubs/CreateHubWithManager.jsx
// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { createPortal } from "react-dom";
// import {
//   User, Phone, Mail, MapPin, CreditCard, FileText, Lock, Eye, EyeOff,
//   Camera, Image, CheckCircle, XCircle, Building2, ChevronDown, Loader,
//   BadgeCheck, Check, ArrowRight, ArrowLeft, Store, Pin, Info, Radar,
// } from 'lucide-react';
// import toast from 'react-hot-toast';
// import { ENDPOINTS } from "../../config/ApiConfig";
// import { HubService, HubManagerService, UploadService } from '../../hooks/AddHubMangerViewModel';

// // ── Constants ────────────────────────────────────────────────────────────────
// const BASE_URL = ENDPOINTS.API_URL;
// const MAP_KEY = ENDPOINTS.MAP_KEY;

// const Colors = {
//     primaryGreen: '#14532D', primaryLightGreen: '#4ADE80',
//     primaryExtraLightGreen: '#F0FDF4', textBlack: '#1F2937',
//     textGrey1: '#6B7280', containerGrey2: '#F3F4F6', white: '#FFFFFF',
// };

// const getToken = () => localStorage.getItem("token") || "";
// const authHeaders = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` });

// // ── API Calls ────────────────────────────────────────────────────────────────
// async function fetchCityZoneList() {
//     const res = await fetch(`${BASE_URL}cityzone_list`, { headers: authHeaders() });
//     if (!res.ok) throw new Error("Failed to fetch city zones");
//     return res.json();
// }

// async function fetchHubZoneList(cityzoneid) {
//     const res = await fetch(`${BASE_URL}hubzone_list`, {
//         method: "POST", headers: { ...authHeaders(), "Content-Type": "application/json" },
//         body: JSON.stringify({ cityzoneid }),
//     });
//     if (!res.ok) throw new Error("Failed to fetch hub zones");
//     return res.json();
// }

// async function createHubZone(payload) {
//     const res = await fetch(`${BASE_URL}hubzone/create`, { method: "POST", headers: authHeaders(), body: JSON.stringify(payload) });
//     const data = await res.json();
//     if (res.ok) { toast.success(data?.message || 'Hub created successfully'); return { success: true, data }; }
//     toast.error(data?.message || 'Failed to create hub');
//     return { success: false, message: data?.message };
// }

// async function fetchPlaceAutocomplete(query) {
//     const res = await fetch(`${BASE_URL}place_autocomplete?query=${encodeURIComponent(query)}`, { headers: authHeaders() });
//     if (!res.ok) throw new Error("Autocomplete failed");
//     return res.json();
// }

// async function fetchPlaceDetails(placeId) {
//     const res = await fetch(`${BASE_URL}place_details?place_id=${encodeURIComponent(placeId)}`, { headers: authHeaders() });
//     if (!res.ok) throw new Error("Place details failed");
//     return res.json();
// }

// async function reverseGeocode(lat, lng) {
//     const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${MAP_KEY}`);
//     const json = await res.json();
//     const results = json.results || [];
//     if (!results.length) return { street: "", city: "", state: "", pincode: "", fullAddress: "" };
//     let best = results.find(r => (r.types || []).some(t => t === "street_address" || t === "premise")) || results.find(r => (r.types || []).includes("locality")) || results[0];
//     const comps = best.address_components || [];
//     let sn = "", rt = "", sl = "", lc = "", aa = "", pc = "";
//     comps.forEach(c => {
//         const t = c.types || [];
//         if (t.includes("street_number")) sn = c.long_name;
//         if (t.includes("route")) rt = c.long_name;
//         if (t.includes("sublocality") || t.includes("sublocality_level_1")) sl = c.long_name;
//         if (t.includes("locality")) lc = c.long_name;
//         if (t.includes("administrative_area_level_1")) aa = c.long_name;
//         if (t.includes("postal_code")) pc = c.long_name;
//     });
//     if (!pc) { for (const r of results) { for (const c of (r.address_components || [])) { if ((c.types || []).includes("postal_code")) { pc = c.long_name; break; } } if (pc) break; } }
//     return { street: [sn, rt].filter(Boolean).join(" "), city: [sl, lc].filter(Boolean).join(", "), state: aa, pincode: pc, fullAddress: [[sn, rt].filter(Boolean).join(" "), [sl, lc].filter(Boolean).join(", "), aa, pc].filter(Boolean).join(", ") };
// }

// function distanceKm(a, b) { const R = 6371; const dLat = ((b.lat - a.lat) * Math.PI) / 180; const dLon = ((b.lng - a.lng) * Math.PI) / 180; const s = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLon / 2) ** 2; return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s)); }
// function clampToCity(point, cityCenter, cityRadiusKm) { const dist = distanceKm(point, cityCenter); if (dist <= cityRadiusKm) return point; const ratio = cityRadiusKm / dist; return { lat: cityCenter.lat + (point.lat - cityCenter.lat) * ratio, lng: cityCenter.lng + (point.lng - cityCenter.lng) * ratio }; }

// // ── Icons ────────────────────────────────────────────────────────────────────
// const Icon = ({ d, size = 16, color = "currentColor" }) => (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d={d} /></svg>
// );

// const IC = {
//     info: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
//     map: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
//     pin: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z",
//     store: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
//     check: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
//     block: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636",
//     close: "M6 18L18 6M6 6l12 12", search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
//     warn: "M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", fit: "M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4",
//     gps: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z",
//     radar: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
//     addPin: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
// };

// const Spinner = ({ size = 16 }) => (<div style={{ width: size, height: size, border: `2px solid ${Colors.primaryExtraLightGreen}`, borderTopColor: Colors.primaryGreen, borderRadius: "50%", animation: "spin 0.7s linear infinite", flexShrink: 0 }} />);

// // ── Map Picker Popup (same as before) ────────────────────────────────────────
// function MapPickerPopup({ cityZone, existingHubs, onClose, onConfirm, snackShow }) {
//     const mapDivRef = useRef(null); const gmapRef = useRef(null);
//     const hubMarkerRef = useRef(null); const hubCircleRef = useRef(null); const cityCircleRef = useRef(null);
//     const isSelectingRef = useRef(false); const debounceRef = useRef(null); const mapInitRef = useRef(false);
//     const cityCenter = { lat: parseFloat(cityZone.lat), lng: parseFloat(cityZone.long) };
//     const cityRadiusKm = parseFloat(cityZone.radiuskm) || 10;
//     const [selLoc, setSelLoc] = useState({ ...cityCenter });
//     const [hubRadius, setHubRadius] = useState(1.0);
//     const [radiusInput, setRadiusInput] = useState("1.0");
//     const [isOutside, setIsOutside] = useState(false);
//     const [isRadiusExceeding, setIsRadiusExceeding] = useState(false);
//     const [searchResultOutside, setSearchResultOutside] = useState(false);
//     const [outsideMsg, setOutsideMsg] = useState("");
//     const [searchQuery, setSearchQuery] = useState("");
//     const [searchResults, setSearchResults] = useState([]);
//     const [searchLoading, setSearchLoading] = useState(false);
//     const [showDropdown, setShowDropdown] = useState(false);
//     const [addrLoading, setAddrLoading] = useState(false);
//     const [addrData, setAddrData] = useState({ street: "", city: "", state: "", pincode: "", fullAddress: "" });
//     const [mapReady, setMapReady] = useState(false);
//     const isInsideCity = useCallback((p) => distanceKm(p, cityCenter) <= cityRadiusKm, []);
//     const isHubFullyInside = useCallback((c, r) => distanceKm(c, cityCenter) + r <= cityRadiusKm, []);
//     const checkOverlap = useCallback((loc, r) => existingHubs.some(z => { const zLat = parseFloat(z.lat); const zLng = parseFloat(z.long); const zR = parseFloat(z.radiuskm); if (!zLat || !zLng || !zR) return false; return distanceKm(loc, { lat: zLat, lng: zLng }) < (r + zR); }), [existingHubs]);
//     const doFetchAddress = useCallback(async (loc) => { setAddrLoading(true); try { const data = await reverseGeocode(loc.lat, loc.lng); setAddrData(data); } catch { setAddrData({ street: "", city: "", state: "", pincode: "", fullAddress: "" }); } finally { setAddrLoading(false); } }, []);

//     useEffect(() => {
//         const initMap = () => {
//             if (mapInitRef.current || !mapDivRef.current) return; mapInitRef.current = true; const google = window.google;
//             const map = new google.maps.Map(mapDivRef.current, { center: cityCenter, zoom: 11, zoomControl: false, mapTypeControl: false, streetViewControl: false, fullscreenControl: false });
//             cityCircleRef.current = new google.maps.Circle({ map, center: cityCenter, radius: cityRadiusKm * 1000, fillColor: "#2563EB", fillOpacity: 0.06, strokeColor: "#2563EB", strokeOpacity: 0.5, strokeWeight: 2 });
//             new google.maps.Marker({ map, position: cityCenter, icon: { path: google.maps.SymbolPath.CIRCLE, scale: 7, fillColor: "#2563EB", fillOpacity: 1, strokeColor: "#fff", strokeWeight: 2 }, title: cityZone.name });
//             existingHubs.forEach(z => { const lat = parseFloat(z.lat); const lng = parseFloat(z.long); const r = parseFloat(z.radiuskm); if (!lat || !lng || !r) return; new google.maps.Circle({ map, center: { lat, lng }, radius: r * 1000, fillColor: "#F97316", fillOpacity: 0.1, strokeColor: "#F97316", strokeOpacity: 0.6, strokeWeight: 2 }); const m = new google.maps.Marker({ map, position: { lat, lng }, icon: { path: google.maps.SymbolPath.CIRCLE, scale: 6, fillColor: "#F97316", fillOpacity: 1, strokeColor: "#fff", strokeWeight: 2 }, title: z.name }); m.addListener("click", () => new google.maps.InfoWindow({ content: `<b>${z.name}</b><br>Radius: ${r} km` }).open(map, m)); });
//             hubCircleRef.current = new google.maps.Circle({ map, center: cityCenter, radius: 1000, fillColor: Colors.primaryGreen, fillOpacity: 0.12, strokeColor: Colors.primaryGreen, strokeOpacity: 0.7, strokeWeight: 2 });
//             hubMarkerRef.current = new google.maps.Marker({ map, position: cityCenter, draggable: true, icon: { path: google.maps.SymbolPath.CIRCLE, scale: 10, fillColor: Colors.primaryGreen, fillOpacity: 1, strokeColor: "#fff", strokeWeight: 3 } });
//             hubMarkerRef.current.addListener("dragend", (e) => { if (isSelectingRef.current) return; let loc = { lat: e.latLng.lat(), lng: e.latLng.lng() }; if (!isInsideCity(loc)) { snackShow("❌ You can only drag inside the blue zone", "error"); loc = clampToCity(loc, cityCenter, cityRadiusKm); hubMarkerRef.current.setPosition({ lat: loc.lat, lng: loc.lng }); } if (checkOverlap(loc, hubRadius)) { snackShow("❌ Overlapping another hub zone", "error"); hubMarkerRef.current.setPosition({ lat: cityCenter.lat, lng: cityCenter.lng }); return; } setSelLoc({ ...loc }); setIsOutside(!isInsideCity(loc)); doFetchAddress(loc); });
//             map.addListener("click", (e) => { if (isSelectingRef.current) return; let loc = { lat: e.latLng.lat(), lng: e.latLng.lng() }; if (checkOverlap(loc, hubRadius)) { snackShow("Overlaps existing zone!", "error"); return; } if (!isInsideCity(loc)) { snackShow("Outside zone!", "warning"); loc = clampToCity(loc, cityCenter, cityRadiusKm); } hubMarkerRef.current?.setPosition({ lat: loc.lat, lng: loc.lng }); hubCircleRef.current?.setCenter({ lat: loc.lat, lng: loc.lng }); setSelLoc({ ...loc }); setIsOutside(!isInsideCity(loc)); setSearchResultOutside(false); doFetchAddress(loc); });
//             gmapRef.current = map; setMapReady(true); doFetchAddress(cityCenter);
//         };
//         if (window.google?.maps) { initMap(); return; }
//         const existingScript = document.getElementById("gmap-script");
//         if (existingScript) { const prev = window._onGmapReady; window._onGmapReady = () => { prev?.(); initMap(); }; return; }
//         window._onGmapReady = initMap;
//         const s = document.createElement("script"); s.id = "gmap-script"; s.src = `https://maps.googleapis.com/maps/api/js?key=${MAP_KEY}&callback=_onGmapReady`; s.async = true; document.head.appendChild(s);
//     }, []);

//     useEffect(() => { if (!mapReady || !window.google) return; const google = window.google; const invalid = isOutside || isRadiusExceeding; const color = invalid ? "#ef4444" : Colors.primaryGreen; hubMarkerRef.current?.setPosition({ lat: selLoc.lat, lng: selLoc.lng }); hubMarkerRef.current?.setIcon({ path: google.maps.SymbolPath.CIRCLE, scale: 10, fillColor: color, fillOpacity: 1, strokeColor: "#fff", strokeWeight: 3 }); if (hubCircleRef.current) { hubCircleRef.current.setCenter({ lat: selLoc.lat, lng: selLoc.lng }); hubCircleRef.current.setRadius(hubRadius * 1000); hubCircleRef.current.setOptions({ fillColor: color, strokeColor: color }); } cityCircleRef.current?.setOptions({ strokeColor: isOutside ? "#ef4444" : "#2563EB" }); }, [selLoc, hubRadius, isOutside, isRadiusExceeding, mapReady]);

//     const confirm = () => { if (isOutside || isRadiusExceeding) { snackShow("Fix errors before confirming.", "error"); return; } if (checkOverlap(selLoc, hubRadius)) { snackShow("Hub overlaps with an existing zone!", "error"); return; } onConfirm({ lat: selLoc.lat, lng: selLoc.lng, address: addrData.fullAddress, pincode: addrData.pincode, radius: hubRadius }); };
//     const blocked = isOutside || isRadiusExceeding; const G = Colors.primaryGreen;

//     return (
//         <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 999999, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
//             <div style={{ width: "100%", maxWidth: "1000px", height: "92vh", background: Colors.containerGrey2, borderRadius: 20, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.25)" }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", background: Colors.white, borderBottom: "1px solid #E8ECF0", flexShrink: 0 }}>
//                     <div style={{ width: 36, height: 36, borderRadius: 10, background: Colors.primaryExtraLightGreen, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon d={IC.map} size={18} color={G} /></div>
//                     <div style={{ flex: 1 }}><p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: Colors.textBlack }}>Select Hub Location</p><p style={{ margin: 0, fontSize: 11, color: Colors.textGrey1 }}>City Zone: {cityZone.name} • Radius: {cityRadiusKm.toFixed(1)} km</p></div>
//                     <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: 10, background: Colors.containerGrey2, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon d={IC.close} size={16} color={Colors.textBlack} /></button>
//                 </div>
//                 <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
//                     <div style={{ flex: 6, position: "relative" }}><div ref={mapDivRef} style={{ width: "100%", height: "100%" }} /></div>
//                     <div style={{ width: 1, background: "#E8ECF0", flexShrink: 0 }} />
//                     <div style={{ width: 310, background: Colors.white, overflowY: "auto", flexShrink: 0, padding: 20 }}>
//                         <div style={{ padding: "10px 12px", borderRadius: 12, background: Colors.primaryExtraLightGreen, border: `1px solid ${Colors.primaryLightGreen}40`, display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
//                             <Icon d={IC.gps} size={14} color={G} /><div><p style={{ margin: 0, fontSize: 9, fontWeight: 800, color: Colors.textGrey1 }}>COORDINATES</p><p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: Colors.textBlack }}>{selLoc.lat.toFixed(6)}, {selLoc.lng.toFixed(6)}</p></div>
//                         </div>
//                         <p style={{ fontSize: 12, fontWeight: 700, color: Colors.textBlack, marginBottom: 8 }}>Hub Coverage Radius</p>
//                         <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
//                             <input type="range" min={0.5} max={cityRadiusKm} step={0.5} value={hubRadius} onChange={e => { const val = parseFloat(e.target.value); if (!checkOverlap(selLoc, val)) { setHubRadius(val); setRadiusInput(val.toFixed(1)); setIsRadiusExceeding(!isHubFullyInside(selLoc, val)); } }} style={{ flex: 1, accentColor: G, cursor: "pointer" }} />
//                             <input type="number" value={radiusInput} onChange={e => { const v = parseFloat(e.target.value); if (!isNaN(v) && v >= 0.5 && v <= cityRadiusKm && !checkOverlap(selLoc, v)) { setHubRadius(v); setRadiusInput(e.target.value); setIsRadiusExceeding(!isHubFullyInside(selLoc, v)); } }} style={{ width: 60, height: 32, borderRadius: 8, border: "1px solid #ddd", textAlign: "center", fontSize: 13, fontWeight: 700, color: G }} />
//                             <span style={{ fontSize: 10, color: Colors.textGrey1 }}>km</span>
//                         </div>
//                         <button onClick={confirm} disabled={blocked} style={{ width: "100%", height: 48, borderRadius: 14, border: "none", background: blocked ? "#ef4444" : G, color: Colors.white, fontSize: 14, fontWeight: 700, cursor: blocked ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><Icon d={blocked ? IC.block : IC.check} size={18} color={Colors.white} />{blocked ? "Fix Errors" : "Confirm Location"}</button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// // ── Form Input Component ─────────────────────────────────────────────────────
// const FormInput = ({ label, placeholder, icon, value, onChange, touched, isValid, error, type = 'text', maxLength, rightIcon }) => {
//     const getBorderColor = () => { if (!touched) return 'border-gray-200'; if (error) return 'border-red-300'; if (isValid) return 'border-green-300'; return 'border-gray-200'; };
//     const getBgColor = () => { if (!touched) return 'bg-gray-50'; if (error) return 'bg-red-50'; if (isValid) return 'bg-green-50'; return 'bg-gray-50'; };
//     return (
//         <div>
//             <label className="text-xs text-gray-500 font-medium mb-1.5 block">{label}</label>
//             <div className="relative">
//                 <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
//                 <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength}
//                     className={`w-full h-12 rounded-xl border pl-10 pr-10 text-sm font-semibold outline-none transition-all focus:ring-2 focus:ring-green-200 ${getBorderColor()} ${getBgColor()} text-gray-900 placeholder-gray-400`} />
//                 <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
//                     {touched && (isValid ? <CheckCircle size={18} className="text-green-600" /> : error ? <XCircle size={18} className="text-red-500" /> : null)}
//                     {rightIcon}
//                 </div>
//             </div>
//             {touched && error && <p className="text-red-500 text-xs mt-1">{error}</p>}
//         </div>
//     );
// };

// // ── MAIN COMPONENT - STEPPER ─────────────────────────────────────────────────
// export default function CreateHubWithManager() {
//     const [step, setStep] = useState(1); // 1 = Create Hub, 2 = Add Manager
    
//     // Step 1: Create Hub
//     const [hubName, setHubName] = useState("");
//     const [locationPicked, setLocationPicked] = useState(false);
//     const [locationData, setLocationData] = useState(null);
//     const [hubErrors, setHubErrors] = useState({});
//     const [submittingHub, setSubmittingHub] = useState(false);
//     const [showMap, setShowMap] = useState(false);
//     const [cityZone, setCityZone] = useState(null);
//     const [existingHubs, setExistingHubs] = useState([]);
//     const [dataLoading, setDataLoading] = useState(false);
//     const [createdHubId, setCreatedHubId] = useState(null);
//     const [createdHubName, setCreatedHubName] = useState("");

//     // Step 2: Add Manager
//     const [hubZones, setHubZones] = useState([]);
//     const [selectedHubZoneId, setSelectedHubZoneId] = useState('');
//     const [isLoadingZones, setIsLoadingZones] = useState(false);
//     const [managerImage, setManagerImage] = useState(null);
//     const [managerImagePreview, setManagerImagePreview] = useState(null);
//     const [formData, setFormData] = useState({ name: '', phone: '', address: '', adharno: '', panno: '', email: '', password: '' });
//     const [managerErrors, setManagerErrors] = useState({});
//     const [managerTouched, setManagerTouched] = useState({});
//     const [showPassword, setShowPassword] = useState(false);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [showImagePicker, setShowImagePicker] = useState(false);

//     const getCityZoneId = () => { try { for (const key of ["profile", "user", "profileData", "userData"]) { const raw = localStorage.getItem(key); if (!raw) continue; const parsed = JSON.parse(raw); const id = parsed?.data?.cityzoneid ?? parsed?.cityzoneid ?? parsed?.data?.data?.cityzoneid; if (id != null) return id.toString(); } } catch { } return cityZone?.id?.toString() || null; };

//     const loadMapData = useCallback(async () => { if (cityZone) return cityZone; setDataLoading(true); try { const czRes = await fetchCityZoneList(); const czList = czRes?.data || []; const activeZone = czList.find(z => parseInt(z.status) === 1) || czList[0]; if (!activeZone) { toast.error("No active city zone found."); return null; } setCityZone(activeZone); const hzRes = await fetchHubZoneList(activeZone.id); setExistingHubs(hzRes?.data || []); return activeZone; } catch { toast.error("Failed to load city zone data."); return null; } finally { setDataLoading(false); } }, [cityZone]);

//     useEffect(() => { loadMapData(); loadHubZonesForManager(); }, []);

//     const loadHubZonesForManager = async () => {
//         setIsLoadingZones(true);
//         try {
//             const userData = JSON.parse(localStorage.getItem("user") || "{}");
//             const cityzoneid = userData?.cityzoneid || userData?.data?.cityzoneid || userData?.data?.data?.cityzoneid;
//             if (!cityzoneid) return;
//             const result = await HubService.getHubZoneList(cityzoneid);
//             if (result.success) setHubZones(result.data || []);
//         } catch { } finally { setIsLoadingZones(false); }
//     };

//     const openMap = async () => { const zone = cityZone || await loadMapData(); if (zone) setShowMap(true); };
//     const handleConfirm = (data) => { setLocationData(data); setLocationPicked(true); setShowMap(false); setHubErrors(e => ({ ...e, location: undefined })); };

//     // Step 1 Submit
//     const handleCreateHub = async () => {
//         const e = {};
//         if (!hubName.trim()) e.hubName = "Hub name is required";
//         if (!locationPicked || !locationData) e.location = "Please pick a location on the map";
//         setHubErrors(e);
//         if (Object.keys(e).length > 0) return;
//         const cityzoneid = getCityZoneId();
//         if (!cityzoneid) { toast.error("City zone ID not found."); return; }
//         setSubmittingHub(true);
//         try {
//             const payload = { cityzoneid, name: hubName.trim(), address: locationData.address || "", pincode: locationData.pincode || "", radiuskm: locationData.radius.toString(), lat: locationData.lat.toString(), long: locationData.lng.toString() };
//             const result = await createHubZone(payload);
//             if (result.success) {
//                 const hubId = result.data?.data?.id || result.data?.id || Date.now();
//                 setCreatedHubId(hubId);
//                 setCreatedHubName(hubName.trim());
//                 setSelectedHubZoneId(String(hubId));
//                 toast.success("Hub created! Now add a manager.");
//                 setStep(2);
//             }
//         } catch { toast.error("Failed to create hub."); } finally { setSubmittingHub(false); }
//     };

//     // Step 2 handlers
//     const handleManagerChange = (field, value) => {
//         let v = value;
//         if (field === 'phone') v = value.replace(/\D/g, '').slice(0, 10);
//         else if (field === 'adharno') v = value.replace(/\D/g, '').slice(0, 12);
//         else if (field === 'panno') v = value.toUpperCase().slice(0, 10);
//         setFormData(prev => ({ ...prev, [field]: v }));
//         setManagerTouched(prev => ({ ...prev, [field]: true }));
//         if (managerErrors[field]) setManagerErrors(prev => ({ ...prev, [field]: '' }));
//     };

//     const handleImagePick = (e) => { const file = e.target.files?.[0]; if (file) { if (file.size > 5 * 1024 * 1024) { toast.error('Image too large'); return; } setManagerImage(file); setManagerImagePreview(URL.createObjectURL(file)); setShowImagePicker(false); } };

//     const validators = { name: (v) => v.trim().length >= 2, phone: (v) => v.replace(/\D/g, '').length === 10, address: (v) => v.trim().length >= 5, adharno: (v) => v.replace(/\s/g, '').length === 12, panno: (v) => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v), email: (v) => /^[\w.-]+@[\w.-]+\.\w{2,}$/.test(v), password: (v) => v.length >= 6, hub: (v) => v !== '' };

//     const getErrMsg = (f) => ({ name: 'Name required (min 2 chars)', phone: 'Valid 10-digit number', address: 'Address required', adharno: 'Valid 12-digit Aadhaar', panno: 'Valid PAN (ABCDE1234F)', email: 'Valid email required', password: 'Min 6 characters', hub: 'Select a hub' }[f] || 'Required');

//     const isManagerValid = (f) => managerTouched[f] && validators[f]?.(formData[f] || '');

//     const handleCreateManager = async () => {
//         const allTouched = {}; Object.keys(validators).forEach(f => allTouched[f] = true); setManagerTouched(allTouched);
//         const newErrors = {}; const allFields = { ...formData, hub: selectedHubZoneId };
//         Object.keys(validators).forEach(f => { if (!validators[f](allFields[f] || '')) newErrors[f] = getErrMsg(f); });
//         setManagerErrors(newErrors);
//         if (Object.keys(newErrors).length > 0) { toast.error('Fix errors'); return; }
//         setIsSubmitting(true);
//         try {
//             let imageUrl = '';
//             if (managerImage) { const r = await UploadService.uploadToCloudinary(managerImage); if (r.success) imageUrl = r.url; else { toast.error('Upload failed'); setIsSubmitting(false); return; } }
//             const payload = { hubzoneid: selectedHubZoneId, name: formData.name.trim(), phone: formData.phone, address: formData.address.trim(), adharno: formData.adharno, panno: formData.panno, img: imageUrl, email: formData.email.trim(), password: formData.password };
//             const result = await HubManagerService.createManager(payload);
//             if (result.success) { toast.success('Manager created!'); resetAll(); setStep(1); }
//             else toast.error(result.message);
//         } catch { toast.error('Failed'); } finally { setIsSubmitting(false); }
//     };

//     const resetAll = () => {
//         setHubName(""); setLocationPicked(false); setLocationData(null); setHubErrors({});
//         setFormData({ name: '', phone: '', address: '', adharno: '', panno: '', email: '', password: '' });
//         setSelectedHubZoneId(''); setManagerImage(null); setManagerImagePreview(null); setManagerTouched({}); setManagerErrors({});
//     };

//     const passwordStrength = (() => { const p = formData.password; let s = 0; if (p.length >= 6) s++; if (p.length >= 10) s++; if (/[A-Z]/.test(p)) s++; if (/[0-9]/.test(p)) s++; if (/[!@#$%^&*]/.test(p)) s++; return s; })();

//     const G = Colors.primaryGreen;

//     return (
//         <div style={{ minHeight: "100vh", fontFamily: "system-ui, sans-serif", background: Colors.containerGrey2 }}>
//             <div style={{ padding: "20px 20px 0" }}>
//                 {/* Header with Stepper */}
//                 <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
//                     <div>
//                         <h1 style={{ fontSize: 24, fontWeight: 800, color: Colors.textBlack, margin: 0 }}>
//                             {step === 1 ? 'Create Hub' : 'Add Hub Manager'}
//                         </h1>
//                         <p style={{ fontSize: 14, color: Colors.textGrey1, margin: "4px 0 0" }}>
//                             {step === 1 ? 'Step 1: Create a new delivery hub' : 'Step 2: Assign a manager to the hub'}
//                         </p>
//                     </div>
//                 </div>

//                 {/* Stepper Indicator */}
//                 <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 24 }}>
//                     {[1, 2].map((s) => (
//                         <React.Fragment key={s}>
//                             <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                                 <div style={{
//                                     width: 32, height: 32, borderRadius: "50%",
//                                     background: step >= s ? G : Colors.containerGrey2,
//                                     color: step >= s ? Colors.white : Colors.textGrey1,
//                                     display: "flex", alignItems: "center", justifyContent: "center",
//                                     fontSize: 14, fontWeight: 700, border: `2px solid ${step >= s ? G : Colors.textGrey1}30`
//                                 }}>
//                                     {step > s ? <Check size={16} /> : s}
//                                 </div>
//                                 <span style={{ fontSize: 13, fontWeight: step === s ? 700 : 400, color: step === s ? Colors.textBlack : Colors.textGrey1 }}>
//                                     {s === 1 ? 'Create Hub' : 'Add Manager'}
//                                 </span>
//                             </div>
//                             {s < 2 && <div style={{ flex: 1, height: 2, background: step > 1 ? G : Colors.containerGrey2, margin: "0 16px" }} />}
//                         </React.Fragment>
//                     ))}
//                 </div>

//                 {/* Step 1: Create Hub */}
//                 {step === 1 && (
//                     <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
//                         <div style={{ padding: 16, borderRadius: 16, background: Colors.white, border: `1px solid ${Colors.primaryGreen}20`, display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 18 }}>
//                             <div style={{ width: 36, height: 36, borderRadius: 12, background: Colors.primaryExtraLightGreen, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon d={IC.info} size={15} color={G} /></div>
//                             <p style={{ margin: 7, fontSize: 13, color: Colors.primaryGreen, lineHeight: 1.5, fontWeight: 500 }}>Fill in the hub details and pick a location on the map.</p>
//                         </div>
//                         <div style={{ marginBottom: 24 }}>
//                             <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
//                                 <div style={{ width: 32, height: 32, borderRadius: 10, background: Colors.primaryExtraLightGreen, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon d={IC.store} size={15} color={G} /></div>
//                                 <span style={{ fontSize: 15, fontWeight: 700, color: Colors.textBlack }}>Hub Information</span>
//                             </div>
//                             <div style={{ background: Colors.white, borderRadius: 16, border: `1px solid ${G}15`, padding: 20 }}>
//                                 <input value={hubName} onChange={e => { setHubName(e.target.value); if (e.target.value) setHubErrors(er => ({ ...er, hubName: undefined })); }}
//                                     placeholder="e.g. Hazratganj Hub"
//                                     style={{ width: "100%", boxSizing: "border-box", height: 48, padding: "0 16px", borderRadius: 12, border: `2px solid ${hubErrors.hubName ? "#FCA5A5" : G}20`, fontSize: 14, color: Colors.textBlack, background: Colors.containerGrey2, outline: "none" }} />
//                                 {hubErrors.hubName && <p style={{ margin: "6px 0 0", fontSize: 12, color: "#EF4444" }}>{hubErrors.hubName}</p>}
//                             </div>
//                         </div>
//                         <div style={{ marginBottom: 32 }}>
//                             <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
//                                 <div style={{ width: 32, height: 32, borderRadius: 10, background: Colors.primaryExtraLightGreen, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon d={IC.pin} size={15} color={G} /></div>
//                                 <span style={{ fontSize: 15, fontWeight: 700, color: Colors.textBlack }}>Hub Location</span>
//                             </div>
//                             <div style={{ background: Colors.white, borderRadius: 16, border: `1px solid ${G}15`, padding: 20 }}>
//                                 <button onClick={openMap} disabled={dataLoading}
//                                     style={{ width: "100%", padding: "28px 0", borderRadius: 14, cursor: dataLoading ? "wait" : "pointer", background: locationPicked ? Colors.primaryExtraLightGreen : Colors.containerGrey2, border: `2px dashed ${hubErrors.location ? "#FCA5A5" : locationPicked ? G + "40" : G + "20"}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
//                                     {dataLoading ? <Spinner size={24} /> : <div style={{ width: 48, height: 48, borderRadius: "50%", background: locationPicked ? Colors.primaryExtraLightGreen : Colors.white, display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${locationPicked ? G + "30" : G + "20"}` }}><Icon d={locationPicked ? IC.check : IC.addPin} size={22} color={locationPicked ? G : Colors.textGrey1} /></div>}
//                                     <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: locationPicked ? G : Colors.textBlack }}>{dataLoading ? "Loading…" : locationPicked ? "Location Selected ✓" : "Tap to Pick Location"}</p>
//                                 </button>
//                                 {hubErrors.location && <p style={{ margin: "8px 0 0", fontSize: 12, color: "#EF4444" }}>{hubErrors.location}</p>}
//                                 {locationPicked && locationData && (
//                                     <div style={{ marginTop: 16, padding: "12px 14px", borderRadius: 12, background: Colors.primaryExtraLightGreen, border: `1px solid ${G}20` }}>
//                                         <p style={{ fontSize: 12, fontWeight: 600, color: Colors.textBlack }}>📍 {locationData.address}</p>
//                                         <p style={{ fontSize: 11, color: Colors.textGrey1, marginTop: 4 }}>📏 {locationData.radius?.toFixed(1)} km radius</p>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                         <button onClick={handleCreateHub} disabled={submittingHub}
//                             style={{ width: "100%", height: 54, borderRadius: 14, border: "none", background: submittingHub ? G : `linear-gradient(135deg, ${G}, #166534)`, color: Colors.white, fontSize: 15, fontWeight: 700, cursor: submittingHub ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
//                             {submittingHub ? <><Spinner size={18} /> Creating Hub…</> : <>Create Hub & Continue <ArrowRight size={18} /></>}
//                         </button>
//                     </motion.div>
//                 )}

//                 {/* Step 2: Add Manager */}
//                 {step === 2 && (
//                     <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
//                         <div style={{ padding: 16, borderRadius: 16, background: Colors.primaryExtraLightGreen, border: `1px solid ${G}20`, marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
//                             <CheckCircle size={20} color={G} />
//                             <div>
//                                 <p style={{ fontSize: 14, fontWeight: 700, color: G }}>Hub Created Successfully!</p>
//                                 <p style={{ fontSize: 12, color: Colors.textGrey1 }}>{createdHubName} • ID: {createdHubId}</p>
//                             </div>
//                             <button onClick={() => setStep(1)} style={{ marginLeft: "auto", padding: "6px 12px", borderRadius: 8, background: "transparent", border: `1px solid ${G}30`, color: G, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>← Back</button>
//                         </div>
//                         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
//                             {/* Left - Hero + Hub Select */}
//                             <div>
//                                 <div style={{ background: `linear-gradient(135deg, ${G}, #166534)`, borderRadius: 16, padding: 24, textAlign: "center", marginBottom: 16 }}>
//                                     <button onClick={() => setShowImagePicker(true)} style={{ background: "none", border: "none", cursor: "pointer" }}>
//                                         <div style={{ width: 80, height: 80, borderRadius: 20, background: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.3)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12" }}>
//                                             {managerImagePreview ? <img src={managerImagePreview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <User size={40} color="white" />}
//                                         </div>
//                                     </button>
//                                     <h2 style={{ color: "white", fontSize: 18, fontWeight: 700 }}>New Hub Manager</h2>
//                                     <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>Tap to upload photo</p>
//                                 </div>
//                                 <div style={{ background: "white", borderRadius: 16, border: "1px solid #ddd", padding: 20 }}>
//                                     <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
//                                         <Building2 size={20} color={G} /><span style={{ fontWeight: 700, fontSize: 14, color: Colors.textBlack }}>Assign Hub</span>
//                                     </div>
//                                     <select value={selectedHubZoneId} onChange={(e) => { setSelectedHubZoneId(e.target.value); setManagerTouched(prev => ({ ...prev, hub: true })); }}
//                                         style={{ width: "100%", height: 44, borderRadius: 12, border: "1px solid #ddd", padding: "0 12px", fontSize: 14, fontWeight: 600, background: Colors.containerGrey2 }}>
//                                         <option value="">Choose hub zone</option>
//                                         {hubZones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
//                                     </select>
//                                 </div>
//                             </div>
//                             {/* Right - Form */}
//                             <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//                                 {[
//                                     { icon: <User size={18} />, label: "Full Name", field: "name", placeholder: "e.g. Rahul Sharma" },
//                                     { icon: <Phone size={18} />, label: "Phone", field: "phone", placeholder: "9876543210", maxLength: 10 },
//                                     { icon: <MapPin size={18} />, label: "Address", field: "address", placeholder: "e.g. Lucknow" },
//                                     { icon: <CreditCard size={18} />, label: "Aadhaar", field: "adharno", placeholder: "12-digit number", maxLength: 12 },
//                                     { icon: <FileText size={18} />, label: "PAN", field: "panno", placeholder: "ABCDE1234F", maxLength: 10 },
//                                     { icon: <Mail size={18} />, label: "Email", field: "email", placeholder: "manager@hub.com" },
//                                 ].map(f => (
//                                     <FormInput key={f.field} {...f} value={formData[f.field]} onChange={(v) => handleManagerChange(f.field, v)} touched={managerTouched[f.field]} isValid={isManagerValid(f.field)} error={managerErrors[f.field]} />
//                                 ))}
//                                 <div>
//                                     <FormInput label="Password" placeholder="Min. 6 characters" icon={<Lock size={18} />} value={formData.password} onChange={(v) => handleManagerChange('password', v)} touched={managerTouched.password} isValid={isManagerValid('password')} error={managerErrors.password} type={showPassword ? 'text' : 'password'}
//                                         rightIcon={<button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}</button>} />
//                                     {managerTouched.password && formData.password && (
//                                         <div className="mt-2"><div className="h-1.5 bg-gray-200 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${(passwordStrength / 5) * 100}%` }} className={`h-full rounded-full ${passwordStrength <= 1 ? 'bg-red-500' : passwordStrength <= 3 ? 'bg-yellow-500' : 'bg-green-600'}`} /></div></div>
//                                     )}
//                                 </div>
//                                 <button onClick={handleCreateManager} disabled={isSubmitting}
//                                     style={{ width: "100%", height: 50, borderRadius: 14, border: "none", background: G, color: "white", fontSize: 15, fontWeight: 700, cursor: isSubmitting ? "wait" : "pointer" }}>
//                                     {isSubmitting ? <Spinner size={18} /> : "Create Manager"}
//                                 </button>
//                             </div>
//                         </div>
//                     </motion.div>
//                 )}
//             </div>

//             {/* Map Popup */}
//             {showMap && cityZone && createPortal(<MapPickerPopup cityZone={cityZone} existingHubs={existingHubs} onClose={() => setShowMap(false)} onConfirm={handleConfirm} snackShow={(msg, type) => type === 'error' ? toast.error(msg) : toast.success(msg)} />, document.body)}

//             {/* Image Picker Modal */}
//             <AnimatePresence>
//                 {showImagePicker && (
//                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowImagePicker(false)}>
//                         <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-2xl p-5 w-full max-w-sm" onClick={e => e.stopPropagation()}>
//                             <h3 className="font-bold text-center mb-4">Upload Photo</h3>
//                             <div className="grid grid-cols-2 gap-3">
//                                 <label className="flex flex-col items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200 cursor-pointer"><Camera size={22} className="text-green-800" /><span className="text-sm font-semibold text-green-800">Camera</span><input type="file" accept="image/*" capture="environment" onChange={handleImagePick} className="hidden" /></label>
//                                 <label className="flex flex-col items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 cursor-pointer"><Image size={22} className="text-emerald-600" /><span className="text-sm font-semibold text-emerald-600">Gallery</span><input type="file" accept="image/*" onChange={handleImagePick} className="hidden" /></label>
//                             </div>
//                         </motion.div>
//                     </motion.div>
//                 )}
//             </AnimatePresence>

//             <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//         </div>
//     );
// }