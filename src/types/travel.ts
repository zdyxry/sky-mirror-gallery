// 旅行足迹相关类型定义

export type TravelCategory = 'home' | 'domestic' | 'international';

export interface TravelPlace {
  /** 地点名称 */
  name: string;
  /** 纬度 */
  lat: number;
  /** 经度 */
  lng: number;
  /** 国家/地区 */
  country: string;
  /** 首次访问日期 */
  firstVisitDate?: string;
  /** 备注/描述 */
  notes?: string;
  /** 类别：居住地/国内旅行/国际旅行 */
  category: TravelCategory;
}

export interface TravelStats {
  totalPlaces: number;
  homeCount: number;
  domesticCount: number;
  internationalCount;
  countries: string[];
}

export const CATEGORY_COLORS: Record<TravelCategory, string> = {
  home: '#e74c3c',          // 红色 - 居住地
  domestic: '#3498db',      // 蓝色 - 国内旅行
  international: '#9b59b6', // 紫色 - 国际旅行
};

export const CATEGORY_LABELS: Record<TravelCategory, string> = {
  home: '居住地',
  domestic: '国内旅行',
  international: '国际旅行',
};
