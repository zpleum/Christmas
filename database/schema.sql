-- Christmas Wishes Database Schema

-- Create database (run this first if database doesn't exist)
CREATE DATABASE IF NOT EXISTS christmas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE christmas_db;

-- Create wishes table
CREATE TABLE IF NOT EXISTS wishes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_created_at (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optional: Insert sample data for testing
-- INSERT INTO wishes (name, message) VALUES
-- ('John Doe', 'Merry Christmas to everyone! May this season bring joy and happiness.'),
-- ('Jane Smith', 'Wishing you all a wonderful holiday season filled with love and laughter!'),
-- ('Bob Johnson', 'Happy holidays! May the new year bring you success and prosperity.');
