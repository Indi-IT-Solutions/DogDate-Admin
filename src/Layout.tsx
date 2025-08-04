import React, { ReactNode } from "react";
import Sidebar from "./layout/Sidebar";
import Header from "./layout/Header";
import { Breadcrumb } from "react-bootstrap";

interface LayoutProps {
    children: ReactNode;
    title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
    return (
        <>
            <div>
                <Header title={title} />
                <Sidebar />
                <div className="mb-3 maincontent_div">
                    <div className="mainbreadcrumb d-block d-md-none mb-3">
                        <Breadcrumb>
                            <Breadcrumb.Item href="#">Pages</Breadcrumb.Item>
                            <Breadcrumb.Item active>{title}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    {children}
                </div>
            </div>
        </>
    );
};

export default Layout;
