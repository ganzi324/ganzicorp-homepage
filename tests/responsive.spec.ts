import { test, expect } from '@playwright/test';

test.describe('Responsive Design Tests', () => {
  const viewports = [
    { name: 'Mobile Small', width: 375, height: 667 },
    { name: 'Mobile Medium', width: 414, height: 896 },
    { name: 'Tablet Portrait', width: 768, height: 1024 },
    { name: 'Tablet Landscape', width: 1024, height: 768 },
    { name: 'Desktop', width: 1920, height: 1080 },
    { name: 'Large Desktop', width: 2560, height: 1440 }
  ];

  for (const viewport of viewports) {
    test(`${viewport.name} (${viewport.width}x${viewport.height}) 반응형 테스트`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');

      // 1. 페이지 로딩 확인
      await expect(page).toHaveTitle(/홈/);

      // 2. 네비게이션 반응형 확인 (더 구체적인 셀렉터 사용)
      const header = page.locator('header');
      await expect(header).toBeVisible();
      
      // 3. 메인 제목 가시성 확인 (첫 번째 h1만 선택)
      const mainTitle = page.locator('h1').first();
      await expect(mainTitle).toBeVisible();

      // 4. 텍스트 크기 확인 (readability)
      const bodyText = page.locator('p').first();
      if (await bodyText.isVisible()) {
        const fontSize = await bodyText.evaluate(el => {
          return parseInt(window.getComputedStyle(el).fontSize);
        });
        expect(fontSize).toBeGreaterThanOrEqual(16); // 최소 16px
      }

      // 5. 이미지 반응형 확인
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        if (await img.isVisible()) {
          const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
          const displayWidth = await img.evaluate((el: HTMLImageElement) => el.offsetWidth);
          
          if (naturalWidth > 0 && displayWidth > 0) {
            expect(displayWidth).toBeLessThanOrEqual(viewport.width);
          }
        }
      }

      // 6. 터치 타겟 크기 확인 (모바일에서만)
      if (viewport.width <= 768) {
        const buttons = page.locator('button, a[role="button"], [role="button"]');
        const buttonCount = await buttons.count();
        
        for (let i = 0; i < Math.min(buttonCount, 5); i++) { // 처음 5개만 체크
          const button = buttons.nth(i);
          if (await button.isVisible()) {
            const box = await button.boundingBox();
            if (box) {
              // 최소 44px x 44px (접근성 가이드라인)
              expect(box.width).toBeGreaterThanOrEqual(44);
              expect(box.height).toBeGreaterThanOrEqual(44);
            }
          }
        }
      }

      // 7. 메뉴 버튼 확인 (모바일에서만)
      if (viewport.width <= 768) {
        const menuButton = page.locator('[aria-label*="menu"], [aria-label*="메뉴"], button:has-text("메뉴")').first();
        if (await menuButton.count() > 0) {
          await expect(menuButton).toBeVisible();
        }
      }

      // 8. 컨테이너 너비 확인
      const mainContainer = page.locator('main, [role="main"]').first();
      if (await mainContainer.count() > 0) {
        const containerWidth = await mainContainer.evaluate((el: HTMLElement) => el.offsetWidth);
        expect(containerWidth).toBeLessThanOrEqual(viewport.width);
      }

      // 9. 스크롤 확인
      await page.evaluate(() => window.scrollTo(0, 100));
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBeGreaterThan(0);

      // 10. 폰트 로딩 확인
      await page.waitForLoadState('networkidle');
      const fontLoaded = await page.evaluate(() => {
        return document.fonts.ready.then(() => true);
      });
      expect(fontLoaded).toBe(true);

      console.log(`✅ ${viewport.name} 테스트 완료`);
    });
  }

  test('가로/세로 방향 전환 테스트', async ({ page }) => {
    // 세로 방향으로 시작
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    const portraitHeight = await page.evaluate(() => document.body.scrollHeight);
    
    // 가로 방향으로 전환
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.waitForTimeout(500); // 레이아웃 안정화 대기
    
    const landscapeHeight = await page.evaluate(() => document.body.scrollHeight);
    
    // 방향 전환 후에도 콘텐츠가 올바르게 표시되는지 확인
    const mainTitle = page.locator('h1').first();
    await expect(mainTitle).toBeVisible();
    
    console.log(`Portrait height: ${portraitHeight}px, Landscape height: ${landscapeHeight}px`);
  });
}); 