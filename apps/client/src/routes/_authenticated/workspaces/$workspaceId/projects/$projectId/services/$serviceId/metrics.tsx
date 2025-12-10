import { useQuery } from "@apollo/client/react";
import { createFileRoute } from "@tanstack/react-router";
import { t } from "i18next";
import { Cpu, MemoryStick } from "lucide-react";

import { Page } from "@/components/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { graphql } from "@/gql";

const SERVICE_METRICS_QUERY = graphql(`
  query ServiceMetrics($id: ID!) {
    service(id: $id) {
      id
      metrics {
        usedCpu
        usedMemory
        limitCpu
        limitMemory
      }
    }
  }
`);

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceId/projects/$projectId/services/$serviceId/metrics",
)({
  component: RouteComponent,
  beforeLoad: () => {
    return { title: null };
  },
});

function RouteComponent() {
  const { serviceId } = Route.useParams();
  const { service } = Route.useRouteContext();

  const { data } = useQuery(SERVICE_METRICS_QUERY, {
    variables: { id: serviceId },
    pollInterval: 10000, // Poll every 10 seconds
  });

  const metrics = data?.service?.metrics;

  const formatCpu = (millicores: number) => {
    const cores = millicores / 1000;
    if (Number.isInteger(cores)) return cores.toString();
    const rounded = Math.round(cores * 100) / 100;
    return Number.isInteger(rounded) ? rounded.toString() : rounded.toString();
  };

  const formatMemory = (mb: number) => {
    if (mb >= 1024) return `${(mb / 1024).toFixed(2)} GB`;
    return `${mb.toFixed(2)} MB`;
  };

  if (!service) {
    return <div>{t("service.notFound")}</div>;
  }

  const usedCpu = metrics?.usedCpu || 0;
  const limitCpu = metrics?.limitCpu || 0;
  const usedMemory = metrics?.usedMemory || 0;
  const limitMemory = metrics?.limitMemory || 0;

  return (
    <Page
      title={t("service.tabs.metrics")}
      description={t("service.metrics.description")}
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("service.metrics.cpu.title")}
            </CardTitle>
            <Cpu className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-xl font-bold">
              {formatCpu(usedCpu)}
              {limitCpu > 0 && ` / ${formatCpu(limitCpu)}`}
            </div>
            {limitCpu > 0 ? (
              <Progress value={(usedCpu / limitCpu) * 100} />
            ) : (
              <p className="text-muted-foreground text-xs">
                {t("service.metrics.noLimit")}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("service.metrics.memory.title")}
            </CardTitle>
            <MemoryStick className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-xl font-bold">
              {formatMemory(usedMemory)}
              {limitMemory > 0 && ` / ${formatMemory(limitMemory)}`}
            </div>
            {limitMemory > 0 ? (
              <Progress value={(usedMemory / limitMemory) * 100} />
            ) : (
              <p className="text-muted-foreground text-xs">
                {t("service.metrics.noLimit")}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </Page>
  );
}
