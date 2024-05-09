import { EnvironmentVariables } from '@benjamin-wss/cornerstone-js-utilities';
import { ConfigFactoryKeyHost, registerAs } from '@nestjs/config';

/**
 * TECH_DEBT (possibly)
 * Currently specifying the interface and config names here because the
 * dependencies are @bambu/server-core/utilities -> @bambu/server-core/configuration
 *
 * The dependencies should be reversed in order to preseve isolation.
 *
 * As a developer when defining a module I should not have to create
 * anything related to that module outside of the included module itself.
 *
 */
export interface IBambuEventEmitterConfig {
  // The maximum number of listeners on an event
  maxListeners?: number;
}
export const BAMBU_EVENT_MODULE_CONFIG_KEY = 'bambuEventModuleConfig';

const { getEnvVariableAsInteger } = EnvironmentVariables;

export const getDefaultBambuEventEmitterConfiguration =
  (): IBambuEventEmitterConfig => ({
    maxListeners: getEnvVariableAsInteger({
      fieldName: 'EVENT_EMITTER_MAX_LISTENERS',
      defaultValue: 10,
    }),
  });

export function getDefaultBambuEventEmitterConfigurationAsNestJsConfig(): (() => IBambuEventEmitterConfig) &
  ConfigFactoryKeyHost<ReturnType<() => IBambuEventEmitterConfig>> {
  return registerAs(
    BAMBU_EVENT_MODULE_CONFIG_KEY,
    getDefaultBambuEventEmitterConfiguration
  );
}
