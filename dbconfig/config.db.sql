CREATE TABLE user_credentials (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_code_area VARCHAR(10),
    country VARCHAR(50),
    phone_number VARCHAR(20),
    bio TEXT,
    avatar VARCHAR(255),
    website VARCHAR(100),
    gender VARCHAR(10)
);

-- Make sure you have the "uuid-ossp" extension enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
