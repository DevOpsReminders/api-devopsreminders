import modules, { AppConfig } from '@config/modules';
import developmentOverrides from '@config/environments/development';
import testingOverrides from '@config/environments/testing';
import { DeepPartial } from 'typeorm';
import Env from '@utils/Env';
import merge from 'lodash/merge';
type EnvironmentTypes = 'development' | 'production' | 'testing';
type Environments = Partial<Record<EnvironmentTypes, DeepPartial<AppConfig>>>;

const environments: Environments = {
    development: developmentOverrides,
    testing: testingOverrides,
};
const currentEnvironmentKey = Env.asString('NODE_ENV', 'development') as EnvironmentTypes;

let appConfig: AppConfig = modules;
if (environments[currentEnvironmentKey]) {
    appConfig = merge(appConfig, environments[currentEnvironmentKey]);
}
export default appConfig;
