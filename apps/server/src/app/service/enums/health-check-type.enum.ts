import { registerEnumType } from '@nest-boot/graphql';

export enum HealthCheckType {
  HTTP = 'HTTP',
  TCP = 'TCP',
}

registerEnumType(HealthCheckType, {
  name: 'HealthCheckType',
});
