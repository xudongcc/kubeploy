/* eslint-disable */
import * as types from './graphql'
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
  '\n  query WorkspaceSwitcherWorkspaces {\n    workspaces(first: 10) {\n      edges {\n        node {\n          id\n          ...WorkspaceSwitcherWorkspace @unmask\n        }\n      }\n    }\n  }\n\n  fragment WorkspaceSwitcherWorkspace on Workspace {\n    id\n    name\n  }\n': typeof types.WorkspaceSwitcherWorkspacesDocument
  'fragment User on User {\n  id\n  name\n  email\n}': typeof types.UserFragmentDoc
  'fragment Workspace on Workspace {\n  id\n  name\n}': typeof types.WorkspaceFragmentDoc
  'mutation CreateWorkspace($input: CreateWorkspaceInput!) {\n  createWorkspace(input: $input) {\n    id\n    ...Workspace\n  }\n}': typeof types.CreateWorkspaceDocument
  'query GetCurrentUser {\n  currentUser {\n    id\n    ...User @unmask\n  }\n}': typeof types.GetCurrentUserDocument
  'query GetCurrentWorkspace {\n  currentWorkspace {\n    id\n    ...Workspace @unmask\n  }\n}': typeof types.GetCurrentWorkspaceDocument
  'query GetWorkspace($id: ID!) {\n  workspace(id: $id) {\n    id\n    ...Workspace\n  }\n}': typeof types.GetWorkspaceDocument
  'query GetWorkspaces($first: Int) {\n  workspaces(first: $first) {\n    edges {\n      node {\n        id\n        ...Workspace\n      }\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}': typeof types.GetWorkspacesDocument
}
const documents: Documents = {
  '\n  query WorkspaceSwitcherWorkspaces {\n    workspaces(first: 10) {\n      edges {\n        node {\n          id\n          ...WorkspaceSwitcherWorkspace @unmask\n        }\n      }\n    }\n  }\n\n  fragment WorkspaceSwitcherWorkspace on Workspace {\n    id\n    name\n  }\n':
    types.WorkspaceSwitcherWorkspacesDocument,
  'fragment User on User {\n  id\n  name\n  email\n}': types.UserFragmentDoc,
  'fragment Workspace on Workspace {\n  id\n  name\n}':
    types.WorkspaceFragmentDoc,
  'mutation CreateWorkspace($input: CreateWorkspaceInput!) {\n  createWorkspace(input: $input) {\n    id\n    ...Workspace\n  }\n}':
    types.CreateWorkspaceDocument,
  'query GetCurrentUser {\n  currentUser {\n    id\n    ...User @unmask\n  }\n}':
    types.GetCurrentUserDocument,
  'query GetCurrentWorkspace {\n  currentWorkspace {\n    id\n    ...Workspace @unmask\n  }\n}':
    types.GetCurrentWorkspaceDocument,
  'query GetWorkspace($id: ID!) {\n  workspace(id: $id) {\n    id\n    ...Workspace\n  }\n}':
    types.GetWorkspaceDocument,
  'query GetWorkspaces($first: Int) {\n  workspaces(first: $first) {\n    edges {\n      node {\n        id\n        ...Workspace\n      }\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}':
    types.GetWorkspacesDocument,
}

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query WorkspaceSwitcherWorkspaces {\n    workspaces(first: 10) {\n      edges {\n        node {\n          id\n          ...WorkspaceSwitcherWorkspace @unmask\n        }\n      }\n    }\n  }\n\n  fragment WorkspaceSwitcherWorkspace on Workspace {\n    id\n    name\n  }\n',
): (typeof documents)['\n  query WorkspaceSwitcherWorkspaces {\n    workspaces(first: 10) {\n      edges {\n        node {\n          id\n          ...WorkspaceSwitcherWorkspace @unmask\n        }\n      }\n    }\n  }\n\n  fragment WorkspaceSwitcherWorkspace on Workspace {\n    id\n    name\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'fragment User on User {\n  id\n  name\n  email\n}',
): (typeof documents)['fragment User on User {\n  id\n  name\n  email\n}']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'fragment Workspace on Workspace {\n  id\n  name\n}',
): (typeof documents)['fragment Workspace on Workspace {\n  id\n  name\n}']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'mutation CreateWorkspace($input: CreateWorkspaceInput!) {\n  createWorkspace(input: $input) {\n    id\n    ...Workspace\n  }\n}',
): (typeof documents)['mutation CreateWorkspace($input: CreateWorkspaceInput!) {\n  createWorkspace(input: $input) {\n    id\n    ...Workspace\n  }\n}']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'query GetCurrentUser {\n  currentUser {\n    id\n    ...User @unmask\n  }\n}',
): (typeof documents)['query GetCurrentUser {\n  currentUser {\n    id\n    ...User @unmask\n  }\n}']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'query GetCurrentWorkspace {\n  currentWorkspace {\n    id\n    ...Workspace @unmask\n  }\n}',
): (typeof documents)['query GetCurrentWorkspace {\n  currentWorkspace {\n    id\n    ...Workspace @unmask\n  }\n}']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'query GetWorkspace($id: ID!) {\n  workspace(id: $id) {\n    id\n    ...Workspace\n  }\n}',
): (typeof documents)['query GetWorkspace($id: ID!) {\n  workspace(id: $id) {\n    id\n    ...Workspace\n  }\n}']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'query GetWorkspaces($first: Int) {\n  workspaces(first: $first) {\n    edges {\n      node {\n        id\n        ...Workspace\n      }\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}',
): (typeof documents)['query GetWorkspaces($first: Int) {\n  workspaces(first: $first) {\n    edges {\n      node {\n        id\n        ...Workspace\n      }\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}']

export function graphql(source: string) {
  return (documents as any)[source] ?? {}
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never
