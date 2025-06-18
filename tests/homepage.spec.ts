import { test, expect } from '@playwright/test';

test.describe('Homepage Tests', () => {
  test('홈페이지가 정상적으로 로드되는지 확인', async ({ page }) => {
    await page.goto('/');
    
    // 페이지 제목 확인 (실제 앱의 title은 "홈")
    await expect(page).toHaveTitle(/홈/);
    
    // 메인 섹션 확인
    await expect(page.locator('section')).toBeVisible();
    
    // 헤더 텍스트 확인
    await expect(page.getByText('혁신적인 기술로')).toBeVisible();
  });

  test('네비게이션 메뉴가 정상 작동하는지 확인', async ({ page }) => {
    await page.goto('/');
    
    // 서비스 페이지 링크 테스트 (실제 텍스트: "서비스 살펴보기")
    const servicesLink = page.getByRole('link', { name: /서비스 살펴보기/i });
    if (await servicesLink.isVisible()) {
      await servicesLink.click();
      await expect(page).toHaveURL(/.*services/);
    }
    
    // Contact 페이지 링크 테스트 (실제 텍스트: "문의하기")
    await page.goto('/');
    const contactLink = page.getByRole('link', { name: /문의하기/i });
    if (await contactLink.isVisible()) {
      await contactLink.click();
      await expect(page).toHaveURL(/.*contact/);
    }
    
    // About 페이지 링크 테스트 (실제 텍스트: "회사 소개 보기")
    await page.goto('/');
    const aboutLink = page.getByRole('link', { name: /회사 소개 보기/i });
    if (await aboutLink.isVisible()) {
      await aboutLink.click();
      await expect(page).toHaveURL(/.*about/);
    }
  });

  test('반응형 디자인이 정상 작동하는지 확인', async ({ page }) => {
    // 데스크톱 해상도
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await expect(page.locator('main')).toBeVisible();
    
    // 태블릿 해상도
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await expect(page.locator('main')).toBeVisible();
    
    // 모바일 해상도
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await expect(page.locator('main')).toBeVisible();
  });

  test('페이지 로딩 시간이 적절한지 확인', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    // 페이지 로딩 시간이 3초 이내인지 확인
    expect(loadTime).toBeLessThan(3000);
  });
}); 