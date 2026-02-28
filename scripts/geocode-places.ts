/**
 * 旅行足迹坐标批量获取工具
 * 
 * 使用方法:
 * npx tsx scripts/geocode-places.ts
 * 
 * 这个脚本会:
 * 1. 读取 src/data/travelData.ts 中的 rawTravelPlaces
 * 2. 使用 OpenStreetMap Nominatim API 获取每个地点的坐标
 * 3. 更新文件中的 coordinateCache
 * 
 * 注意: 此脚本需要网络连接，且由于 API 限制，每秒只能请求一次
 */

import { rawTravelPlaces } from '../src/data/travelData';
import { geocodeLocation } from '../src/services/geocoding';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE_PATH = path.join(__dirname, '../src/data/travelData.ts');

async function main() {
  console.log('🗺️  旅行足迹坐标批量获取工具\n');
  console.log(`📍 共 ${rawTravelPlaces.length} 个地点需要获取坐标\n`);

  const results = [];
  
  for (let i = 0; i < rawTravelPlaces.length; i++) {
    const place = rawTravelPlaces[i];
    console.log(`[${i + 1}/${rawTravelPlaces.length}] 正在获取: ${place.name} (${place.country || '未知'})`);
    
    const coords = await geocodeLocation(place.name, place.country);
    
    if (coords) {
      console.log(`  ✅ 成功: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
      results.push({ place, coords });
    } else {
      console.log(`  ❌ 失败: 无法获取坐标`);
      results.push({ place, coords: null });
    }

    // 遵守 API 速率限制
    if (i < rawTravelPlaces.length - 1) {
      await delay(1100);
    }
  }

  console.log('\n📊 获取结果统计:');
  const successCount = results.filter(r => r.coords !== null).length;
  const failCount = results.length - successCount;
  console.log(`  ✅ 成功: ${successCount}`);
  console.log(`  ❌ 失败: ${failCount}`);

  if (successCount > 0) {
    console.log('\n💾 正在更新数据文件...');
    
    // 读取原文件内容
    const originalContent = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
    
    // 生成新的缓存对象
    const cacheEntries = results
      .filter(r => r.coords !== null)
      .map(r => {
        const key = `${r.place.name}-${r.place.country || ''}`;
        return `  '${key}': { lat: ${r.coords!.lat.toFixed(4)}, lng: ${r.coords!.lng.toFixed(4)} }`;
      });

    const newCacheContent = `const coordinateCache: Record<string, { lat: number; lng: number }> = {\n${cacheEntries.join(',\n')},\n};`;

    // 替换文件中的 coordinateCache
    const updatedContent = originalContent.replace(
      /const coordinateCache: Record<string, \{ lat: number; lng: number \}> = \{[\s\S]*?\};/,
      newCacheContent
    );

    fs.writeFileSync(DATA_FILE_PATH, updatedContent, 'utf-8');
    console.log(`  ✅ 已更新: ${DATA_FILE_PATH}`);
  }

  if (failCount > 0) {
    console.log('\n⚠️  以下地点获取失败，请手动检查:');
    results
      .filter(r => r.coords === null)
      .forEach(r => {
        console.log(`  - ${r.place.name} (${r.place.country || '未知'})`);
      });
  }

  console.log('\n✨ 完成!');
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

main().catch(console.error);
