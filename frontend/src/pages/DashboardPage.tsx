import { AppLayout } from '../components/layout/AppLayout';
import { TopBar } from '../components/layout/TopBar';
import { Panel } from '../components/ui/Panel';

export function DashboardPage() {
    return (
        <AppLayout>
            <Panel>
                <TopBar />
            </Panel>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_2fr_1fr]">
                <Panel>
                    <h2>Manual Control</h2>
                </Panel>
                <Panel>
                    <h2>Camera Preview</h2>
                </Panel>
                <Panel>
                    <h2>System Status</h2>
                </Panel>
            </div>
            <Panel>
                <h2>Disconnect</h2>
            </Panel>
        </AppLayout>
    );
}