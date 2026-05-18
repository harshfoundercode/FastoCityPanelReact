import { useState, useEffect, useRef, useCallback } from "react";
import { ENDPOINTS } from "../../config/ApiConfig";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const BASE_URL = ENDPOINTS.API_URL;
const MAP_KEY = ENDPOINTS.MAP_KEY;

// ─────────────────────────────────────────────────────────────────────────────
// COLORS
// ─────────────────────────────────────────────────────────────────────────────
const Colors = {
  primaryGreen: '#14532D',
  primaryLightGreen: '#4ADE80',
  primaryExtraLightGreen: '#F0FDF4',
  textBlack: '#1F2937',
  textGrey1: '#6B7280',
  containerGrey2: '#F3F4F6',
  white: '#FFFFFF',
};

const getToken = () => localStorage.getItem("token") || "";

const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
});

// ─────────────────────────────────────────────────────────────────────────────
// API CALLS
// ─────────────────────────────────────────────────────────────────────────────
async function fetchCityZoneList() {
    const res = await fetch(`${BASE_URL}cityzone_list`, { headers: authHeaders() });
    if (!res.ok) throw new Error("Failed to fetch city zones");
    return res.json();
}

async function fetchHubZoneList(cityzoneid) {
    const res = await fetch(`${BASE_URL}hubzone_list`, {
        method: "POST",
        headers: {
            ...authHeaders(),
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            cityzoneid,
        }),
    });

    if (!res.ok) {
        throw new Error("Failed to fetch hub zones");
    }

    return res.json();
}

async function createHubZone(payload) {
    const res = await fetch(`${BASE_URL}hubzone/create`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to create hub zone");
    return res.json();
}

async function fetchPlaceAutocomplete(query) {
    const res = await fetch(
        `${BASE_URL}place_autocomplete?query=${encodeURIComponent(query)}`,
        { headers: authHeaders() }
    );
    if (!res.ok) throw new Error("Autocomplete failed");
    return res.json();
}

async function fetchPlaceDetails(placeId) {
    const res = await fetch(
        `${BASE_URL}place_details?place_id=${encodeURIComponent(placeId)}`,
        { headers: authHeaders() }
    );
    if (!res.ok) throw new Error("Place details failed");
    return res.json();
}

async function reverseGeocode(lat, lng) {
    const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${MAP_KEY}`
    );
    const json = await res.json();
    const results = json.results || [];
    if (!results.length) return { street: "", city: "", state: "", pincode: "", fullAddress: "" };

    let best = null;
    for (const r of results) {
        const types = r.types || [];
        if (types.includes("street_address") || types.includes("premise")) { best = r; break; }
    }
    if (!best) best = results.find(r => (r.types || []).includes("locality")) || results[0];

    const comps = best.address_components || [];
    let streetNumber = "", route = "", sublocality = "", locality = "", adminArea = "", pincode = "";
    for (const c of comps) {
        const types = c.types || [];
        if (types.includes("street_number")) streetNumber = c.long_name;
        if (types.includes("route")) route = c.long_name;
        if (types.includes("sublocality") || types.includes("sublocality_level_1")) sublocality = c.long_name;
        if (types.includes("locality")) locality = c.long_name;
        if (types.includes("administrative_area_level_1")) adminArea = c.long_name;
        if (types.includes("postal_code")) pincode = c.long_name;
    }
    if (!pincode) {
        for (const r of results) {
            for (const c of (r.address_components || [])) {
                if ((c.types || []).includes("postal_code")) { pincode = c.long_name; break; }
            }
            if (pincode) break;
        }
    }
    const street = [streetNumber, route].filter(Boolean).join(" ");
    const city = [sublocality, locality].filter(Boolean).join(", ");
    const fullAddress = [street, city, adminArea, pincode].filter(Boolean).join(", ");
    return { street, city, state: adminArea, pincode, fullAddress };
}

// ─────────────────────────────────────────────────────────────────────────────
// HAVERSINE
// ─────────────────────────────────────────────────────────────────────────────
function distanceKm(a, b) {
    const R = 6371;
    const dLat = ((b.lat - a.lat) * Math.PI) / 180;
    const dLon = ((b.lng - a.lng) * Math.PI) / 180;
    const s =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((a.lat * Math.PI) / 180) *
        Math.cos((b.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

function clampToCity(point, cityCenter, cityRadiusKm) {
    const dist = distanceKm(point, cityCenter);
    if (dist <= cityRadiusKm) return point;
    const ratio = cityRadiusKm / dist;
    return {
        lat: cityCenter.lat + (point.lat - cityCenter.lat) * ratio,
        lng: cityCenter.lng + (point.lng - cityCenter.lng) * ratio,
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// SNACKBAR - Updated with Colors
// ─────────────────────────────────────────────────────────────────────────────
function Snackbar({ message, type, onClose }) {
    useEffect(() => {
        const t = setTimeout(onClose, 3500);
        return () => clearTimeout(t);
    }, [message, onClose]);
    
    const bgColors = { 
        error: "#ef4444", 
        warning: "#f59e0b", 
        success: Colors.primaryGreen 
    };
    
    return (
        <div style={{ 
            position: "fixed", 
            bottom: 24, 
            left: "50%", 
            transform: "translateX(-50%)", 
            zIndex: 99999, 
            display: "flex", 
            alignItems: "center", 
            gap: 12, 
            padding: "12px 20px", 
            borderRadius: 14, 
            background: bgColors[type] || "#374151", 
            color: Colors.white, 
            fontSize: 13, 
            fontWeight: 500, 
            minWidth: 260, 
            maxWidth: 420, 
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)" 
        }}>
            <span style={{ flex: 1 }}>{message}</span>
            <button onClick={onClose} style={{ 
                background: "none", 
                border: "none", 
                color: Colors.white, 
                cursor: "pointer", 
                fontSize: 16, 
                opacity: 0.8 
            }}>✕</button>
        </div>
    );
}

function useSnackbar() {
    const [snack, setSnack] = useState(null);
    const show = useCallback((message, type = "error") => setSnack({ message, type, key: Date.now() }), []);
    const hide = useCallback(() => setSnack(null), []);
    return { snack, show, hide };
}

// ─────────────────────────────────────────────────────────────────────────────
// ICON
// ─────────────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 16, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <path d={d} />
    </svg>
);

const IC = {
    info: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    map: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
    pin: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z",
    store: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    check: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    block: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636",
    close: "M6 18L18 6M6 6l12 12",
    search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    warn: "M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    fit: "M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4",
    gps: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z",
    radar: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
    addPin: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
};

const Spinner = ({ size = 16, color = Colors.primaryGreen }) => (
    <div style={{ 
        width: size, 
        height: size, 
        border: `2px solid ${Colors.primaryExtraLightGreen}`, 
        borderTopColor: color, 
        borderRadius: "50%", 
        animation: "spin 0.7s linear infinite", 
        flexShrink: 0 
    }} />
);

// ─────────────────────────────────────────────────────────────────────────────
// SMALL SHARED WIDGETS - Updated with Colors
// ─────────────────────────────────────────────────────────────────────────────
function SectionHeader({ icon, title }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ 
                width: 32, 
                height: 32, 
                borderRadius: 10, 
                background: Colors.primaryExtraLightGreen, 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                border: `1px solid ${Colors.primaryLightGreen}30`
            }}>
                <Icon d={icon} size={15} color={Colors.primaryGreen} />
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: Colors.textBlack }}>{title}</span>
        </div>
    );
}

function SectionLabel({ icon, title }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <Icon d={icon} size={13} color={Colors.primaryGreen} />
            <span style={{ fontSize: 12, fontWeight: 700, color: Colors.textBlack }}>{title}</span>
        </div>
    );
}

function WarningBox({ color, icon, title, message, btnLabel, onBtn }) {
    const red = color === "red";
    return (
        <div style={{ 
            padding: "10px 12px", 
            borderRadius: 12, 
            background: red ? "#FEF2F2" : "#FFFBEB", 
            border: `1px solid ${red ? "#FECACA" : "#FDE68A"}`, 
            display: "flex", 
            alignItems: "flex-start", 
            gap: 8 
        }}>
            <Icon d={icon} size={15} color={red ? "#DC2626" : "#D97706"} />
            <div style={{ flex: 1 }}>
                {title && <p style={{ margin: "0 0 2px", fontSize: 12, fontWeight: 700, color: red ? "#991B1B" : "#92400E" }}>{title}</p>}
                <p style={{ margin: 0, fontSize: 11, color: red ? "#991B1B" : "#92400E", lineHeight: 1.4 }}>{message}</p>
            </div>
            <button onClick={onBtn} style={{ 
                padding: "4px 10px", 
                borderRadius: 8, 
                background: red ? "#FEE2E2" : "#FEF3C7", 
                border: "none", 
                fontSize: 11, 
                fontWeight: 700, 
                color: red ? "#991B1B" : "#92400E", 
                cursor: "pointer", 
                flexShrink: 0 
            }}>{btnLabel}</button>
        </div>
    );
}

function ReadOnlyTile({ icon, label, value }) {
    return (
        <div style={{ 
            padding: "12px 14px", 
            borderRadius: 12, 
            background: Colors.primaryExtraLightGreen, 
            border: `1px solid ${Colors.primaryGreen}20`, 
            display: "flex", 
            alignItems: "flex-start", 
            gap: 10 
        }}>
            <Icon d={icon} size={15} color={Colors.primaryGreen} />
            <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 10, color: Colors.textGrey1, textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>{label}</p>
                <p style={{ margin: "3px 0 0", fontSize: 13, fontWeight: 600, color: Colors.textBlack, wordBreak: "break-word" }}>{value || "—"}</p>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAP PICKER POPUP - Updated with Colors
// ─────────────────────────────────────────────────────────────────────────────
function MapPickerPopup({ cityZone, existingHubs, onClose, onConfirm, snackShow }) {
    const mapDivRef = useRef(null);
    const gmapRef = useRef(null);
    const hubMarkerRef = useRef(null);
    const hubCircleRef = useRef(null);
    const cityCircleRef = useRef(null);
    const isSelectingRef = useRef(false);
    const debounceRef = useRef(null);
    const mapInitRef = useRef(false);

    const cityCenter = { lat: parseFloat(cityZone.lat), lng: parseFloat(cityZone.long) };
    const cityRadiusKm = parseFloat(cityZone.radiuskm) || 10;

    const [selLoc, setSelLoc] = useState({ ...cityCenter });
    const [hubRadius, setHubRadius] = useState(1.0);
    const [radiusInput, setRadiusInput] = useState("1.0");
    const [isOutside, setIsOutside] = useState(false);
    const [isRadiusExceeding, setIsRadiusExceeding] = useState(false);
    const [searchResultOutside, setSearchResultOutside] = useState(false);
    const [outsideMsg, setOutsideMsg] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [addrLoading, setAddrLoading] = useState(false);
    const [addrData, setAddrData] = useState({ street: "", city: "", state: "", pincode: "", fullAddress: "" });
    const [mapReady, setMapReady] = useState(false);

    const isInsideCity = useCallback((p) => distanceKm(p, cityCenter) <= cityRadiusKm, []);
    const isHubFullyInside = useCallback((c, r) => distanceKm(c, cityCenter) + r <= cityRadiusKm, []);
    const checkOverlap = useCallback((loc, r) =>
        existingHubs.some(z => {
            const zLat = parseFloat(z.lat); const zLng = parseFloat(z.long); const zR = parseFloat(z.radiuskm);
            if (!zLat || !zLng || !zR) return false;
            return distanceKm(loc, { lat: zLat, lng: zLng }) < (r + zR);
        }), [existingHubs]);

    const doFetchAddress = useCallback(async (loc) => {
        setAddrLoading(true);
        try {
            const data = await reverseGeocode(loc.lat, loc.lng);
            setAddrData(data);
        } catch { setAddrData({ street: "", city: "", state: "", pincode: "", fullAddress: "" }); }
        finally { setAddrLoading(false); }
    }, []);

    useEffect(() => {
        const initMap = () => {
            if (mapInitRef.current || !mapDivRef.current) return;
            mapInitRef.current = true;
            const google = window.google;

            const map = new google.maps.Map(mapDivRef.current, {
                center: cityCenter, zoom: 11,
                zoomControl: false, mapTypeControl: false,
                streetViewControl: false, fullscreenControl: false,
            });

            cityCircleRef.current = new google.maps.Circle({
                map, center: cityCenter, radius: cityRadiusKm * 1000,
                fillColor: "#2563EB", fillOpacity: 0.06,
                strokeColor: "#2563EB", strokeOpacity: 0.5, strokeWeight: 2,
            });

            new google.maps.Marker({
                map, position: cityCenter,
                icon: { path: google.maps.SymbolPath.CIRCLE, scale: 7, fillColor: "#2563EB", fillOpacity: 1, strokeColor: "#fff", strokeWeight: 2 },
                title: cityZone.name,
            });

            existingHubs.forEach(z => {
                const lat = parseFloat(z.lat); const lng = parseFloat(z.long); const r = parseFloat(z.radiuskm);
                if (!lat || !lng || !r) return;
                new google.maps.Circle({ map, center: { lat, lng }, radius: r * 1000, fillColor: "#F97316", fillOpacity: 0.1, strokeColor: "#F97316", strokeOpacity: 0.6, strokeWeight: 2 });
                const m = new google.maps.Marker({
                    map, position: { lat, lng },
                    icon: { path: google.maps.SymbolPath.CIRCLE, scale: 6, fillColor: "#F97316", fillOpacity: 1, strokeColor: "#fff", strokeWeight: 2 },
                    title: z.name,
                });
                m.addListener("click", () => new google.maps.InfoWindow({ content: `<b>${z.name}</b><br>Radius: ${r} km<br>${z.address || ""}` }).open(map, m));
            });

            hubCircleRef.current = new google.maps.Circle({
                map, center: cityCenter, radius: 1000,
                fillColor: Colors.primaryGreen, fillOpacity: 0.12, strokeColor: Colors.primaryGreen, strokeOpacity: 0.7, strokeWeight: 2,
            });

            hubMarkerRef.current = new google.maps.Marker({
                map, position: cityCenter, draggable: true,
                icon: { path: google.maps.SymbolPath.CIRCLE, scale: 10, fillColor: Colors.primaryGreen, fillOpacity: 1, strokeColor: "#fff", strokeWeight: 3 },
            });

            hubMarkerRef.current.addListener("dragend", (e) => {
                if (isSelectingRef.current) return;
                let loc = { lat: e.latLng.lat(), lng: e.latLng.lng() };
                if (!isInsideCity(loc)) {
                    snackShow("❌ You can only drag inside the blue zone", "error");
                    loc = clampToCity(loc, cityCenter, cityRadiusKm);
                    hubMarkerRef.current.setPosition({ lat: loc.lat, lng: loc.lng });
                }
                if (checkOverlap(loc, hubRadius)) {
                    snackShow("❌ Overlapping another hub zone", "error");
                    hubMarkerRef.current.setPosition({ lat: cityCenter.lat, lng: cityCenter.lng });
                    return;
                }
                setSelLoc({ ...loc });
                setIsOutside(!isInsideCity(loc));
                doFetchAddress(loc);
            });

            map.addListener("click", (e) => {
                if (isSelectingRef.current) return;
                let loc = { lat: e.latLng.lat(), lng: e.latLng.lng() };
                if (checkOverlap(loc, 1.0)) { snackShow("This location overlaps an existing hub zone!", "error"); return; }
                if (!isInsideCity(loc)) { snackShow("Outside zone! Auto adjusting…", "error"); loc = { ...cityCenter }; }
                setSelLoc({ ...loc });
                setIsOutside(false);
                setSearchResultOutside(false);
                doFetchAddress(loc);
            });

            gmapRef.current = map;
            setMapReady(true);
            doFetchAddress(cityCenter);
        };

        if (window.google?.maps) { initMap(); return; }

        const existingScript = document.getElementById("gmap-script");
        if (existingScript) {
            const prev = window._onGmapReady;
            window._onGmapReady = () => { prev?.(); initMap(); };
            return;
        }

        window._onGmapReady = initMap;
        const s = document.createElement("script");
        s.id = "gmap-script";
        s.src = `https://maps.googleapis.com/maps/api/js?key=${MAP_KEY}&callback=_onGmapReady`;
        s.async = true;
        document.head.appendChild(s);
    }, []);

    useEffect(() => {
        if (!mapReady || !window.google) return;
        const google = window.google;
        const invalid = isOutside || isRadiusExceeding;
        const color = invalid ? "#ef4444" : Colors.primaryGreen;

        hubMarkerRef.current?.setPosition({ lat: selLoc.lat, lng: selLoc.lng });
        hubMarkerRef.current?.setIcon({ path: google.maps.SymbolPath.CIRCLE, scale: 10, fillColor: color, fillOpacity: 1, strokeColor: "#fff", strokeWeight: 3 });
        if (hubCircleRef.current) {
            hubCircleRef.current.setCenter({ lat: selLoc.lat, lng: selLoc.lng });
            hubCircleRef.current.setRadius(hubRadius * 1000);
            hubCircleRef.current.setOptions({ fillColor: color, strokeColor: color });
        }
        cityCircleRef.current?.setOptions({ strokeColor: isOutside ? "#ef4444" : "#2563EB" });
    }, [selLoc, hubRadius, isOutside, isRadiusExceeding, mapReady]);

    useEffect(() => {
        if (!isOutside) setIsRadiusExceeding(!isHubFullyInside(selLoc, hubRadius));
    }, [selLoc]);

    const onSearchChange = (v) => {
        setSearchQuery(v);
        setSearchResultOutside(false);
        if (!v.trim()) { setSearchResults([]); setShowDropdown(false); return; }
        clearTimeout(debounceRef.current);
        setSearchLoading(true);
        debounceRef.current = setTimeout(async () => {
            try {
                const data = await fetchPlaceAutocomplete(v);
                const results = data?.data || [];
                setSearchResults(results);
                setShowDropdown(results.length > 0);
            } catch { setSearchResults([]); }
            finally { setSearchLoading(false); }
        }, 450);
    };

    const selectPlace = async (placeId, description) => {
        isSelectingRef.current = true;
        setShowDropdown(false);
        setSearchResults([]);
        setSearchQuery(description);
        try {
            const data = await fetchPlaceDetails(placeId);
            const loc = data?.data ?? data;
            if (!loc?.lat || !loc?.lng) { snackShow("Could not fetch location coordinates.", "error"); return; }
            const parsedLoc = { lat: parseFloat(loc.lat), lng: parseFloat(loc.lng) };

            if (!isInsideCity(parsedLoc)) {
                setSelLoc({ ...parsedLoc });
                setIsOutside(true);
                setIsRadiusExceeding(false);
                setSearchResultOutside(true);
                setOutsideMsg(`This place is outside the city zone "${cityZone.name}". Only locations inside the blue circle are allowed.`);
                gmapRef.current?.panTo({ lat: parsedLoc.lat, lng: parsedLoc.lng });
                return;
            }
            if (checkOverlap(parsedLoc, hubRadius)) { snackShow("This location overlaps an existing hub zone!", "error"); return; }

            const fits = isHubFullyInside(parsedLoc, hubRadius);
            if (!fits) {
                const newR = parseFloat(Math.max(0.5, cityRadiusKm - distanceKm(parsedLoc, cityCenter)).toFixed(1));
                setHubRadius(newR);
                setRadiusInput(newR.toFixed(1));
                snackShow("⚠️ Radius adjusted to fit within city boundary.", "warning");
            }
            setSelLoc({ ...parsedLoc });
            setIsOutside(false);
            setIsRadiusExceeding(false);
            setSearchResultOutside(false);
            setOutsideMsg("");
            gmapRef.current?.panTo({ lat: parsedLoc.lat, lng: parsedLoc.lng });
            gmapRef.current?.setZoom(14);
            await doFetchAddress(parsedLoc);
        } catch { snackShow("Failed to load place details. Please try again.", "error"); }
        finally { setTimeout(() => { isSelectingRef.current = false; }, 600); }
    };

    const onRadiusSlider = (v) => {
        const val = parseFloat(v);
        if (checkOverlap(selLoc, val)) { snackShow("Radius will overlap an existing hub zone!", "error"); return; }
        const fits = isHubFullyInside(selLoc, val);
        if (!fits) snackShow("❌ Radius exceeds city boundary!", "error");
        setHubRadius(val);
        setRadiusInput(val.toFixed(1));
        setIsRadiusExceeding(!fits);
    };

    const onRadiusField = (v) => {
        setRadiusInput(v);
        const parsed = parseFloat(v);
        if (!isNaN(parsed) && parsed >= 0.5 && parsed <= cityRadiusKm) {
            if (checkOverlap(selLoc, parsed)) { snackShow("This radius overlaps an existing hub zone!", "error"); return; }
            const fits = isHubFullyInside(selLoc, parsed);
            if (!fits) snackShow("❌ Radius would go outside the city boundary!", "error");
            setHubRadius(parsed);
            setIsRadiusExceeding(!fits);
        }
    };

    const autoFixRadius = () => {
        const max = parseFloat(Math.max(0.5, cityRadiusKm - distanceKm(selLoc, cityCenter)).toFixed(1));
        setHubRadius(max); setRadiusInput(max.toFixed(1)); setIsRadiusExceeding(false);
    };

    const resetToCenter = async () => {
        setSelLoc({ ...cityCenter }); setIsOutside(false); setIsRadiusExceeding(false);
        setSearchResultOutside(false); setOutsideMsg(""); setSearchQuery("");
        gmapRef.current?.panTo({ lat: cityCenter.lat, lng: cityCenter.lng });
        gmapRef.current?.setZoom(11);
        await doFetchAddress(cityCenter);
    };

    const confirm = () => {
        if (isOutside || isRadiusExceeding) { snackShow("Fix errors before confirming.", "error"); return; }
        if (checkOverlap(selLoc, hubRadius)) { snackShow("Hub overlaps with an existing zone!", "error"); return; }
        onConfirm({ lat: selLoc.lat, lng: selLoc.lng, address: addrData.fullAddress, pincode: addrData.pincode, radius: hubRadius });
    };

    const blocked = isOutside || isRadiusExceeding;
    const G = Colors.primaryGreen;

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 9000, background: "rgba(0,0,0,0.52)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "min(98vw,1000px)", height: "min(95vh,700px)", background: Colors.containerGrey2, borderRadius: 20, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.25)" }}>

                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", background: Colors.white, borderBottom: "1px solid #E8ECF0", flexShrink: 0 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: Colors.primaryExtraLightGreen, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon d={IC.map} size={18} color={G} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: Colors.textBlack }}>Select Hub Location</p>
                        <p style={{ margin: 0, fontSize: 11, color: Colors.textGrey1 }}>City Zone: {cityZone.name} &nbsp;•&nbsp; Radius: {cityRadiusKm.toFixed(1)} km</p>
                    </div>
                    <button onClick={() => { gmapRef.current?.panTo({ lat: cityCenter.lat, lng: cityCenter.lng }); gmapRef.current?.setZoom(11); }}
                        style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 10, background: Colors.primaryExtraLightGreen, border: `1px solid ${Colors.primaryGreen}30`, color: Colors.primaryGreen, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                        <Icon d={IC.fit} size={13} color={Colors.primaryGreen} /> Fit Zone
                    </button>
                    <button onClick={onClose} style={{ marginLeft: 8, width: 34, height: 34, borderRadius: 10, background: Colors.containerGrey2, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon d={IC.close} size={16} color={Colors.textBlack} />
                    </button>
                </div>

                {/* Body */}
                <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
                    <div style={{ flex: 6, position: "relative" }}>
                        <div ref={mapDivRef} style={{ width: "100%", height: "100%" }} />

                        <div style={{ position: "absolute", top: 12, left: 12, zIndex: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 20, background: Colors.white, border: `1px solid ${blocked ? "rgba(239,68,68,0.3)" : `${Colors.primaryGreen}30`}`, fontSize: 11, fontWeight: 600, color: blocked ? "#dc2626" : Colors.primaryGreen, boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
                                <Icon d={blocked ? IC.warn : IC.gps} size={12} color={blocked ? "#dc2626" : Colors.primaryGreen} />
                                {isOutside ? "⚠ Outside boundary" : isRadiusExceeding ? "⚠ Radius exceeds boundary" : "Click inside the blue circle"}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", borderRadius: 20, background: Colors.white, fontSize: 10, fontWeight: 600, color: Colors.textBlack, boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
                                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(249,115,22,0.3)", border: "1.5px solid #F97316" }} />
                                Existing hub zones
                            </div>
                        </div>

                        <div style={{ position: "absolute", bottom: 16, right: 16, zIndex: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                            {[
                                { label: "+", fn: () => gmapRef.current?.setZoom((gmapRef.current.getZoom() || 11) + 1) },
                                { label: "−", fn: () => gmapRef.current?.setZoom((gmapRef.current.getZoom() || 11) - 1) },
                                { label: "⊙", fn: () => { gmapRef.current?.panTo({ lat: cityCenter.lat, lng: cityCenter.lng }); gmapRef.current?.setZoom(11); } },
                            ].map((b, i) => (
                                <button key={i} onClick={b.fn} style={{ width: 36, height: 36, borderRadius: 10, background: Colors.white, border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", cursor: "pointer", fontSize: 18, color: Colors.textBlack, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>{b.label}</button>
                            ))}
                        </div>
                    </div>

                    <div style={{ width: 1, background: "#E8ECF0", flexShrink: 0 }} />

                    <div style={{ width: 310, background: Colors.white, overflowY: "auto", flexShrink: 0 }}>
                        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
                            <div style={{ position: "relative" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, height: 44, padding: "0 12px", borderRadius: 13, border: `1px solid ${Colors.primaryGreen}20`, background: Colors.white, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                                    {searchLoading ? <Spinner size={15} color={G} /> : <Icon d={IC.search} size={16} color={G} />}
                                    <input
                                        value={searchQuery}
                                        onChange={e => onSearchChange(e.target.value)}
                                        onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                                        placeholder="Search a place or landmark…"
                                        style={{ flex: 1, border: "none", outline: "none", fontSize: 13, fontWeight: 500, color: Colors.textBlack, background: "transparent" }}
                                    />
                                    {searchQuery && (
                                        <button onClick={() => { setSearchQuery(""); setSearchResults([]); setShowDropdown(false); setSearchResultOutside(false); }}
                                            style={{ width: 22, height: 22, borderRadius: 6, background: Colors.containerGrey2, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <Icon d={IC.close} size={11} color={Colors.textGrey1} />
                                        </button>
                                    )}
                                </div>
                                {showDropdown && searchResults.length > 0 && (
                                    <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: Colors.white, borderRadius: 14, border: `1px solid ${Colors.primaryGreen}20`, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 50, maxHeight: 200, overflowY: "auto" }}>
                                        {searchResults.map((p, i) => {
                                            const desc = p.description || "";
                                            const parts = desc.split(",");
                                            return (
                                                <button key={i} onClick={() => selectPlace(p.place_id, desc)}
                                                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", border: "none", borderBottom: i < searchResults.length - 1 ? "1px solid #F3F4F6" : "none", background: "none", cursor: "pointer", textAlign: "left" }}
                                                    onMouseEnter={e => e.currentTarget.style.background = Colors.containerGrey2}
                                                    onMouseLeave={e => e.currentTarget.style.background = "none"}
                                                >
                                                    <div style={{ width: 30, height: 30, borderRadius: 8, background: Colors.primaryExtraLightGreen, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                        <Icon d={IC.pin} size={14} color={G} />
                                                    </div>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: Colors.textBlack, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{parts[0]}</p>
                                                        {parts.length > 1 && <p style={{ margin: 0, fontSize: 11, color: Colors.textGrey1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{parts.slice(1, 3).join(",")}</p>}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {searchResultOutside && <WarningBox color="red" icon={IC.pin} title="Location Outside City Zone" message={outsideMsg} btnLabel="Reset" onBtn={resetToCenter} />}
                            {isRadiusExceeding && !isOutside && !searchResultOutside && <WarningBox color="amber" icon={IC.warn} message="Radius exceeds city boundary — reduce it to confirm." btnLabel="Auto-fix" onBtn={autoFixRadius} />}
                            {isOutside && !searchResultOutside && <WarningBox color="red" icon={IC.warn} message="Outside city boundary — move pin inside the blue circle." btnLabel="Reset" onBtn={resetToCenter} />}

                            <div style={{ padding: "10px 12px", borderRadius: 12, background: Colors.primaryExtraLightGreen, border: `1px solid ${Colors.primaryLightGreen}40`, display: "flex", alignItems: "center", gap: 8 }}>
                                <Icon d={IC.gps} size={14} color={G} />
                                <div>
                                    <p style={{ margin: 0, fontSize: 9, fontWeight: 800, color: Colors.textGrey1, letterSpacing: "0.8px" }}>COORDINATES</p>
                                    <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: Colors.textBlack }}>{selLoc.lat.toFixed(6)}, {selLoc.lng.toFixed(6)}</p>
                                </div>
                            </div>

                            <div>
                                <SectionLabel icon={IC.pin} title="Detected Address" />
                                {addrLoading ? (
                                    <div style={{ padding: "10px 12px", borderRadius: 10, background: Colors.containerGrey2, border: `1px solid ${Colors.primaryGreen}20`, display: "flex", alignItems: "center", gap: 8 }}>
                                        <Spinner size={13} color={G} />
                                        <span style={{ fontSize: 12, color: Colors.textGrey1 }}>Fetching address…</span>
                                    </div>
                                ) : addrData.street || addrData.city ? (
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                                        {[
                                            { label: "Street", value: addrData.street, color: G, bg: Colors.primaryExtraLightGreen, border: `${Colors.primaryGreen}30` },
                                            { label: "City", value: addrData.city, color: "#2563EB", bg: "#EFF6FF", border: "rgba(37,99,235,0.18)" },
                                            { label: "State", value: addrData.state, color: "#D97706", bg: "#FFFBEB", border: "rgba(217,119,6,0.18)" },
                                            { label: "Pincode", value: addrData.pincode, color: "#EC4899", bg: "#FDF2F8", border: "rgba(236,72,153,0.18)" },
                                        ].filter(f => f.value).map(f => (
                                            <div key={f.label} style={{ padding: "8px 10px", borderRadius: 10, background: f.bg, border: `1px solid ${f.border}` }}>
                                                <p style={{ margin: 0, fontSize: 9, fontWeight: 700, color: f.color, letterSpacing: "0.5px" }}>{f.label.toUpperCase()}</p>
                                                <p style={{ margin: "2px 0 0", fontSize: 12, fontWeight: 600, color: Colors.textBlack, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ padding: "10px 12px", borderRadius: 10, background: Colors.containerGrey2, border: `1px solid ${Colors.primaryGreen}20`, display: "flex", alignItems: "center", gap: 8 }}>
                                        <Icon d={IC.info} size={14} color={Colors.textGrey1} />
                                        <span style={{ fontSize: 12, color: Colors.textGrey1 }}>Tap inside the blue circle to pick a location</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <SectionLabel icon={IC.radar} title="Hub Coverage Radius" />
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <input type="range" min={0.5} max={cityRadiusKm} step={0.5} value={hubRadius}
                                        onChange={e => onRadiusSlider(e.target.value)}
                                        style={{ flex: 1, accentColor: isRadiusExceeding ? "#ef4444" : G, cursor: "pointer" }}
                                    />
                                    <div style={{ position: "relative", width: 70 }}>
                                        <input type="number" step="0.1" min={0.5} max={cityRadiusKm} value={radiusInput}
                                            onChange={e => onRadiusField(e.target.value)}
                                            style={{ width: "100%", height: 36, borderRadius: 10, border: "none", textAlign: "center", fontSize: 13, fontWeight: 700, background: isRadiusExceeding ? "rgba(239,68,68,0.07)" : Colors.primaryExtraLightGreen, color: isRadiusExceeding ? "#ef4444" : G, outline: "none", paddingRight: 24 }}
                                        />
                                        <span style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", fontSize: 10, color: Colors.textGrey1, pointerEvents: "none" }}>km</span>
                                    </div>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 4px" }}>
                                    <span style={{ fontSize: 10, color: Colors.textGrey1 }}>0.5 km</span>
                                    <span style={{ fontSize: 10, color: Colors.textGrey1 }}>{cityRadiusKm.toFixed(1)} km (max)</span>
                                </div>
                            </div>

                            <button onClick={confirm} disabled={blocked}
                                style={{ width: "100%", height: 48, borderRadius: 14, border: "none", background: blocked ? "#ef4444" : G, color: Colors.white, fontSize: 14, fontWeight: 700, cursor: blocked ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                                <Icon d={blocked ? IC.block : IC.check} size={18} color={Colors.white} />
                                {isOutside ? "Outside Boundary" : isRadiusExceeding ? "Radius Exceeds Boundary" : "Confirm Location"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADD HUB SCREEN - Updated UI with Colors
// ─────────────────────────────────────────────────────────────────────────────
export default function AddHubScreen() {
    const { snack, show: showSnack, hide: hideSnack } = useSnackbar();

    const [hubName, setHubName] = useState("");
    const [locationPicked, setLocationPicked] = useState(false);
    const [locationData, setLocationData] = useState(null);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [cityZone, setCityZone] = useState(null);
    const [existingHubs, setExistingHubs] = useState([]);
    const [dataLoading, setDataLoading] = useState(false);

    const getCityZoneId = (loadedZone) => {
        try {
            for (const key of ["profile", "user", "profileData", "userData"]) {
                const raw = localStorage.getItem(key);
                if (!raw) continue;
                const parsed = JSON.parse(raw);
                const id = parsed?.data?.cityzoneid ?? parsed?.cityzoneid ?? parsed?.data?.data?.cityzoneid;
                if (id != null) return id.toString();
            }
        } catch { /* ignore */ }
        return loadedZone?.id?.toString() || null;
    };

    const loadMapData = useCallback(async () => {
        if (cityZone) return cityZone;
        setDataLoading(true);
        try {
            const czRes = await fetchCityZoneList();
            const czList = czRes?.data || [];
            const activeZone = czList.find(z => parseInt(z.status) === 1) || czList[0];
            if (!activeZone) { showSnack("No active city zone found.", "error"); return null; }
            setCityZone(activeZone);

            const hzRes = await fetchHubZoneList(activeZone.id);
            setExistingHubs(hzRes?.data || []);
            return activeZone;
        } catch {
            showSnack("Failed to load city zone data.", "error");
            return null;
        } finally {
            setDataLoading(false);
        }
    }, [cityZone]);

    const openMap = async () => {
        const zone = cityZone || await loadMapData();
        if (zone) setShowMap(true);
    };

    const handleConfirm = (data) => {
        setLocationData(data);
        setLocationPicked(true);
        setShowMap(false);
        setErrors(e => ({ ...e, location: undefined }));
    };

    const handleSubmit = async () => {
        const e = {};
        if (!hubName.trim()) e.hubName = "Hub name is required";
        if (!locationPicked || !locationData) e.location = "Please pick a location on the map";
        setErrors(e);
        if (Object.keys(e).length > 0) return;

        const cityzoneid = getCityZoneId(cityZone);
        if (!cityzoneid) { showSnack("City zone ID not found. Please login again.", "error"); return; }

        setSubmitting(true);
        try {
            const payload = {
                cityzoneid,
                name: hubName.trim(),
                address: locationData.address || "",
                pincode: locationData.pincode || "",
                radiuskm: locationData.radius.toString(),
                lat: locationData.lat.toString(),
                long: locationData.lng.toString(),
            };
            await createHubZone(payload);
            showSnack("✅ Hub created successfully!", "success");
            setHubName(""); setLocationPicked(false); setLocationData(null); setErrors({});
        } catch (err) {
            showSnack(err.message || "Failed to create hub. Please try again.", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const G = Colors.primaryGreen;

    return (
        <div style={{ minHeight: "100vh", background: Colors.primaryExtraLightGreen, fontFamily: "system-ui, -apple-system, sans-serif" }}>
            {snack && <Snackbar {...snack} onClose={hideSnack} />}

            {/* AppBar - Updated */}
            <div style={{ 
                background: `linear-gradient(135deg, ${Colors.primaryGreen} 0%, #166534 100%)`, 
                padding: "16px 20px",
                position: "relative",
                overflow: "hidden"
            }}>
                <div style={{
                    position: "absolute",
                    top: -15,
                    right: -15,
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: `${Colors.primaryLightGreen}15`,
                }} />
                <div style={{
                    position: "absolute",
                    bottom: -25,
                    left: "30%",
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    background: `${Colors.primaryLightGreen}10`,
                }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                    <p style={{ margin: 0, color: Colors.white, fontWeight: 800, fontSize: 18, letterSpacing: "-0.3px" }}>Create Hub</p>
                    <p style={{ margin: "3px 0 0", color: `${Colors.primaryLightGreen}CC`, fontSize: 12 }}>Add a new delivery hub</p>
                </div>
            </div>

            {/* Body */}
            <div style={{ margin: "0 auto", padding: "20px 16px 48px" }}>

                {/* Info banner - Updated */}
                <div style={{ 
                    padding: 14, 
                    borderRadius: 16, 
                    background: Colors.white, 
                    border: `1px solid ${Colors.primaryGreen}20`, 
                    display: "flex", 
                    alignItems: "flex-start", 
                    gap: 12, 
                    marginBottom: 24,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                }}>
                    <div style={{ 
                        width: 36, 
                        height: 36, 
                        borderRadius: 12, 
                        background: Colors.primaryExtraLightGreen, 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center", 
                        flexShrink: 0,
                        border: `1px solid ${Colors.primaryLightGreen}30`
                    }}>
                        <Icon d={IC.info} size={18} color={G} />
                    </div>
                    <p style={{ margin: 0, fontSize: 13, color: Colors.primaryGreen, lineHeight: 1.5, fontWeight: 500 }}>
                        Fill in the hub details and pick a location on the map to define its coverage area.
                    </p>
                </div>

                {/* Hub Information - Updated */}
                <div style={{ marginBottom: 24 }}>
                    <SectionHeader icon={IC.store} title="Hub Information" />
                    <div style={{ 
                        background: Colors.white, 
                        borderRadius: 16, 
                        border: `1px solid ${Colors.primaryGreen}15`, 
                        padding: 20, 
                        boxShadow: "0 2px 12px rgba(0,0,0,0.04)", 
                        marginTop: 12 
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                            <Icon d={IC.store} size={13} color={Colors.textGrey1} />
                            <span style={{ fontSize: 13, fontWeight: 600, color: Colors.textBlack }}>Hub Name</span>
                        </div>
                        <input
                            value={hubName}
                            onChange={e => { setHubName(e.target.value); if (e.target.value) setErrors(er => ({ ...er, hubName: undefined })); }}
                            placeholder="e.g. Hazratganj Hub"
                            style={{ 
                                width: "100%", 
                                boxSizing: "border-box", 
                                height: 48, 
                                padding: "0 16px", 
                                borderRadius: 12, 
                                border: `2px solid ${errors.hubName ? "#FCA5A5" : Colors.primaryGreen}20`, 
                                fontSize: 14, 
                                color: Colors.textBlack, 
                                background: Colors.containerGrey2, 
                                outline: "none",
                                transition: "all 0.2s ease"
                            }}
                            onFocus={e => {
                                e.target.style.borderColor = G;
                                e.target.style.background = Colors.white;
                                e.target.style.boxShadow = `0 0 0 3px ${Colors.primaryLightGreen}40`;
                            }}
                            onBlur={e => {
                                e.target.style.borderColor = errors.hubName ? "#FCA5A5" : `${Colors.primaryGreen}20`;
                                e.target.style.background = Colors.containerGrey2;
                                e.target.style.boxShadow = "none";
                            }}
                        />
                        {errors.hubName && <p style={{ margin: "6px 0 0", fontSize: 12, color: "#EF4444", fontWeight: 500 }}>{errors.hubName}</p>}
                    </div>
                </div>

                {/* Hub Location - Updated */}
                <div style={{ marginBottom: 32 }}>
                    <SectionHeader icon={IC.pin} title="Hub Location" />
                    <div style={{ 
                        background: Colors.white, 
                        borderRadius: 16, 
                        border: `1px solid ${Colors.primaryGreen}15`, 
                        padding: 20, 
                        boxShadow: "0 2px 12px rgba(0,0,0,0.04)", 
                        marginTop: 12 
                    }}>
                        <button onClick={openMap} disabled={dataLoading}
                            style={{ 
                                width: "100%", 
                                padding: "28px 0", 
                                borderRadius: 14, 
                                cursor: dataLoading ? "wait" : "pointer", 
                                background: locationPicked ? Colors.primaryExtraLightGreen : Colors.containerGrey2, 
                                border: `2px dashed ${errors.location ? "#FCA5A5" : locationPicked ? Colors.primaryGreen + "40" : Colors.primaryGreen + "20"}`, 
                                display: "flex", 
                                flexDirection: "column", 
                                alignItems: "center", 
                                gap: 12, 
                                transition: "all 0.25s ease" 
                            }}>
                            {dataLoading
                                ? <Spinner size={24} color={G} />
                                : <div style={{ 
                                    width: 48, 
                                    height: 48, 
                                    borderRadius: "50%", 
                                    background: locationPicked ? Colors.primaryExtraLightGreen : Colors.white, 
                                    display: "flex", 
                                    alignItems: "center", 
                                    justifyContent: "center",
                                    border: `2px solid ${locationPicked ? Colors.primaryGreen + "30" : Colors.primaryGreen + "20"}`
                                }}>
                                    <Icon d={locationPicked ? IC.check : IC.addPin} size={22} color={locationPicked ? G : Colors.textGrey1} />
                                </div>}
                            <div style={{ textAlign: "center" }}>
                                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: locationPicked ? G : Colors.textBlack }}>
                                    {dataLoading ? "Loading map data…" : locationPicked ? "Location Selected ✓" : "Tap to Pick Location on Map"}
                                </p>
                                <p style={{ margin: "4px 0 0", fontSize: 12, color: Colors.textGrey1 }}>
                                    {locationPicked ? "Tap to change location" : "Pin the hub on the map"}
                                </p>
                            </div>
                        </button>
                        {errors.location && <p style={{ margin: "8px 0 0", fontSize: 12, color: "#EF4444", fontWeight: 500 }}>{errors.location}</p>}

                        {locationPicked && locationData && (
                            <div style={{ marginTop: 16 }}>
                                <div style={{ height: 1, background: Colors.containerGrey2, marginBottom: 16 }} />
                                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                    <ReadOnlyTile icon={IC.pin} label="Address" value={locationData.address} />
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                        <ReadOnlyTile icon={IC.gps} label="Latitude" value={locationData.lat?.toFixed(6)} />
                                        <ReadOnlyTile icon={IC.map} label="Longitude" value={locationData.lng?.toFixed(6)} />
                                    </div>
                                    <ReadOnlyTile icon={IC.radar} label="Coverage Radius" value={`${locationData.radius?.toFixed(1)} km`} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit Button - Updated */}
                <button onClick={handleSubmit} disabled={submitting}
                    style={{ 
                        width: "100%", 
                        height: 54, 
                        borderRadius: 14, 
                        border: "none", 
                        background: submitting ? Colors.primaryGreen : `linear-gradient(135deg, ${Colors.primaryGreen} 0%, #166534 100%)`, 
                        color: Colors.white, 
                        fontSize: 15, 
                        fontWeight: 700, 
                        cursor: submitting ? "wait" : "pointer", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center", 
                        gap: 10, 
                        opacity: submitting ? 0.85 : 1,
                        boxShadow: `0 4px 16px ${Colors.primaryGreen}40`,
                        letterSpacing: "0.2px",
                        transition: "all 0.2s ease"
                    }}>
                    {submitting ? <><Spinner size={18} color={Colors.white} /> Creating Hub…</> : <><Icon d={IC.store} size={18} color={Colors.white} /> Create Hub</>}
                </button>
            </div>

            {/* Map Picker Popup */}
            {showMap && cityZone && (
                <MapPickerPopup
                    cityZone={cityZone}
                    existingHubs={existingHubs}
                    onClose={() => setShowMap(false)}
                    onConfirm={handleConfirm}
                    snackShow={showSnack}
                />
            )}

            <style>{`@keyframes spin { to { transform: rotate(360deg); } } * { box-sizing: border-box; }`}</style>
        </div>
    );
}