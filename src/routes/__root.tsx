import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Header } from "@/components/elite/Header";
import { useAppState } from "@/lib/app-store";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-mono text-7xl font-bold text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Signal lost</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          That diagnostic page isn't on the bus.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-primary to-primary-glow px-4 py-2 text-sm font-medium text-primary-foreground glow-primary transition-transform hover:scale-105"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "EliteScan — GM OBD2 Diagnostic Dashboard" },
      {
        name: "description",
        content:
          "Professional GM-specialized OBD2 diagnostics. Real-time gauges, fault code scanning with simple explanations and fixes for Chevrolet, GMC, Cadillac, and Buick.",
      },
      { name: "author", content: "EliteScan" },
      { property: "og:title", content: "EliteScan — GM OBD2 Diagnostic Dashboard" },
      {
        property: "og:description",
        content:
          "Cyber-automotive dashboard for GM vehicles. Live telemetry and intelligent DTC analysis over Bluetooth ELM327.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { status, demoMode } = useAppState();
  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      <Header status={status} demo={demoMode} />
      <main className="flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>
    </div>
  );
}
