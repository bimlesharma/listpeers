import { Navbar } from '@/components/Navbar';
import { DisclaimerFooter } from '@/components/DisclaimerFooter';

export default function AuthenticatedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
                {children}
            </main>
            <DisclaimerFooter />
        </div>
    );
}
