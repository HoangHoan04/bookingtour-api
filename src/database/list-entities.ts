// Load environment variables from .env file
import 'dotenv/config';
import { dataSource } from '../typeorm/typeorm.config';

// Script để list tất cả entities mà TypeORM đang load
async function listEntities() {
  console.log('📋 Checking Entities Loaded by TypeORM...\n');

  try {
    await dataSource.initialize();
    console.log('✅ DataSource initialized\n');

    const entities = dataSource.entityMetadatas;

    console.log(`📊 Found ${entities.length} entity(ies) loaded:\n`);

    // Group entities by schema/folder
    const byFolder: { [key: string]: string[] } = {};

    entities.forEach((entity) => {
      const tableName = entity.tableName;
      const folder = entity.targetName;

      // Try to guess folder from table name
      let group = 'root';
      if (
        tableName.includes('blog') ||
        tableName.includes('banner') ||
        tableName.includes('destination') ||
        tableName.includes('news') ||
        tableName.includes('travel')
      ) {
        group = 'blogs';
      } else if (
        tableName.includes('tour') ||
        tableName.includes('booking') ||
        tableName.includes('payment') ||
        tableName.includes('voucher') ||
        tableName.includes('review')
      ) {
        group = 'tours';
      } else if (
        tableName.includes('user') ||
        tableName.includes('customer') ||
        tableName.includes('guide') ||
        tableName.includes('verify')
      ) {
        group = 'user';
      } else if (tableName.includes('role')) {
        group = 'role';
      } else if (
        tableName.includes('notif') ||
        tableName.includes('newsletter')
      ) {
        group = 'notify';
      }

      if (!byFolder[group]) {
        byFolder[group] = [];
      }
      byFolder[group].push(`${folder} → ${tableName}`);
    });

    // Print grouped
    Object.keys(byFolder)
      .sort()
      .forEach((group) => {
        console.log(`\n📁 ${group.toUpperCase()}:`);
        byFolder[group].forEach((entity) => {
          console.log(`   ✓ ${entity}`);
        });
      });

    console.log('\n\n📝 Entity Class Names:');
    entities.forEach((entity) => {
      console.log(`   - ${entity.targetName}`);
    });

    await dataSource.destroy();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

void listEntities();
