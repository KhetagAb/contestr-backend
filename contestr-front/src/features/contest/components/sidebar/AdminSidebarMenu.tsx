import { ADMIN_TIMETABLE_PATH } from "@/app/AppPath";
import type { AdminSidebarSession } from "./Sidebar";

type Props = {
    session: AdminSidebarSession;
};

export function AdminSidebarMenu({ session }: Props) {
    return (
        <div className="admin-user-popover">
            <p className="admin-user-popover-greeting">
                Вы вошли как{" "}
                <span style={{ color: "var(--accent)", fontWeight: 600 }}>{session.username}</span>
            </p>
            <a href={ADMIN_TIMETABLE_PATH} className="admin-user-popover-link">
                Админ-панель
            </a>
            <button
                type="button"
                className="admin-user-popover-btn"
                onClick={session.onLogout}
            >
                Выйти
            </button>
        </div>
    );
}
