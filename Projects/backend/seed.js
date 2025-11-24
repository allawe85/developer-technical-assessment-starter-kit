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
const TOTAL_CONTACTS = 800;
const BATCH_SIZE = 50; 

// Oman Bounding Box (Muscat Area)
const OMAN_LAT_MIN = 23.50;
const OMAN_LAT_MAX = 23.70;
const OMAN_LNG_MIN = 58.20;
const OMAN_LNG_MAX = 58.60;

async function seed() {
  try {
    await client.connect();
    console.log('Connected. Starting seed with GEO coordinates...');

    // 1. Seed Users
    console.log('1. Seeding Users...');
    const users = [];
    for (let i = 0; i < 50; i++) {
      const safeName = faker.person.fullName().replace(/'/g, "''");
      const passwordHash = '$2b$10$EpQqjFw7...placeholder...hash'; 
      users.push(`('${faker.internet.email()}', '${passwordHash}', '${safeName}')`);
    }
    
    await client.query(`TRUNCATE users CASCADE;`);
    await client.query(`INSERT INTO users (email, password_hash, full_name) VALUES ${users.join(',')} ON CONFLICT DO NOTHING`);
    
    const userResult = await client.query('SELECT id FROM users');
    const userIds = userResult.rows.map(r => r.id);

    // 2. Seed Listings with Coordinates
    console.log(`2. Generating ${TOTAL_LISTINGS} Listings with Lat/Lng...`);
    
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
      
      // Generate Oman Coordinates
      const lat = faker.location.latitude({ min: OMAN_LAT_MIN, max: OMAN_LAT_MAX });
      const lng = faker.location.longitude({ min: OMAN_LNG_MIN, max: OMAN_LNG_MAX });

      if (type === 'property') {
        properties.push(`('${name}', ${basePrice}, '${location}', '${images}', '${details}', ${area}, '{Gym,Pool}', ${lat}, ${lng})`);
      } else if (type === 'project') {
        const priceRange = `${basePrice} - ${Number(basePrice) + 100000}`;
        projects.push(`('${name}', '${priceRange}', '${location}', '${images}', '${details}', ${area}, NOW() + interval '1 year', ${lat}, ${lng})`);
      } else {
        lands.push(`('${name}', ${basePrice}, '${location}', '${images}', '${details}', ${area}, 'Residential', ${lat}, ${lng})`);
      }
    }

    const runBatch = async (table, cols, vals) => {
        while (vals.length) {
            const batch = vals.splice(0, BATCH_SIZE);
            await client.query(`INSERT INTO ${table} (${cols}) VALUES ${batch.join(',')}`);
        }
    };

    // Updated columns list
    if (properties.length) await runBatch('properties', 'name, price, location, image_urls, details, sq_ft_or_area, amenities, latitude, longitude', properties);
    if (projects.length) await runBatch('projects', 'name, price_range, location, image_urls, details, sq_ft_or_area, completion_date, latitude, longitude', projects);
    if (lands.length) await runBatch('lands', 'name, price, location, image_urls, details, sq_ft_or_area, zoning_type, latitude, longitude', lands);

    // 3. Seed Contacts
    console.log('3. Generating Agent Contacts...');
    const propIds = (await client.query('SELECT id FROM properties')).rows.map(r => ({id: r.id, type: 'property'}));
    const projIds = (await client.query('SELECT id FROM projects')).rows.map(r => ({id: r.id, type: 'project'}));
    const landIds = (await client.query('SELECT id FROM lands')).rows.map(r => ({id: r.id, type: 'land'}));
    
    const allListings = [...propIds, ...projIds, ...landIds];
    const contacts = [];

    for (let i = 0; i < TOTAL_CONTACTS; i++) {
        const user = faker.helpers.arrayElement(userIds);
        let listing;
        if (Math.random() < 0.8) {
            listing = faker.helpers.arrayElement(allListings.slice(0, 20)); 
        } else {
            listing = faker.helpers.arrayElement(allListings); 
        }
        const msg = faker.lorem.sentence().replace(/'/g, "''");
        contacts.push(`('${user}', '${listing.id}', '${listing.type}', '${msg}')`);
    }

    await runBatch('agent_contacts', 'user_id, listing_id, listing_type, message', contacts);

    console.log('✅ Seeding Complete with Coordinates!');

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

seed();