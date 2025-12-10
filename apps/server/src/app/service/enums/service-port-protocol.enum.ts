import { registerEnumType } from '@nest-boot/graphql';

export enum ServicePortProtocol {
  HTTP = 'HTTP',
  TCP = 'TCP',
  UDP = 'UDP',
}

registerEnumType(ServicePortProtocol, {
  name: 'ServicePortProtocol',
});
