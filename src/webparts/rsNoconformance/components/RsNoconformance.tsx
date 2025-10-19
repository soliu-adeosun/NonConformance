import * as React from "react";
// import styles from './RsNoconformance.module.scss';
import type {IRsNoconformanceProps} from "./IRsNoconformanceProps";
// import { escape } from '@microsoft/sp-lodash-subset';
import {Route, Routes, HashRouter} from "react-router-dom";
import {Layout} from "../../../Global/Layout";
import Dashboard from "./pages/Dashoboard";
import NewRequest from "./pages/NewRequest";
import ApproveRequest from "./pages/ApproveRequest";
import ViewRequest from "./pages/ViewRequest";
import Report from './pages/Report';

require('main');

declare global {
    interface Window {
        globalProp: any;
        loadDashboardComponent: () => void;
        loadNewRequestComponent: () => void;
        loadApproveRequestComponent: () => void;
        loadViewRequestComponent: () => void;
        loadReportComponent : () => void;
    }
}

export default class RsNoconformance extends React.Component<IRsNoconformanceProps> {
    public render(): React.ReactElement<IRsNoconformanceProps> {
        const {} = this.props;

        return (
            <>
                <HashRouter>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Dashboard />} />
                            <Route path="newrequest" element={<NewRequest />} />
                            <Route path="approverequest" element={<ApproveRequest />} />
                            <Route path="viewrequest" element={<ViewRequest />} />
                            <Route path="report" element={<Report />} />
                        </Route>
                    </Routes>
                </HashRouter>
            </>
        );
    }
}
