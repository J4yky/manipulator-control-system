import type { ReactNode } from "react";

type AppLayoutProps = {
  children: ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
    return (
        <main className="min-h-screen bg-slate-950 p-4 text-slate-100">
            <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-4">
                {children}
            </div>
        </main>
    );
}