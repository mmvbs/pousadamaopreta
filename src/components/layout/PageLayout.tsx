import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface PageLayoutProps {
  children: ReactNode;
}

export const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="md:pl-64">
        <div className="p-4 md:p-8 pt-16 md:pt-8">{children}</div>
      </main>
    </div>
  );
};
