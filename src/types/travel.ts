// 旅行足迹相关类型定义

export type TravelCategory = 'home' | 'domestic' | 'international';

export interface TravelVisit {
  /** 访问年份 */
  year: number;
  /** 访问描述/原因 */
  description: string;
}

export interface TravelPlace {
  /** 地点名称 */
  name: string;
  /** 纬度 */
  lat: number;
  /** 经度 */
  lng: number;
  /** 国家/地区 */
  country: string;
  /** 类别：居住地/国内旅行/国际旅行 */
  category: TravelCategory;
  /** 所有访问记录 */
  visits: TravelVisit[];
  /** 备注（可选） */
  notes?: string;
}

export interface RawTravelPlace {
  /** 地点名称 */
  name: string;
  /** 国家/地区（可选，帮助提高搜索准确度） */
  country?: string;
  /** 类别：居住地/国内旅行/国际旅行 */
  category: TravelCategory;
  /** 所有访问记录 */
  visits: TravelVisit[];
  /** 备注（可选） */
  notes?: string;
}

export interface TravelStats {
  totalPlaces: number;
  totalVisits: number;
  homeCount: number;
  domesticCount: number;
  internationalCount: number;
  countries: string[];
  yearRange: {
    min: number;
    max: number;
  };
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
