import { AppLayout } from '../components/layout/AppLayout';
import { TopBar } from '../components/layout/TopBar';
import { Panel } from '../components/ui/Panel';
import { useLanguage } from '../i18n/LanguageContext';

export function DashboardPage() {
    const { t } = useLanguage();
    return (
        <AppLayout>
            <Panel>
                <TopBar />
            </Panel>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_2fr_1fr]">
                <Panel>
                    <h2>{t("manualControl")}</h2>
                </Panel>
                <Panel>
                    <h2>{t("cameraPreview")}</h2>
                </Panel>
                <Panel>
                    <h2>{t("systemStatus")}</h2>
                </Panel>
            </div>
            <Panel>
                <h2>{t("disconnect")}</h2>
            </Panel>
        </AppLayout>
    );
}