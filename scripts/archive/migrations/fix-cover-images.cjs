/**
 * Diagnose and fix cover images for products where the first image
 * doesn't show the brand/label clearly.
 *
 * Usage:
 *   node scripts/fix-cover-images.cjs            -- dry-run, shows current state
 *   node scripts/fix-cover-images.cjs --fix       -- apply changes
 *   node scripts/fix-cover-images.cjs --fix --product "PRIMER EVA INCOLORO - 3000cc"
 */

const { Client } = require('pg');

const DB_URL = process.env.DATABASE_URL;

const args = process.argv.slice(2);
const DRY_RUN = !args.includes('--fix');
const PRODUCT_FILTER = (() => {
  const idx = args.indexOf('--product');
  return idx !== -1 ? args[idx + 1] : null;
})();

async function main() {
  const client = new Client({ connectionString: DB_URL });
  await client.connect();
  console.log('Connected to DB\n');

  try {
    // Get product(s) with their images ordered by sort_order / product_image_id
    const productQuery = PRODUCT_FILTER
      ? `SELECT p.product_id, p.uuid, pd.name
         FROM product p
         JOIN product_description pd ON pd.product_description_product_id = p.product_id
         WHERE pd.name ILIKE $1
         ORDER BY pd.name`
      : `SELECT p.product_id, p.uuid, pd.name
         FROM product p
         JOIN product_description pd ON pd.product_description_product_id = p.product_id
         ORDER BY pd.name`;

    const products = await client.query(
      productQuery,
      PRODUCT_FILTER ? [`%${PRODUCT_FILTER}%`] : []
    );

    if (products.rows.length === 0) {
      console.log('No products found.');
      return;
    }

    console.log(`Found ${products.rows.length} product(s)\n`);

    for (const prod of products.rows) {
      // Get all images for this product ordered by sort_order then id
      const imgRes = await client.query(
        `SELECT product_image_id, origin_image, listing_image, single_image, is_main
         FROM product_image
         WHERE product_image_product_id = $1
         ORDER BY product_image_id ASC`,
        [prod.product_id]
      );

      const imgs = imgRes.rows;
      if (imgs.length === 0) {
        console.log(`[${prod.name}] — no images`);
        continue;
      }

      const mainIdx = imgs.findIndex(i => i.is_main);
      console.log(`\n=== ${prod.name} (id: ${prod.product_id}) ===`);
      imgs.forEach((img, idx) => {
        const marker = img.is_main ? ' ← COVER' : '';
        console.log(`  [${idx + 1}] id=${img.product_image_id} ${img.origin_image}${marker}`);
      });

      // Only touch products that have at least 3 images
      if (imgs.length < 3) {
        console.log('  → Less than 3 images, skipping.');
        continue;
      }

      // If the 3rd image is already the cover, skip
      const thirdImg = imgs[2];
      if (thirdImg.is_main) {
        console.log('  → 3rd image is already the cover, skipping.');
        continue;
      }

      // Only auto-fix if --product was specified, otherwise report
      if (PRODUCT_FILTER || DRY_RUN === false) {
        if (DRY_RUN) {
          console.log(`  → [DRY-RUN] Would set image #3 (id=${thirdImg.product_image_id}) as cover`);
        } else {
          // Unset current cover
          await client.query(
            `UPDATE product_image SET is_main = false WHERE product_image_product_id = $1`,
            [prod.product_id]
          );
          // Set 3rd image as cover
          await client.query(
            `UPDATE product_image SET is_main = true WHERE product_image_id = $1`,
            [thirdImg.product_image_id]
          );
          console.log(`  → FIXED: image #3 (id=${thirdImg.product_image_id}) is now the cover`);
        }
      } else {
        console.log(`  → [DRY-RUN] Cover is image #${mainIdx + 1}. Run with --fix --product "${prod.name}" to change to #3.`);
      }
    }

    console.log('\nDone.');
  } finally {
    await client.end();
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
