/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never }
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never
    }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any }
}

export type AcceptWorkspaceInviteInput = {
  name?: InputMaybe<Scalars['String']['input']>
}

export type AcceptWorkspaceInviteResult = {
  __typename?: 'AcceptWorkspaceInviteResult'
  workspaceId: Scalars['ID']['output']
  workspaceMember: WorkspaceMember
}

export type AddWorkspaceMemberInput = {
  email: Scalars['String']['input']
}

export type CreateWorkspaceInput = {
  name: Scalars['String']['input']
}

export type CreateWorkspaceInviteInput = {
  email?: InputMaybe<Scalars['String']['input']>
  role: WorkspaceMemberRole
}

export type FileUpload = {
  __typename?: 'FileUpload'
  fields: Array<FileUploadField>
  url: Scalars['String']['output']
}

export type FileUploadField = {
  __typename?: 'FileUploadField'
  name: Scalars['String']['output']
  value: Scalars['String']['output']
}

export type FileUploadInput = {
  fileSize: Scalars['Int']['input']
  mimeType: Scalars['String']['input']
  name: Scalars['String']['input']
}

export type Mutation = {
  __typename?: 'Mutation'
  acceptWorkspaceInvite: AcceptWorkspaceInviteResult
  addWorkspaceMember: WorkspaceMember
  createFileUploads: Array<FileUpload>
  createWorkspace: Workspace
  createWorkspaceInvite: WorkspaceMember
  removeWorkspace: Workspace
  removeWorkspaceMember: WorkspaceMember
  updateWorkspace: Workspace
  updateWorkspaceMember?: Maybe<WorkspaceMember>
}

export type MutationAcceptWorkspaceInviteArgs = {
  input?: InputMaybe<AcceptWorkspaceInviteInput>
  token: Scalars['String']['input']
}

export type MutationAddWorkspaceMemberArgs = {
  input: AddWorkspaceMemberInput
}

export type MutationCreateFileUploadsArgs = {
  input: Array<FileUploadInput>
}

export type MutationCreateWorkspaceArgs = {
  input: CreateWorkspaceInput
}

export type MutationCreateWorkspaceInviteArgs = {
  input: CreateWorkspaceInviteInput
}

export type MutationRemoveWorkspaceMemberArgs = {
  id: Scalars['ID']['input']
}

export type MutationUpdateWorkspaceArgs = {
  input: UpdateWorkspaceInput
}

export type MutationUpdateWorkspaceMemberArgs = {
  id: Scalars['ID']['input']
  input: UpdateWorkspaceMemberInput
}

export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

/** Returns information about pagination in a connection, in accordance with the [Relay specification](https://relay.dev/graphql/connections.htm#sec-undefined.PageInfo). */
export type PageInfo = {
  __typename?: 'PageInfo'
  endCursor?: Maybe<Scalars['String']['output']>
  /** Whether there are more pages to fetch following the current page. */
  hasNextPage: Scalars['Boolean']['output']
  /** Whether there are any pages prior to the current page. */
  hasPreviousPage: Scalars['Boolean']['output']
  startCursor?: Maybe<Scalars['String']['output']>
}

export type Query = {
  __typename?: 'Query'
  currentUser: User
  currentWorkspace: Workspace
  currentWorkspaceMember: WorkspaceMember
  workspace?: Maybe<Workspace>
  workspaceMember?: Maybe<WorkspaceMember>
  workspaceMemberByToken?: Maybe<WorkspaceMember>
  workspaceMembers: WorkspaceMemberConnection
  workspaces: WorkspaceConnection
}

export type QueryWorkspaceArgs = {
  id: Scalars['ID']['input']
}

export type QueryWorkspaceMemberArgs = {
  id: Scalars['ID']['input']
}

export type QueryWorkspaceMemberByTokenArgs = {
  token: Scalars['String']['input']
}

export type QueryWorkspaceMembersArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<WorkspaceMemberOrder>
  query?: InputMaybe<Scalars['String']['input']>
}

export type QueryWorkspacesArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<WorkspaceOrder>
  query?: InputMaybe<Scalars['String']['input']>
}

export type UpdateWorkspaceInput = {
  name?: InputMaybe<Scalars['String']['input']>
}

export type UpdateWorkspaceMemberInput = {
  email?: InputMaybe<Scalars['String']['input']>
  name?: InputMaybe<Scalars['String']['input']>
  permissions?: InputMaybe<Array<WorkspacePermission>>
  role?: InputMaybe<WorkspaceMemberRole>
}

export type User = {
  __typename?: 'User'
  createdAt: Scalars['DateTime']['output']
  email: Scalars['String']['output']
  id: Scalars['ID']['output']
  name: Scalars['String']['output']
  updatedAt: Scalars['DateTime']['output']
}

export type Workspace = {
  __typename?: 'Workspace'
  createdAt: Scalars['DateTime']['output']
  deletedAt?: Maybe<Scalars['DateTime']['output']>
  features: Array<WorkspaceFeature>
  id: Scalars['ID']['output']
  name: Scalars['String']['output']
  updatedAt: Scalars['DateTime']['output']
}

export type WorkspaceConnection = {
  __typename?: 'WorkspaceConnection'
  /** A list of edges. */
  edges: Array<WorkspaceEdge>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output']
}

/** An auto-generated type which holds one Workspace and a cursor during pagination. */
export type WorkspaceEdge = {
  __typename?: 'WorkspaceEdge'
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output']
  /** The item at the end of WorkspaceEdge. */
  node: Workspace
}

export enum WorkspaceFeature {
  AI = 'AI',
}

export type WorkspaceMember = {
  __typename?: 'WorkspaceMember'
  createdAt: Scalars['DateTime']['output']
  email?: Maybe<Scalars['String']['output']>
  id: Scalars['ID']['output']
  inviteExpiresAt?: Maybe<Scalars['DateTime']['output']>
  inviteStatus?: Maybe<WorkspaceMemberInviteStatus>
  inviteToken?: Maybe<Scalars['String']['output']>
  invitedBy?: Maybe<User>
  invitedByUserName?: Maybe<Scalars['String']['output']>
  name: Scalars['String']['output']
  permissions: Array<WorkspacePermission>
  role: WorkspaceMemberRole
  updatedAt: Scalars['DateTime']['output']
  user?: Maybe<User>
}

export type WorkspaceMemberConnection = {
  __typename?: 'WorkspaceMemberConnection'
  /** A list of edges. */
  edges: Array<WorkspaceMemberEdge>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output']
}

/** An auto-generated type which holds one WorkspaceMember and a cursor during pagination. */
export type WorkspaceMemberEdge = {
  __typename?: 'WorkspaceMemberEdge'
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output']
  /** The item at the end of WorkspaceMemberEdge. */
  node: WorkspaceMember
}

export enum WorkspaceMemberInviteStatus {
  ACCEPTED = 'ACCEPTED',
  EXPIRED = 'EXPIRED',
  PENDING = 'PENDING',
}

/** Ordering options for workspacemember connections */
export type WorkspaceMemberOrder = {
  /** The ordering direction. */
  direction: OrderDirection
  /** The field to order workspacemembers by. */
  field: WorkspaceMemberOrderField
}

/** Properties by which workspacemember connections can be ordered. */
export enum WorkspaceMemberOrderField {
  CREATED_AT = 'CREATED_AT',
  ID = 'ID',
}

export enum WorkspaceMemberRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  OWNER = 'OWNER',
}

/** Ordering options for workspace connections */
export type WorkspaceOrder = {
  /** The ordering direction. */
  direction: OrderDirection
  /** The field to order workspaces by. */
  field: WorkspaceOrderField
}

/** Properties by which workspace connections can be ordered. */
export enum WorkspaceOrderField {
  CREATED_AT = 'CREATED_AT',
  ID = 'ID',
}

export enum WorkspacePermission {
  DELETE_FILES = 'DELETE_FILES',
  MANAGE_FILES = 'MANAGE_FILES',
  MANAGE_MEMBERS = 'MANAGE_MEMBERS',
  MANAGE_TAGS = 'MANAGE_TAGS',
  MANAGE_WORKSPACE = 'MANAGE_WORKSPACE',
}

export type WorkspaceSwitcherWorkspacesQueryVariables = Exact<{
  [key: string]: never
}>

export type WorkspaceSwitcherWorkspacesQuery = {
  __typename?: 'Query'
  workspaces: {
    __typename?: 'WorkspaceConnection'
    edges: Array<{
      __typename?: 'WorkspaceEdge'
      node: { __typename?: 'Workspace'; id: string; name: string }
    }>
  }
}

export type WorkspaceSwitcherWorkspaceFragment = {
  __typename?: 'Workspace'
  id: string
  name: string
} & { ' $fragmentName'?: 'WorkspaceSwitcherWorkspaceFragment' }

export type UserFragment = {
  __typename?: 'User'
  id: string
  name: string
  email: string
} & { ' $fragmentName'?: 'UserFragment' }

export type WorkspaceFragment = {
  __typename?: 'Workspace'
  id: string
  name: string
} & { ' $fragmentName'?: 'WorkspaceFragment' }

export type CreateWorkspaceMutationVariables = Exact<{
  input: CreateWorkspaceInput
}>

export type CreateWorkspaceMutation = {
  __typename?: 'Mutation'
  createWorkspace: { __typename?: 'Workspace'; id: string } & {
    ' $fragmentRefs'?: { WorkspaceFragment: WorkspaceFragment }
  }
}

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never }>

export type GetCurrentUserQuery = {
  __typename?: 'Query'
  currentUser: { __typename?: 'User'; id: string; name: string; email: string }
}

export type GetCurrentWorkspaceQueryVariables = Exact<{ [key: string]: never }>

export type GetCurrentWorkspaceQuery = {
  __typename?: 'Query'
  currentWorkspace: { __typename?: 'Workspace'; id: string; name: string }
}

export type GetWorkspaceQueryVariables = Exact<{
  id: Scalars['ID']['input']
}>

export type GetWorkspaceQuery = {
  __typename?: 'Query'
  workspace?:
    | ({ __typename?: 'Workspace'; id: string } & {
        ' $fragmentRefs'?: { WorkspaceFragment: WorkspaceFragment }
      })
    | null
}

export type GetWorkspacesQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>
}>

export type GetWorkspacesQuery = {
  __typename?: 'Query'
  workspaces: {
    __typename?: 'WorkspaceConnection'
    edges: Array<{
      __typename?: 'WorkspaceEdge'
      node: { __typename?: 'Workspace'; id: string } & {
        ' $fragmentRefs'?: { WorkspaceFragment: WorkspaceFragment }
      }
    }>
    pageInfo: {
      __typename?: 'PageInfo'
      hasNextPage: boolean
      hasPreviousPage: boolean
      startCursor?: string | null
      endCursor?: string | null
    }
  }
}

export const WorkspaceSwitcherWorkspaceFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'WorkspaceSwitcherWorkspace' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Workspace' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<WorkspaceSwitcherWorkspaceFragment, unknown>
export const UserFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'User' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'User' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'email' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UserFragment, unknown>
export const WorkspaceFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'Workspace' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Workspace' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<WorkspaceFragment, unknown>
export const WorkspaceSwitcherWorkspacesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'WorkspaceSwitcherWorkspaces' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'workspaces' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'first' },
                value: { kind: 'IntValue', value: '10' },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'FragmentSpread',
                              name: {
                                kind: 'Name',
                                value: 'WorkspaceSwitcherWorkspace',
                              },
                              directives: [
                                {
                                  kind: 'Directive',
                                  name: { kind: 'Name', value: 'unmask' },
                                },
                              ],
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'WorkspaceSwitcherWorkspace' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Workspace' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  WorkspaceSwitcherWorkspacesQuery,
  WorkspaceSwitcherWorkspacesQueryVariables
>
export const CreateWorkspaceDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateWorkspace' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'CreateWorkspaceInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createWorkspace' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'Workspace' },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'Workspace' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Workspace' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateWorkspaceMutation,
  CreateWorkspaceMutationVariables
>
export const GetCurrentUserDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetCurrentUser' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'currentUser' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'User' },
                  directives: [
                    {
                      kind: 'Directive',
                      name: { kind: 'Name', value: 'unmask' },
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'User' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'User' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'email' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetCurrentUserQuery, GetCurrentUserQueryVariables>
export const GetCurrentWorkspaceDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetCurrentWorkspace' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'currentWorkspace' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'Workspace' },
                  directives: [
                    {
                      kind: 'Directive',
                      name: { kind: 'Name', value: 'unmask' },
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'Workspace' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Workspace' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetCurrentWorkspaceQuery,
  GetCurrentWorkspaceQueryVariables
>
export const GetWorkspaceDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetWorkspace' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'workspace' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'Workspace' },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'Workspace' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Workspace' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetWorkspaceQuery, GetWorkspaceQueryVariables>
export const GetWorkspacesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetWorkspaces' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'first' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'workspaces' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'first' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'first' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'FragmentSpread',
                              name: { kind: 'Name', value: 'Workspace' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'pageInfo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'hasNextPage' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'hasPreviousPage' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'startCursor' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'endCursor' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'Workspace' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Workspace' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetWorkspacesQuery, GetWorkspacesQueryVariables>
