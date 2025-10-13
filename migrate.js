#!/usr/bin/env node

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

function createPool() {
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });
}

async function runMigrations(pool = null) {
  const shouldClosePool = !pool;
  if (!pool) pool = createPool();
  
  const client = await pool.connect();
  
  try {
    console.log('🚀 Starting database migrations...');
    
    // Create migrations tracking table
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Get migration files
    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    // Get already applied migrations
    const { rows: appliedMigrations } = await client.query(
      'SELECT filename FROM migrations'
    );
    const appliedSet = new Set(appliedMigrations.map(row => row.filename));
    
    // Run pending migrations
    for (const file of migrationFiles) {
      if (!appliedSet.has(file)) {
        console.log(`📁 Applying migration: ${file}`);
        
        const migrationSQL = fs.readFileSync(
          path.join(migrationsDir, file),
          'utf8'
        );
        
        await client.query('BEGIN');
        try {
          await client.query(migrationSQL);
          await client.query(
            'INSERT INTO migrations (filename) VALUES ($1)',
            [file]
          );
          await client.query('COMMIT');
          console.log(`✅ Migration ${file} applied successfully`);
        } catch (error) {
          await client.query('ROLLBACK');
          throw error;
        }
      } else {
        console.log(`⏭️  Migration ${file} already applied`);
      }
    }
    
    console.log('🎉 All migrations completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    if (shouldClosePool) {
      await pool.end();
    }
  }
}

async function runSeeds(pool = null) {
  const shouldClosePool = !pool;
  if (!pool) pool = createPool();
  
  const client = await pool.connect();
  
  try {
    console.log('🌱 Starting database seeding...');
    
    // Get seed files
    const seedsDir = path.join(__dirname, 'seeds');
    const seedFiles = fs.readdirSync(seedsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    // Run seed files
    for (const file of seedFiles) {
      console.log(`📁 Running seed: ${file}`);
      
      const seedSQL = fs.readFileSync(
        path.join(seedsDir, file),
        'utf8'
      );
      
      await client.query(seedSQL);
      console.log(`✅ Seed ${file} completed successfully`);
    }
    
    console.log('🎉 All seeds completed successfully!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    client.release();
    if (shouldClosePool) {
      await pool.end();
    }
  }
}

async function runReset() {
  const pool = createPool();
  
  try {
    await runMigrations(pool);
    await runSeeds(pool);
  } catch (error) {
    console.error('❌ Reset failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Parse command line arguments
const command = process.argv[2];

switch (command) {
  case 'migrate':
    runMigrations()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
    break;
  case 'seed':
    runSeeds()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
    break;
  case 'reset':
    runReset();
    break;
  default:
    console.log('Usage:');
    console.log('  node migrate.js migrate  - Run pending migrations');
    console.log('  node migrate.js seed     - Run seed data');
    console.log('  node migrate.js reset    - Run migrations and seeds');
    process.exit(1);
}