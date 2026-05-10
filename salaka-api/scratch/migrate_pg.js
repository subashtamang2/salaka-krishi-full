
const { Client } = require('pg');
const client = new Client({
  connectionString: "postgresql://admin:admin@localhost:5432/salaka_api?schema=public"
});

async function main() {
  await client.connect();
  try {
    const res = await client.query('UPDATE "Order" SET "orderStatus" = \'Pending\' WHERE "orderStatus" = \'WAITING_ESEWA\';');
    console.log(`Successfully updated ${res.rowCount} orders.`);
  } catch (err) {
    console.error('Error executing query', err.stack);
  } finally {
    await client.end();
  }
}

main();
