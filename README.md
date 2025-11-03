# Job Find Tracking - E2E Tests

End-to-end tests for the Job Find Tracking application using Playwright.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Access to staging/production environments

### Installation

```bash
# Clone this repository
git clone <your-e2e-repo-url>
cd job-find-tracking-e2e

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your values
# - Set ENVIRONMENT (local, staging, production)
# - Set application URLs
# - Set test credentials
```

## 🧪 Running Tests

### Local Development
```bash
# Run all tests in headless mode
npm test

# Run tests with UI mode (interactive)
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Debug specific test
npm run test:debug

# Run only smoke tests
npm run test:smoke
```

### Against Different Environments
```bash
# Test against staging
npm run test:staging

# Test against production
npm run test:prod

# Test against local dev server
ENVIRONMENT=local npm test
```

### Specific Browsers
```bash
# Run on Chrome only
npm run test:chrome

# Run on all browsers
npm test
```

## 📁 Project Structure

```
job-find-tracking-e2e/
├── .github/
│   └── workflows/          # CI/CD workflows
├── tests/
│   ├── auth.spec.ts       # Authentication tests
│   ├── auth.setup.ts      # Authentication setup
│   └── ...                # Other test files
├── playwright.config.ts    # Playwright configuration
├── package.json
├── .env.example           # Environment variables template
└── README.md
```

## 🏷️ Test Tags

Use tags to categorize and run specific test groups:

```typescript
test('login should work @smoke @auth', async ({ page }) => {
  // Test code
});
```

Run tagged tests:
```bash
# Run smoke tests only
npm run test:smoke

# Run auth tests only
npx playwright test --grep @auth

# Exclude slow tests
npx playwright test --grep-invert @slow
```

## 🔄 CI/CD Integration

### Automatic Triggers

**On Production Merge:**
- Triggers when code is merged to `main` or `production` branch in the main app repo
- Runs full E2E test suite
- Tests on Chrome and Firefox
- Sends Telegram notifications on start, success, and failure

### Manual Trigger

You can manually trigger tests from GitHub Actions:
1. Go to Actions tab in GitHub
2. Select "E2E Tests on Production Merge" workflow
3. Click "Run workflow"
4. Select environment and run

## 📱 Telegram Notifications Setup

### Step 1: Create Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` command
3. Follow the instructions to create your bot
4. Copy the **Bot Token** (looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### Step 2: Get Chat ID

**Option A: Use your personal chat**
1. Start a chat with your bot
2. Send any message to the bot
3. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Look for `"chat":{"id":123456789}` - this is your chat ID

**Option B: Use a group**
1. Create a Telegram group
2. Add your bot to the group
3. Send a message in the group
4. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
5. Look for the group chat ID (negative number like `-987654321`)

### Step 3: Configure GitHub Secrets

In your GitHub repository settings (Settings → Secrets and variables → Actions), add:

```
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=123456789
```

### Notification Examples

**When tests start:**
```
🚀 E2E Tests Started

Repository: your-org/job-find-tracking-e2e
Branch: main
Project: chromium
Trigger: push
Commit: abc123

[View Workflow Run](link)
```

**When tests pass:**
```
✅ E2E Tests PASSED

Repository: your-org/job-find-tracking-e2e
Branch: main
Project: chromium
Environment: Production

All tests completed successfully! 🎉

[View Report](link)
```

**When tests fail:**
```
❌ E2E Tests FAILED

Repository: your-org/job-find-tracking-e2e
Branch: main
Project: chromium
Environment: Production

⚠️ Some tests failed. Please check the logs.

[View Failed Tests](link)
[Download Report Artifact](link)
```

## 🔐 GitHub Secrets Configuration

Configure these secrets in your GitHub repository settings:

| Secret Name | Description | Example |
|------------|-------------|---------|
| `PRODUCTION_URL` | Production application URL | `https://yourapp.com` |
| `STAGING_URL` | Staging application URL | `https://staging.yourapp.com` |
| `TEST_USER_EMAIL` | Test user email | `test@example.com` |
| `TEST_USER_PASSWORD` | Test user password | `testpassword123` |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token from BotFather | `123456:ABC...` |
| `TELEGRAM_CHAT_ID` | Your Telegram chat ID | `123456789` |

## 📊 Test Reports

After running tests:

```bash
# View HTML report
npm run test:report

# Reports are saved in:
# - playwright-report/ (HTML)
# - test-results.json (JSON)
# - junit.xml (JUnit format for CI)
```

## 🐛 Debugging Tips

1. **Use UI Mode** for interactive debugging:
   ```bash
   npm run test:ui
   ```

2. **Add `page.pause()`** in your test to stop execution:
   ```typescript
   await page.pause(); // Test will pause here
   ```

3. **Enable headed mode** to see browser:
   ```bash
   npm run test:headed
   ```

4. **Check screenshots and videos** in `test-results/` folder after failures

## 📝 Writing Tests

### Test Structure
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something @smoke', async ({ page }) => {
    // 1. Navigate
    await page.goto('/');

    // 2. Interact
    await page.getByRole('button', { name: 'Submit' }).click();

    // 3. Assert
    await expect(page).toHaveURL(/\/success/);
  });
});
```

### Best Practices
- Use `@smoke` tag for critical path tests
- Always use accessible locators (getByRole, getByLabel)
- Keep tests independent and isolated
- Use page object pattern for complex flows
- Add meaningful test descriptions

## 🔗 Integration with Main App Repo

### Setup in Main Repository

In your main app repository `.github/workflows/deploy-production.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy application
        run: |
          # Your deployment steps here
          echo "Deploying to production..."

      - name: Trigger E2E Tests
        run: |
          curl -X POST \
            -H "Accept: application/vnd.github.v3+json" \
            -H "Authorization: token ${{ secrets.GH_PAT }}" \
            https://api.github.com/repos/${{ github.repository_owner }}/job-find-tracking-e2e/dispatches \
            -d '{"event_type":"production-deploy"}'
```

You'll need to create a Personal Access Token (PAT) with `repo` scope and add it as `GH_PAT` secret.

## 🆘 Troubleshooting

**Tests failing locally but passing in CI:**
- Check browser versions: `npx playwright --version`
- Clear Playwright cache: `npx playwright install --force`

**Authentication not working:**
- Verify credentials in `.env`
- Check if `playwright/.auth/user.json` exists
- Run setup tests manually: `npx playwright test --project=setup`

**Timeout errors:**
- Increase timeout in `playwright.config.ts`
- Check network connectivity to target environment
- Verify application is deployed and accessible

**Telegram notifications not working:**
- Verify bot token and chat ID are correct
- Ensure the bot has been started (sent at least one message)
- Check GitHub Actions logs for error messages

## 📞 Support

For issues or questions:
- Check [Playwright Documentation](https://playwright.dev)
- Review test execution logs in GitHub Actions
- Check Telegram notifications for test failures

---

**Last Updated:** 2025-11-04
