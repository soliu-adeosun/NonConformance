import { Link } from "react-router-dom";
import ClientButton from "../../../../Global/ClientButton";
import * as React from "react";
require("approverequest");

export default class ApproveRequest extends React.Component<{}, {}> {
    public render(): React.ReactElement {
        return (
            <section className="bg-white p-4 sm:p-6 border border-gray-200 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-bold text-navy-900 mb-4 sm:mb-6">Management Rep Section</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-blue-600 mb-2">NC Reference No.</label>
                        <input type="text" readOnly speed-bind="NCReferenceID" className="w-full px-3 sm:px-4 py-2 sm:py-3  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none bg-no-repeat bg-right pr-8 sm:pr-10 text-sm sm:text-base" />
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-blue-600 mb-2">Name</label>
                        <input readOnly speed-bind="ManagementRepName" type="text" placeholder="Enter text here..." className="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-40  focus:ring-2 focus:ring-primary-500  transition-all text-sm sm:text-base" />
                    </div>
                    {/* Text Input */}
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-blue-600 mb-2">Employee ID</label>
                        <input readOnly speed-bind="ManagementRepID" type="text" placeholder="Enter text here..." className="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-400  focus:ring-2 focus:ring-primary-500  transition-all text-sm sm:text-base" />
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

                    {/* Text Input */}
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-blue-600 mb-2">Email</label>
                        <input readOnly type="text" speed-bind="ManagementRepEmail" placeholder="Enter text here..." className="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-400  focus:ring-2 focus:ring-primary-500  transition-all text-sm sm:text-base" />
                    </div>
                    {/* Text Input */}
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-blue-600 mb-2">Division/Unit</label>
                        <input readOnly speed-bind="ManagementRepDivision" type="text" placeholder="Enter text here..." className="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-400  focus:ring-2 focus:ring-primary-500  transition-all text-sm sm:text-base" />
                    </div>
                    {/* Text Input */}
                </div>


                {/* <div style={{marginTop: "2.2rem"}}>
                    <div>
                        <label className="block text-sm font-medium text-blue-600 mb-2">Comments</label>
                        <textarea readOnly
                            speed-bind="Comments"
                            placeholder="Enter text here..."
                            className="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-400  focus:ring-2 focus:ring-primary-500  transition-all text-sm sm:text-base"
                            defaultValue={""}
                        />
                    </div>
                </div> */}
                <div>
                    <h2 style={{ marginTop: "2.2rem" }} className="text-xl sm:text-2xl font-bold text-navy-900 mb-4 sm:mb-6">Non Conformance Issued To:</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
                        <div className="mt-2">
                            <label className="block text-sm font-medium text-blue-600 mb-2">Employee Name</label>
                            <input readOnly speed-bind="EmployeeName" type="text" placeholder="Enter text here..." className="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-40  focus:ring-2 focus:ring-primary-500  transition-all text-sm sm:text-base" />
                        </div>
                        <div className="mt-2">
                            <label className="block text-sm font-medium text-blue-600 mb-2">Employee ID</label>
                            <input
                                readOnly
                                type="text"
                                placeholder="Enter text here..."
                                className="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-400  focus:ring-2 focus:ring-primary-500  transition-all text-sm sm:text-base"
                                speed-bind="EmployeeID"
                            />
                        </div>
                        <div className="mt-2">
                            <label className="block text-sm font-medium text-blue-600 mb-2">Email</label>
                            <input
                                readOnly
                                type="text"
                                placeholder="Enter text here..."
                                className="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-400  focus:ring-2 focus:ring-primary-500  transition-all text-sm sm:text-base"
                                speed-bind="EmployeeEmail"
                            />
                        </div>
                        <div className="mt-2">
                            <label className="block text-sm font-medium text-blue-600 mb-2">Division/Unit</label>
                            <input
                                readOnly
                                type="text"
                                placeholder="Enter text here..."
                                className="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-400  focus:ring-2 focus:ring-primary-500  transition-all text-sm sm:text-base"
                                speed-bind="EmployeeDivision"
                            />
                        </div>
                        <div className="mt-2">
                            <label className="block text-sm font-medium text-blue-600 mb-2">Request Date</label>
                            <input
                                readOnly
                                type="text"
                                className="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-400  focus:ring-2 focus:ring-primary-500  transition-all text-sm sm:text-base"
                                speed-bind="RequestDate"
                            />
                        </div>
                        <div className="mt-2">
                            <label className="block text-sm font-medium text-blue-600 mb-2">Expected Date</label>
                            <input
                                readOnly
                                type="text"
                                className="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-400  focus:ring-2 focus:ring-primary-500  transition-all text-sm sm:text-base"
                                speed-bind="ExpectedDate"
                            />
                        </div>

                        {/* <div className="mt-2">
                            <label className="block text-sm font-medium text-blue-600 mb-2">ISO Requirement</label>
                            <input
                                type="text"
                                placeholder="Enter text here..."
                                className="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-400  focus:ring-2 focus:ring-primary-500  transition-all text-sm sm:text-base"
                            />
                        </div> */}
                    </div>
                </div>

                <h2 style={{ marginTop: "2.2rem" }} className="text-xl sm:text-2xl font-bold text-navy-900 mb-4 sm:mb-6">NonConformance Section</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-blue-600 mb-2">NC Reference No.</label>
                        <input type="text" readOnly speed-bind="NCReferenceID" placeholder="Enter text here..." className="w-full px-3 sm:px-4 py-2 sm:py-3  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none bg-no-repeat bg-right pr-8 sm:pr-10 text-sm sm:text-base" />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-blue-600 mb-2">ISO Clause</label>
                        <input
                            readOnly
                            type="text"
                            placeholder="Enter text here..."
                            className="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-400  focus:ring-2 focus:ring-primary-500  transition-all text-sm sm:text-base"
                            id="isoClause"
                            speed-bind="ISOClause"
                        />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-blue-600 mb-2">Type of Audit</label>
                        <input
                            readOnly
                            type="text"
                            placeholder="Enter text here..."
                            className="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-400  focus:ring-2 focus:ring-primary-500  transition-all text-sm sm:text-base"
                            id="typeOfAudit"
                            speed-bind="TypeOfAudit"
                        />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-blue-600 mb-2">Process</label>
                        <input
                            readOnly
                            type="text"
                            placeholder="Enter text here..."
                            className="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-400  focus:ring-2 focus:ring-primary-500  transition-all text-sm sm:text-base"
                            id="process"
                            speed-bind="Process"
                        />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-blue-600 mb-2">Procedure</label>
                        <input
                            readOnly
                            type="text"
                            placeholder="Enter text here..."
                            className="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-400  focus:ring-2 focus:ring-primary-500  transition-all text-sm sm:text-base"
                            id="procedure"
                            speed-bind="Procedure"
                        />
                    </div>

                    <div className="mt-2">
                        <label className="block text-sm font-medium text-blue-600 mb-2">Objective Evidence</label>
                        <input
                            readOnly
                            type="text"
                            placeholder="Enter text here..."
                            className="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-400  focus:ring-2 focus:ring-primary-500  transition-all text-sm sm:text-base"
                            id="objectiveEvidence"
                            speed-bind="ObjectiveEvidence"
                        />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-blue-600 mb-2">Non-Conformance Statement</label>
                        <textarea
                            readOnly
                            placeholder="Enter text here..."
                            className="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-400  focus:ring-2 focus:ring-primary-500  transition-all text-sm sm:text-base"
                            id="nonConformanceStatement"
                            speed-bind="NonConformanceStatement"
                        />
                    </div>
                </div>

                {/* Readoly Section Ends Here */}

                <h2 style={{ marginTop: "2.2rem" }} className="text-xl sm:text-2xl font-bold text-navy-900 mb-4 sm:mb-6">Correction and Corrective Action Section</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 approversReadOnlyContainer">
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-blue-600 mb-2">Name</label>
                        <input
                            readOnly
                            speed-bind="Title"
                            type="text"
                            placeholder="Enter text here..."
                            className="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm sm:text-base"
                        />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-blue-600 mb-2">Actual Date of Response</label>
                        <input
                            readOnly
                            id="actualDateOfResponse"
                            speed-bind-class="CorrectionData"
                            type="text"
                            placeholder="Enter text here..."
                            className="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm sm:text-base"
                        />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-blue-600 mb-2">Root Cause of Non-Conformance<span className="required">*</span></label>
                        <textarea
                            speed-bind-class="CorrectionData"
                            speed-bind-validate="RootCause"
                            placeholder="Enter text here..."
                            className="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm sm:text-base"
                        ></textarea>
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-blue-600 mb-2">Correction<span className="required">*</span></label>
                        <input
                            speed-bind-class="CorrectionData"
                            speed-bind-validate="Correction"
                            type="text"
                            placeholder="Enter text here..."
                            className="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm sm:text-base"
                        />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-blue-600 mb-2">Corrective Action<span className="required">*</span></label>
                        <input
                            speed-bind-class="CorrectionData"
                            speed-bind-validate="CorrectiveAction"
                            type="text"
                            placeholder="Enter text here..."
                            className="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm sm:text-base"
                        />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-blue-600 mb-2">Attach File<span className="required">*</span></label>
                        <input
                            speed-file-bind="SupportingDocuments"
                            type="file"
                            className="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm sm:text-base"
                        />
                        <div speed-file-bind="SupportingDocuments"></div>
                    </div>
                </div>

                <div style={{ marginTop: '2.2rem' }}>
                        <div>
                            <label className="block text-sm font-medium text-blue-600 mb-2">Comment</label>
                            <textarea id="approvercomment"
                            readOnly
                            speed-bind-validate="Comment"
                            speed-include-control="false"
                            speed-as-static="true"
                            speed-validate-type="Comments"
                            speed-event-switch="false"
                            speed-validate-msg="Please tell us why you want to decline the NC!"
                            placeholder="Enter text here..." className="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm sm:text-base" defaultValue={""} />
                        </div>
                    </div>

                <div className="action-btns flex justify-center items-center gap-3" style={{ marginTop: "2rem" }}>
                    <ClientButton
                        text={"Submit"}
                        func={"MainApplication.ApproveRequestComponent.confirmSubmit"}
                        clax={"px-4 py-2 bg-slate-700 text-white text-sm font-medium hover:bg-slate-800 transition-colors approver-btn"}
                        prop="Approved"
                        attr=""
                    />

                    <ClientButton text={"Decline"} func={"MainApplication.ApproveRequestComponent.confirmSubmit"} clax={"px-4 py-2 bg-slate-500 text-white text-sm font-medium hover:bg-slate-600 transition-colors hidden"} prop="Revise" attr="id='rtnBtn'" />
                    {/* <button id="saveButton" className="px-4 py-2 bg-slate-500 text-white text-sm font-medium hover:bg-slate-600 transition-colors">
                            Save
                        </button> */}
                    <Link to="/" className="px-4 py-2 bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors">
                        Cancel
                    </Link>
                </div>

                <div className="row mt-3">
                    <h3>Audit Trail</h3>
                    <table className="w-full table-mobile">
                        <thead className="border-b border-gray-200">
                            <tr>
                                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider" scope="col">Name</th>
                                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider" scope="col">Stage</th>
                                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider" scope="col">Action</th>
                                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider" scope="col">Comment</th>
                                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider" scope="col">Action Time</th>
                            </tr>
                        </thead>
                        <tbody id="logs">

                        </tbody>
                    </table>
                </div>

            </section>
        );
    }

    public componentDidMount(): void {
        window.loadApproveRequestComponent();
    }
}
