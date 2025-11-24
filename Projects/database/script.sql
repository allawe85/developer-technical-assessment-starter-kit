CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean up
DROP VIEW IF EXISTS popular_listings_view;
DROP TABLE IF EXISTS agent_contacts;
DROP TABLE IF EXISTS properties;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS lands;
DROP TABLE IF EXISTS users;

-- 1. Identity & Access
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Listings Architecture
-- Polymorphic table design to support specific attributes per listing type
-- Search vectors pre-calculated for performance (Task 1.2)

CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    location VARCHAR(255) NOT NULL,
    image_urls TEXT[] DEFAULT '{}',
    details TEXT,
    sq_ft_or_area DECIMAL(10, 2),
    amenities TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Generated column for full-text search optimization
    search_vector tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('english', name), 'A') || 
        setweight(to_tsvector('english', coalesce(details, '')), 'B') ||
        setweight(to_tsvector('english', location), 'C')
    ) STORED
);

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    price_range VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    image_urls TEXT[] DEFAULT '{}',
    details TEXT,
    sq_ft_or_area DECIMAL(10, 2),
    completion_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    search_vector tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('english', name), 'A') || 
        setweight(to_tsvector('english', coalesce(details, '')), 'B') ||
        setweight(to_tsvector('english', location), 'C')
    ) STORED
);

CREATE TABLE lands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    location VARCHAR(255) NOT NULL,
    image_urls TEXT[] DEFAULT '{}',
    details TEXT,
    sq_ft_or_area DECIMAL(10, 2),
    zoning_type VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    search_vector tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('english', name), 'A') || 
        setweight(to_tsvector('english', coalesce(details, '')), 'B') ||
        setweight(to_tsvector('english', location), 'C')
    ) STORED
);

-- 3. Lead Generation
CREATE TABLE agent_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    listing_id UUID NOT NULL,
    listing_type VARCHAR(50) NOT NULL, -- Enum: property, project, land
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Indexing Strategy
-- Standard indexes for filtering/sorting
CREATE INDEX idx_props_price ON properties(price);
CREATE INDEX idx_props_location ON properties(location);
CREATE INDEX idx_lands_price ON lands(price);
CREATE INDEX idx_lands_location ON lands(location);
CREATE INDEX idx_projects_location ON projects(location);

-- GIN indexes for high-performance text search
CREATE INDEX idx_props_search ON properties USING GIN(search_vector);
CREATE INDEX idx_projects_search ON projects USING GIN(search_vector);
CREATE INDEX idx_lands_search ON lands USING GIN(search_vector);

-- 5. Unified View for API Performance
-- Aggregates top listings to reduce API latency and complexity
CREATE OR REPLACE VIEW popular_listings_view AS
    SELECT 
        l.id, 
        l.name, 
        l.price::text as price_display, 
        l.location, 
        l.image_urls, 
        'property' as type, 
        l.created_at,
        (SELECT COUNT(*) FROM agent_contacts ac WHERE ac.listing_id = l.id) as popularity_score
    FROM properties l
    UNION ALL
    SELECT 
        p.id, 
        p.name, 
        p.price_range as price_display, 
        p.location, 
        p.image_urls, 
        'project' as type, 
        p.created_at,
        (SELECT COUNT(*) FROM agent_contacts ac WHERE ac.listing_id = p.id) as popularity_score
    FROM projects p
    UNION ALL
    SELECT 
        la.id, 
        la.name, 
        la.price::text as price_display, 
        la.location, 
        la.image_urls, 
        'land' as type, 
        la.created_at,
        (SELECT COUNT(*) FROM agent_contacts ac WHERE ac.listing_id = la.id) as popularity_score
    FROM lands la;