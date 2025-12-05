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
  '\n  query GetCurrentUser {\n    currentUser {\n      id\n      ...CurrentUser @unmask\n    }\n  }\n\n  fragment CurrentUser on User {\n    id\n    name\n    email\n  }\n': typeof types.GetCurrentUserDocument
  '\n  query GetCurrentWorkspace($id: ID!) {\n    workspace(id: $id) {\n      id\n      ...CurrentWorkspace @unmask\n    }\n  }\n\n  fragment CurrentWorkspace on Workspace {\n    id\n    name\n  }\n': typeof types.GetCurrentWorkspaceDocument
  '\n  query GetProject($id: ID!) {\n    project(id: $id) {\n      id\n      ...ProjectDetail @unmask\n    }\n  }\n\n  fragment ProjectDetail on Project {\n    id\n    name\n    createdAt\n  }\n': typeof types.GetProjectDocument
  '\n  mutation CreateService($input: CreateServiceInput!) {\n    createService(input: $input) {\n      id\n    }\n  }\n': typeof types.CreateServiceDocument
  '\n  query GetServices(\n    $projectId: ID!\n    $after: String\n    $before: String\n    $first: Int\n    $last: Int\n    $orderBy: ServiceOrder\n    $query: String\n  ) {\n    services(\n      projectId: $projectId\n      after: $after\n      before: $before\n      first: $first\n      last: $last\n      orderBy: $orderBy\n      query: $query\n    ) {\n      edges {\n        node {\n          id\n          ...ServiceItem @unmask\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n    }\n  }\n\n  fragment ServiceItem on Service {\n    id\n    name\n    image\n    replicas\n    ports\n    createdAt\n  }\n': typeof types.GetServicesDocument
  '\n  query GetProjectSettings($id: ID!) {\n    project(id: $id) {\n      id\n      ...ProjectDetail @unmask\n    }\n  }\n': typeof types.GetProjectSettingsDocument
  '\n  mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {\n    updateProject(id: $id, input: $input) {\n      id\n      ...ProjectDetail\n    }\n  }\n': typeof types.UpdateProjectDocument
  '\n  mutation RemoveProject($id: ID!) {\n    removeProject(id: $id) {\n      id\n    }\n  }\n': typeof types.RemoveProjectDocument
  '\n  query GetProjects(\n    $after: String\n    $before: String\n    $first: Int\n    $last: Int\n    $orderBy: ProjectOrder\n    $query: String\n  ) {\n    projects(\n      after: $after\n      before: $before\n      first: $first\n      last: $last\n      orderBy: $orderBy\n      query: $query\n    ) {\n      edges {\n        node {\n          id\n          ...ProjectItem @unmask\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n    }\n  }\n\n  fragment ProjectItem on Project {\n    id\n    name\n    createdAt\n  }\n': typeof types.GetProjectsDocument
  '\n  mutation CreateProject($input: CreateProjectInput!) {\n    createProject(input: $input) {\n      id\n    }\n  }\n': typeof types.CreateProjectDocument
  '\n  query GetFirstWorkspace {\n    workspaces(first: 1, orderBy: { field: CREATED_AT, direction: DESC }) {\n      edges {\n        node {\n          id\n        }\n      }\n    }\n  }\n': typeof types.GetFirstWorkspaceDocument
}
const documents: Documents = {
  '\n  query WorkspaceSwitcherWorkspaces {\n    workspaces(first: 10) {\n      edges {\n        node {\n          id\n          ...WorkspaceSwitcherWorkspace @unmask\n        }\n      }\n    }\n  }\n\n  fragment WorkspaceSwitcherWorkspace on Workspace {\n    id\n    name\n  }\n':
    types.WorkspaceSwitcherWorkspacesDocument,
  '\n  query GetCurrentUser {\n    currentUser {\n      id\n      ...CurrentUser @unmask\n    }\n  }\n\n  fragment CurrentUser on User {\n    id\n    name\n    email\n  }\n':
    types.GetCurrentUserDocument,
  '\n  query GetCurrentWorkspace($id: ID!) {\n    workspace(id: $id) {\n      id\n      ...CurrentWorkspace @unmask\n    }\n  }\n\n  fragment CurrentWorkspace on Workspace {\n    id\n    name\n  }\n':
    types.GetCurrentWorkspaceDocument,
  '\n  query GetProject($id: ID!) {\n    project(id: $id) {\n      id\n      ...ProjectDetail @unmask\n    }\n  }\n\n  fragment ProjectDetail on Project {\n    id\n    name\n    createdAt\n  }\n':
    types.GetProjectDocument,
  '\n  mutation CreateService($input: CreateServiceInput!) {\n    createService(input: $input) {\n      id\n    }\n  }\n':
    types.CreateServiceDocument,
  '\n  query GetServices(\n    $projectId: ID!\n    $after: String\n    $before: String\n    $first: Int\n    $last: Int\n    $orderBy: ServiceOrder\n    $query: String\n  ) {\n    services(\n      projectId: $projectId\n      after: $after\n      before: $before\n      first: $first\n      last: $last\n      orderBy: $orderBy\n      query: $query\n    ) {\n      edges {\n        node {\n          id\n          ...ServiceItem @unmask\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n    }\n  }\n\n  fragment ServiceItem on Service {\n    id\n    name\n    image\n    replicas\n    ports\n    createdAt\n  }\n':
    types.GetServicesDocument,
  '\n  query GetProjectSettings($id: ID!) {\n    project(id: $id) {\n      id\n      ...ProjectDetail @unmask\n    }\n  }\n':
    types.GetProjectSettingsDocument,
  '\n  mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {\n    updateProject(id: $id, input: $input) {\n      id\n      ...ProjectDetail\n    }\n  }\n':
    types.UpdateProjectDocument,
  '\n  mutation RemoveProject($id: ID!) {\n    removeProject(id: $id) {\n      id\n    }\n  }\n':
    types.RemoveProjectDocument,
  '\n  query GetProjects(\n    $after: String\n    $before: String\n    $first: Int\n    $last: Int\n    $orderBy: ProjectOrder\n    $query: String\n  ) {\n    projects(\n      after: $after\n      before: $before\n      first: $first\n      last: $last\n      orderBy: $orderBy\n      query: $query\n    ) {\n      edges {\n        node {\n          id\n          ...ProjectItem @unmask\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n    }\n  }\n\n  fragment ProjectItem on Project {\n    id\n    name\n    createdAt\n  }\n':
    types.GetProjectsDocument,
  '\n  mutation CreateProject($input: CreateProjectInput!) {\n    createProject(input: $input) {\n      id\n    }\n  }\n':
    types.CreateProjectDocument,
  '\n  query GetFirstWorkspace {\n    workspaces(first: 1, orderBy: { field: CREATED_AT, direction: DESC }) {\n      edges {\n        node {\n          id\n        }\n      }\n    }\n  }\n':
    types.GetFirstWorkspaceDocument,
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
  source: '\n  query GetCurrentUser {\n    currentUser {\n      id\n      ...CurrentUser @unmask\n    }\n  }\n\n  fragment CurrentUser on User {\n    id\n    name\n    email\n  }\n',
): (typeof documents)['\n  query GetCurrentUser {\n    currentUser {\n      id\n      ...CurrentUser @unmask\n    }\n  }\n\n  fragment CurrentUser on User {\n    id\n    name\n    email\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetCurrentWorkspace($id: ID!) {\n    workspace(id: $id) {\n      id\n      ...CurrentWorkspace @unmask\n    }\n  }\n\n  fragment CurrentWorkspace on Workspace {\n    id\n    name\n  }\n',
): (typeof documents)['\n  query GetCurrentWorkspace($id: ID!) {\n    workspace(id: $id) {\n      id\n      ...CurrentWorkspace @unmask\n    }\n  }\n\n  fragment CurrentWorkspace on Workspace {\n    id\n    name\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetProject($id: ID!) {\n    project(id: $id) {\n      id\n      ...ProjectDetail @unmask\n    }\n  }\n\n  fragment ProjectDetail on Project {\n    id\n    name\n    createdAt\n  }\n',
): (typeof documents)['\n  query GetProject($id: ID!) {\n    project(id: $id) {\n      id\n      ...ProjectDetail @unmask\n    }\n  }\n\n  fragment ProjectDetail on Project {\n    id\n    name\n    createdAt\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation CreateService($input: CreateServiceInput!) {\n    createService(input: $input) {\n      id\n    }\n  }\n',
): (typeof documents)['\n  mutation CreateService($input: CreateServiceInput!) {\n    createService(input: $input) {\n      id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetServices(\n    $projectId: ID!\n    $after: String\n    $before: String\n    $first: Int\n    $last: Int\n    $orderBy: ServiceOrder\n    $query: String\n  ) {\n    services(\n      projectId: $projectId\n      after: $after\n      before: $before\n      first: $first\n      last: $last\n      orderBy: $orderBy\n      query: $query\n    ) {\n      edges {\n        node {\n          id\n          ...ServiceItem @unmask\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n    }\n  }\n\n  fragment ServiceItem on Service {\n    id\n    name\n    image\n    replicas\n    ports\n    createdAt\n  }\n',
): (typeof documents)['\n  query GetServices(\n    $projectId: ID!\n    $after: String\n    $before: String\n    $first: Int\n    $last: Int\n    $orderBy: ServiceOrder\n    $query: String\n  ) {\n    services(\n      projectId: $projectId\n      after: $after\n      before: $before\n      first: $first\n      last: $last\n      orderBy: $orderBy\n      query: $query\n    ) {\n      edges {\n        node {\n          id\n          ...ServiceItem @unmask\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n    }\n  }\n\n  fragment ServiceItem on Service {\n    id\n    name\n    image\n    replicas\n    ports\n    createdAt\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetProjectSettings($id: ID!) {\n    project(id: $id) {\n      id\n      ...ProjectDetail @unmask\n    }\n  }\n',
): (typeof documents)['\n  query GetProjectSettings($id: ID!) {\n    project(id: $id) {\n      id\n      ...ProjectDetail @unmask\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {\n    updateProject(id: $id, input: $input) {\n      id\n      ...ProjectDetail\n    }\n  }\n',
): (typeof documents)['\n  mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {\n    updateProject(id: $id, input: $input) {\n      id\n      ...ProjectDetail\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation RemoveProject($id: ID!) {\n    removeProject(id: $id) {\n      id\n    }\n  }\n',
): (typeof documents)['\n  mutation RemoveProject($id: ID!) {\n    removeProject(id: $id) {\n      id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetProjects(\n    $after: String\n    $before: String\n    $first: Int\n    $last: Int\n    $orderBy: ProjectOrder\n    $query: String\n  ) {\n    projects(\n      after: $after\n      before: $before\n      first: $first\n      last: $last\n      orderBy: $orderBy\n      query: $query\n    ) {\n      edges {\n        node {\n          id\n          ...ProjectItem @unmask\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n    }\n  }\n\n  fragment ProjectItem on Project {\n    id\n    name\n    createdAt\n  }\n',
): (typeof documents)['\n  query GetProjects(\n    $after: String\n    $before: String\n    $first: Int\n    $last: Int\n    $orderBy: ProjectOrder\n    $query: String\n  ) {\n    projects(\n      after: $after\n      before: $before\n      first: $first\n      last: $last\n      orderBy: $orderBy\n      query: $query\n    ) {\n      edges {\n        node {\n          id\n          ...ProjectItem @unmask\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n    }\n  }\n\n  fragment ProjectItem on Project {\n    id\n    name\n    createdAt\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation CreateProject($input: CreateProjectInput!) {\n    createProject(input: $input) {\n      id\n    }\n  }\n',
): (typeof documents)['\n  mutation CreateProject($input: CreateProjectInput!) {\n    createProject(input: $input) {\n      id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetFirstWorkspace {\n    workspaces(first: 1, orderBy: { field: CREATED_AT, direction: DESC }) {\n      edges {\n        node {\n          id\n        }\n      }\n    }\n  }\n',
): (typeof documents)['\n  query GetFirstWorkspace {\n    workspaces(first: 1, orderBy: { field: CREATED_AT, direction: DESC }) {\n      edges {\n        node {\n          id\n        }\n      }\n    }\n  }\n']

export function graphql(source: string) {
  return (documents as any)[source] ?? {}
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never
