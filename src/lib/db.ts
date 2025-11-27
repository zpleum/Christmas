import mysql from 'mysql2/promise';

// Database configuration from environment variables
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'portfolio_db',
    port: parseInt(process.env.DB_PORT || '4000'),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true,
    },
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test connection
pool.getConnection()
    .then(connection => {
        console.log('✅ Database connected successfully');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Database connection failed:', err.message);
    });

// Helper function to execute queries
export async function query<T = any>(sql: string, params?: any[]): Promise<T> {
    try {
        const [results] = await pool.execute(sql, params);
        return results as T;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

// Helper function to get a single row
export async function queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
    try {
        const [results] = await pool.execute(sql, params);
        const rows = results as T[];
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

export default pool;
