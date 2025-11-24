const { Client } = require('pg');
const { faker } = require('@faker-js/faker');

const client = new Client({
  user: 'postgres',
  host: 'db',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

const TOTAL_LISTINGS = 1200; 
const TOTAL_CONTACTS = 800; // Number of "leads" to generate
const BATCH_SIZE = 50; 

async function seed() {
  try {
    await client.connect();
    console.log('Connected. Starting comprehensive seed...');

    // --- STEP 1: SEED USERS ---
    console.log('1. Seeding Users...');
    const users = [];
    for (let i = 0; i < 50; i++) {
      const safeName = faker.person.fullName().replace(/'/g, "''");
      const passwordHash = '$2b$10$EpQqjFw7...placeholder...hash'; 
      users.push(`('${faker.internet.email()}', '${passwordHash}', '${safeName}')`);
    }
    
    // Insert and immediately fetch IDs for use in contacts
    await client.query(`TRUNCATE users CASCADE;`); // Clear old data to avoid duplicates/conflicts
    await client.query(`INSERT INTO users (email, password_hash, full_name) VALUES ${users.join(',')} ON CONFLICT DO NOTHING`);
    
    const userResult = await client.query('SELECT id FROM users');
    const userIds = userResult.rows.map(r => r.id);

    // --- STEP 2: SEED LISTINGS ---
    console.log(`2. Generating ${TOTAL_LISTINGS} Listings...`);
    
    // Clear old listings to ensure clean IDs
    await client.query('TRUNCATE properties, projects, lands, agent_contacts CASCADE;');

    let properties = [];
    let projects = [];
    let lands = [];

    for (let i = 0; i < TOTAL_LISTINGS; i++) {
      const type = faker.helpers.arrayElement(['property', 'project', 'land']);
      const name = (faker.location.streetAddress() + ' ' + faker.word.adjective() + ' ' + faker.helpers.arrayElement(['Residency', 'Tower', 'Plot', 'Villa'])).replace(/'/g, "''");
      const location = (faker.location.city() + ', ' + faker.location.state()).replace(/'/g, "''");
      const basePrice = faker.commerce.price({ min: 50000, max: 2000000, dec: 0 });
      const details = faker.lorem.paragraph().replace(/'/g, "''");
      const area = faker.number.int({ min: 800, max: 10000 });
      const images = `{${faker.image.urlLoremFlickr({ category: 'city' })},${faker.image.urlLoremFlickr({ category: 'building' })}}`;

      if (type === 'property') {
        properties.push(`('${name}', ${basePrice}, '${location}', '${images}', '${details}', ${area}, '{Gym,Pool}')`);
      } else if (type === 'project') {
        const priceRange = `${basePrice} - ${Number(basePrice) + 100000}`;
        projects.push(`('${name}', '${priceRange}', '${location}', '${images}', '${details}', ${area}, NOW() + interval '1 year')`);
      } else {
        lands.push(`('${name}', ${basePrice}, '${location}', '${images}', '${details}', ${area}, 'Residential')`);
      }
    }

    // Helper: Simple batch insert
    const runBatch = async (table, cols, vals) => {
        while (vals.length) {
            const batch = vals.splice(0, BATCH_SIZE);
            await client.query(`INSERT INTO ${table} (${cols}) VALUES ${batch.join(',')}`);
        }
    };

    if (properties.length) await runBatch('properties', 'name, price, location, image_urls, details, sq_ft_or_area, amenities', properties);
    if (projects.length) await runBatch('projects', 'name, price_range, location, image_urls, details, sq_ft_or_area, completion_date', projects);
    if (lands.length) await runBatch('lands', 'name, price, location, image_urls, details, sq_ft_or_area, zoning_type', lands);

    // --- STEP 3: SEED AGENT CONTACTS (POPULARITY) ---
    console.log('3. Generating Agent Contacts (creating popularity spikes)...');

    // Fetch all listing IDs back so we can link them
    const propIds = (await client.query('SELECT id FROM properties')).rows.map(r => ({id: r.id, type: 'property'}));
    const projIds = (await client.query('SELECT id FROM projects')).rows.map(r => ({id: r.id, type: 'project'}));
    const landIds = (await client.query('SELECT id FROM lands')).rows.map(r => ({id: r.id, type: 'land'}));
    
    const allListings = [...propIds, ...projIds, ...landIds];
    const contacts = [];

    for (let i = 0; i < TOTAL_CONTACTS; i++) {
        const user = faker.helpers.arrayElement(userIds);
        
        // LOGIC: 80% of contacts go to the first 20 listings to simulate "Popular" items
        // This ensures the top results have HIGH counts (e.g., 15 contacts) vs 0-1 for others.
        let listing;
        if (Math.random() < 0.8) {
            listing = faker.helpers.arrayElement(allListings.slice(0, 20)); // "Hot" items
        } else {
            listing = faker.helpers.arrayElement(allListings); // Random long tail
        }

        const msg = faker.lorem.sentence().replace(/'/g, "''");
        contacts.push(`('${user}', '${listing.id}', '${listing.type}', '${msg}')`);
    }

    await runBatch('agent_contacts', 'user_id, listing_id, listing_type, message', contacts);

    console.log('✅ Seeding Complete!');
    console.log('Run this in DB to verify popularity:');
    console.log('SELECT * FROM popular_listings_view ORDER BY popularity_score DESC LIMIT 5;');

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

seed();