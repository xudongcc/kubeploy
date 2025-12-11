import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { t } from "i18next";
import { Terminal } from "lucide-react";
import { fetchEventSource } from "@microsoft/fetch-event-source";

import { Page } from "@/components/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceId/projects/$projectId/services/$serviceId/logs",
)({
  component: RouteComponent,
  beforeLoad: () => {
    return { title: null };
  },
});

interface LogEntry {
  timestamp: Date;
  message: string;
}

function RouteComponent() {
  const { serviceId, workspaceId } = Route.useParams();
  const { service } = Route.useRouteContext();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const timestampRegex =
      /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z)\s+(.*)$/;

    fetchEventSource(`/api/services/${serviceId}/runtime-logs`, {
      signal: abortController.signal,
      headers: {
        "x-workspace-id": workspaceId,
      },
      onopen: async () => {
        setConnected(true);
        setError(null);
      },
      onmessage: (event) => {
        if (event.data) {
          const parsedData = JSON.parse(event.data);
          const logLine = parsedData.log;

          const timestampMatch = timestampRegex.exec(logLine);
          let timestamp: Date;
          let message: string;

          if (timestampMatch) {
            timestamp = new Date(timestampMatch[1]);
            message = timestampMatch[2];
          } else {
            timestamp = new Date();
            message = logLine;
          }

          setLogs((prev) => [...prev, { timestamp, message }]);

          // Auto-scroll to bottom
          setTimeout(() => {
            if (scrollAreaRef.current) {
              const scrollContainer = scrollAreaRef.current.querySelector(
                "[data-radix-scroll-area-viewport]",
              );
              if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
              }
            }
          }, 0);
        }
      },
      onerror: (err) => {
        setConnected(false);
        setError(err.message || "Connection error");
        throw err;
      },
    }).catch(() => {
      // Error already handled in onerror
    });

    return () => {
      abortController.abort();
    };
  }, [serviceId, workspaceId]);

  if (!service) {
    return <div>{t("service.notFound")}</div>;
  }

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString("zh-CN", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <Page
      title={t("service.tabs.logs")}
      description={t("service.logs.description")}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Terminal className="h-4 w-4" />
            {t("service.logs.title")}
          </CardTitle>
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`}
            />
            <span className="text-muted-foreground text-xs">
              {connected
                ? t("service.logs.connected")
                : t("service.logs.disconnected")}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-destructive/10 text-destructive mb-4 rounded-md p-3 text-sm">
              {error || t("service.logs.connectionError")}
            </div>
          )}
          <ScrollArea ref={scrollAreaRef} className="h-[600px] w-full">
            <div className="space-y-1 font-mono text-xs">
              {logs.length === 0 && !error && (
                <div className="text-muted-foreground flex h-[600px] items-center justify-center">
                  {connected
                    ? t("service.logs.waiting")
                    : t("service.logs.connecting")}
                </div>
              )}
              {logs.map((log, index) => (
                <div
                  key={index}
                  className="hover:bg-muted/50 flex gap-3 rounded px-2 py-1"
                >
                  <span className="text-muted-foreground flex-shrink-0">
                    {formatTimestamp(log.timestamp)}
                  </span>
                  <span className="break-all">{log.message}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </Page>
  );
}
