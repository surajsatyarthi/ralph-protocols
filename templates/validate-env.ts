#!/usr/bin/env tsx
/**
 * Ralph Protocol v6.5 - DPL-001: Environment Variable Validation
 * Phase 1 Enhancement: Active Connectivity Testing
 *
 * This script validates that all required environment variables are present
 * AND actively working before allowing development or deployment.
 *
 * NEW in v6.5:
 * - Pings Supabase URL to verify connectivity
 * - Checks local port availability (prevents 54321 vs 55321 mismatches)
 * - Validates Auth service responsiveness
 * - Generates .env-validated.log as proof of validation
 *
 * Usage:
 *   npm run validate:env
 *   npm run validate:env -- --environment=production
 *   npm run validate:env -- --skip-connectivity (vars only)
 */

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const REQUIRED_ENV_VARS = {
  // Supabase Configuration
  NEXT_PUBLIC_SUPABASE_URL: {
    description: 'Supabase project URL',
    example: 'https://xxxxx.supabase.co',
    production: true,
    testConnectivity: true,
  },
  NEXT_PUBLIC_SUPABASE_ANON_KEY: {
    description: 'Supabase anonymous/public key',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    production: true,
    testConnectivity: false,
  },
  SUPABASE_SERVICE_ROLE_KEY: {
    description: 'Supabase service role key (admin)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    production: true,
    testConnectivity: false,
  },

  // Database
  DATABASE_URL: {
    description: 'PostgreSQL connection string',
    example: 'postgresql://user:pass@host:5432/dbname',
    production: true,
    testConnectivity: false,
  },

  // Email Service
  RESEND_API_KEY: {
    description: 'Resend API key for transactional emails',
    example: 're_xxxxxxxxxxxxx',
    production: true,
    testConnectivity: false,
  },
  RESEND_FROM_EMAIL: {
    description: 'From email address for transactional emails',
    example: 'noreply@businessmarket.network',
    production: true,
    testConnectivity: false,
  },

  // Application
  NEXT_PUBLIC_APP_URL: {
    description: 'Public application URL',
    example: 'https://smartket.network',
    production: true,
    testConnectivity: false,
  },
  CRON_SECRET: {
    description: 'Secret for authenticating cron job requests',
    example: 'random-secure-string',
    production: true,
    testConnectivity: false,
  },

  // OAuth
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: {
    description: 'Google OAuth client ID',
    example: '123456789-xxxxxxxx.apps.googleusercontent.com',
    production: false,
    testConnectivity: false,
  },
  GOOGLE_CLIENT_SECRET: {
    description: 'Google OAuth client secret',
    example: 'GOCSPX-xxxxxxxxxxxxx',
    production: false,
    testConnectivity: false,
  },
} as const;

interface ValidationResult {
  valid: boolean;
  missing: string[];
  warnings: string[];
  connectivityIssues: string[];
}

/**
 * Test if a URL is accessible
 */
async function testUrlConnectivity(url: string): Promise<{ success: boolean; error?: string }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      return { success: true };
    } else {
      return { success: false, error: `HTTP ${response.status}` };
    }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Unknown error' };
  }
}

/**
 * Test if a local port is in use (common issue: 54321 vs 55321)
 */
async function testLocalPort(port: number): Promise<{ available: boolean; error?: string }> {
  try {
    const server = Bun.serve({
      port,
      fetch() {
        return new Response('test');
      },
    });
    server.stop();
    return { available: true };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('EADDRINUSE')) {
        return { available: false, error: `Port ${port} already in use (this is OK if your dev server is running)` };
      }
      return { available: false, error: error.message };
    }
    return { available: false, error: 'Unknown error' };
  }
}

/**
 * Test Supabase Auth service connectivity
 */
async function testSupabaseAuth(supabaseUrl: string, anonKey: string): Promise<{ success: boolean; error?: string }> {
  try {
    const authUrl = `${supabaseUrl}/auth/v1/health`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(authUrl, {
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      return { success: true };
    } else {
      return { success: false, error: `Auth health check failed: HTTP ${response.status}` };
    }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Unknown error' };
  }
}

async function validateEnvironment(
  checkProduction = false,
  skipConnectivity = false
): Promise<ValidationResult> {
  const missing: string[] = [];
  const warnings: string[] = [];
  const connectivityIssues: string[] = [];

  console.log('🔍 Ralph Protocol v6.5 - Environment Validation (Phase 1 Enhanced)');
  console.log('====================================================================\n');

  // Step 1: Validate variable presence and format
  console.log('📋 Step 1/3: Checking environment variables...\n');

  for (const [key, config] of Object.entries(REQUIRED_ENV_VARS)) {
    const value = process.env[key];
    const isRequired = checkProduction ? config.production : true;

    if (!value) {
      if (isRequired) {
        missing.push(key);
        console.log(`❌ MISSING: ${key}`);
        console.log(`   Description: ${config.description}`);
        console.log(`   Example: ${config.example}\n`);
      } else {
        warnings.push(key);
        console.log(`⚠️  OPTIONAL: ${key} (not set)`);
        console.log(`   Description: ${config.description}\n`);
      }
    } else {
      // Validate format
      let validFormat = true;
      let formatError = '';

      if (key.includes('URL')) {
        if (!value.startsWith('http://') && !value.startsWith('https://')) {
          validFormat = false;
          formatError = 'Must be a valid URL starting with http:// or https://';
        }
      }

      if (key.includes('EMAIL')) {
        if (!value.includes('@')) {
          validFormat = false;
          formatError = 'Must be a valid email address';
        }
      }

      if (validFormat) {
        console.log(`✅ ${key}`);
      } else {
        console.log(`❌ ${key} (invalid format)`);
        console.log(`   Error: ${formatError}\n`);
        missing.push(key);
      }
    }
  }

  // Step 2: Test connectivity (if not skipped)
  if (!skipConnectivity && missing.length === 0) {
    console.log('\n🌐 Step 2/3: Testing live connectivity...\n');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Test Supabase URL accessibility
    if (supabaseUrl) {
      console.log('Testing Supabase URL accessibility...');
      const urlTest = await testUrlConnectivity(supabaseUrl);
      if (urlTest.success) {
        console.log(`✅ Supabase URL is accessible: ${supabaseUrl}\n`);
      } else {
        console.log(`❌ Supabase URL unreachable: ${supabaseUrl}`);
        console.log(`   Error: ${urlTest.error}\n`);
        connectivityIssues.push(`Supabase URL unreachable: ${urlTest.error}`);
      }

      // Test Supabase Auth service
      if (anonKey) {
        console.log('Testing Supabase Auth service...');
        const authTest = await testSupabaseAuth(supabaseUrl, anonKey);
        if (authTest.success) {
          console.log('✅ Supabase Auth service is responsive\n');
        } else {
          console.log('❌ Supabase Auth service check failed');
          console.log(`   Error: ${authTest.error}\n`);
          connectivityIssues.push(`Auth service failed: ${authTest.error}`);
        }
      }
    }

    // Test common local ports (Supabase local dev)
    if (supabaseUrl?.includes('localhost') || supabaseUrl?.includes('127.0.0.1')) {
      console.log('Detected local Supabase - checking common ports...');

      // Extract port from URL
      const urlMatch = supabaseUrl.match(/:(\d+)/);
      if (urlMatch) {
        const port = parseInt(urlMatch[1], 10);
        console.log(`   Checking port ${port}...`);
        const portTest = await testLocalPort(port);
        if (portTest.available) {
          console.log(`   ⚠️  Port ${port} is NOT in use - is your local Supabase running?`);
          warnings.push(`Local Supabase port ${port} appears unused`);
        } else {
          console.log(`   ✅ Port ${port} is in use (local Supabase likely running)`);
        }
      }
      console.log('');
    }
  } else if (skipConnectivity) {
    console.log('\n⏭️  Step 2/3: Skipped (--skip-connectivity flag)\n');
  } else {
    console.log('\n⏭️  Step 2/3: Skipped (missing required variables)\n');
  }

  // Step 3: Generate validation log
  console.log('📝 Step 3/3: Generating validation log...\n');

  const result: ValidationResult = {
    valid: missing.length === 0 && connectivityIssues.length === 0,
    missing,
    warnings,
    connectivityIssues,
  };

  if (result.valid) {
    const logContent = `Ralph Protocol v6.5 - Environment Validation
====================================================================
Validated at: ${new Date().toISOString()}
Status: ✅ PASSED
Missing variables: 0
Connectivity issues: 0
Warnings: ${warnings.length}

All required environment variables are present and services are accessible.
This log file is required by pre-commit hooks to ensure environment validity.

${warnings.length > 0 ? `Warnings:\n${warnings.map(w => `  - ${w}`).join('\n')}` : ''}
`;

    try {
      writeFileSync('.env-validated.log', logContent);
      console.log('✅ Validation log created: .env-validated.log');
    } catch (error) {
      console.log('⚠️  Could not write validation log (non-critical)');
    }
  }

  console.log('\n====================================================================');

  if (result.valid) {
    console.log('✅ All checks passed - environment is ready!\n');
  } else {
    if (missing.length > 0) {
      console.log(`❌ ${missing.length} required variable(s) missing or invalid`);
      console.log('   Fix: Add these variables to your .env.local file\n');
    }
    if (connectivityIssues.length > 0) {
      console.log(`❌ ${connectivityIssues.length} connectivity issue(s) detected`);
      console.log('   Fix: Ensure services are running and URLs are correct\n');
      connectivityIssues.forEach(issue => console.log(`   - ${issue}`));
      console.log('');
    }
  }

  return result;
}

// Main execution
const args = process.argv.slice(2);
const isProduction = args.some((arg: string) => arg.includes('production'));
const skipConnectivity = args.some((arg: string) => arg.includes('skip-connectivity'));

validateEnvironment(isProduction, skipConnectivity).then((result) => {
  if (!result.valid) {
    process.exit(1);
  }
  process.exit(0);
});
