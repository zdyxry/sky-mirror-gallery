import type { TravelPlace } from '@/types/travel';
import type { RawTravelPlace } from '@/services/geocoding';

/**
 * 个人旅行足迹数据
 * 
 * 只需填写地点名称，经纬度会自动获取！
 * 如果需要更精确的位置，建议填写 country 字段
 * 
 * 数据结构：
 * - name: 地点名称（必填）
 * - country: 国家/地区（可选，帮助提高搜索准确度）
 * - firstVisitDate: 首次访问日期（可选）
 * - notes: 备注/描述（可选）
 * - category: 类别 - 'home' 居住地 | 'domestic' 国内旅行 | 'international' 国际旅行
 */
export const rawTravelPlaces: RawTravelPlace[] = [
  // ========== 居住地 ==========
  {
    name: '佳木斯',
    country: '中国',
    notes: '故乡，成长之地',
    category: 'home',
  },
  {
    name: '大连',
    country: '中国',
    notes: '海滨城市，宜居之地',
    category: 'home',
  },
  {
    name: '广州',
    country: '中国',
    notes: '羊城，美食之都',
    category: 'home',
  },

  // ========== 国内旅行 ==========
  {
    name: '天津',
    country: '中国',
    notes: '津门故里，相声之乡',
    category: 'domestic',
  },
  {
    name: '厦门',
    country: '中国',
    notes: '海上花园，鼓浪屿',
    category: 'domestic',
  },
  {
    name: '成都',
    country: '中国',
    notes: '天府之国，美食之都',
    category: 'domestic',
  },
  {
    name: '湛江',
    country: '中国',
    notes: '港城，南海之滨',
    category: 'domestic',
  },
  {
    name: '汕头',
    country: '中国',
    notes: '潮汕文化，海滨邹鲁',
    category: 'domestic',
  },

  // ========== 国际旅行 ==========
  {
    name: '摩洛哥',
    country: '摩洛哥',
    notes: '北非明珠，撒哈拉沙漠与蓝色小镇',
    category: 'international',
  },
  {
    name: '新加坡',
    country: '新加坡',
    notes: '花园城市，多元文化',
    category: 'international',
  },
  {
    name: '曼谷',
    country: '泰国',
    notes: '微笑之国，寺庙林立',
    category: 'international',
  },
];

/**
 * 预获取的坐标缓存
 * 运行 npm run geocode 可以更新此缓存
 */
const coordinateCache: Record<string, { lat: number; lng: number }> = {
  '佳木斯-中国': { lat: 47.0216, lng: 132.0441 },
  '大连-中国': { lat: 38.9130, lng: 121.6098 },
  '广州-中国': { lat: 23.1288, lng: 113.2590 },
  '天津-中国': { lat: 39.3033, lng: 117.4164 },
  '厦门-中国': { lat: 24.4801, lng: 118.0853 },
  '成都-中国': { lat: 30.6599, lng: 104.0633 },
  '湛江-中国': { lat: 21.2737, lng: 110.3548 },
  '汕头-中国': { lat: 23.3564, lng: 116.6776 },
  '摩洛哥-摩洛哥': { lat: 28.3348, lng: -10.3713 },
  '新加坡-新加坡': { lat: 1.2899, lng: 103.8519 },
  '曼谷-泰国': { lat: 13.7525, lng: 100.4935 },
};

/**
 * 获取带坐标的完整地点数据
 * 优先使用缓存，如果没有缓存则需要在运行时获取
 */
export function getTravelPlaces(): TravelPlace[] {
  return rawTravelPlaces
    .map((place) => {
      const cacheKey = `${place.name}-${place.country || ''}`;
      const coords = coordinateCache[cacheKey];
      
      if (!coords) {
        console.warn(`坐标未缓存: ${place.name}，将在运行时获取`);
        return null;
      }
      
      return {
        ...place,
        lat: coords.lat,
        lng: coords.lng,
      };
    })
    .filter((place): place is TravelPlace => place !== null);
}

/**
 * 获取旅行统计信息
 */
export function getTravelStats() {
  const places = getTravelPlaces();
  const countries = new Set(places.map(p => p.country));
  return {
    totalPlaces: places.length,
    homeCount: places.filter(p => p.category === 'home').length,
    domesticCount: places.filter(p => p.category === 'domestic').length,
    internationalCount: places.filter(p => p.category === 'international').length,
    countries: Array.from(countries),
  };
}
