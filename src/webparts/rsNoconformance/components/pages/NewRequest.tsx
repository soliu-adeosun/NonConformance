import ClientButton from "../../../../Global/ClientButton";
import * as React from "react";
import CustomPeoplePicker from "../../../../Global/CustomPeoplePicker";
import { Link } from "react-router-dom";
require("newrequest");

export default class NewRequest extends React.Component<{}, {}> {
    public render(): React.ReactElement {
        return (
            <section className="bg-white p-4 sm:p-6 border border-gray-200 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-bold text-navy-900 mb-4 sm:mb-6">MANAGEMENT REPRESENTATIVE</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-blue-600 mb-2">Name</label>
                        <input readOnly id="managementRepName" speed-bind="ManagementRepName" type="text" placeholder="Enter text here..." className="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-40  focus:ring-2 focus:ring-primary-500  transition-all text-sm sm:text-base" />
                    </div>
                    {/* Text Input */}
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-blue-600 mb-2">Employee ID</label>
                        <input readOnly speed-bind="ManagementRepID" id="managementRepId" type="text" placeholder="Enter text here..." className="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-400  focus:ring-2 focus:ring-primary-500  transition-all text-sm sm:text-base" />
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

                    {/* Text Input */}
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-blue-600 mb-2">Email</label>
                        <input readOnly id="managementRepMail" type="text" speed-bind="ManagementRepEmail" placeholder="Enter text here..." className="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-400  focus:ring-2 focus:ring-primary-500  transition-all text-sm sm:text-base" />
                    </div>
                    {/* Text Input */}
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-blue-600 mb-2">Division/Unit</label>
                        <input readOnly speed-bind="ManagementRepDivision" id="managementRepDivision" type="text" placeholder="Enter text here..." className="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-400  focus:ring-2 focus:ring-primary-500  transition-all text-sm sm:text-base" />
                    </div>
                    {/* Text Input */}
                </div>


                <h2 style={{ marginTop: "2.2rem" }} className="text-xl sm:text-2xl font-bold text-navy-900 mb-4 sm:mb-6">NON-CONFORMANCE SECTION</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    <div className="mt-2">
                        <div className="flex justify-between items-center">
                            <label className="block text-sm font-medium text-blue-600 mb-2">NC Reference No. <span className="required">*</span></label>
                            <p className="text-sm font-medium text-blue-600">Available NC(s): <span id="availableNCs"></span></p>
                        </div>
                        
                        <select id="ncReferenceID" speed-bind-validate="NCReferenceID" className="w-full px-3 sm:px-4 py-2 sm:py-3  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none bg-no-repeat bg-right pr-8 sm:pr-10 text-sm sm:text-base dropdown-arrow">
                            <option disabled selected value="">Select a Reference ID</option>
                        </select>
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
                        <label className="block text-sm font-medium text-blue-600 mb-2">Objective Evidence</label>
                        <input
                            type="text"
                            placeholder="Enter text here..."
                            className="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-400  focus:ring-2 focus:ring-primary-500  transition-all text-sm sm:text-base"
                            id="objectiveEvidence"
                            speed-bind="ObjectiveEvidence"
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
                        <label className="block text-sm font-medium text-blue-600 mb-2">Non-Conformance Statement <span className="required">*</span></label>
                        <textarea
                            placeholder="Enter text here..."
                            className="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-400  focus:ring-2 focus:ring-primary-500  transition-all text-sm sm:text-base"
                            id="nonConformanceStatement"
                            speed-bind-validate="NonConformanceStatement"
                        />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-blue-600 mb-2">Requirement <span className="required">*</span></label>
                        <textarea
                            placeholder="Enter text here..."
                            className="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-400  focus:ring-2 focus:ring-primary-500  transition-all text-sm sm:text-base"
                            id="requirement"
                            speed-bind-validate="Requirement"
                        />
                    </div>

                </div>

                <div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

                        <div className="mt-5">
                            <label className="block text-sm font-medium text-blue-600 mb-2">Non Conformance Issued To: <span className="required">*</span></label>
                            <CustomPeoplePicker validate-control="true" custom-people="Employee" validation-msg="Please select an employee" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 mt-5">
                        <div className="mt-2">
                            <label className="block text-sm font-medium text-blue-600 mb-2">Employee Name</label>
                            <input readOnly id="employeeName" speed-bind="EmployeeName" type="text" placeholder="Enter text here..." className="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-40  focus:ring-2 focus:ring-primary-500  transition-all text-sm sm:text-base" />
                        </div>
                        <div className="mt-2">
                            <label className="block text-sm font-medium text-blue-600 mb-2">Employee ID</label>
                            <input
                                readOnly
                                type="text"
                                placeholder="Enter text here..."
                                className="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-400  focus:ring-2 focus:ring-primary-500  transition-all text-sm sm:text-base"
                                id="employeeId"
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
                                id="employeeEmail"
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
                                id="employeeDivision"
                                speed-bind="EmployeeDivision"
                            />
                        </div>
                        <div className="mt-2">
                            <label className="block text-sm font-medium text-blue-600 mb-2">Request Date <span className="required">*</span></label>
                            <input
                                type="date"
                                className="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-400  focus:ring-2 focus:ring-primary-500  transition-all text-sm sm:text-base"
                                speed-bind-validate="RequestDate"
                                id="requestDate"
                            />
                        </div>
                        <div className="mt-2">
                            <label className="block text-sm font-medium text-blue-600 mb-2">Expected Date <span className="required">*</span></label>
                            <input
                                type="date"
                                className="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-400  focus:ring-2 focus:ring-primary-500  transition-all text-sm sm:text-base"
                                speed-bind-validate="ExpectedDate"
                                id="expectedDate"
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

                <div className="action-btns flex justify-center items-center gap-3" style={{ marginTop: "2rem" }}>
                    <ClientButton text={"Submit"} func={"NewRequestComponent.confirmSubmit"} clax={"px-4 py-2 bg-slate-500 text-white text-sm font-medium hover:bg-slate-600 transition-colors"} prop="NewRequest" attr="" />
                    {/* <button id="saveButton" className="px-4 py-2 bg-slate-500 text-white text-sm font-medium hover:bg-slate-600 transition-colors">
                            Save
                        </button> */}
                    <Link to="/" className="px-4 py-2 bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors">
                        Cancel
                    </Link>
                </div>
            </section>
        );
    }

    public componentDidMount(): void {
        window.loadNewRequestComponent();
    }
}
