import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('페이지 로딩 성능 테스트', async ({ page }) => {
    // 성능 메트릭 수집 시작
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Performance API를 사용하여 로딩 시간 측정
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      return {
        // Core Web Vitals
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        totalTime: navigation.loadEventEnd - navigation.fetchStart,
        
        // Paint metrics
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        
        // Network metrics
        dns: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcp: navigation.connectEnd - navigation.connectStart,
        request: navigation.responseStart - navigation.requestStart,
        response: navigation.responseEnd - navigation.responseStart,
        
        // Document metrics
        domInteractive: navigation.domInteractive - navigation.fetchStart,
        domComplete: navigation.domComplete - navigation.fetchStart,
      };
    });

    console.log('Performance Metrics:', performanceMetrics);

    // 성능 기준 검증 (개발 환경에 맞게 조정)
    expect(performanceMetrics.totalTime).toBeLessThan(8000); // 8초 이내 (개발 환경)
    expect(performanceMetrics.firstContentfulPaint).toBeLessThan(3000); // FCP 3초 이내
    expect(performanceMetrics.domInteractive).toBeLessThan(5000); // DOM 인터랙티브 5초 이내
  });

  test('리소스 로딩 최적화 테스트', async ({ page }) => {
    // 네트워크 요청 모니터링
    const requests: Array<{ url: string; size: number; type: string; status: number }> = [];
    
    page.on('response', async (response) => {
      try {
        const request = response.request();
        const headers = await response.allHeaders();
        const size = parseInt(headers['content-length'] || '0');
        
        requests.push({
          url: request.url(),
          size: size,
          type: request.resourceType(),
          status: response.status()
        });
      } catch {
        // 일부 요청은 헤더를 가져올 수 없을 수 있음
      }
    });

    await page.goto('/', { waitUntil: 'networkidle' });

    console.log(`Total requests: ${requests.length}`);
    
    // 이미지 최적화 확인
    const images = requests.filter(r => r.type === 'image');
    console.log(`Image requests: ${images.length}`);
    
    // CSS/JS 최적화 확인
    const stylesheets = requests.filter(r => r.type === 'stylesheet');
    const scripts = requests.filter(r => r.type === 'script');
    
    console.log(`CSS files: ${stylesheets.length}`);
    console.log(`JS files: ${scripts.length}`);

    // 실패한 요청 확인
    const failedRequests = requests.filter(r => r.status >= 400);
    expect(failedRequests.length).toBe(0);

    // 요청 수 제한 (너무 많은 요청은 성능 저하)
    expect(requests.length).toBeLessThan(50);
  });

  test('JavaScript 번들 크기 테스트', async ({ page }) => {
    const jsResources: Array<{ url: string; size: number }> = [];
    
    page.on('response', async (response) => {
      try {
        const request = response.request();
        if (request.resourceType() === 'script') {
          const buffer = await response.body();
          jsResources.push({
            url: request.url(),
            size: buffer.length
          });
        }
      } catch {
        // 일부 요청은 body를 가져올 수 없을 수 있음
      }
    });

    await page.goto('/', { waitUntil: 'networkidle' });

    const totalJSSize = jsResources.reduce((total, resource) => total + resource.size, 0);
    const totalJSSizeMB = totalJSSize / (1024 * 1024);
    
    console.log(`Total JS bundle size: ${totalJSSizeMB.toFixed(2)} MB`);
    console.log('JS Resources:', jsResources.map(r => ({
      url: r.url.split('/').pop(),
      sizeMB: (r.size / (1024 * 1024)).toFixed(2)
    })));

    // JS 번들 크기 제한 (5MB 이하)
    expect(totalJSSizeMB).toBeLessThan(5);
  });

  test('메모리 사용량 테스트', async ({ page }) => {
    await page.goto('/');
    
    // 메모리 사용량 측정
    const memoryInfo = await page.evaluate(() => {
      // performance.memory는 Chrome에서만 사용 가능
      return (performance as any).memory ? {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
      } : null;
    });

    if (memoryInfo) {
      const usedMemoryMB = memoryInfo.usedJSHeapSize / (1024 * 1024);
      console.log(`Used memory: ${usedMemoryMB.toFixed(2)} MB`);
      
      // 메모리 사용량 제한 (100MB 이하)
      expect(usedMemoryMB).toBeLessThan(100);
    }
  });

  test('이미지 최적화 테스트', async ({ page }) => {
    await page.goto('/');
    
    // 페이지의 모든 이미지 분석
    const images = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.map(img => ({
        src: img.src,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        displayWidth: img.offsetWidth,
        displayHeight: img.offsetHeight,
        loading: img.loading,
        alt: img.alt
      }));
    });

    console.log('Image analysis:', images);

    for (const img of images) {
      // 이미지가 과도하게 큰지 확인 (표시 크기의 2배 이상이면 최적화 필요)
      if (img.naturalWidth > 0 && img.displayWidth > 0) {
        const widthRatio = img.naturalWidth / img.displayWidth;
        const heightRatio = img.naturalHeight / img.displayHeight;
        
        console.log(`Image ${img.src.split('/').pop()}: width ratio ${widthRatio.toFixed(2)}, height ratio ${heightRatio.toFixed(2)}`);
        
        // 이미지 최적화 권장 (비율이 2 이상이면 권장사항 출력)
        if (widthRatio > 2 || heightRatio > 2) {
          console.warn(`⚠️ Image optimization recommended for: ${img.src}`);
        }
      }

      // alt 텍스트 확인 (접근성)
      if (!img.alt && img.src) {
        console.warn(`⚠️ Missing alt text for image: ${img.src}`);
      }

      // lazy loading 확인
      if (img.loading !== 'lazy' && img.src) {
        console.log(`💡 Consider adding loading="lazy" to: ${img.src}`);
      }
    }
  });

  test('폰트 로딩 성능 테스트', async ({ page }) => {
    await page.goto('/');
    
    // 폰트 로딩 상태 확인
    const fontLoadPromises = await page.evaluate(() => {
      if ('fonts' in document) {
        return Promise.all([
          (document as any).fonts.ready,
          (document as any).fonts.load('1em Arial'),
        ]).then(() => {
          const loadedFonts = Array.from((document as any).fonts.values()).map((font: any) => ({
            family: font.family,
            style: font.style,
            weight: font.weight,
            status: font.status
          }));
          return loadedFonts;
        });
      }
      return [];
    });

    console.log('Loaded fonts:', await fontLoadPromises);
  });

  test('CSS 최적화 테스트', async ({ page }) => {
    const cssResources: Array<{ url: string; size: number }> = [];
    
    page.on('response', async (response) => {
      try {
        const request = response.request();
        if (request.resourceType() === 'stylesheet') {
          const buffer = await response.body();
          cssResources.push({
            url: request.url(),
            size: buffer.length
          });
        }
      } catch {
        // 일부 요청은 body를 가져올 수 없을 수 있음
      }
    });

    await page.goto('/', { waitUntil: 'networkidle' });

    const totalCSSSize = cssResources.reduce((total, resource) => total + resource.size, 0);
    const totalCSSSizeKB = totalCSSSize / 1024;
    
    console.log(`Total CSS size: ${totalCSSSizeKB.toFixed(2)} KB`);
    console.log('CSS Resources:', cssResources.map(r => ({
      url: r.url.split('/').pop(),
      sizeKB: (r.size / 1024).toFixed(2)
    })));

    // CSS 크기 제한 (1MB 이하)
    expect(totalCSSSizeKB).toBeLessThan(1024);
  });
}); 