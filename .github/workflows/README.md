# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automated code quality checks.

## Workflows

### 🔍 `lint-typecheck.yml` - Code Quality Pipeline

**Triggers:**

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**Jobs:**

#### 1. `quality-checks` - Code Quality Checks

- **Code Formatting**: Runs `pnpm format:check` to ensure consistent formatting
- **Linting**: Runs `pnpm lint` to check for code quality issues
- **Type Checking**: Runs `pnpm typecheck` to validate TypeScript types

#### 2. `build-validation` - Build & Environment Validation

- **Dependencies**: Installs all project dependencies
- **Environment Validation**: Runs `pnpm build` with mock environment variables
- **Build Process**: Validates that the application builds successfully
- **Env Variables**: Uses `SKIP_ENV_VALIDATION=true` for CI builds

#### 3. `database-check` - Database Schema Validation

- **Schema Generation**: Runs `pnpm db:generate` to validate database schema
- **Migration Check**: Ensures database migrations are valid

## Environment Variables

The workflow provides mock environment variables for build validation:

```env
# Required for build
NEXT_PUBLIC_BASE_URL=http://localhost:3000
AUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://user:pass@localhost:5432/db
REDIS_URL=redis://localhost:6379
GMAIL_USER=test@example.com
GMAIL_PASS=1234567890123456
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
NODE_ENV=production

# Optional (PostHog)
NEXT_PUBLIC_POSTHOG_KEY=""
NEXT_PUBLIC_POSTHOG_HOST="https://us.i.posthog.com"

# Skip validation flag
SKIP_ENV_VALIDATION=true
```

## Adding Secrets (Optional)

If you want to use real PostHog keys in CI:

1. Go to your GitHub repository → Settings → Secrets and variables → Actions
2. Add the following repository variables:
   - `NEXT_PUBLIC_POSTHOG_KEY`: Your PostHog project API key
   - `NEXT_PUBLIC_POSTHOG_HOST`: Your PostHog host URL

## Local Development

Run the same checks locally:

```bash
# Install dependencies
pnpm install

# Format check
pnpm format:check

# Lint
pnpm lint

# Type check
pnpm typecheck

# Combined check
pnpm check

# Build validation
pnpm build
```

## Workflow Status

The workflow will:

- ✅ **Pass**: All checks pass, code is ready for merge
- ❌ **Fail**: One or more checks fail, review the error messages

### Common Failure Reasons

1. **Formatting Issues**: Run `pnpm format:write` to fix
2. **Linting Errors**: Run `pnpm lint:fix` to auto-fix issues
3. **Type Errors**: Check TypeScript error messages and fix types
4. **Build Failures**: Check for missing dependencies or configuration issues
5. **Database Issues**: Ensure database schema is valid

## Branch Protection

Consider setting up branch protection rules:

1. Go to repository Settings → Branches
2. Add rule for `main` branch
3. Require status checks to pass:
   - `quality-checks`
   - `build-validation`
   - `database-check`

## Customization

### Adding More Checks

To add additional validation steps, modify the workflow:

```yaml
- name: Additional check
  run: pnpm your-custom-command
```

### Changing Node Version

Update the Node.js version in the workflow:

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: 18 # or 20, 21, etc.
    cache: "pnpm"
```

### Adding Test Runs

Add a test job:

```yaml
test:
  name: Run Tests
  runs-on: ubuntu-latest
  needs: quality-checks
  steps:
    - name: Checkout code
      uses: actions/checkout@v4
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: 20
        cache: "pnpm"
    - name: Install dependencies
      run: pnpm install --frozen-lockfile
    - name: Run tests
      run: pnpm test
```

## Troubleshooting

### Workflow Not Triggering

- Check branch names match the `on:` triggers
- Ensure workflow file is in `.github/workflows/` directory
- Verify YAML syntax is valid

### Build Failures

- Check that all required environment variables are provided
- Ensure `SKIP_ENV_VALIDATION=true` is set for CI
- Verify database URL format is correct

### Permission Issues

- Workflows run with default GITHUB_TOKEN permissions
- For additional permissions, add to the workflow:

```yaml
permissions:
  contents: read
  pull-requests: write
```

## Performance

The workflow is optimized for speed:

- Uses dependency caching with `cache: 'pnpm'`
- Runs jobs in parallel where possible
- Uses `needs:` to prevent unnecessary runs
- Minimal environment setup

## Cost Optimization

- Runs only on relevant branches (`main`, `develop`)
- Uses Ubuntu runners (free tier)
- Caches dependencies between runs
- Parallel job execution
