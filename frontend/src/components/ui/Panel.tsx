import type {ReactNode} from 'react';

type PanelProps = {
  children: ReactNode;
};

export const Panel = ({children}: PanelProps) => {
    return (
        <section className="rounded-xl border border-slate-700 bg-slate-900 p-6">
            {children}
        </section>
    )
}