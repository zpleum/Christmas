// Database Connection Test Script
// Run this with: node test-db-connection.js

const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
    console.log('🔍 Testing database connection...\n');

    // Display configuration (without password)
    console.log('Configuration:');
    console.log('- Host:', process.env.DB_HOST || 'localhost');
    console.log('- Port:', process.env.DB_PORT || '3306');
    console.log('- User:', process.env.DB_USER || 'root');
    console.log('- Database:', process.env.DB_NAME || 'christmas_db');
    console.log('- Password:', process.env.DB_PASSWORD ? '***' : '(not set)');
    console.log('');

    try {
        // Test 1: Connect to MySQL server (without database)
        console.log('Test 1: Connecting to MySQL server...');
        const connectionWithoutDB = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '3306'),
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
        });
        console.log('✅ Successfully connected to MySQL server\n');
        await connectionWithoutDB.end();

        // Test 2: Check if database exists
        console.log('Test 2: Checking if database exists...');
        const tempConnection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '3306'),
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
        });

        const [databases] = await tempConnection.execute(
            'SHOW DATABASES LIKE ?',
            [process.env.DB_NAME || 'christmas_db']
        );

        if (databases.length === 0) {
            console.log('⚠️  Database does not exist. Creating it...');
            await tempConnection.execute(
                `CREATE DATABASE ${process.env.DB_NAME || 'christmas_db'} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
            );
            console.log('✅ Database created successfully\n');
        } else {
            console.log('✅ Database exists\n');
        }
        await tempConnection.end();

        // Test 3: Connect to specific database
        console.log('Test 3: Connecting to database...');
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '3306'),
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'christmas_db',
        });
        console.log('✅ Successfully connected to database\n');

        // Test 4: Check if wishes table exists
        console.log('Test 4: Checking if wishes table exists...');
        const [tables] = await connection.execute(
            'SHOW TABLES LIKE ?',
            ['wishes']
        );

        if (tables.length === 0) {
            console.log('⚠️  Wishes table does not exist. Creating it...');
            await connection.execute(`
        CREATE TABLE wishes (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          message TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_created_at (created_at DESC)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
            console.log('✅ Wishes table created successfully\n');
        } else {
            console.log('✅ Wishes table exists\n');
        }

        // Test 5: Query wishes table
        console.log('Test 5: Querying wishes table...');
        const [rows] = await connection.execute('SELECT COUNT(*) as count FROM wishes');
        console.log(`✅ Wishes table has ${rows[0].count} records\n`);

        await connection.end();

        console.log('🎉 All tests passed! Database is ready to use.');
        console.log('\nYou can now restart your Next.js dev server.');

    } catch (error) {
        console.error('\n❌ Connection failed!');
        console.error('Error:', error.message);
        console.error('\nCommon issues:');
        console.error('1. MySQL server is not running');
        console.error('   - Start MySQL: net start MySQL (Windows) or sudo service mysql start (Linux)');
        console.error('2. Wrong credentials in .env file');
        console.error('   - Check DB_USER and DB_PASSWORD');
        console.error('3. Wrong port number');
        console.error('   - Default MySQL port is 3306, not 4000');
        console.error('4. Firewall blocking connection');
        console.error('   - Check firewall settings');

        if (error.code === 'ECONNREFUSED') {
            console.error('\n⚠️  ECONNREFUSED means MySQL server is not running or not accessible.');
            console.error('   Please start your MySQL server and try again.');
        }

        process.exit(1);
    }
}

testConnection();
