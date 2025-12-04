import { ConfigModule } from '@nestjs/config';

const ConfigDynamicModule = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: process.env.NODE_ENV === 'testing' ? '.testing.env' : '.env',
  expandVariables: true,
});

export { ConfigDynamicModule as ConfigModule };
