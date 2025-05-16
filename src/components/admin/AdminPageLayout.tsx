import { ReactNode } from "react";

interface AdminPageLayoutProps {
    title: string;
    action?: ReactNode;
    children: ReactNode;
}

const AdminPageLayout = ({ title, action, children }: AdminPageLayoutProps) => {
    return (
        <section className="w-full rounded-2xl bg-white p-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-semibold">{title}</h2>
                {action}
            </div>
            <div className="mt-5">{children}</div>
        </section>
    );
};

export default AdminPageLayout;