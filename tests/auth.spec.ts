import { test, expect } from '@playwright/test';

test.describe('Authentication Tests', () => {
  test('로그인 페이지가 정상적으로 로드되는지 확인', async ({ page }) => {
    await page.goto('/auth/login');
    
    // 로그인 폼 확인
    await expect(page.locator('form')).toBeVisible();
    await expect(page.getByLabel(/이메일/i)).toBeVisible();
    await expect(page.getByLabel(/비밀번호/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /로그인/i })).toBeVisible();
    
    // 페이지 제목과 설명 확인
    await expect(page.getByRole('heading', { name: '로그인' })).toBeVisible();
    await expect(page.getByText('GanziCorp 계정으로 로그인하세요')).toBeVisible();
  });

  test('잘못된 자격증명으로 로그인 실패 확인', async ({ page }) => {
    await page.goto('/auth/login');
    
    // 잘못된 자격증명 입력
    await page.getByLabel(/이메일/i).fill('invalid@example.com');
    await page.getByLabel(/비밀번호/i).fill('wrongpassword');
    await page.getByRole('button', { name: /로그인/i }).click();
    
    // 에러 메시지 확인 (Supabase 에러 또는 validation 에러 대기)
    await expect(page.locator('[role="alert"], .text-destructive')).toBeVisible({ timeout: 10000 });
  });

  test('보호된 라우트 접근 차단 확인', async ({ page }) => {
    // 관리자 페이지 직접 접근 시도
    await page.goto('/admin');
    
    // 관리자 로그인 페이지로 리다이렉트되는지 확인
    await expect(page).toHaveURL(/.*admin.*login/);
    await expect(page.getByText('관리자 로그인')).toBeVisible();
  });

  test('입력 필드 검증 확인', async ({ page }) => {
    await page.goto('/auth/login');
    
    // 빈 필드로 제출 시도
    await page.getByRole('button', { name: /로그인/i }).click();
    
    // HTML5 validation 또는 custom validation 확인
    const emailInput = page.getByLabel(/이메일/i);
    const passwordInput = page.getByLabel(/비밀번호/i);
    
    // 이메일 필드가 required인지 확인
    await expect(emailInput).toHaveAttribute('required');
    
    // 패스워드 필드가 required인지 확인  
    await expect(passwordInput).toHaveAttribute('required');
  });

  test('이메일 형식 검증 확인', async ({ page }) => {
    await page.goto('/auth/login');
    
    // 잘못된 이메일 형식 입력
    await page.getByLabel(/이메일/i).fill('invalid-email');
    await page.getByLabel(/비밀번호/i).fill('somepassword');
    await page.getByRole('button', { name: /로그인/i }).click();
    
    // 이메일 형식 오류 확인 (HTML5 validation 또는 React Hook Form validation)
    const emailInput = page.getByLabel(/이메일/i);
    const validationMessage = await emailInput.evaluate(el => (el as HTMLInputElement).validationMessage);
    const hasErrorStyling = await emailInput.getAttribute('class');
    
    // HTML5 validation 또는 React Hook Form 에러 스타일링 확인
    expect(validationMessage || (hasErrorStyling && hasErrorStyling.includes('destructive'))).toBeTruthy();
  });
}); 