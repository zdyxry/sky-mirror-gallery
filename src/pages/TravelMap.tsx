import { useEffect, useRef, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Globe, Loader2, Calendar, History } from 'lucide-react';
import { rawTravelPlaces } from '@/data/travelData';
import { CATEGORY_COLORS, CATEGORY_LABELS, type TravelCategory, type TravelPlace } from '@/types/travel';
import { BackgroundEffects } from '@/components/BackgroundEffects';
import { batchGeocode } from '@/services/geocoding';
import 'leaflet/dist/leaflet.css';
import type * as Leaflet from 'leaflet';

// 创建地图标记图标
function createMarkerIcon(color: string): Leaflet.DivIcon {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="40" viewBox="0 0 24 36">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z"
            fill="${color}" stroke="white" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="5" fill="white"/>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    iconSize: [28, 40],
    iconAnchor: [14, 40],
    popupAnchor: [0, -40],
    className: '',
  });
}

// 类别筛选按钮
function CategoryFilter({
  category,
  label,
  color,
  count,
  isActive,
  onClick,
}: {
  category: TravelCategory | 'all';
  label: string;
  color: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
        transition-all duration-200 border
        ${isActive 
          ? 'bg-primary text-primary-foreground border-primary shadow-sm' 
          : 'bg-background/80 text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
        }
      `}
    >
      <span 
        className="w-2.5 h-2.5 rounded-full" 
        style={{ backgroundColor: color }}
      />
      <span>{label}</span>
      <span className={`
        text-xs px-1.5 py-0.5 rounded-full
        ${isActive ? 'bg-primary-foreground/20' : 'bg-muted'}
      `}>
        {count}
      </span>
    </button>
  );
}

// 格式化访问记录
function formatVisits(visits: { year: number; description: string }[]): string {
  if (visits.length === 0) return '';
  
  // 按年份降序排序
  const sorted = [...visits].sort((a, b) => b.year - a.year);
  
  return sorted.map(v => `${v.year}年${v.description ? ` · ${v.description}` : ''}`).join('<br/>');
}

export default function TravelMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const markersRef = useRef<Leaflet.Marker[]>([]);
  const [activeCategory, setActiveCategory] = useState<TravelCategory | 'all'>('all');
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [places, setPlaces] = useState<TravelPlace[]>([]);
  const [isLoadingCoords, setIsLoadingCoords] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState({ current: 0, total: 0 });

  const stats = useMemo(() => {
    const countries = new Set(places.map(p => p.country));
    const allYears = places.flatMap(p => p.visits.map(v => v.year));
    const totalVisits = allYears.length;
    
    return {
      totalPlaces: places.length,
      totalVisits,
      homeCount: places.filter(p => p.category === 'home').length,
      domesticCount: places.filter(p => p.category === 'domestic').length,
      internationalCount: places.filter(p => p.category === 'international').length,
      countries: Array.from(countries),
      yearRange: {
        min: allYears.length > 0 ? Math.min(...allYears) : new Date().getFullYear(),
        max: allYears.length > 0 ? Math.max(...allYears) : new Date().getFullYear(),
      },
    };
  }, [places]);

  // 筛选后的地点
  const filteredPlaces = useMemo(() => {
    if (activeCategory === 'all') return places;
    return places.filter(p => p.category === activeCategory);
  }, [places, activeCategory]);

  // 初始化坐标数据
  useEffect(() => {
    let isCancelled = false;

    async function loadCoordinates() {
      setIsLoadingCoords(true);
      
      // 先尝试从缓存获取
      const { getTravelPlaces } = await import('@/data/travelData');
      const cachedPlaces = getTravelPlaces();
      
      // 检查是否所有地点都有坐标
      const placesNeedingCoords = rawTravelPlaces.filter(
        raw => !cachedPlaces.find(cached => cached.name === raw.name && cached.country === raw.country)
      );

      if (placesNeedingCoords.length === 0) {
        // 所有坐标都已缓存
        if (!isCancelled) {
          setPlaces(cachedPlaces);
          setIsLoadingCoords(false);
        }
        return;
      }

      // 需要获取坐标的地点
      if (!isCancelled) {
        setLoadingProgress({ current: 0, total: placesNeedingCoords.length });
      }

      // 批量获取坐标
      const newPlaces = await batchGeocode(
        placesNeedingCoords,
        (current, total, placeName) => {
          if (!isCancelled) {
            setLoadingProgress({ current, total });
          }
        }
      );

      if (!isCancelled) {
        setPlaces([...cachedPlaces, ...newPlaces]);
        setIsLoadingCoords(false);
      }
    }

    loadCoordinates();

    return () => {
      isCancelled = true;
    };
  }, []);

  // 初始化地图
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current || places.length === 0) return;

    import('leaflet').then((L) => {
      // 计算地图中心点（所有地点的平均值）
      const avgLat = places.reduce((sum, p) => sum + p.lat, 0) / places.length;
      const avgLng = places.reduce((sum, p) => sum + p.lng, 0) / places.length;

      // 创建地图
      const map = L.map(mapContainerRef.current!).setView([avgLat, avgLng], 4);

      // 添加地图图层
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      mapRef.current = map;
      setIsMapLoaded(true);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [places]);

  // 更新标记
  useEffect(() => {
    if (!mapRef.current || !isMapLoaded) return;

    import('leaflet').then((L) => {
      // 清除现有标记
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      // 添加新标记
      filteredPlaces.forEach((place) => {
        const icon = createMarkerIcon(CATEGORY_COLORS[place.category]);
        const marker = L.marker([place.lat, place.lng], { icon }).addTo(mapRef.current!);

        const visitCount = place.visits.length;
        const visitsHtml = visitCount > 0 
          ? `<div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(0,0,0,0.1);">
               <div style="display: flex; align-items: center; gap: 4px; font-size: 12px; color: #666; margin-bottom: 4px;">
                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><path d="M12 7v5l4 2"/></svg>
                 <span>访问记录 (${visitCount}次)</span>
               </div>
               <div style="font-size: 12px; color: #333;">${formatVisits(place.visits)}</div>
             </div>`
          : '';
        
        const notesHtml = place.notes
          ? `<div style="display: flex; gap: 8px; font-size: 14px; margin-top: 8px;"><span style="color: #666;">备注：</span><span>${place.notes}</span></div>`
          : '';

        marker.bindPopup(`
          <div style="min-width: 200px; padding: 4px;">
            <div style="font-weight: 600; font-size: 16px; margin-bottom: 4px;">${place.name}</div>
            <div style="display: flex; gap: 8px; font-size: 14px; margin-bottom: 8px;">
              <span style="color: #666;">国家/地区：</span>
              <span>${place.country}</span>
            </div>
            ${notesHtml}
            ${visitsHtml}
            <div style="margin-top: 12px; padding-top: 8px; border-top: 1px solid rgba(0,0,0,0.1); font-size: 12px; color: ${CATEGORY_COLORS[place.category]};">
              ● ${CATEGORY_LABELS[place.category]}
            </div>
          </div>
        `);

        markersRef.current.push(marker);
      });
    });
  }, [filteredPlaces, isMapLoaded]);

  return (
    <div className="min-h-screen bg-background">
      <BackgroundEffects />

      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <Globe className="w-5 h-5" />
              <span className="font-semibold">Decaocto</span>
            </a>

            {/* Navigation */}
            <nav className="flex items-center gap-1">
              <a
                href="/"
                className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors"
              >
                动态
              </a>
              <a
                href="/travel"
                className="px-3 py-1.5 text-sm font-medium text-foreground bg-accent rounded-md"
              >
                足迹
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col h-[calc(100vh-56px)]">
        {/* Subheader with Stats */}
        <div className="bg-muted/30 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Title */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Navigation className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-foreground">旅行足迹</h1>
                  <p className="text-xs text-muted-foreground">
                    {stats.yearRange.min}-{stats.yearRange.max} · 记录走过的每一个角落
                  </p>
                </div>
              </div>

              {/* Stats */}
              <motion.div 
                className="flex items-center gap-4 sm:gap-6 text-sm flex-wrap"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">地点</span>
                  <span className="font-semibold text-foreground">{stats.totalPlaces}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">访问</span>
                  <span className="font-semibold text-foreground">{stats.totalVisits}</span>
                  <span className="text-muted-foreground">次</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">覆盖</span>
                  <span className="font-semibold text-foreground">{stats.countries.length}</span>
                  <span className="text-muted-foreground">个国家/地区</span>
                </div>
              </motion.div>
            </div>

            {/* Category Filters */}
            <motion.div 
              className="flex flex-wrap items-center gap-2 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <CategoryFilter
                category="all"
                label="全部"
                color="#64748b"
                count={stats.totalPlaces}
                isActive={activeCategory === 'all'}
                onClick={() => setActiveCategory('all')}
              />
              <CategoryFilter
                category="home"
                label={CATEGORY_LABELS.home}
                color={CATEGORY_COLORS.home}
                count={stats.homeCount}
                isActive={activeCategory === 'home'}
                onClick={() => setActiveCategory('home')}
              />
              <CategoryFilter
                category="domestic"
                label={CATEGORY_LABELS.domestic}
                color={CATEGORY_COLORS.domestic}
                count={stats.domesticCount}
                isActive={activeCategory === 'domestic'}
                onClick={() => setActiveCategory('domestic')}
              />
              <CategoryFilter
                category="international"
                label={CATEGORY_LABELS.international}
                color={CATEGORY_COLORS.international}
                count={stats.internationalCount}
                isActive={activeCategory === 'international'}
                onClick={() => setActiveCategory('international')}
              />
            </motion.div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          <div ref={mapContainerRef} className="absolute inset-0" />
          
          {/* Loading State */}
          {(isLoadingCoords || !isMapLoaded) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/30 backdrop-blur-sm z-10">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
              <p className="text-sm text-muted-foreground">
                {isLoadingCoords 
                  ? `正在获取坐标... (${loadingProgress.current}/${loadingProgress.total})`
                  : '加载地图中...'
                }
              </p>
              {isLoadingCoords && loadingProgress.total > 0 && (
                <div className="mt-2 w-48 h-1 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ 
                      width: `${(loadingProgress.current / loadingProgress.total) * 100}%` 
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Legend */}
          <motion.div 
            className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg border border-border p-3 shadow-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-xs font-medium text-muted-foreground mb-2">图例</div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS.home }} />
                <span>{CATEGORY_LABELS.home}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS.domestic }} />
                <span>{CATEGORY_LABELS.domestic}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS.international }} />
                <span>{CATEGORY_LABELS.international}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
