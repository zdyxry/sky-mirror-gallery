import type { TravelPlace } from '@/types/travel';
import type { RawTravelPlace } from '@/types/travel';

/**
 * 个人旅行足迹数据
 * 
 * 只需填写地点名称，经纬度会自动获取！
 * 支持一个城市多次访问的记录
 * 
 * 数据结构：
 * - name: 地点名称（必填）
 * - country: 国家/地区（可选，帮助提高搜索准确度）
 * - category: 类别 - 'home' 居住地 | 'domestic' 国内旅行 | 'international' 国际旅行
 * - visits: 访问记录数组，每个记录包含年份和描述
 * - notes: 备注（可选）
 */
export const rawTravelPlaces: RawTravelPlace[] = [
  // ========== 居住地 ==========
  {
    name: '佳木斯',
    country: '中国',
    category: 'home',
    visits: [],
    notes: '故乡，成长之地',
  },
  {
    name: '大连',
    country: '中国',
    category: 'home',
    visits: [
      { year: 2025, description: '探亲' },
      { year: 2024, description: '探亲' },
    ],
    notes: '海滨城市，宜居之地',
  },
  {
    name: '广州',
    country: '中国',
    category: 'home',
    visits: [],
    notes: '羊城，美食之都',
  },

  // ========== 国内旅行 ==========
  // 2026
  {
    name: '湛江',
    country: '中国',
    category: 'domestic',
    visits: [
      { year: 2026, description: '出差' },
      { year: 2025, description: '出差' },
    ],
    notes: '港城，南海之滨',
  },
  {
    name: '东莞',
    country: '中国',
    category: 'domestic',
    visits: [
      { year: 2026, description: '出差' },
      { year: 2024, description: '出差' },
    ],
  },
  {
    name: '天津',
    country: '中国',
    category: 'domestic',
    visits: [
      { year: 2026, description: '探亲' },
    ],
    notes: '津门故里，相声之乡',
  },

  // 2025
  {
    name: '河源',
    country: '中国',
    category: 'domestic',
    visits: [
      { year: 2025, description: '出差' },
      { year: 2024, description: '出差' },
    ],
  },
  {
    name: '江门',
    country: '中国',
    category: 'domestic',
    visits: [
      { year: 2025, description: '出差' },
    ],
  },
  {
    name: '成都',
    country: '中国',
    category: 'domestic',
    visits: [
      { year: 2025, description: '旅行' },
    ],
    notes: '天府之国，美食之都',
  },
  {
    name: '韶关',
    country: '中国',
    category: 'domestic',
    visits: [
      { year: 2025, description: '旅行' },
    ],
  },
  {
    name: '深圳',
    country: '中国',
    category: 'domestic',
    visits: [
      { year: 2025, description: '出差' },
      { year: 2024, description: '演唱会、出差' },
    ],
  },
  {
    name: '澳门',
    country: '中国',
    category: 'domestic',
    visits: [
      { year: 2025, description: '旅行' },
      { year: 2024, description: '旅行' },
    ],
  },
  {
    name: '珠海',
    country: '中国',
    category: 'domestic',
    visits: [
      { year: 2025, description: '旅行' },
      { year: 2024, description: '旅行、出差' },
    ],
  },
  {
    name: '清远',
    country: '中国',
    category: 'domestic',
    visits: [
      { year: 2025, description: '旅行' },
    ],
  },
  {
    name: '温州',
    country: '中国',
    category: 'domestic',
    visits: [
      { year: 2025, description: '旅行' },
    ],
  },

  // 2024
  {
    name: '揭阳',
    country: '中国',
    category: 'domestic',
    visits: [
      { year: 2024, description: '出差' },
    ],
  },
  {
    name: '香港',
    country: '中国',
    category: 'domestic',
    visits: [
      { year: 2024, description: '旅行' },
    ],
  },
  {
    name: '汕头',
    country: '中国',
    category: 'domestic',
    visits: [
      { year: 2024, description: '出差' },
    ],
    notes: '潮汕文化，海滨邹鲁',
  },
  {
    name: '南宁',
    country: '中国',
    category: 'domestic',
    visits: [
      { year: 2024, description: '出差' },
    ],
  },
  {
    name: '惠来',
    country: '中国',
    category: 'domestic',
    visits: [
      { year: 2024, description: '出差' },
    ],
  },
  {
    name: '长沙',
    country: '中国',
    category: 'domestic',
    visits: [
      { year: 2024, description: '旅行' },
    ],
  },
  {
    name: '佛山',
    country: '中国',
    category: 'domestic',
    visits: [
      { year: 2024, description: '旅行' },
    ],
  },
  {
    name: '厦门',
    country: '中国',
    category: 'domestic',
    visits: [
      { year: 2026, description: '旅行' },
    ],
    notes: '海上花园，鼓浪屿',
  },

  // 2016-2020
  {
    name: '南京',
    country: '中国',
    category: 'domestic',
    visits: [
      { year: 2016, description: '旅行' },
    ],
  },
  {
    name: '上海',
    country: '中国',
    category: 'domestic',
    visits: [
      { year: 2017, description: '旅行' },
    ],
  },
  {
    name: '杭州',
    country: '中国',
    category: 'domestic',
    visits: [
      { year: 2017, description: '旅行' },
    ],
  },
  {
    name: '乌镇',
    country: '中国',
    category: 'domestic',
    visits: [
      { year: 2017, description: '旅行' },
    ],
  },
  {
    name: '合肥',
    country: '中国',
    category: 'domestic',
    visits: [
      { year: 2018, description: '旅行' },
    ],
  },
  {
    name: '北京',
    country: '中国',
    category: 'domestic',
    visits: [
      { year: 2019, description: '旅行' },
      { year: 2020, description: '旅行' },
    ],
  },
  {
    name: '郑州',
    country: '中国',
    category: 'domestic',
    visits: [
      { year: 2020, description: '旅行' },
    ],
  },
  {
    name: '洛阳',
    country: '中国',
    category: 'domestic',
    visits: [
      { year: 2020, description: '旅行' },
    ],
  },
  {
    name: '太原',
    country: '中国',
    category: 'domestic',
    visits: [
      { year: 2020, description: '旅行' },
    ],
  },
  {
    name: '西安',
    country: '中国',
    category: 'domestic',
    visits: [
      { year: 2020, description: '旅行' },
    ],
  },

  // 东北地区
  {
    name: '齐齐哈尔',
    country: '中国',
    category: 'domestic',
    visits: [
      { year: 2013, description: '旅行' },
    ],
  },
  {
    name: '长春',
    country: '中国',
    category: 'domestic',
    visits: [
      { year: 2014, description: '旅行' },
    ],
  },
  {
    name: '沈阳',
    country: '中国',
    category: 'domestic',
    visits: [
      { year: 2016, description: '旅行' },
      { year: 2020, description: '考试' },
    ],
  },
  {
    name: '哈尔滨',
    country: '中国',
    category: 'domestic',
    visits: [
      { year: 2022, description: '探亲' },
    ],
  },
  {
    name: '海拉尔',
    country: '中国',
    category: 'domestic',
    visits: [
      { year: 2022, description: '旅行' },
    ],
  },

  // ========== 国际旅行 ==========
  {
    name: '摩洛哥',
    country: '摩洛哥',
    category: 'international',
    visits: [
      { year: 2018, description: '旅行' },
    ],
    notes: '北非明珠，撒哈拉沙漠与蓝色小镇',
  },
  {
    name: '新加坡',
    country: '新加坡',
    category: 'international',
    visits: [
      { year: 2025, description: '旅行' },
    ],
    notes: '花园城市，多元文化',
  },
  {
    name: '曼谷',
    country: '泰国',
    category: 'international',
    visits: [
      { year: 2024, description: '旅行' },
    ],
    notes: '微笑之国，寺庙林立',
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
  '湛江-中国': { lat: 21.2737, lng: 110.3548 },
  '东莞-中国': { lat: 23.0184, lng: 113.7452 },
  '天津-中国': { lat: 39.3033, lng: 117.4164 },
  '河源-中国': { lat: 23.7468, lng: 114.6954 },
  '江门-中国': { lat: 22.5817, lng: 113.0761 },
  '成都-中国': { lat: 30.6599, lng: 104.0633 },
  '韶关-中国': { lat: 24.8136, lng: 113.5922 },
  '深圳-中国': { lat: 22.5446, lng: 114.0545 },
  '澳门-中国': { lat: 22.1758, lng: 113.5514 },
  '珠海-中国': { lat: 22.2737, lng: 113.5721 },
  '清远-中国': { lat: 23.6833, lng: 113.0506 },
  '温州-中国': { lat: 27.9964, lng: 120.6953 },
  '揭阳-中国': { lat: 23.5532, lng: 116.3680 },
  '香港-中国': { lat: 22.2793, lng: 114.1629 },
  '汕头-中国': { lat: 23.3564, lng: 116.6776 },
  '南宁-中国': { lat: 22.8193, lng: 108.3627 },
  '惠来-中国': { lat: 23.0326, lng: 116.2257 },
  '长沙-中国': { lat: 28.1988, lng: 112.9709 },
  '佛山-中国': { lat: 23.0240, lng: 113.1160 },
  '厦门-中国': { lat: 24.4801, lng: 118.0853 },
  '南京-中国': { lat: 32.0438, lng: 118.7789 },
  '上海-中国': { lat: 31.2313, lng: 121.4700 },
  '杭州-中国': { lat: 30.2490, lng: 120.2052 },
  '乌镇-中国': { lat: 30.7465, lng: 120.4819 },
  '合肥-中国': { lat: 31.8666, lng: 117.2814 },
  '北京-中国': { lat: 39.9057, lng: 116.3913 },
  '郑州-中国': { lat: 34.7473, lng: 113.6193 },
  '洛阳-中国': { lat: 34.6197, lng: 112.4477 },
  '太原-中国': { lat: 37.8600, lng: 112.5818 },
  '西安-中国': { lat: 34.2610, lng: 108.9423 },
  '齐齐哈尔-中国': { lat: 47.7364, lng: 124.6568 },
  '长春-中国': { lat: 43.8844, lng: 125.3181 },
  '沈阳-中国': { lat: 41.8026, lng: 123.4279 },
  '哈尔滨-中国': { lat: 45.7594, lng: 126.6276 },
  '海拉尔-中国': { lat: 49.2321, lng: 119.8172 },
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
}
