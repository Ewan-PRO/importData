import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
	engine: 'classic',
	datasource: {
		url: env('CENOV_PREPROD_DATABASE_URL')
	},
	schema: './schema.prisma'
});
