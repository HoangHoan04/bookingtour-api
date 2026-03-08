import { DATA_SOURCE } from 'src/common/constants';
import { dataSource } from 'src/typeorm';

export const databaseProvider = {
  provide: DATA_SOURCE,
  useFactory: async () => {
    try {
      if (!dataSource.isInitialized) {
        console.log('🔄 Initializing database connection...');
        await dataSource.initialize();
        console.log('✅ Database connected successfully!');

        if (process.env.NODE_ENV !== 'development') {
          try {
            console.log('🔄 Running migrations...');
            await dataSource.runMigrations();
            console.log('✅ Migrations completed!');
          } catch (error: any) {
            console.error('❌ Migration Error:', error.message);
            // Don't fail on migration errors in production
          }
        }
      }
      return dataSource;
    } catch (error: any) {
      console.error('❌ Database Connection Error:', error.message);
      console.error('Stack:', error.stack);

      // Log environment variables (without sensitive data)
      console.log('Database Config:');
      console.log('- TYPEORM_HOST:', process.env.TYPEORM_HOST || 'NOT SET');
      console.log('- TYPEORM_PORT:', process.env.TYPEORM_PORT || 'NOT SET');
      console.log(
        '- TYPEORM_DATABASE:',
        process.env.TYPEORM_DATABASE || 'NOT SET',
      );
      console.log(
        '- DATABASE_URL:',
        process.env.DATABASE_URL ? 'SET' : 'NOT SET',
      );

      throw error; // Re-throw to let NestJS handle it
    }
  },
};
