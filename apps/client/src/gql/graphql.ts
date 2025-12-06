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

export type Cluster = {
  __typename?: 'Cluster'
  createdAt: Scalars['DateTime']['output']
  id: Scalars['ID']['output']
  name: Scalars['String']['output']
  projects: ProjectConnection
  server: Scalars['String']['output']
  updatedAt: Scalars['DateTime']['output']
}

export type ClusterProjectsArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<ProjectOrder>
  query?: InputMaybe<Scalars['String']['input']>
}

export type ClusterConnection = {
  __typename?: 'ClusterConnection'
  /** A list of edges. */
  edges: Array<ClusterEdge>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output']
}

/** An auto-generated type which holds one Cluster and a cursor during pagination. */
export type ClusterEdge = {
  __typename?: 'ClusterEdge'
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output']
  /** The item at the end of ClusterEdge. */
  node: Cluster
}

/** Ordering options for cluster connections */
export type ClusterOrder = {
  /** The ordering direction. */
  direction: OrderDirection
  /** The field to order clusters by. */
  field: ClusterOrderField
}

/** Properties by which cluster connections can be ordered. */
export enum ClusterOrderField {
  CREATED_AT = 'CREATED_AT',
  ID = 'ID',
}

export type CreateClusterInput = {
  certificateAuthorityData: Scalars['String']['input']
  name: Scalars['String']['input']
  server: Scalars['String']['input']
  token: Scalars['String']['input']
  workspaceId: Scalars['ID']['input']
}

export type CreateDomainInput = {
  host: Scalars['String']['input']
  path?: InputMaybe<Scalars['String']['input']>
  serviceId: Scalars['ID']['input']
  servicePort: Scalars['Int']['input']
}

export type CreateProjectInput = {
  clusterId: Scalars['ID']['input']
  name: Scalars['String']['input']
}

export type CreateServiceInput = {
  environmentVariables?: InputMaybe<Array<EnvironmentVariableInput>>
  image: Scalars['String']['input']
  name: Scalars['String']['input']
  ports?: InputMaybe<Array<Scalars['Int']['input']>>
  projectId: Scalars['ID']['input']
  replicas?: InputMaybe<Scalars['Int']['input']>
}

export type CreateVolumeInput = {
  name: Scalars['String']['input']
  serviceId: Scalars['ID']['input']
  size: Scalars['String']['input']
  storageClass?: InputMaybe<Scalars['String']['input']>
}

export type CreateWorkspaceInput = {
  name: Scalars['String']['input']
}

export type CreateWorkspaceInviteInput = {
  email?: InputMaybe<Scalars['String']['input']>
  role: WorkspaceMemberRole
}

export type Domain = {
  __typename?: 'Domain'
  createdAt: Scalars['DateTime']['output']
  host: Scalars['String']['output']
  id: Scalars['ID']['output']
  path: Scalars['String']['output']
  service: Service
  servicePort: Scalars['Int']['output']
  updatedAt: Scalars['DateTime']['output']
}

export type DomainConnection = {
  __typename?: 'DomainConnection'
  /** A list of edges. */
  edges: Array<DomainEdge>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output']
}

/** An auto-generated type which holds one Domain and a cursor during pagination. */
export type DomainEdge = {
  __typename?: 'DomainEdge'
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output']
  /** The item at the end of DomainEdge. */
  node: Domain
}

/** Ordering options for domain connections */
export type DomainOrder = {
  /** The ordering direction. */
  direction: OrderDirection
  /** The field to order domains by. */
  field: DomainOrderField
}

/** Properties by which domain connections can be ordered. */
export enum DomainOrderField {
  CREATED_AT = 'CREATED_AT',
  ID = 'ID',
}

export type EnvironmentVariable = {
  __typename?: 'EnvironmentVariable'
  key: Scalars['String']['output']
  value: Scalars['String']['output']
}

export type EnvironmentVariableInput = {
  key: Scalars['String']['input']
  value: Scalars['String']['input']
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
  createCluster: Cluster
  createDomain: Domain
  createFileUploads: Array<FileUpload>
  createProject: Project
  createService: Service
  createVolume: Volume
  createWorkspace: Workspace
  createWorkspaceInvite: WorkspaceMember
  removeCluster: Cluster
  removeDomain: Domain
  removeProject: Project
  removeService: Service
  removeVolume: Volume
  removeWorkspace: Workspace
  removeWorkspaceMember: WorkspaceMember
  updateCluster: Cluster
  updateDomain: Domain
  updateProject: Project
  updateService: Service
  updateVolume: Volume
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

export type MutationCreateClusterArgs = {
  input: CreateClusterInput
}

export type MutationCreateDomainArgs = {
  input: CreateDomainInput
}

export type MutationCreateFileUploadsArgs = {
  input: Array<FileUploadInput>
}

export type MutationCreateProjectArgs = {
  input: CreateProjectInput
}

export type MutationCreateServiceArgs = {
  input: CreateServiceInput
}

export type MutationCreateVolumeArgs = {
  input: CreateVolumeInput
}

export type MutationCreateWorkspaceArgs = {
  input: CreateWorkspaceInput
}

export type MutationCreateWorkspaceInviteArgs = {
  input: CreateWorkspaceInviteInput
}

export type MutationRemoveClusterArgs = {
  id: Scalars['ID']['input']
}

export type MutationRemoveDomainArgs = {
  id: Scalars['ID']['input']
}

export type MutationRemoveProjectArgs = {
  id: Scalars['ID']['input']
}

export type MutationRemoveServiceArgs = {
  id: Scalars['ID']['input']
}

export type MutationRemoveVolumeArgs = {
  id: Scalars['ID']['input']
}

export type MutationRemoveWorkspaceMemberArgs = {
  id: Scalars['ID']['input']
}

export type MutationUpdateClusterArgs = {
  id: Scalars['ID']['input']
  input: UpdateClusterInput
}

export type MutationUpdateDomainArgs = {
  id: Scalars['ID']['input']
  input: UpdateDomainInput
}

export type MutationUpdateProjectArgs = {
  id: Scalars['ID']['input']
  input: UpdateProjectInput
}

export type MutationUpdateServiceArgs = {
  id: Scalars['ID']['input']
  input: UpdateServiceInput
}

export type MutationUpdateVolumeArgs = {
  id: Scalars['ID']['input']
  input: UpdateVolumeInput
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

export type Project = {
  __typename?: 'Project'
  cluster: Cluster
  createdAt: Scalars['DateTime']['output']
  id: Scalars['ID']['output']
  name: Scalars['String']['output']
  services: ServiceConnection
  updatedAt: Scalars['DateTime']['output']
}

export type ProjectServicesArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<ServiceOrder>
  query?: InputMaybe<Scalars['String']['input']>
}

export type ProjectConnection = {
  __typename?: 'ProjectConnection'
  /** A list of edges. */
  edges: Array<ProjectEdge>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output']
}

/** An auto-generated type which holds one Project and a cursor during pagination. */
export type ProjectEdge = {
  __typename?: 'ProjectEdge'
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output']
  /** The item at the end of ProjectEdge. */
  node: Project
}

/** Ordering options for project connections */
export type ProjectOrder = {
  /** The ordering direction. */
  direction: OrderDirection
  /** The field to order projects by. */
  field: ProjectOrderField
}

/** Properties by which project connections can be ordered. */
export enum ProjectOrderField {
  CREATED_AT = 'CREATED_AT',
  ID = 'ID',
}

export type Query = {
  __typename?: 'Query'
  cluster?: Maybe<Cluster>
  clusters: ClusterConnection
  currentUser: User
  currentWorkspace: Workspace
  currentWorkspaceMember: WorkspaceMember
  domain?: Maybe<Domain>
  domains: DomainConnection
  project?: Maybe<Project>
  projects: ProjectConnection
  service?: Maybe<Service>
  volume?: Maybe<Volume>
  workspace?: Maybe<Workspace>
  workspaceMember?: Maybe<WorkspaceMember>
  workspaceMemberByToken?: Maybe<WorkspaceMember>
  workspaceMembers: WorkspaceMemberConnection
  workspaces: WorkspaceConnection
}

export type QueryClusterArgs = {
  id: Scalars['ID']['input']
}

export type QueryClustersArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<ClusterOrder>
  query?: InputMaybe<Scalars['String']['input']>
}

export type QueryDomainArgs = {
  id: Scalars['ID']['input']
}

export type QueryDomainsArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<DomainOrder>
  query?: InputMaybe<Scalars['String']['input']>
  serviceId: Scalars['ID']['input']
}

export type QueryProjectArgs = {
  id: Scalars['ID']['input']
}

export type QueryProjectsArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<ProjectOrder>
  query?: InputMaybe<Scalars['String']['input']>
}

export type QueryServiceArgs = {
  id: Scalars['ID']['input']
}

export type QueryVolumeArgs = {
  id: Scalars['ID']['input']
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

export type Service = {
  __typename?: 'Service'
  createdAt: Scalars['DateTime']['output']
  domains: DomainConnection
  environmentVariables: Array<EnvironmentVariable>
  id: Scalars['ID']['output']
  image: Scalars['String']['output']
  name: Scalars['String']['output']
  ports: Array<Scalars['Int']['output']>
  project: Project
  replicas: Scalars['Int']['output']
  updatedAt: Scalars['DateTime']['output']
}

export type ServiceDomainsArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<DomainOrder>
  query?: InputMaybe<Scalars['String']['input']>
}

export type ServiceConnection = {
  __typename?: 'ServiceConnection'
  /** A list of edges. */
  edges: Array<ServiceEdge>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output']
}

/** An auto-generated type which holds one Service and a cursor during pagination. */
export type ServiceEdge = {
  __typename?: 'ServiceEdge'
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output']
  /** The item at the end of ServiceEdge. */
  node: Service
}

/** Ordering options for service connections */
export type ServiceOrder = {
  /** The ordering direction. */
  direction: OrderDirection
  /** The field to order services by. */
  field: ServiceOrderField
}

/** Properties by which service connections can be ordered. */
export enum ServiceOrderField {
  CREATED_AT = 'CREATED_AT',
  ID = 'ID',
}

export type UpdateClusterInput = {
  certificateAuthorityData?: InputMaybe<Scalars['String']['input']>
  name?: InputMaybe<Scalars['String']['input']>
  server?: InputMaybe<Scalars['String']['input']>
  token?: InputMaybe<Scalars['String']['input']>
}

export type UpdateDomainInput = {
  host?: InputMaybe<Scalars['String']['input']>
  path?: InputMaybe<Scalars['String']['input']>
  servicePort?: InputMaybe<Scalars['Int']['input']>
}

export type UpdateProjectInput = {
  name?: InputMaybe<Scalars['String']['input']>
}

export type UpdateServiceInput = {
  environmentVariables?: InputMaybe<Array<EnvironmentVariableInput>>
  image?: InputMaybe<Scalars['String']['input']>
  name?: InputMaybe<Scalars['String']['input']>
  ports?: InputMaybe<Array<Scalars['Int']['input']>>
  replicas?: InputMaybe<Scalars['Int']['input']>
}

export type UpdateVolumeInput = {
  name?: InputMaybe<Scalars['String']['input']>
  size?: InputMaybe<Scalars['String']['input']>
  storageClass?: InputMaybe<Scalars['String']['input']>
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

export type Volume = {
  __typename?: 'Volume'
  createdAt: Scalars['DateTime']['output']
  id: Scalars['ID']['output']
  name: Scalars['String']['output']
  service: Service
  size: Scalars['String']['output']
  storageClass?: Maybe<Scalars['String']['output']>
  updatedAt: Scalars['DateTime']['output']
}

export type Workspace = {
  __typename?: 'Workspace'
  clusters: ClusterConnection
  createdAt: Scalars['DateTime']['output']
  deletedAt?: Maybe<Scalars['DateTime']['output']>
  features: Array<WorkspaceFeature>
  id: Scalars['ID']['output']
  name: Scalars['String']['output']
  projects: ProjectConnection
  updatedAt: Scalars['DateTime']['output']
}

export type WorkspaceClustersArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<ClusterOrder>
  query?: InputMaybe<Scalars['String']['input']>
}

export type WorkspaceProjectsArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<ProjectOrder>
  query?: InputMaybe<Scalars['String']['input']>
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

export type GetClustersForSelectQueryVariables = Exact<{ [key: string]: never }>

export type GetClustersForSelectQuery = {
  __typename?: 'Query'
  clusters: {
    __typename?: 'ClusterConnection'
    edges: Array<{
      __typename?: 'ClusterEdge'
      node: { __typename?: 'Cluster'; id: string; name: string }
    }>
  }
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

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never }>

export type GetCurrentUserQuery = {
  __typename?: 'Query'
  currentUser: { __typename?: 'User'; id: string; name: string; email: string }
}

export type CurrentUserFragment = {
  __typename?: 'User'
  id: string
  name: string
  email: string
} & { ' $fragmentName'?: 'CurrentUserFragment' }

export type GetCurrentWorkspaceQueryVariables = Exact<{
  id: Scalars['ID']['input']
}>

export type GetCurrentWorkspaceQuery = {
  __typename?: 'Query'
  workspace?: { __typename?: 'Workspace'; id: string; name: string } | null
}

export type CurrentWorkspaceFragment = {
  __typename?: 'Workspace'
  id: string
  name: string
} & { ' $fragmentName'?: 'CurrentWorkspaceFragment' }

export type GetProjectQueryVariables = Exact<{
  id: Scalars['ID']['input']
}>

export type GetProjectQuery = {
  __typename?: 'Query'
  project?: {
    __typename?: 'Project'
    id: string
    name: string
    createdAt: any
  } | null
}

export type ProjectDetailFragment = {
  __typename?: 'Project'
  id: string
  name: string
  createdAt: any
} & { ' $fragmentName'?: 'ProjectDetailFragment' }

export type CreateServiceMutationVariables = Exact<{
  input: CreateServiceInput
}>

export type CreateServiceMutation = {
  __typename?: 'Mutation'
  createService: { __typename?: 'Service'; id: string }
}

export type GetServicesQueryVariables = Exact<{
  projectId: Scalars['ID']['input']
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<ServiceOrder>
  query?: InputMaybe<Scalars['String']['input']>
}>

export type GetServicesQuery = {
  __typename?: 'Query'
  project?: {
    __typename?: 'Project'
    services: {
      __typename?: 'ServiceConnection'
      edges: Array<{
        __typename?: 'ServiceEdge'
        node: {
          __typename?: 'Service'
          id: string
          name: string
          image: string
          replicas: number
          ports: Array<number>
          createdAt: any
        }
      }>
      pageInfo: {
        __typename?: 'PageInfo'
        endCursor?: string | null
        hasNextPage: boolean
        hasPreviousPage: boolean
        startCursor?: string | null
      }
    }
  } | null
}

export type ServiceItemFragment = {
  __typename?: 'Service'
  id: string
  name: string
  image: string
  replicas: number
  ports: Array<number>
  createdAt: any
} & { ' $fragmentName'?: 'ServiceItemFragment' }

export type UpdateProjectMutationVariables = Exact<{
  id: Scalars['ID']['input']
  input: UpdateProjectInput
}>

export type UpdateProjectMutation = {
  __typename?: 'Mutation'
  updateProject: { __typename?: 'Project'; id: string } & {
    ' $fragmentRefs'?: { ProjectDetailFragment: ProjectDetailFragment }
  }
}

export type RemoveProjectMutationVariables = Exact<{
  id: Scalars['ID']['input']
}>

export type RemoveProjectMutation = {
  __typename?: 'Mutation'
  removeProject: { __typename?: 'Project'; id: string }
}

export type GetServiceQueryVariables = Exact<{
  id: Scalars['ID']['input']
}>

export type GetServiceQuery = {
  __typename?: 'Query'
  service?: {
    __typename?: 'Service'
    id: string
    name: string
    image: string
    ports: Array<number>
    replicas: number
    createdAt: any
    environmentVariables: Array<{
      __typename?: 'EnvironmentVariable'
      key: string
      value: string
    }>
  } | null
}

export type ServiceDetailFragment = {
  __typename?: 'Service'
  id: string
  name: string
  image: string
  ports: Array<number>
  replicas: number
  createdAt: any
  environmentVariables: Array<{
    __typename?: 'EnvironmentVariable'
    key: string
    value: string
  }>
} & { ' $fragmentName'?: 'ServiceDetailFragment' }

export type GetDomainsQueryVariables = Exact<{
  serviceId: Scalars['ID']['input']
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<DomainOrder>
}>

export type GetDomainsQuery = {
  __typename?: 'Query'
  domains: {
    __typename?: 'DomainConnection'
    edges: Array<{
      __typename?: 'DomainEdge'
      node: {
        __typename?: 'Domain'
        id: string
        host: string
        path: string
        servicePort: number
        createdAt: any
      }
    }>
    pageInfo: {
      __typename?: 'PageInfo'
      endCursor?: string | null
      hasNextPage: boolean
      hasPreviousPage: boolean
      startCursor?: string | null
    }
  }
}

export type DomainItemFragment = {
  __typename?: 'Domain'
  id: string
  host: string
  path: string
  servicePort: number
  createdAt: any
} & { ' $fragmentName'?: 'DomainItemFragment' }

export type CreateDomainMutationVariables = Exact<{
  input: CreateDomainInput
}>

export type CreateDomainMutation = {
  __typename?: 'Mutation'
  createDomain: { __typename?: 'Domain'; id: string } & {
    ' $fragmentRefs'?: { DomainItemFragment: DomainItemFragment }
  }
}

export type RemoveDomainMutationVariables = Exact<{
  id: Scalars['ID']['input']
}>

export type RemoveDomainMutation = {
  __typename?: 'Mutation'
  removeDomain: { __typename?: 'Domain'; id: string }
}

export type UpdateServiceEnvironmentMutationVariables = Exact<{
  id: Scalars['ID']['input']
  input: UpdateServiceInput
}>

export type UpdateServiceEnvironmentMutation = {
  __typename?: 'Mutation'
  updateService: { __typename?: 'Service'; id: string } & {
    ' $fragmentRefs'?: { ServiceDetailFragment: ServiceDetailFragment }
  }
}

export type UpdateServiceMutationVariables = Exact<{
  id: Scalars['ID']['input']
  input: UpdateServiceInput
}>

export type UpdateServiceMutation = {
  __typename?: 'Mutation'
  updateService: { __typename?: 'Service'; id: string } & {
    ' $fragmentRefs'?: { ServiceDetailFragment: ServiceDetailFragment }
  }
}

export type RemoveServiceMutationVariables = Exact<{
  id: Scalars['ID']['input']
}>

export type RemoveServiceMutation = {
  __typename?: 'Mutation'
  removeService: { __typename?: 'Service'; id: string }
}

export type GetClusterQueryVariables = Exact<{
  id: Scalars['ID']['input']
}>

export type GetClusterQuery = {
  __typename?: 'Query'
  cluster?: {
    __typename?: 'Cluster'
    id: string
    name: string
    server: string
    createdAt: any
  } | null
}

export type ClusterDetailFragment = {
  __typename?: 'Cluster'
  id: string
  name: string
  server: string
  createdAt: any
} & { ' $fragmentName'?: 'ClusterDetailFragment' }

export type UpdateClusterMutationVariables = Exact<{
  id: Scalars['ID']['input']
  input: UpdateClusterInput
}>

export type UpdateClusterMutation = {
  __typename?: 'Mutation'
  updateCluster: { __typename?: 'Cluster'; id: string } & {
    ' $fragmentRefs'?: { ClusterDetailFragment: ClusterDetailFragment }
  }
}

export type RemoveClusterMutationVariables = Exact<{
  id: Scalars['ID']['input']
}>

export type RemoveClusterMutation = {
  __typename?: 'Mutation'
  removeCluster: { __typename?: 'Cluster'; id: string }
}

export type GetClustersQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<ClusterOrder>
  query?: InputMaybe<Scalars['String']['input']>
}>

export type GetClustersQuery = {
  __typename?: 'Query'
  clusters: {
    __typename?: 'ClusterConnection'
    edges: Array<{
      __typename?: 'ClusterEdge'
      node: {
        __typename?: 'Cluster'
        id: string
        name: string
        server: string
        createdAt: any
      }
    }>
    pageInfo: {
      __typename?: 'PageInfo'
      endCursor?: string | null
      hasNextPage: boolean
      hasPreviousPage: boolean
      startCursor?: string | null
    }
  }
}

export type ClusterItemFragment = {
  __typename?: 'Cluster'
  id: string
  name: string
  server: string
  createdAt: any
} & { ' $fragmentName'?: 'ClusterItemFragment' }

export type CreateClusterMutationVariables = Exact<{
  input: CreateClusterInput
}>

export type CreateClusterMutation = {
  __typename?: 'Mutation'
  createCluster: { __typename?: 'Cluster'; id: string }
}

export type GetProjectsQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<ProjectOrder>
  query?: InputMaybe<Scalars['String']['input']>
}>

export type GetProjectsQuery = {
  __typename?: 'Query'
  projects: {
    __typename?: 'ProjectConnection'
    edges: Array<{
      __typename?: 'ProjectEdge'
      node: {
        __typename?: 'Project'
        id: string
        name: string
        createdAt: any
        cluster: { __typename?: 'Cluster'; id: string; name: string }
      }
    }>
    pageInfo: {
      __typename?: 'PageInfo'
      endCursor?: string | null
      hasNextPage: boolean
      hasPreviousPage: boolean
      startCursor?: string | null
    }
  }
}

export type ProjectItemFragment = {
  __typename?: 'Project'
  id: string
  name: string
  createdAt: any
  cluster: { __typename?: 'Cluster'; id: string; name: string }
} & { ' $fragmentName'?: 'ProjectItemFragment' }

export type CreateProjectMutationVariables = Exact<{
  input: CreateProjectInput
}>

export type CreateProjectMutation = {
  __typename?: 'Mutation'
  createProject: { __typename?: 'Project'; id: string }
}

export type CreateWorkspaceMutationVariables = Exact<{
  input: CreateWorkspaceInput
}>

export type CreateWorkspaceMutation = {
  __typename?: 'Mutation'
  createWorkspace: { __typename?: 'Workspace'; id: string }
}

export type GetFirstWorkspaceQueryVariables = Exact<{ [key: string]: never }>

export type GetFirstWorkspaceQuery = {
  __typename?: 'Query'
  workspaces: {
    __typename?: 'WorkspaceConnection'
    edges: Array<{
      __typename?: 'WorkspaceEdge'
      node: { __typename?: 'Workspace'; id: string }
    }>
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
export const CurrentUserFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CurrentUser' },
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
} as unknown as DocumentNode<CurrentUserFragment, unknown>
export const CurrentWorkspaceFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CurrentWorkspace' },
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
} as unknown as DocumentNode<CurrentWorkspaceFragment, unknown>
export const ProjectDetailFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProjectDetail' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Project' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ProjectDetailFragment, unknown>
export const ServiceItemFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ServiceItem' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Service' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'image' } },
          { kind: 'Field', name: { kind: 'Name', value: 'replicas' } },
          { kind: 'Field', name: { kind: 'Name', value: 'ports' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ServiceItemFragment, unknown>
export const ServiceDetailFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ServiceDetail' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Service' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'image' } },
          { kind: 'Field', name: { kind: 'Name', value: 'ports' } },
          { kind: 'Field', name: { kind: 'Name', value: 'replicas' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'environmentVariables' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'key' } },
                { kind: 'Field', name: { kind: 'Name', value: 'value' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ServiceDetailFragment, unknown>
export const DomainItemFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DomainItem' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Domain' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'host' } },
          { kind: 'Field', name: { kind: 'Name', value: 'path' } },
          { kind: 'Field', name: { kind: 'Name', value: 'servicePort' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DomainItemFragment, unknown>
export const ClusterDetailFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ClusterDetail' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Cluster' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'server' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ClusterDetailFragment, unknown>
export const ClusterItemFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ClusterItem' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Cluster' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'server' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ClusterItemFragment, unknown>
export const ProjectItemFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProjectItem' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Project' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'cluster' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ProjectItemFragment, unknown>
export const GetClustersForSelectDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetClustersForSelect' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'clusters' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'first' },
                value: { kind: 'IntValue', value: '20' },
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
                              kind: 'Field',
                              name: { kind: 'Name', value: 'name' },
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
  ],
} as unknown as DocumentNode<
  GetClustersForSelectQuery,
  GetClustersForSelectQueryVariables
>
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
                  name: { kind: 'Name', value: 'CurrentUser' },
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
      name: { kind: 'Name', value: 'CurrentUser' },
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
                  name: { kind: 'Name', value: 'CurrentWorkspace' },
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
      name: { kind: 'Name', value: 'CurrentWorkspace' },
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
export const GetProjectDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetProject' },
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
            name: { kind: 'Name', value: 'project' },
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
                  name: { kind: 'Name', value: 'ProjectDetail' },
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
      name: { kind: 'Name', value: 'ProjectDetail' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Project' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetProjectQuery, GetProjectQueryVariables>
export const CreateServiceDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateService' },
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
              name: { kind: 'Name', value: 'CreateServiceInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createService' },
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
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateServiceMutation,
  CreateServiceMutationVariables
>
export const GetServicesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetServices' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'projectId' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'after' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'before' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'first' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'last' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'orderBy' },
          },
          type: {
            kind: 'NamedType',
            name: { kind: 'Name', value: 'ServiceOrder' },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'query' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'project' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'projectId' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'services' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'after' },
                      value: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'after' },
                      },
                    },
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'before' },
                      value: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'before' },
                      },
                    },
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'first' },
                      value: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'first' },
                      },
                    },
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'last' },
                      value: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'last' },
                      },
                    },
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'orderBy' },
                      value: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'orderBy' },
                      },
                    },
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'query' },
                      value: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'query' },
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
                                    name: {
                                      kind: 'Name',
                                      value: 'ServiceItem',
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
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'pageInfo' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'endCursor' },
                            },
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
      name: { kind: 'Name', value: 'ServiceItem' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Service' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'image' } },
          { kind: 'Field', name: { kind: 'Name', value: 'replicas' } },
          { kind: 'Field', name: { kind: 'Name', value: 'ports' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetServicesQuery, GetServicesQueryVariables>
export const UpdateProjectDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateProject' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
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
              name: { kind: 'Name', value: 'UpdateProjectInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateProject' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
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
                  name: { kind: 'Name', value: 'ProjectDetail' },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProjectDetail' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Project' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateProjectMutation,
  UpdateProjectMutationVariables
>
export const RemoveProjectDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'RemoveProject' },
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
            name: { kind: 'Name', value: 'removeProject' },
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
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  RemoveProjectMutation,
  RemoveProjectMutationVariables
>
export const GetServiceDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetService' },
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
            name: { kind: 'Name', value: 'service' },
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
                  name: { kind: 'Name', value: 'ServiceDetail' },
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
      name: { kind: 'Name', value: 'ServiceDetail' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Service' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'image' } },
          { kind: 'Field', name: { kind: 'Name', value: 'ports' } },
          { kind: 'Field', name: { kind: 'Name', value: 'replicas' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'environmentVariables' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'key' } },
                { kind: 'Field', name: { kind: 'Name', value: 'value' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetServiceQuery, GetServiceQueryVariables>
export const GetDomainsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetDomains' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'serviceId' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'after' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'before' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'first' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'last' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'orderBy' },
          },
          type: {
            kind: 'NamedType',
            name: { kind: 'Name', value: 'DomainOrder' },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'domains' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'serviceId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'serviceId' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'after' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'after' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'before' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'before' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'first' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'first' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'last' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'last' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderBy' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'orderBy' },
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
                              name: { kind: 'Name', value: 'DomainItem' },
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
                  kind: 'Field',
                  name: { kind: 'Name', value: 'pageInfo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'endCursor' },
                      },
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
      name: { kind: 'Name', value: 'DomainItem' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Domain' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'host' } },
          { kind: 'Field', name: { kind: 'Name', value: 'path' } },
          { kind: 'Field', name: { kind: 'Name', value: 'servicePort' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetDomainsQuery, GetDomainsQueryVariables>
export const CreateDomainDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateDomain' },
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
              name: { kind: 'Name', value: 'CreateDomainInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createDomain' },
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
                  name: { kind: 'Name', value: 'DomainItem' },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DomainItem' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Domain' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'host' } },
          { kind: 'Field', name: { kind: 'Name', value: 'path' } },
          { kind: 'Field', name: { kind: 'Name', value: 'servicePort' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateDomainMutation,
  CreateDomainMutationVariables
>
export const RemoveDomainDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'RemoveDomain' },
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
            name: { kind: 'Name', value: 'removeDomain' },
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
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  RemoveDomainMutation,
  RemoveDomainMutationVariables
>
export const UpdateServiceEnvironmentDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateServiceEnvironment' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
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
              name: { kind: 'Name', value: 'UpdateServiceInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateService' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
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
                  name: { kind: 'Name', value: 'ServiceDetail' },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ServiceDetail' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Service' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'image' } },
          { kind: 'Field', name: { kind: 'Name', value: 'ports' } },
          { kind: 'Field', name: { kind: 'Name', value: 'replicas' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'environmentVariables' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'key' } },
                { kind: 'Field', name: { kind: 'Name', value: 'value' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateServiceEnvironmentMutation,
  UpdateServiceEnvironmentMutationVariables
>
export const UpdateServiceDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateService' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
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
              name: { kind: 'Name', value: 'UpdateServiceInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateService' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
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
                  name: { kind: 'Name', value: 'ServiceDetail' },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ServiceDetail' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Service' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'image' } },
          { kind: 'Field', name: { kind: 'Name', value: 'ports' } },
          { kind: 'Field', name: { kind: 'Name', value: 'replicas' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'environmentVariables' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'key' } },
                { kind: 'Field', name: { kind: 'Name', value: 'value' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateServiceMutation,
  UpdateServiceMutationVariables
>
export const RemoveServiceDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'RemoveService' },
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
            name: { kind: 'Name', value: 'removeService' },
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
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  RemoveServiceMutation,
  RemoveServiceMutationVariables
>
export const GetClusterDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetCluster' },
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
            name: { kind: 'Name', value: 'cluster' },
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
                  name: { kind: 'Name', value: 'ClusterDetail' },
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
      name: { kind: 'Name', value: 'ClusterDetail' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Cluster' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'server' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetClusterQuery, GetClusterQueryVariables>
export const UpdateClusterDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateCluster' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
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
              name: { kind: 'Name', value: 'UpdateClusterInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateCluster' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
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
                  name: { kind: 'Name', value: 'ClusterDetail' },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ClusterDetail' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Cluster' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'server' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateClusterMutation,
  UpdateClusterMutationVariables
>
export const RemoveClusterDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'RemoveCluster' },
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
            name: { kind: 'Name', value: 'removeCluster' },
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
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  RemoveClusterMutation,
  RemoveClusterMutationVariables
>
export const GetClustersDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetClusters' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'after' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'before' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'first' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'last' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'orderBy' },
          },
          type: {
            kind: 'NamedType',
            name: { kind: 'Name', value: 'ClusterOrder' },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'query' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'clusters' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'after' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'after' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'before' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'before' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'first' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'first' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'last' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'last' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderBy' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'orderBy' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'query' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'query' },
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
                              name: { kind: 'Name', value: 'ClusterItem' },
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
                  kind: 'Field',
                  name: { kind: 'Name', value: 'pageInfo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'endCursor' },
                      },
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
      name: { kind: 'Name', value: 'ClusterItem' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Cluster' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'server' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetClustersQuery, GetClustersQueryVariables>
export const CreateClusterDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateCluster' },
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
              name: { kind: 'Name', value: 'CreateClusterInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createCluster' },
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
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateClusterMutation,
  CreateClusterMutationVariables
>
export const GetProjectsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetProjects' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'after' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'before' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'first' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'last' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'orderBy' },
          },
          type: {
            kind: 'NamedType',
            name: { kind: 'Name', value: 'ProjectOrder' },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'query' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'projects' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'after' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'after' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'before' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'before' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'first' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'first' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'last' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'last' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderBy' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'orderBy' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'query' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'query' },
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
                              name: { kind: 'Name', value: 'ProjectItem' },
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
                  kind: 'Field',
                  name: { kind: 'Name', value: 'pageInfo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'endCursor' },
                      },
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
      name: { kind: 'Name', value: 'ProjectItem' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Project' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'cluster' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetProjectsQuery, GetProjectsQueryVariables>
export const CreateProjectDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateProject' },
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
              name: { kind: 'Name', value: 'CreateProjectInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createProject' },
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
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateProjectMutation,
  CreateProjectMutationVariables
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
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateWorkspaceMutation,
  CreateWorkspaceMutationVariables
>
export const GetFirstWorkspaceDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetFirstWorkspace' },
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
                value: { kind: 'IntValue', value: '1' },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderBy' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'field' },
                      value: { kind: 'EnumValue', value: 'CREATED_AT' },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'direction' },
                      value: { kind: 'EnumValue', value: 'DESC' },
                    },
                  ],
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
  ],
} as unknown as DocumentNode<
  GetFirstWorkspaceQuery,
  GetFirstWorkspaceQueryVariables
>
