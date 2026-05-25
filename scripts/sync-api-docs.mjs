#!/usr/bin/env node
/**
 * Keeps bruno/ and docs/api-spec.graphql in sync with src/schema.gql.
 *
 * Usage:
 *   npm run sync:api-docs          — manual run after restarting dev server
 *
 * Also runs automatically via the Claude Code PostToolUse hook whenever
 * a *.resolver.ts file is edited (see .claude/settings.json).
 *
 * NOTE: src/schema.gql is generated at app startup by NestJS. Make sure
 * `npm run start:dev` has run at least once before syncing.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { buildSchema, getNamedType, isScalarType, isObjectType, isEnumType } from 'graphql';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SCHEMA_PATH = join(ROOT, 'src', 'schema.gql');
const BRUNO_DIR = join(ROOT, 'bruno');
const API_SPEC_PATH = join(ROOT, 'docs', 'api-spec.graphql');

// ─── Hook payload ────────────────────────────────────────────────────────────

function readHookPayload() {
  if (process.stdin.isTTY) return null;
  try {
    const raw = readFileSync(0, 'utf-8').trim(); // fd 0 = stdin
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ─── Bruno generation ────────────────────────────────────────────────────────

function argDefault(arg) {
  const base = arg.type.toString().replace(/[!\[\]]/g, '');
  if (base === 'String' || base === 'ID') return '"value"';
  if (base === 'Int' || base === 'Float') return '0';
  if (base === 'Boolean') return 'false';
  return 'null';
}

function toBruFileName(name) {
  return name.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
}

function buildBruFile(name, operation, field, seq) {
  const display = name.charAt(0).toUpperCase() + name.slice(1);
  const returnType = getNamedType(field.type);
  const needsSelection =
    isObjectType(returnType) && !isScalarType(returnType) && !isEnumType(returnType);

  let argDef = '';
  let argCall = '';
  if (field.args?.length) {
    argDef = `(${field.args.map((a) => `$${a.name}: ${a.type}`).join(', ')})`;
    argCall = `(${field.args.map((a) => `${a.name}: ${argDefault(a)}`).join(', ')})`;
  }

  const selection = needsSelection ? ' {\n    # TODO: select fields\n  }' : '';
  const opHeader = argDef ? ` ${display}${argDef}` : '';
  const body = `${operation}${opHeader} {\n  ${name}${argCall}${selection}\n}`;

  return `meta {
  name: ${display}
  type: graphql
  seq: ${seq}
}

post {
  url: {{baseUrl}}/graphql
  body: graphql
  auth: none
}

body:graphql {
  ${body}
}
`;
}

function syncBrunoCollection(schema) {
  const write = (dir, operation, typeObj) => {
    mkdirSync(dir, { recursive: true });
    let seq = 1;
    for (const [name, field] of Object.entries(typeObj.getFields())) {
      const file = join(dir, `${toBruFileName(name)}.bru`);
      writeFileSync(file, buildBruFile(name, operation, field, seq++));
      console.log(`  updated  bruno/${operation}s/${toBruFileName(name)}.bru`);
    }
  };

  const query = schema.getQueryType();
  const mutation = schema.getMutationType();
  if (query) write(join(BRUNO_DIR, 'queries'), 'query', query);
  if (mutation) write(join(BRUNO_DIR, 'mutations'), 'mutation', mutation);
}

// ─── API spec ────────────────────────────────────────────────────────────────

function syncApiSpec(sdl) {
  mkdirSync(join(ROOT, 'docs'), { recursive: true });
  const header = [
    '# ClientPulse API — GraphQL Schema',
    '# Auto-synced from src/schema.gql by scripts/sync-api-docs.mjs',
    '# Do not edit by hand — change the resolver and run: npm run sync:api-docs',
    '',
  ].join('\n');
  writeFileSync(API_SPEC_PATH, header + sdl);
  console.log('  updated  docs/api-spec.graphql');
}

// ─── Main ────────────────────────────────────────────────────────────────────

const payload = readHookPayload();
if (payload) {
  // Called from Claude Code hook — only sync when a resolver was changed
  const filePath = payload.tool_input?.file_path ?? '';
  if (!filePath.endsWith('.resolver.ts')) process.exit(0);
}

if (!existsSync(SCHEMA_PATH)) {
  console.error(
    'src/schema.gql not found.\nRun `npm run start:dev` once to generate it, then re-run this script.',
  );
  process.exit(1);
}

console.log('Syncing API docs from src/schema.gql...');
const sdl = readFileSync(SCHEMA_PATH, 'utf-8');
const schema = buildSchema(sdl);
syncBrunoCollection(schema);
syncApiSpec(sdl);
console.log('\nDone.');
