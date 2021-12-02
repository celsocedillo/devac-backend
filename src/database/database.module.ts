import { Module, Global } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import config from '../config';

@Global()
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [config.KEY],
            useFactory: (configService: ConfigType<typeof config>) => {
              const { user, host, sid, password, port } = configService.oracle;
              return {
                type: 'oracle',
                sid,
                host,
                port,
                username: user,
                password,
                synchronize: false,
                autoLoadEntities: true,
              };
            },
          }),
    ],
    providers: [],
    exports: [ TypeOrmModule],
})
export class DatabaseModule {}
