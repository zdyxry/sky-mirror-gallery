import type { TravelPlace, RawTravelPlace } from '@/types/travel';

// 坐标缓存，避免重复请求
const coordinateCache = new Map<string, { lat: number; lng: number }>();

/**
 * 使用 OpenStreetMap Nominatim API 获取地理坐标
 * 免费使用，无需 API Key，但有使用限制（每秒 1 次请求）
 * 
 * @param name 地点名称
 * @param country 可选的国家/地区，用于提高搜索准确度
 * @returns 经纬度坐标
 */
export async function geocodeLocation(
  name: string,
  country?: string
): Promise<{ lat: number; lng: number } | null> {
  const cacheKey = `${name}-${country || ''}`;
  
  // 检查缓存
  if (coordinateCache.has(cacheKey)) {
    return coordinateCache.get(cacheKey)!;
  }

  try {
    // 构建搜索查询
    const query = country ? `${name}, ${country}` : name;
    const encodedQuery = encodeURIComponent(query);
    
    // Nominatim API 请求
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&limit=1`,
      {
        headers: {
          'User-Agent': 'Decaocto-TravelMap/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const result = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
      
      // 存入缓存
      coordinateCache.set(cacheKey, result);
      return result;
    }

    return null;
  } catch (error) {
    console.error(`Failed to geocode "${name}":`, error);
    return null;
  }
}

/**
 * 批量地理编码，带延迟以避免触发速率限制
 * 
 * @param places 原始地点数据（不含坐标）
 * @param onProgress 进度回调
 * @returns 完整的地点数据（含坐标）
 */
export async function batchGeocode(
  places: RawTravelPlace[],
  onProgress?: (current: number, total: number, placeName: string) => void
): Promise<TravelPlace[]> {
  const results: TravelPlace[] = [];
  const errors: string[] = [];

  for (let i = 0; i < places.length; i++) {
    const place = places[i];
    
    onProgress?.(i + 1, places.length, place.name);

    const coords = await geocodeLocation(place.name, place.country);

    if (coords) {
      results.push({
        ...place,
        lat: coords.lat,
        lng: coords.lng,
        country: place.country || '未知',
      });
    } else {
      errors.push(place.name);
      console.warn(`无法获取 "${place.name}" 的坐标`);
    }

    // 遵守 Nominatim 的使用政策：每秒最多 1 次请求
    if (i < places.length - 1) {
      await delay(1100);
    }
  }

  if (errors.length > 0) {
    console.warn('以下地点无法获取坐标:', errors);
  }

  return results;
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
