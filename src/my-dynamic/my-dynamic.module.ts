import { DynamicModule, Module } from '@nestjs/common';

export type MyDynamicModuleConfigs = {
  apiKey: string;
  apiUrl: string;
};

export const MY_DYNAMIC_MODULE_CONFIGS = 'MY_DYNAMIC_MODULE_CONFIGS';

@Module({})
export class MyDynamicModule {
  static register(configs: MyDynamicModuleConfigs): DynamicModule {
    console.log('RUNNING MY DYNAMIC MODULE');
    // This is where you can define the dynamic module's configuration

    return {
      module: MyDynamicModule,
      imports: [],
      exports: [MY_DYNAMIC_MODULE_CONFIGS],
      providers: [
        {
          provide: MY_DYNAMIC_MODULE_CONFIGS,
          useValue: configs,
        },
      ],
      controllers: [],
    };
  }
}
