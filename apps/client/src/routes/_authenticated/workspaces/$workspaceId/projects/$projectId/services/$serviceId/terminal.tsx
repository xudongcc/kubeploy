import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { t } from "i18next";
import { Terminal as TerminalIcon } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { useXTerm } from "react-xtermjs";

import { Page } from "@/components/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceId/projects/$projectId/services/$serviceId/terminal",
)({
  component: RouteComponent,
  beforeLoad: () => {
    return { title: null };
  },
});

function RouteComponent() {
  const { service } = Route.useRouteContext();
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // Use the useXTerm hook
  const { instance, ref } = useXTerm();

  useEffect(() => {
    if (!service || !instance) return;

    instance.options.theme = {
      ...instance.options.theme,
      background: "#000",
      foreground: "#fff",
    };

    // Connect to Socket.IO
    const socket = io("/terminal", {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected");
      setConnected(true);
      setError(null);

      // Start terminal session
      socket.emit("start", { serviceId: service.id });
    });

    socket.on("started", () => {
      console.log("Terminal session started");
    });

    socket.on("data", (data: string) => {
      // Write data to terminal
      instance.write(data);
    });

    socket.on("error", (err: { message: string }) => {
      console.error("Terminal error:", err);
      setError(err.message);
      setConnected(false);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setConnected(false);
    });

    // Handle terminal input
    instance.onData((data) => {
      if (socket.connected) {
        socket.emit("data", { data });
      }
    });

    // Handle terminal resize
    instance.onResize(({ cols, rows }) => {
      if (socket.connected) {
        socket.emit("resize", { cols, rows });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [service, instance]);

  if (!service) {
    return <div>{t("service.notFound")}</div>;
  }

  return (
    <Page
      title={t("service.tabs.terminal")}
      description={t("service.terminal.description")}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <TerminalIcon className="h-4 w-4" />
            {t("service.terminal.title")}
          </CardTitle>
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`}
            />
            <span className="text-muted-foreground text-xs">
              {connected
                ? t("service.terminal.connected")
                : t("service.terminal.disconnected")}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-destructive/10 text-destructive mb-4 rounded-md p-3 text-sm">
              {error}
            </div>
          )}
          <div ref={ref} className="h-full w-full rounded-md bg-black p-2" />
        </CardContent>
      </Card>
    </Page>
  );
}
