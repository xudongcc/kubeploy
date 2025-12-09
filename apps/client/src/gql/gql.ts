/* eslint-disable */
import * as types from "./graphql";
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

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
  "\n  query GetClustersForSelect($workspaceId: ID!) {\n    workspace(id: $workspaceId) {\n      clusters(first: 20) {\n        edges {\n          node {\n            id\n            name\n          }\n        }\n      }\n    }\n  }\n": typeof types.GetClustersForSelectDocument;
  "\n  query WorkspaceSwitcherWorkspaces {\n    workspaces(first: 10) {\n      edges {\n        node {\n          id\n          ...WorkspaceSwitcherWorkspace @unmask\n        }\n      }\n    }\n  }\n\n  fragment WorkspaceSwitcherWorkspace on Workspace {\n    id\n    name\n  }\n": typeof types.WorkspaceSwitcherWorkspacesDocument;
  "\n  query GetCurrentUser {\n    currentUser {\n      id\n      ...CurrentUser @unmask\n    }\n  }\n\n  fragment CurrentUser on User {\n    id\n    name\n    email\n  }\n": typeof types.GetCurrentUserDocument;
  "\n  query GetCurrentWorkspace($id: ID!) {\n    workspace(id: $id) {\n      id\n      ...CurrentWorkspace @unmask\n    }\n  }\n\n  fragment CurrentWorkspace on Workspace {\n    id\n    name\n  }\n": typeof types.GetCurrentWorkspaceDocument;
  "\n  query GetCluster($id: ID!) {\n    cluster(id: $id) {\n      id\n      ...ClusterDetail @unmask\n    }\n  }\n\n  fragment ClusterDetail on Cluster {\n    id\n    name\n    server\n    createdAt\n    nodes {\n      name\n      ip\n      status\n      allocatableCpuCores\n      allocatableMemoryBytes\n      allocatableDiskBytes\n      capacityCpuCores\n      capacityMemoryBytes\n      capacityDiskBytes\n    }\n  }\n": typeof types.GetClusterDocument;
  "\n  mutation UpdateCluster($id: ID!, $input: UpdateClusterInput!) {\n    updateCluster(id: $id, input: $input) {\n      id\n      ...ClusterDetail\n    }\n  }\n": typeof types.UpdateClusterDocument;
  "\n  mutation DeleteCluster($id: ID!) {\n    deleteCluster(id: $id) {\n      id\n    }\n  }\n": typeof types.DeleteClusterDocument;
  "\n  query GetClusters(\n    $workspaceId: ID!\n    $after: String\n    $before: String\n    $first: Int\n    $last: Int\n    $orderBy: ClusterOrder\n    $query: String\n  ) {\n    workspace(id: $workspaceId) {\n      clusters(\n        after: $after\n        before: $before\n        first: $first\n        last: $last\n        orderBy: $orderBy\n        query: $query\n      ) {\n        edges {\n          node {\n            id\n            ...ClusterItem @unmask\n          }\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n          hasPreviousPage\n          startCursor\n        }\n      }\n    }\n  }\n\n  fragment ClusterItem on Cluster {\n    id\n    name\n    server\n    createdAt\n  }\n": typeof types.GetClustersDocument;
  "\n  mutation CreateCluster($input: CreateClusterInput!) {\n    createCluster(input: $input) {\n      id\n    }\n  }\n": typeof types.CreateClusterDocument;
  "\n  query GetWorkspaceMembers(\n    $after: String\n    $before: String\n    $first: Int\n    $last: Int\n    $orderBy: WorkspaceMemberOrder\n    $query: String\n  ) {\n    workspaceMembers(\n      after: $after\n      before: $before\n      first: $first\n      last: $last\n      orderBy: $orderBy\n      query: $query\n    ) {\n      edges {\n        node {\n          id\n          ...WorkspaceMemberItem @unmask\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n    }\n  }\n\n  fragment WorkspaceMemberItem on WorkspaceMember {\n    id\n    name\n    email\n    role\n    inviteStatus\n    createdAt\n    user {\n      id\n      name\n      email\n    }\n  }\n": typeof types.GetWorkspaceMembersDocument;
  "\n  mutation CreateWorkspaceInvite($input: CreateWorkspaceInviteInput!) {\n    createWorkspaceInvite(input: $input) {\n      id\n    }\n  }\n": typeof types.CreateWorkspaceInviteDocument;
  "\n  mutation UpdateWorkspaceMember(\n    $id: ID!\n    $input: UpdateWorkspaceMemberInput!\n  ) {\n    updateWorkspaceMember(id: $id, input: $input) {\n      id\n      role\n    }\n  }\n": typeof types.UpdateWorkspaceMemberDocument;
  "\n  mutation RemoveWorkspaceMember($id: ID!) {\n    removeWorkspaceMember(id: $id) {\n      id\n    }\n  }\n": typeof types.RemoveWorkspaceMemberDocument;
  "\n  query GetProject($id: ID!) {\n    project(id: $id) {\n      id\n      ...ProjectDetail @unmask\n    }\n  }\n\n  fragment ProjectDetail on Project {\n    id\n    name\n  }\n": typeof types.GetProjectDocument;
  "\n  mutation CreateService($input: CreateServiceInput!) {\n    createService(input: $input) {\n      id\n    }\n  }\n": typeof types.CreateServiceDocument;
  "\n  query GetServices(\n    $projectId: ID!\n    $after: String\n    $before: String\n    $first: Int\n    $last: Int\n    $orderBy: ServiceOrder\n    $query: String\n  ) {\n    project(id: $projectId) {\n      services(\n        after: $after\n        before: $before\n        first: $first\n        last: $last\n        orderBy: $orderBy\n        query: $query\n      ) {\n        edges {\n          node {\n            id\n            ...ServiceItem @unmask\n          }\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n          hasPreviousPage\n          startCursor\n        }\n      }\n    }\n  }\n\n  fragment ServiceItem on Service {\n    id\n    name\n    status\n    createdAt\n  }\n": typeof types.GetServicesDocument;
  "\n  mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {\n    updateProject(id: $id, input: $input) {\n      id\n      ...ProjectDetail\n    }\n  }\n": typeof types.UpdateProjectDocument;
  "\n  mutation DeleteProject($id: ID!) {\n    deleteProject(id: $id) {\n      id\n    }\n  }\n": typeof types.DeleteProjectDocument;
  "\n  query GetService($id: ID!) {\n    service(id: $id) {\n      id\n      ...ServiceDetail @unmask\n    }\n  }\n\n  fragment ServiceDetail on Service {\n    id\n    name\n    image\n    ports\n    replicas\n    environmentVariables {\n      key\n      value\n    }\n    createdAt\n  }\n": typeof types.GetServiceDocument;
  "\n  query GetDomains(\n    $serviceId: ID!\n    $after: String\n    $before: String\n    $first: Int\n    $last: Int\n    $orderBy: DomainOrder\n  ) {\n    service(id: $serviceId) {\n      domains(\n        after: $after\n        before: $before\n        first: $first\n        last: $last\n        orderBy: $orderBy\n      ) {\n        edges {\n          node {\n            id\n            ...DomainItem @unmask\n          }\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n          hasPreviousPage\n          startCursor\n        }\n      }\n    }\n  }\n\n  fragment DomainItem on Domain {\n    id\n    host\n    path\n    servicePort\n    createdAt\n  }\n": typeof types.GetDomainsDocument;
  "\n  mutation CreateDomain($input: CreateDomainInput!) {\n    createDomain(input: $input) {\n      id\n      ...DomainItem\n    }\n  }\n": typeof types.CreateDomainDocument;
  "\n  mutation UpdateDomain($id: ID!, $input: UpdateDomainInput!) {\n    updateDomain(id: $id, input: $input) {\n      id\n      ...DomainItem\n    }\n  }\n": typeof types.UpdateDomainDocument;
  "\n  mutation DeleteDomain($id: ID!) {\n    deleteDomain(id: $id) {\n      id\n    }\n  }\n": typeof types.DeleteDomainDocument;
  "\n  mutation UpdateServiceEnvironment($id: ID!, $input: UpdateServiceInput!) {\n    updateService(id: $id, input: $input) {\n      id\n      ...ServiceDetail\n    }\n  }\n": typeof types.UpdateServiceEnvironmentDocument;
  "\n  mutation DeployService($id: ID!) {\n    deployService(id: $id) {\n      id\n    }\n  }\n": typeof types.DeployServiceDocument;
  "\n  mutation UpdateService($id: ID!, $input: UpdateServiceInput!) {\n    updateService(id: $id, input: $input) {\n      id\n      ...ServiceDetail\n    }\n  }\n": typeof types.UpdateServiceDocument;
  "\n  mutation DeleteService($id: ID!) {\n    deleteService(id: $id) {\n      id\n    }\n  }\n": typeof types.DeleteServiceDocument;
  "\n  query GetVolumes(\n    $serviceId: ID!\n    $after: String\n    $before: String\n    $first: Int\n    $last: Int\n    $orderBy: VolumeOrder\n  ) {\n    service(id: $serviceId) {\n      volumes(\n        after: $after\n        before: $before\n        first: $first\n        last: $last\n        orderBy: $orderBy\n      ) {\n        edges {\n          node {\n            id\n            ...VolumeItem @unmask\n          }\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n          hasPreviousPage\n          startCursor\n        }\n      }\n    }\n  }\n\n  fragment VolumeItem on Volume {\n    id\n    name\n    size\n    mountPath\n    createdAt\n  }\n": typeof types.GetVolumesDocument;
  "\n  mutation CreateVolume($input: CreateVolumeInput!) {\n    createVolume(input: $input) {\n      id\n      ...VolumeItem\n    }\n  }\n": typeof types.CreateVolumeDocument;
  "\n  mutation UpdateVolume($id: ID!, $input: UpdateVolumeInput!) {\n    updateVolume(id: $id, input: $input) {\n      id\n      ...VolumeItem\n    }\n  }\n": typeof types.UpdateVolumeDocument;
  "\n  mutation DeleteVolume($id: ID!) {\n    deleteVolume(id: $id) {\n      id\n    }\n  }\n": typeof types.DeleteVolumeDocument;
  "\n  query GetProjects(\n    $workspaceId: ID!\n    $after: String\n    $before: String\n    $first: Int\n    $last: Int\n    $orderBy: ProjectOrder\n    $query: String\n  ) {\n    workspace(id: $workspaceId) {\n      projects(\n        after: $after\n        before: $before\n        first: $first\n        last: $last\n        orderBy: $orderBy\n        query: $query\n      ) {\n        edges {\n          node {\n            id\n            ...ProjectItem @unmask\n          }\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n          hasPreviousPage\n          startCursor\n        }\n      }\n    }\n  }\n\n  fragment ProjectItem on Project {\n    id\n    name\n    cluster {\n      id\n      name\n    }\n    createdAt\n  }\n": typeof types.GetProjectsDocument;
  "\n  mutation CreateProject($input: CreateProjectInput!) {\n    createProject(input: $input) {\n      id\n    }\n  }\n": typeof types.CreateProjectDocument;
  "\n  mutation UpdateWorkspace($input: UpdateWorkspaceInput!) {\n    updateWorkspace(input: $input) {\n      id\n      name\n    }\n  }\n": typeof types.UpdateWorkspaceDocument;
  "\n  mutation DeleteWorkspace {\n    deleteWorkspace {\n      id\n    }\n  }\n": typeof types.DeleteWorkspaceDocument;
  "\n  mutation CreateWorkspace($input: CreateWorkspaceInput!) {\n    createWorkspace(input: $input) {\n      id\n    }\n  }\n": typeof types.CreateWorkspaceDocument;
  "\n  query GetFirstWorkspace {\n    workspaces(first: 1, orderBy: { field: CREATED_AT, direction: DESC }) {\n      edges {\n        node {\n          id\n        }\n      }\n    }\n  }\n": typeof types.GetFirstWorkspaceDocument;
};
const documents: Documents = {
  "\n  query GetClustersForSelect($workspaceId: ID!) {\n    workspace(id: $workspaceId) {\n      clusters(first: 20) {\n        edges {\n          node {\n            id\n            name\n          }\n        }\n      }\n    }\n  }\n":
    types.GetClustersForSelectDocument,
  "\n  query WorkspaceSwitcherWorkspaces {\n    workspaces(first: 10) {\n      edges {\n        node {\n          id\n          ...WorkspaceSwitcherWorkspace @unmask\n        }\n      }\n    }\n  }\n\n  fragment WorkspaceSwitcherWorkspace on Workspace {\n    id\n    name\n  }\n":
    types.WorkspaceSwitcherWorkspacesDocument,
  "\n  query GetCurrentUser {\n    currentUser {\n      id\n      ...CurrentUser @unmask\n    }\n  }\n\n  fragment CurrentUser on User {\n    id\n    name\n    email\n  }\n":
    types.GetCurrentUserDocument,
  "\n  query GetCurrentWorkspace($id: ID!) {\n    workspace(id: $id) {\n      id\n      ...CurrentWorkspace @unmask\n    }\n  }\n\n  fragment CurrentWorkspace on Workspace {\n    id\n    name\n  }\n":
    types.GetCurrentWorkspaceDocument,
  "\n  query GetCluster($id: ID!) {\n    cluster(id: $id) {\n      id\n      ...ClusterDetail @unmask\n    }\n  }\n\n  fragment ClusterDetail on Cluster {\n    id\n    name\n    server\n    createdAt\n    nodes {\n      name\n      ip\n      status\n      allocatableCpuCores\n      allocatableMemoryBytes\n      allocatableDiskBytes\n      capacityCpuCores\n      capacityMemoryBytes\n      capacityDiskBytes\n    }\n  }\n":
    types.GetClusterDocument,
  "\n  mutation UpdateCluster($id: ID!, $input: UpdateClusterInput!) {\n    updateCluster(id: $id, input: $input) {\n      id\n      ...ClusterDetail\n    }\n  }\n":
    types.UpdateClusterDocument,
  "\n  mutation DeleteCluster($id: ID!) {\n    deleteCluster(id: $id) {\n      id\n    }\n  }\n":
    types.DeleteClusterDocument,
  "\n  query GetClusters(\n    $workspaceId: ID!\n    $after: String\n    $before: String\n    $first: Int\n    $last: Int\n    $orderBy: ClusterOrder\n    $query: String\n  ) {\n    workspace(id: $workspaceId) {\n      clusters(\n        after: $after\n        before: $before\n        first: $first\n        last: $last\n        orderBy: $orderBy\n        query: $query\n      ) {\n        edges {\n          node {\n            id\n            ...ClusterItem @unmask\n          }\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n          hasPreviousPage\n          startCursor\n        }\n      }\n    }\n  }\n\n  fragment ClusterItem on Cluster {\n    id\n    name\n    server\n    createdAt\n  }\n":
    types.GetClustersDocument,
  "\n  mutation CreateCluster($input: CreateClusterInput!) {\n    createCluster(input: $input) {\n      id\n    }\n  }\n":
    types.CreateClusterDocument,
  "\n  query GetWorkspaceMembers(\n    $after: String\n    $before: String\n    $first: Int\n    $last: Int\n    $orderBy: WorkspaceMemberOrder\n    $query: String\n  ) {\n    workspaceMembers(\n      after: $after\n      before: $before\n      first: $first\n      last: $last\n      orderBy: $orderBy\n      query: $query\n    ) {\n      edges {\n        node {\n          id\n          ...WorkspaceMemberItem @unmask\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n    }\n  }\n\n  fragment WorkspaceMemberItem on WorkspaceMember {\n    id\n    name\n    email\n    role\n    inviteStatus\n    createdAt\n    user {\n      id\n      name\n      email\n    }\n  }\n":
    types.GetWorkspaceMembersDocument,
  "\n  mutation CreateWorkspaceInvite($input: CreateWorkspaceInviteInput!) {\n    createWorkspaceInvite(input: $input) {\n      id\n    }\n  }\n":
    types.CreateWorkspaceInviteDocument,
  "\n  mutation UpdateWorkspaceMember(\n    $id: ID!\n    $input: UpdateWorkspaceMemberInput!\n  ) {\n    updateWorkspaceMember(id: $id, input: $input) {\n      id\n      role\n    }\n  }\n":
    types.UpdateWorkspaceMemberDocument,
  "\n  mutation RemoveWorkspaceMember($id: ID!) {\n    removeWorkspaceMember(id: $id) {\n      id\n    }\n  }\n":
    types.RemoveWorkspaceMemberDocument,
  "\n  query GetProject($id: ID!) {\n    project(id: $id) {\n      id\n      ...ProjectDetail @unmask\n    }\n  }\n\n  fragment ProjectDetail on Project {\n    id\n    name\n  }\n":
    types.GetProjectDocument,
  "\n  mutation CreateService($input: CreateServiceInput!) {\n    createService(input: $input) {\n      id\n    }\n  }\n":
    types.CreateServiceDocument,
  "\n  query GetServices(\n    $projectId: ID!\n    $after: String\n    $before: String\n    $first: Int\n    $last: Int\n    $orderBy: ServiceOrder\n    $query: String\n  ) {\n    project(id: $projectId) {\n      services(\n        after: $after\n        before: $before\n        first: $first\n        last: $last\n        orderBy: $orderBy\n        query: $query\n      ) {\n        edges {\n          node {\n            id\n            ...ServiceItem @unmask\n          }\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n          hasPreviousPage\n          startCursor\n        }\n      }\n    }\n  }\n\n  fragment ServiceItem on Service {\n    id\n    name\n    status\n    createdAt\n  }\n":
    types.GetServicesDocument,
  "\n  mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {\n    updateProject(id: $id, input: $input) {\n      id\n      ...ProjectDetail\n    }\n  }\n":
    types.UpdateProjectDocument,
  "\n  mutation DeleteProject($id: ID!) {\n    deleteProject(id: $id) {\n      id\n    }\n  }\n":
    types.DeleteProjectDocument,
  "\n  query GetService($id: ID!) {\n    service(id: $id) {\n      id\n      ...ServiceDetail @unmask\n    }\n  }\n\n  fragment ServiceDetail on Service {\n    id\n    name\n    image\n    ports\n    replicas\n    environmentVariables {\n      key\n      value\n    }\n    createdAt\n  }\n":
    types.GetServiceDocument,
  "\n  query GetDomains(\n    $serviceId: ID!\n    $after: String\n    $before: String\n    $first: Int\n    $last: Int\n    $orderBy: DomainOrder\n  ) {\n    service(id: $serviceId) {\n      domains(\n        after: $after\n        before: $before\n        first: $first\n        last: $last\n        orderBy: $orderBy\n      ) {\n        edges {\n          node {\n            id\n            ...DomainItem @unmask\n          }\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n          hasPreviousPage\n          startCursor\n        }\n      }\n    }\n  }\n\n  fragment DomainItem on Domain {\n    id\n    host\n    path\n    servicePort\n    createdAt\n  }\n":
    types.GetDomainsDocument,
  "\n  mutation CreateDomain($input: CreateDomainInput!) {\n    createDomain(input: $input) {\n      id\n      ...DomainItem\n    }\n  }\n":
    types.CreateDomainDocument,
  "\n  mutation UpdateDomain($id: ID!, $input: UpdateDomainInput!) {\n    updateDomain(id: $id, input: $input) {\n      id\n      ...DomainItem\n    }\n  }\n":
    types.UpdateDomainDocument,
  "\n  mutation DeleteDomain($id: ID!) {\n    deleteDomain(id: $id) {\n      id\n    }\n  }\n":
    types.DeleteDomainDocument,
  "\n  mutation UpdateServiceEnvironment($id: ID!, $input: UpdateServiceInput!) {\n    updateService(id: $id, input: $input) {\n      id\n      ...ServiceDetail\n    }\n  }\n":
    types.UpdateServiceEnvironmentDocument,
  "\n  mutation DeployService($id: ID!) {\n    deployService(id: $id) {\n      id\n    }\n  }\n":
    types.DeployServiceDocument,
  "\n  mutation UpdateService($id: ID!, $input: UpdateServiceInput!) {\n    updateService(id: $id, input: $input) {\n      id\n      ...ServiceDetail\n    }\n  }\n":
    types.UpdateServiceDocument,
  "\n  mutation DeleteService($id: ID!) {\n    deleteService(id: $id) {\n      id\n    }\n  }\n":
    types.DeleteServiceDocument,
  "\n  query GetVolumes(\n    $serviceId: ID!\n    $after: String\n    $before: String\n    $first: Int\n    $last: Int\n    $orderBy: VolumeOrder\n  ) {\n    service(id: $serviceId) {\n      volumes(\n        after: $after\n        before: $before\n        first: $first\n        last: $last\n        orderBy: $orderBy\n      ) {\n        edges {\n          node {\n            id\n            ...VolumeItem @unmask\n          }\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n          hasPreviousPage\n          startCursor\n        }\n      }\n    }\n  }\n\n  fragment VolumeItem on Volume {\n    id\n    name\n    size\n    mountPath\n    createdAt\n  }\n":
    types.GetVolumesDocument,
  "\n  mutation CreateVolume($input: CreateVolumeInput!) {\n    createVolume(input: $input) {\n      id\n      ...VolumeItem\n    }\n  }\n":
    types.CreateVolumeDocument,
  "\n  mutation UpdateVolume($id: ID!, $input: UpdateVolumeInput!) {\n    updateVolume(id: $id, input: $input) {\n      id\n      ...VolumeItem\n    }\n  }\n":
    types.UpdateVolumeDocument,
  "\n  mutation DeleteVolume($id: ID!) {\n    deleteVolume(id: $id) {\n      id\n    }\n  }\n":
    types.DeleteVolumeDocument,
  "\n  query GetProjects(\n    $workspaceId: ID!\n    $after: String\n    $before: String\n    $first: Int\n    $last: Int\n    $orderBy: ProjectOrder\n    $query: String\n  ) {\n    workspace(id: $workspaceId) {\n      projects(\n        after: $after\n        before: $before\n        first: $first\n        last: $last\n        orderBy: $orderBy\n        query: $query\n      ) {\n        edges {\n          node {\n            id\n            ...ProjectItem @unmask\n          }\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n          hasPreviousPage\n          startCursor\n        }\n      }\n    }\n  }\n\n  fragment ProjectItem on Project {\n    id\n    name\n    cluster {\n      id\n      name\n    }\n    createdAt\n  }\n":
    types.GetProjectsDocument,
  "\n  mutation CreateProject($input: CreateProjectInput!) {\n    createProject(input: $input) {\n      id\n    }\n  }\n":
    types.CreateProjectDocument,
  "\n  mutation UpdateWorkspace($input: UpdateWorkspaceInput!) {\n    updateWorkspace(input: $input) {\n      id\n      name\n    }\n  }\n":
    types.UpdateWorkspaceDocument,
  "\n  mutation DeleteWorkspace {\n    deleteWorkspace {\n      id\n    }\n  }\n":
    types.DeleteWorkspaceDocument,
  "\n  mutation CreateWorkspace($input: CreateWorkspaceInput!) {\n    createWorkspace(input: $input) {\n      id\n    }\n  }\n":
    types.CreateWorkspaceDocument,
  "\n  query GetFirstWorkspace {\n    workspaces(first: 1, orderBy: { field: CREATED_AT, direction: DESC }) {\n      edges {\n        node {\n          id\n        }\n      }\n    }\n  }\n":
    types.GetFirstWorkspaceDocument,
};

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
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetClustersForSelect($workspaceId: ID!) {\n    workspace(id: $workspaceId) {\n      clusters(first: 20) {\n        edges {\n          node {\n            id\n            name\n          }\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  query GetClustersForSelect($workspaceId: ID!) {\n    workspace(id: $workspaceId) {\n      clusters(first: 20) {\n        edges {\n          node {\n            id\n            name\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query WorkspaceSwitcherWorkspaces {\n    workspaces(first: 10) {\n      edges {\n        node {\n          id\n          ...WorkspaceSwitcherWorkspace @unmask\n        }\n      }\n    }\n  }\n\n  fragment WorkspaceSwitcherWorkspace on Workspace {\n    id\n    name\n  }\n",
): (typeof documents)["\n  query WorkspaceSwitcherWorkspaces {\n    workspaces(first: 10) {\n      edges {\n        node {\n          id\n          ...WorkspaceSwitcherWorkspace @unmask\n        }\n      }\n    }\n  }\n\n  fragment WorkspaceSwitcherWorkspace on Workspace {\n    id\n    name\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetCurrentUser {\n    currentUser {\n      id\n      ...CurrentUser @unmask\n    }\n  }\n\n  fragment CurrentUser on User {\n    id\n    name\n    email\n  }\n",
): (typeof documents)["\n  query GetCurrentUser {\n    currentUser {\n      id\n      ...CurrentUser @unmask\n    }\n  }\n\n  fragment CurrentUser on User {\n    id\n    name\n    email\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetCurrentWorkspace($id: ID!) {\n    workspace(id: $id) {\n      id\n      ...CurrentWorkspace @unmask\n    }\n  }\n\n  fragment CurrentWorkspace on Workspace {\n    id\n    name\n  }\n",
): (typeof documents)["\n  query GetCurrentWorkspace($id: ID!) {\n    workspace(id: $id) {\n      id\n      ...CurrentWorkspace @unmask\n    }\n  }\n\n  fragment CurrentWorkspace on Workspace {\n    id\n    name\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetCluster($id: ID!) {\n    cluster(id: $id) {\n      id\n      ...ClusterDetail @unmask\n    }\n  }\n\n  fragment ClusterDetail on Cluster {\n    id\n    name\n    server\n    createdAt\n    nodes {\n      name\n      ip\n      status\n      allocatableCpuCores\n      allocatableMemoryBytes\n      allocatableDiskBytes\n      capacityCpuCores\n      capacityMemoryBytes\n      capacityDiskBytes\n    }\n  }\n",
): (typeof documents)["\n  query GetCluster($id: ID!) {\n    cluster(id: $id) {\n      id\n      ...ClusterDetail @unmask\n    }\n  }\n\n  fragment ClusterDetail on Cluster {\n    id\n    name\n    server\n    createdAt\n    nodes {\n      name\n      ip\n      status\n      allocatableCpuCores\n      allocatableMemoryBytes\n      allocatableDiskBytes\n      capacityCpuCores\n      capacityMemoryBytes\n      capacityDiskBytes\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation UpdateCluster($id: ID!, $input: UpdateClusterInput!) {\n    updateCluster(id: $id, input: $input) {\n      id\n      ...ClusterDetail\n    }\n  }\n",
): (typeof documents)["\n  mutation UpdateCluster($id: ID!, $input: UpdateClusterInput!) {\n    updateCluster(id: $id, input: $input) {\n      id\n      ...ClusterDetail\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation DeleteCluster($id: ID!) {\n    deleteCluster(id: $id) {\n      id\n    }\n  }\n",
): (typeof documents)["\n  mutation DeleteCluster($id: ID!) {\n    deleteCluster(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetClusters(\n    $workspaceId: ID!\n    $after: String\n    $before: String\n    $first: Int\n    $last: Int\n    $orderBy: ClusterOrder\n    $query: String\n  ) {\n    workspace(id: $workspaceId) {\n      clusters(\n        after: $after\n        before: $before\n        first: $first\n        last: $last\n        orderBy: $orderBy\n        query: $query\n      ) {\n        edges {\n          node {\n            id\n            ...ClusterItem @unmask\n          }\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n          hasPreviousPage\n          startCursor\n        }\n      }\n    }\n  }\n\n  fragment ClusterItem on Cluster {\n    id\n    name\n    server\n    createdAt\n  }\n",
): (typeof documents)["\n  query GetClusters(\n    $workspaceId: ID!\n    $after: String\n    $before: String\n    $first: Int\n    $last: Int\n    $orderBy: ClusterOrder\n    $query: String\n  ) {\n    workspace(id: $workspaceId) {\n      clusters(\n        after: $after\n        before: $before\n        first: $first\n        last: $last\n        orderBy: $orderBy\n        query: $query\n      ) {\n        edges {\n          node {\n            id\n            ...ClusterItem @unmask\n          }\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n          hasPreviousPage\n          startCursor\n        }\n      }\n    }\n  }\n\n  fragment ClusterItem on Cluster {\n    id\n    name\n    server\n    createdAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation CreateCluster($input: CreateClusterInput!) {\n    createCluster(input: $input) {\n      id\n    }\n  }\n",
): (typeof documents)["\n  mutation CreateCluster($input: CreateClusterInput!) {\n    createCluster(input: $input) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetWorkspaceMembers(\n    $after: String\n    $before: String\n    $first: Int\n    $last: Int\n    $orderBy: WorkspaceMemberOrder\n    $query: String\n  ) {\n    workspaceMembers(\n      after: $after\n      before: $before\n      first: $first\n      last: $last\n      orderBy: $orderBy\n      query: $query\n    ) {\n      edges {\n        node {\n          id\n          ...WorkspaceMemberItem @unmask\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n    }\n  }\n\n  fragment WorkspaceMemberItem on WorkspaceMember {\n    id\n    name\n    email\n    role\n    inviteStatus\n    createdAt\n    user {\n      id\n      name\n      email\n    }\n  }\n",
): (typeof documents)["\n  query GetWorkspaceMembers(\n    $after: String\n    $before: String\n    $first: Int\n    $last: Int\n    $orderBy: WorkspaceMemberOrder\n    $query: String\n  ) {\n    workspaceMembers(\n      after: $after\n      before: $before\n      first: $first\n      last: $last\n      orderBy: $orderBy\n      query: $query\n    ) {\n      edges {\n        node {\n          id\n          ...WorkspaceMemberItem @unmask\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n    }\n  }\n\n  fragment WorkspaceMemberItem on WorkspaceMember {\n    id\n    name\n    email\n    role\n    inviteStatus\n    createdAt\n    user {\n      id\n      name\n      email\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation CreateWorkspaceInvite($input: CreateWorkspaceInviteInput!) {\n    createWorkspaceInvite(input: $input) {\n      id\n    }\n  }\n",
): (typeof documents)["\n  mutation CreateWorkspaceInvite($input: CreateWorkspaceInviteInput!) {\n    createWorkspaceInvite(input: $input) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation UpdateWorkspaceMember(\n    $id: ID!\n    $input: UpdateWorkspaceMemberInput!\n  ) {\n    updateWorkspaceMember(id: $id, input: $input) {\n      id\n      role\n    }\n  }\n",
): (typeof documents)["\n  mutation UpdateWorkspaceMember(\n    $id: ID!\n    $input: UpdateWorkspaceMemberInput!\n  ) {\n    updateWorkspaceMember(id: $id, input: $input) {\n      id\n      role\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation RemoveWorkspaceMember($id: ID!) {\n    removeWorkspaceMember(id: $id) {\n      id\n    }\n  }\n",
): (typeof documents)["\n  mutation RemoveWorkspaceMember($id: ID!) {\n    removeWorkspaceMember(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetProject($id: ID!) {\n    project(id: $id) {\n      id\n      ...ProjectDetail @unmask\n    }\n  }\n\n  fragment ProjectDetail on Project {\n    id\n    name\n  }\n",
): (typeof documents)["\n  query GetProject($id: ID!) {\n    project(id: $id) {\n      id\n      ...ProjectDetail @unmask\n    }\n  }\n\n  fragment ProjectDetail on Project {\n    id\n    name\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation CreateService($input: CreateServiceInput!) {\n    createService(input: $input) {\n      id\n    }\n  }\n",
): (typeof documents)["\n  mutation CreateService($input: CreateServiceInput!) {\n    createService(input: $input) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetServices(\n    $projectId: ID!\n    $after: String\n    $before: String\n    $first: Int\n    $last: Int\n    $orderBy: ServiceOrder\n    $query: String\n  ) {\n    project(id: $projectId) {\n      services(\n        after: $after\n        before: $before\n        first: $first\n        last: $last\n        orderBy: $orderBy\n        query: $query\n      ) {\n        edges {\n          node {\n            id\n            ...ServiceItem @unmask\n          }\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n          hasPreviousPage\n          startCursor\n        }\n      }\n    }\n  }\n\n  fragment ServiceItem on Service {\n    id\n    name\n    status\n    createdAt\n  }\n",
): (typeof documents)["\n  query GetServices(\n    $projectId: ID!\n    $after: String\n    $before: String\n    $first: Int\n    $last: Int\n    $orderBy: ServiceOrder\n    $query: String\n  ) {\n    project(id: $projectId) {\n      services(\n        after: $after\n        before: $before\n        first: $first\n        last: $last\n        orderBy: $orderBy\n        query: $query\n      ) {\n        edges {\n          node {\n            id\n            ...ServiceItem @unmask\n          }\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n          hasPreviousPage\n          startCursor\n        }\n      }\n    }\n  }\n\n  fragment ServiceItem on Service {\n    id\n    name\n    status\n    createdAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {\n    updateProject(id: $id, input: $input) {\n      id\n      ...ProjectDetail\n    }\n  }\n",
): (typeof documents)["\n  mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {\n    updateProject(id: $id, input: $input) {\n      id\n      ...ProjectDetail\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation DeleteProject($id: ID!) {\n    deleteProject(id: $id) {\n      id\n    }\n  }\n",
): (typeof documents)["\n  mutation DeleteProject($id: ID!) {\n    deleteProject(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetService($id: ID!) {\n    service(id: $id) {\n      id\n      ...ServiceDetail @unmask\n    }\n  }\n\n  fragment ServiceDetail on Service {\n    id\n    name\n    image\n    ports\n    replicas\n    environmentVariables {\n      key\n      value\n    }\n    createdAt\n  }\n",
): (typeof documents)["\n  query GetService($id: ID!) {\n    service(id: $id) {\n      id\n      ...ServiceDetail @unmask\n    }\n  }\n\n  fragment ServiceDetail on Service {\n    id\n    name\n    image\n    ports\n    replicas\n    environmentVariables {\n      key\n      value\n    }\n    createdAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetDomains(\n    $serviceId: ID!\n    $after: String\n    $before: String\n    $first: Int\n    $last: Int\n    $orderBy: DomainOrder\n  ) {\n    service(id: $serviceId) {\n      domains(\n        after: $after\n        before: $before\n        first: $first\n        last: $last\n        orderBy: $orderBy\n      ) {\n        edges {\n          node {\n            id\n            ...DomainItem @unmask\n          }\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n          hasPreviousPage\n          startCursor\n        }\n      }\n    }\n  }\n\n  fragment DomainItem on Domain {\n    id\n    host\n    path\n    servicePort\n    createdAt\n  }\n",
): (typeof documents)["\n  query GetDomains(\n    $serviceId: ID!\n    $after: String\n    $before: String\n    $first: Int\n    $last: Int\n    $orderBy: DomainOrder\n  ) {\n    service(id: $serviceId) {\n      domains(\n        after: $after\n        before: $before\n        first: $first\n        last: $last\n        orderBy: $orderBy\n      ) {\n        edges {\n          node {\n            id\n            ...DomainItem @unmask\n          }\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n          hasPreviousPage\n          startCursor\n        }\n      }\n    }\n  }\n\n  fragment DomainItem on Domain {\n    id\n    host\n    path\n    servicePort\n    createdAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation CreateDomain($input: CreateDomainInput!) {\n    createDomain(input: $input) {\n      id\n      ...DomainItem\n    }\n  }\n",
): (typeof documents)["\n  mutation CreateDomain($input: CreateDomainInput!) {\n    createDomain(input: $input) {\n      id\n      ...DomainItem\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation UpdateDomain($id: ID!, $input: UpdateDomainInput!) {\n    updateDomain(id: $id, input: $input) {\n      id\n      ...DomainItem\n    }\n  }\n",
): (typeof documents)["\n  mutation UpdateDomain($id: ID!, $input: UpdateDomainInput!) {\n    updateDomain(id: $id, input: $input) {\n      id\n      ...DomainItem\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation DeleteDomain($id: ID!) {\n    deleteDomain(id: $id) {\n      id\n    }\n  }\n",
): (typeof documents)["\n  mutation DeleteDomain($id: ID!) {\n    deleteDomain(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation UpdateServiceEnvironment($id: ID!, $input: UpdateServiceInput!) {\n    updateService(id: $id, input: $input) {\n      id\n      ...ServiceDetail\n    }\n  }\n",
): (typeof documents)["\n  mutation UpdateServiceEnvironment($id: ID!, $input: UpdateServiceInput!) {\n    updateService(id: $id, input: $input) {\n      id\n      ...ServiceDetail\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation DeployService($id: ID!) {\n    deployService(id: $id) {\n      id\n    }\n  }\n",
): (typeof documents)["\n  mutation DeployService($id: ID!) {\n    deployService(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation UpdateService($id: ID!, $input: UpdateServiceInput!) {\n    updateService(id: $id, input: $input) {\n      id\n      ...ServiceDetail\n    }\n  }\n",
): (typeof documents)["\n  mutation UpdateService($id: ID!, $input: UpdateServiceInput!) {\n    updateService(id: $id, input: $input) {\n      id\n      ...ServiceDetail\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation DeleteService($id: ID!) {\n    deleteService(id: $id) {\n      id\n    }\n  }\n",
): (typeof documents)["\n  mutation DeleteService($id: ID!) {\n    deleteService(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetVolumes(\n    $serviceId: ID!\n    $after: String\n    $before: String\n    $first: Int\n    $last: Int\n    $orderBy: VolumeOrder\n  ) {\n    service(id: $serviceId) {\n      volumes(\n        after: $after\n        before: $before\n        first: $first\n        last: $last\n        orderBy: $orderBy\n      ) {\n        edges {\n          node {\n            id\n            ...VolumeItem @unmask\n          }\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n          hasPreviousPage\n          startCursor\n        }\n      }\n    }\n  }\n\n  fragment VolumeItem on Volume {\n    id\n    name\n    size\n    mountPath\n    createdAt\n  }\n",
): (typeof documents)["\n  query GetVolumes(\n    $serviceId: ID!\n    $after: String\n    $before: String\n    $first: Int\n    $last: Int\n    $orderBy: VolumeOrder\n  ) {\n    service(id: $serviceId) {\n      volumes(\n        after: $after\n        before: $before\n        first: $first\n        last: $last\n        orderBy: $orderBy\n      ) {\n        edges {\n          node {\n            id\n            ...VolumeItem @unmask\n          }\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n          hasPreviousPage\n          startCursor\n        }\n      }\n    }\n  }\n\n  fragment VolumeItem on Volume {\n    id\n    name\n    size\n    mountPath\n    createdAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation CreateVolume($input: CreateVolumeInput!) {\n    createVolume(input: $input) {\n      id\n      ...VolumeItem\n    }\n  }\n",
): (typeof documents)["\n  mutation CreateVolume($input: CreateVolumeInput!) {\n    createVolume(input: $input) {\n      id\n      ...VolumeItem\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation UpdateVolume($id: ID!, $input: UpdateVolumeInput!) {\n    updateVolume(id: $id, input: $input) {\n      id\n      ...VolumeItem\n    }\n  }\n",
): (typeof documents)["\n  mutation UpdateVolume($id: ID!, $input: UpdateVolumeInput!) {\n    updateVolume(id: $id, input: $input) {\n      id\n      ...VolumeItem\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation DeleteVolume($id: ID!) {\n    deleteVolume(id: $id) {\n      id\n    }\n  }\n",
): (typeof documents)["\n  mutation DeleteVolume($id: ID!) {\n    deleteVolume(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetProjects(\n    $workspaceId: ID!\n    $after: String\n    $before: String\n    $first: Int\n    $last: Int\n    $orderBy: ProjectOrder\n    $query: String\n  ) {\n    workspace(id: $workspaceId) {\n      projects(\n        after: $after\n        before: $before\n        first: $first\n        last: $last\n        orderBy: $orderBy\n        query: $query\n      ) {\n        edges {\n          node {\n            id\n            ...ProjectItem @unmask\n          }\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n          hasPreviousPage\n          startCursor\n        }\n      }\n    }\n  }\n\n  fragment ProjectItem on Project {\n    id\n    name\n    cluster {\n      id\n      name\n    }\n    createdAt\n  }\n",
): (typeof documents)["\n  query GetProjects(\n    $workspaceId: ID!\n    $after: String\n    $before: String\n    $first: Int\n    $last: Int\n    $orderBy: ProjectOrder\n    $query: String\n  ) {\n    workspace(id: $workspaceId) {\n      projects(\n        after: $after\n        before: $before\n        first: $first\n        last: $last\n        orderBy: $orderBy\n        query: $query\n      ) {\n        edges {\n          node {\n            id\n            ...ProjectItem @unmask\n          }\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n          hasPreviousPage\n          startCursor\n        }\n      }\n    }\n  }\n\n  fragment ProjectItem on Project {\n    id\n    name\n    cluster {\n      id\n      name\n    }\n    createdAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation CreateProject($input: CreateProjectInput!) {\n    createProject(input: $input) {\n      id\n    }\n  }\n",
): (typeof documents)["\n  mutation CreateProject($input: CreateProjectInput!) {\n    createProject(input: $input) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation UpdateWorkspace($input: UpdateWorkspaceInput!) {\n    updateWorkspace(input: $input) {\n      id\n      name\n    }\n  }\n",
): (typeof documents)["\n  mutation UpdateWorkspace($input: UpdateWorkspaceInput!) {\n    updateWorkspace(input: $input) {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation DeleteWorkspace {\n    deleteWorkspace {\n      id\n    }\n  }\n",
): (typeof documents)["\n  mutation DeleteWorkspace {\n    deleteWorkspace {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation CreateWorkspace($input: CreateWorkspaceInput!) {\n    createWorkspace(input: $input) {\n      id\n    }\n  }\n",
): (typeof documents)["\n  mutation CreateWorkspace($input: CreateWorkspaceInput!) {\n    createWorkspace(input: $input) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetFirstWorkspace {\n    workspaces(first: 1, orderBy: { field: CREATED_AT, direction: DESC }) {\n      edges {\n        node {\n          id\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  query GetFirstWorkspace {\n    workspaces(first: 1, orderBy: { field: CREATED_AT, direction: DESC }) {\n      edges {\n        node {\n          id\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
