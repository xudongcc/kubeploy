import { registerEnumType } from '@nest-boot/graphql';

export enum GitProviderType {
  GITHUB = 'GITHUB',
  GITLAB = 'GITLAB',
}

registerEnumType(GitProviderType, {
  name: 'GitProviderType',
  description: 'Type of git provider',
});
