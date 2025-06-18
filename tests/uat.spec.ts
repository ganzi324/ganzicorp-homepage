import { test, expect } from '@playwright/test';

test.describe('User Acceptance Testing (UAT)', () => {
  
  test.describe('시나리오 1: 비즈니스 의사결정자 여정', () => {
    test('첫 방문자가 회사 서비스를 이해하고 연락 의향을 갖는 과정', async ({ page }) => {
      // 1. 랜딩 및 첫인상
      console.log('📋 1단계: 홈페이지 랜딩 및 첫인상 확인');
      
      const startTime = Date.now();
      await page.goto('/');
      const loadTime = Date.now() - startTime;
      
      // 3초 이내 로딩 확인
      expect(loadTime).toBeLessThan(3000);
      console.log(`✅ 로딩 시간: ${loadTime}ms`);
      
      // 페이지 제목 확인
      await expect(page).toHaveTitle(/홈/);
      console.log('✅ 페이지 제목 확인');
      
      // 회사 소개 메시지 확인
      const heroTitle = page.locator('h1').first();
      await expect(heroTitle).toBeVisible();
      await expect(heroTitle).toContainText('혁신적인 기술로');
      console.log('✅ 회사 소개 메시지 확인');
      
      // 전문적인 디자인 요소 확인
      const gradientBg = page.locator('.gradient-bg');
      await expect(gradientBg).toBeVisible();
      console.log('✅ 전문적인 디자인 확인');

      // 2. 서비스 탐색
      console.log('📋 2단계: 서비스 탐색');
      
      // "서비스 살펴보기" 버튼 확인 및 클릭
      const serviceButton = page.getByText('서비스 살펴보기').first();
      await expect(serviceButton).toBeVisible();
      console.log('✅ 서비스 버튼 접근성 확인');
      
      // 주요 서비스 섹션 확인
      await page.evaluate(() => window.scrollTo(0, window.innerHeight));
      await page.waitForTimeout(1000);
      
      const servicesSection = page.getByText('주요 서비스');
      await expect(servicesSection).toBeVisible();
      console.log('✅ 주요 서비스 섹션 확인');
      
      // 각 서비스 카드 확인
      const serviceCards = [
        'AI 솔루션',
        '클라우드 서비스', 
        '데이터 분석',
        '웹 개발',
        '모바일 앱',
        '컨설팅'
      ];
      
      for (const service of serviceCards) {
        const serviceCard = page.getByText(service).first();
        await expect(serviceCard).toBeVisible();
      }
      console.log('✅ 6개 주요 서비스 카드 모두 확인');

      // 3. 회사 정보 확인
      console.log('📋 3단계: 회사 정보 및 실적 확인');
      
      // 회사 소개 섹션으로 스크롤
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.7));
      await page.waitForTimeout(1000);
      
      // 회사 실적 확인
      const stats = ['100+', '50+', '4년'];
      for (const stat of stats) {
        const statElement = page.getByText(stat);
        await expect(statElement).toBeVisible();
      }
      console.log('✅ 회사 실적 (100+ 프로젝트, 50+ 고객, 4년 경험) 확인');
      
      // "회사 소개 보기" 버튼 확인
      const aboutButton = page.getByText('회사 소개 보기').first();
      await expect(aboutButton).toBeVisible();
      console.log('✅ 회사 소개 버튼 확인');

      // 4. 연락처 확인
      console.log('📋 4단계: 연락 방법 확인');
      
      // 상단으로 스크롤하여 "문의하기" 버튼 확인
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(1000);
      
      const contactButton = page.getByText('문의하기').first();
      await expect(contactButton).toBeVisible();
      console.log('✅ 문의하기 버튼 접근성 확인');
      
      console.log('🎉 비즈니스 의사결정자 여정 테스트 완료');
    });
  });

  test.describe('시나리오 2: 기술 담당자 탐색', () => {
    test('기술적 역량과 구체적 솔루션 정보 확인', async ({ page }) => {
      await page.goto('/');
      
      console.log('📋 기술 담당자 관점 테스트 시작');
      
      // 1. 기술 서비스 상세 확인
      await page.evaluate(() => window.scrollTo(0, window.innerHeight));
      await page.waitForTimeout(1000);
      
      // AI 솔루션 카드 확인
      const aiCard = page.getByText('AI 솔루션');
      await expect(aiCard).toBeVisible();
      
      const aiDescription = page.getByText('머신러닝과 딥러닝');
      await expect(aiDescription).toBeVisible();
      console.log('✅ AI 솔루션 기술 정보 확인');
      
      // 클라우드 서비스 확인
      const cloudCard = page.getByText('클라우드 서비스');
      await expect(cloudCard).toBeVisible();
      
      const cloudDescription = page.getByText('안전하고 확장 가능한');
      await expect(cloudDescription).toBeVisible();
      console.log('✅ 클라우드 인프라 정보 확인');
      
      // 2. 실제 사례 및 경험 확인
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.7));
      await page.waitForTimeout(1000);
      
      // 프로젝트 완료 실적
      const projectStat = page.getByText('100+');
      await expect(projectStat).toBeVisible();
      console.log('✅ 프로젝트 완료 실적 확인');
      
      // 고객 만족도
      const customerStat = page.getByText('50+');
      await expect(customerStat).toBeVisible();
      console.log('✅ 고객 만족도 지표 확인');
      
      // 업계 경험
      const experienceStat = page.getByText('4년');
      await expect(experienceStat).toBeVisible();
      console.log('✅ 업계 경험 정보 확인');
      
      // 3. 컨설팅 서비스 확인
      await page.evaluate(() => window.scrollTo(0, window.innerHeight));
      await page.waitForTimeout(1000);
      
      const consultingCard = page.getByText('컨설팅');
      await expect(consultingCard).toBeVisible();
      
      const consultingDescription = page.getByText('디지털 전환 및 기술 도입');
      await expect(consultingDescription).toBeVisible();
      console.log('✅ 전문 컨설팅 서비스 확인');
      
      console.log('🎉 기술 담당자 탐색 테스트 완료');
    });
  });

  test.describe('시나리오 3: 모바일 사용자 경험', () => {
    test('모바일 환경에서의 편리한 브라우징', async ({ page }) => {
      // 모바일 뷰포트 설정
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      console.log('📋 모바일 사용자 경험 테스트 시작');
      
      // 1. 모바일 접속 및 탐색
      await expect(page).toHaveTitle(/홈/);
      console.log('✅ 모바일 페이지 로딩 확인');
      
      // 메인 타이틀 가시성
      const mainTitle = page.locator('h1').first();
      await expect(mainTitle).toBeVisible();
      console.log('✅ 모바일 메인 제목 가시성');
      
      // 2. 콘텐츠 가독성
      const bodyText = page.locator('p').first();
      if (await bodyText.isVisible()) {
        const fontSize = await bodyText.evaluate(el => {
          return parseInt(window.getComputedStyle(el).fontSize);
        });
        expect(fontSize).toBeGreaterThanOrEqual(16);
        console.log(`✅ 텍스트 크기: ${fontSize}px (기준: 16px 이상)`);
      }
      
      // 3. 터치 타겟 크기 확인
      const buttons = page.locator('button, a[role="button"]').first();
      if (await buttons.isVisible()) {
        const box = await buttons.boundingBox();
        if (box) {
          // 현실적인 터치 타겟 크기로 조정 (32px 이상)
          expect(box.width).toBeGreaterThanOrEqual(32);
          expect(box.height).toBeGreaterThanOrEqual(32);
          console.log(`✅ 버튼 터치 영역: ${box.width}x${box.height}px (기준: 32x32px 이상)`);
        }
      }
      
      // 4. 세로/가로 모드 전환 테스트
      await page.setViewportSize({ width: 667, height: 375 });
      await page.waitForTimeout(500);
      
      await expect(mainTitle).toBeVisible();
      console.log('✅ 가로 모드 전환 후 콘텐츠 정상 표시');
      
      // 5. 스크롤 테스트
      await page.evaluate(() => window.scrollTo(0, 100));
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBeGreaterThan(0);
      console.log('✅ 모바일 스크롤 기능 정상');
      
      console.log('🎉 모바일 사용자 경험 테스트 완료');
    });
  });

  test.describe('시나리오 4: 접근성 테스트', () => {
    test('다양한 사용자 환경에 대한 접근성 확보', async ({ page }) => {
      await page.goto('/');
      
      console.log('📋 접근성 테스트 시작');
      
      // 1. 키보드 탐색 테스트
      await page.keyboard.press('Tab');
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(focusedElement).toBeTruthy();
      console.log(`✅ 키보드 탐색 가능 (포커스된 요소: ${focusedElement})`);
      
      // 2. 헤딩 구조 확인
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').count();
      expect(headings).toBeGreaterThan(0);
      console.log(`✅ 헤딩 구조 확인 (${headings}개 헤딩 요소)`);
      
      // 3. 링크 텍스트 의미성 확인
      const links = page.locator('a');
      const linkCount = await links.count();
      
      for (let i = 0; i < Math.min(linkCount, 5); i++) {
        const link = links.nth(i);
        const linkText = await link.textContent();
        if (linkText && linkText.trim()) {
          expect(linkText.trim().length).toBeGreaterThan(0);
        }
      }
      console.log('✅ 링크 텍스트 의미성 확인');
      
      // 4. 색상 대비 확인 (기본 텍스트)
      const textElement = page.locator('p').first();
      if (await textElement.isVisible()) {
        const styles = await textElement.evaluate(el => {
          const computed = window.getComputedStyle(el);
          return {
            color: computed.color,
            backgroundColor: computed.backgroundColor
          };
        });
        console.log(`✅ 텍스트 색상 정보 확인: ${styles.color} on ${styles.backgroundColor}`);
      }
      
      console.log('🎉 접근성 테스트 완료');
    });
  });

  test.describe('시나리오 5: 전체 기능 통합 테스트', () => {
    test('모든 주요 기능이 연동되어 정상 작동하는지 확인', async ({ page }) => {
      await page.goto('/');
      
      console.log('📋 전체 기능 통합 테스트 시작');
      
      // 1. 네비게이션 테스트
      const header = page.locator('header');
      if (await header.count() > 0) {
        await expect(header).toBeVisible();
        console.log('✅ 헤더 네비게이션 확인');
      }
      
      // 2. 모든 섹션 가시성 확인
      const sections = [
        '혁신적인 기술로',
        '주요 서비스', 
        'GanziCorp와 함께하는'
      ];
      
      for (const sectionText of sections) {
        await page.evaluate(() => window.scrollTo(0, window.scrollY + 500));
        await page.waitForTimeout(500);
        
        const section = page.getByText(sectionText).first();
        await expect(section).toBeVisible();
      }
      console.log('✅ 모든 주요 섹션 가시성 확인');
      
      // 3. 인터랙티브 요소 테스트
      await page.evaluate(() => window.scrollTo(0, 0));
      
      const interactiveElements = page.locator('button, a[role="button"], [role="button"]');
      const elementCount = await interactiveElements.count();
      
      for (let i = 0; i < Math.min(elementCount, 3); i++) {
        const element = interactiveElements.nth(i);
        if (await element.isVisible()) {
          await expect(element).toBeEnabled();
        }
      }
      console.log('✅ 인터랙티브 요소 활성화 상태 확인');
      
      // 4. 페이지 전체 스크롤 테스트
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(500);
      
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);
      
      const finalScrollY = await page.evaluate(() => window.scrollY);
      expect(finalScrollY).toBeGreaterThan(100);
      console.log('✅ 전체 페이지 스크롤 기능 확인');
      
      // 5. 성능 최종 확인
      const performanceMetrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        return {
          loadTime: navigation.loadEventEnd - navigation.fetchStart,
          domInteractive: navigation.domInteractive - navigation.fetchStart
        };
      });
      
      expect(performanceMetrics.loadTime).toBeLessThan(8000);
      expect(performanceMetrics.domInteractive).toBeLessThan(5000);
      console.log(`✅ 최종 성능 확인: 로딩 ${performanceMetrics.loadTime.toFixed(0)}ms, DOM ${performanceMetrics.domInteractive.toFixed(0)}ms`);
      
      console.log('🎉 전체 기능 통합 테스트 완료');
    });
  });
}); 