loadApproveRequestComponent = function () {
    if (MainApplication.cachedState.mode) {
		whenApproveRequestDependeciesLoaded();
	}else{
        MainApplication.cachedState.pageStateCall = loadApproveRequestComponent;
    }
};

var AppRequest;
var customWorkflowEngine;

MainApplication.ApproveRequestComponent.ApplicationDetails = function () {
    this.url = window.location.href;
    this.itemId = null;
    this.requestDetails = {};
    this.Attachments = [];
    this.FileUrls = {};
    this.FolderUrl = "";
    this.AttachmentLoader = {};
    this.messageTemplate = {};
    this.feedback = false;
    this.approverComment = "";
    this.transactionHistory = [];
    this.defaultStage = "AA1";
    this.returned = false;
    this.messageType = "standard";
    this.documentsToUpdate = {};
    this.isNonConformance = null;
    this.mode = null;
}


whenApproveRequestDependeciesLoaded = function () {
    globalDefinitions.callLoader();
    // globalDefinitions.extendStages();
    $spcontext.assignAttributes();

    $spcontext.filesDictionary = {};
    
    AppRequest = new MainApplication.ApproveRequestComponent.ApplicationDetails();
    globalDefinitions.extendStages();
    customWorkflowEngine = new WorkflowManagerEngine(CurrentUserProperties);
    globalDefinitions.SetWorkflowRouting(customWorkflowEngine);
    AppRequest.itemId = $spcontext.getParameterByName("itemid", window.location.href);
    AppRequest.mode = $spcontext.getParameterByName("mode", window.location.href);

    $spcontext.filesDictionary = {};

    $spcontext.validationProperties.text.extend["Comment"] = function (field) {
        var passed = false;
        if ((field.trim() !== "" && (AppRequest.actionTaken === globalDefinitions.stageDefinitions.decline ||
            AppRequest.actionTaken === globalDefinitions.stageDefinitions.correction || AppRequest.actionTaken === "Revise")) ||
            AppRequest.actionTaken === globalDefinitions.stageDefinitions.approve) passed = true;
        return passed;
    }

    $spcontext.appliedEvents.attachments = [];
    $spcontext.applyAttachmentEvent(
		{
			o365: true,
			appendFiles: true,
			cancelClear: false,
            dynamicNaming: false,
            fileNameasName: true,
		},
		function (elementName, listOfFiles, fileId) {
			$("div[speed-file-bind='" + elementName + "']").empty();

			if (listOfFiles.files.length !== 0) {
				for (var y = 0; y < listOfFiles.files.length; y++) {
					if (typeof listOfFiles.files[y] === "string") {
						var splitedLinks = listOfFiles.files[y].split("/");
						var pos = splitedLinks.length - 1;
						displayName = splitedLinks[pos];
						var attachmentBlock =
							"<p id='" +
							elementName +
							"display" +
							y +
							"' style='color : #002c4d'><a href='" +
							listOfFiles.files[y] +
							"'>" +
							displayName +
							"<span><a style='color: red; cursor: pointer; padding-left: 5px' class='attachment-inline-delete' onclick='MainApplication.ApproveRequestComponent.deleteRowAttachment(\"" +
							elementName +
							'", ' +
							y +
							',"' +
							fileId +
							"\")'>x</a></span></a></p>";
						$("div[speed-file-bind='" + elementName + "']").append(attachmentBlock);
					} else {
						var attachmentBlock =
							"<p id='" +
							elementName +
							"display" +
							y +
							"' style='color : #002c4d'>" +
							listOfFiles.files[y].dataName +
							"<span><a class='attachment-inline-delete' style='color: red; cursor: pointer; padding-left: 5px' onclick='MainApplication.ApproveRequestComponent.deleteRowAttachment(\"" +
							elementName +
							'", ' +
							y +
							',"' +
							fileId +
							"\")'>x</a></span></p>";
						$("div[speed-file-bind='" + elementName + "']").append(attachmentBlock);
					}
				}
			}
		},
		function (errors) {
			globalDefinitions.HandlerError(errors.msg, false);
		}
	);

    $("#commentBox").hide();
    if (AppRequest.mode === "edit" && AppRequest.mode !== null){
        $("#commentBox").show();
    }
    $spcontext.applyValidationEvents();
    MainApplication.ApproveRequestComponent.recoverListData();
    setTimeout(function () {
        globalDefinitions.closeLoader();
    }, 2000);
};


MainApplication.ApproveRequestComponent.recoverListData = function() {
    
    if (AppRequest.itemId !== null && AppRequest.itemId !== "") {

        var query = ncRoot.camlBuilder([{
            rowlimit: 1
        },

            {
                operator: 'Eq',
                field: 'WorkflowRequestID',
                type: 'Text',
                val: AppRequest.itemId
            },
            {
                operator: 'Eq',
                field: 'Approval_Status',
                type: 'Text',
                val: globalDefinitions.stageDefinitions.pending
            }
        ]);
        
        var extraProperties = [
            "ID", "Title", "WorkflowRequestID", "Current_Approver", "Current_Approver_Code", "Approval_Status",
            "Created", "InitiatorEmailAddress", "InitiatorLogin", "Transaction_History", "ReturnForCorrection",
            "Modified", "PendingUserEmail", "PendingUserLogin", "Attachment_Folder", "AttachmentURL", "Author",
            "NCReferenceID", "ISOClause", "ObjectiveEvidence", "NonConformanceStatement", "TypeOfAudit",
            "Process", "Procedure", "RequestDate", "ExpectedDate", "CorrectiveActionName", "ActualDateOfResponse",
            "RootCause", "Correction", "CorrectiveAction", "HOD", "Employee", "Year", "Requirement", "Comment", "EmployeeEmail", "HODEmail",
            "WhyOne", "WhyTwo", "WhyThree", "WhyFour", "WhyFive"
        ];

        ncRoot.getListToControl(globalDefinitions.stageDefinitions.listname, query, extraProperties, function (listProperties) {
            if ($.isEmptyObject(listProperties)) {
                MainApplication.notyf.error("Request is not pending approval...");
                $spcontext.redirect("#/", false);
                globalDefinitions.closeLoader();
                
            }
            else {
                // customWorkflowEngine.routeEngine(customWorkflowEngine).updateRoutesinFlow(listProperties, function (resolved) {
                //     customWorkflowEngine.routeEngine(customWorkflowEngine).
                //     PageSecurity(customWorkflowEngine.stages.securityModeTask, listProperties.Current_Approver, listProperties.Approval_Status,
                //         function (error) {
                        if (listProperties.Current_Approver === "Management Rep" || listProperties.Current_Approver === "CEO" || listProperties.Current_Approver === "Employee" || listProperties.Current_Approver === "HOD") {
                        // if (typeof error === "undefined") {
                            
                            listProperties.Created = $spcontext.stringnifyDate({
                                value: listProperties.Created
                            });

                            listProperties.RequestDate = $spcontext.stringnifyDate({
                                value: listProperties.RequestDate,
                                includeTime: false,
                                format : "dd/mm/yy"
                            });

                            listProperties.ExpectedDate = $spcontext.stringnifyDate({
                                value: listProperties.ExpectedDate,
                                includeTime: false,
                                format : "dd/mm/yy"
                            });

                            listProperties.ActualDateOfResponse = $spcontext.stringnifyDate({
                                value: listProperties.ActualDateOfResponse,
                                includeTime: false,
                                format : "dd/mm/yy"
                            });

                            listProperties.Transaction_History = $spcontext.JSONToObject(listProperties.Transaction_History);
                            listProperties.AttachmentURL = $spcontext.JSONToObject(listProperties.AttachmentURL, 'object');

                            AppRequest.FolderUrl = listProperties.Attachment_Folder;
                            AppRequest.FileUrls = $spcontext.deferenceObject(listProperties.AttachmentURL);

                            for(var file in AppRequest.FileUrls) {
                                $spcontext.filesDictionary[file] = { files : AppRequest.FileUrls[file]};
                            }

                            // AppRequest.FileUrls = $spcontext.deferenceObject(listProperties.AttachmentURL);

                            if (listProperties.Transaction_History.length !== 0) {
                                $("#transaction-history").show();
                                globalDefinitions.displayHistory(listProperties.Transaction_History);
                            }

                            // AA1 = first Employee stage (Five Whys + CorrectionData, Attachment HIDDEN)
                            // AA3 = second Employee stage (Attachment ACTIVE)
                            // All other stages use read-only form
                            if (listProperties.Current_Approver !== "Employee" && listProperties.Current_Approver_Code !== "AA1" && listProperties.Current_Approver_Code !== "AA3") {
                                MainApplication.ApproveRequestComponent.otherApproversReadOnlyForm();
                                
                                listProperties.Comment = "";
                            }

                            AppRequest.requestDetails = listProperties;
                            
                            $spcontext.htmlBind(listProperties);


                            // if (AppRequest.requestDetails.Current_Approver !== 'Employee'){
                            $spcontext.attachmentLinkBind(listProperties.AttachmentURL);
                            // }

                            // Hide Attachment field at AA1 (first employee pass); show from AA3 onwards
                            MainApplication.ApproveRequestComponent.toggleAttachmentField(listProperties.Current_Approver_Code);
                            
                            MainApplication.ApproveRequestComponent.dateHandler(listProperties.ActualDateOfResponse);
                            globalDefinitions.closeLoader();
                            
                        } else {
                            globalDefinitions.HandlerError("You are not allowed to access this request");
                            globalDefinitions.AuditLogManager_SaveLog({
                                Action: `Unauthorized action on Audit Management ${listProperties.WorkflowRequestID}`,
                                Message: "User is not allowed to act on this request"
                            });
                            setTimeout(function () {
                                globalDefinitions.closeLoader();
                            }, 1000);
                            $spcontext.redirect("#/", false);
                        }
                    // }); //commented here
                    
                // }); //commented here
            }
        });
    } else {
        globalDefinitions.closeLoader();
        MainApplication.notyf.error("Invalid Request...");
        $spcontext.redirect("#/", false);
    }
}

MainApplication.ApproveRequestComponent.confirmSubmit = function (actionTaken) {
    $("#confirmModal").modal("show");
    AppRequest.actionTaken = actionTaken;
    MainApplication.confirmAction = MainApplication.ApproveRequestComponent.actionConfirmed;
}

MainApplication.ApproveRequestComponent.actionConfirmed = function () {
    $("#confirmModal").modal("hide");
    MainApplication.ApproveRequestComponent.saveDataToList(AppRequest.actionTaken);
}

MainApplication.ApproveRequestComponent.saveDataToList = function (actionTaken) {
    globalDefinitions.onActionClicked();
    
    
    var tempData = $spcontext.bind({});

    

    if ($spcontext.checkPassedValidation()) {

        // if (CurrentUserProperties.email === AppRequest.requestDetails.EmployeeEmail) {
        //     var formData = $spcontext.bind({}, "CorrectionData");
        // } else{
        //     var formData = {};
        // }

        var formData = $spcontext.bind({}, "CorrectionData");

        AppRequest.comment = $("#approvercomment").val();
        formData.Comment = AppRequest.comment;

        var historyProp = {
            stage: AppRequest.requestDetails.Current_Approver,
            comment: AppRequest.comment,
            action: actionTaken
        };

        formData = customWorkflowEngine.routeEngine(customWorkflowEngine).requestHistoryHandler(formData, AppRequest.requestDetails.Transaction_History, historyProp);
        
        if (actionTaken === "Approved" || actionTaken === "Declined") {
            
            formData = customWorkflowEngine.routeEngine(customWorkflowEngine).runRouting(formData, AppRequest.requestDetails.Current_Approver_Code, actionTaken);
            // After AA3 (second Employee stage), next is HOD - set pending user to HOD
            if (AppRequest.requestDetails.Current_Approver_Code === "AA3") {
                formData.PendingUserLogin = AppRequest.requestDetails.HODEmail;
                formData.PendingUserEmail = AppRequest.requestDetails.HODEmail;
            }
            // After AA1 (first Employee stage), next is Management (group) - engine handles it
            // After AA2 Management approves, next is Employee AA3 - set pending user back to Employee
            if (AppRequest.requestDetails.Current_Approver_Code === "AA2") {
                formData.PendingUserLogin = AppRequest.requestDetails.EmployeeEmail;
                formData.PendingUserEmail = AppRequest.requestDetails.EmployeeEmail;
            }
        } else if (actionTaken === "Revise") {
            // Revise always returns to Employee to correct inputs.
            // If still in first cycle (AA2), go back to AA1; otherwise go back to AA3 (attachment stage).
            formData.Current_Approver = globalDefinitions.stageDefinitions.employee;
            var currentCode = AppRequest.requestDetails.Current_Approver_Code;
            if (currentCode === "AA2" || currentCode === "AA1") {
                formData.Current_Approver_Code = "AA1";
            } else {
                formData.Current_Approver_Code = "AA3";
            }
            formData.PendingUserLogin = AppRequest.requestDetails.EmployeeEmail;
            formData.PendingUserEmail = AppRequest.requestDetails.EmployeeEmail;
            // formData.Approval_Status = "Revise";
            formData.ReturnForCorrection = "Yes";
        }
        
        globalDefinitions.onActionCompleted();
        MainApplication.ApproveRequestComponent.proceedToList(formData);
    }
    else {
        globalDefinitions.HandlerError("", true);
        globalDefinitions.onActionFailed();
    }
}

MainApplication.ApproveRequestComponent.proceedToList = function(formData) {
    globalDefinitions.callLoader();
    var Attachments = $spcontext.grabAllAttachments();
    var DocumentLibrary = "NCDocuments";
    var FolderName = AppRequest.requestDetails.Title.replace(/\s+/g, '') + AppRequest.requestDetails.NCReferenceID;
    AppRequest.FileUrls = $spcontext.grabAllAttachmentsLinks();

    globalDefinitions.uploadAttachment(
        ncRoot,
        Attachments,
        FolderName,
        DocumentLibrary,
        function () {
            formData.ID = AppRequest.requestDetails.ID;
            formData.AttachmentURL = JSON.stringify(AppRequest.FileUrls);
            ncRoot.updateItems([formData], globalDefinitions.stageDefinitions.listname, function () {
                // AppRequest.requestDetails.Current_Approver = formData.Current_Approver;
                globalDefinitions.closeLoader();
                globalDefinitions.HandlerSuccess(`You have successfully taken action on this request`);
                globalDefinitions.AuditLogManager_SaveLog({
                    Action: `took action on NC request ${AppRequest.requestDetails.WorkflowRequestID}`
                });
                $spcontext.redirect("#/", false);
            });
    });
}

MainApplication.ApproveRequestComponent.deleteRowAttachment = function (elementBindProperty, index, elementId) {
	var customId = "#" + elementBindProperty + "display" + index;
	var property = document.getElementById(elementId).getAttribute("speed-file-validate");
	property = typeof property === "undefined" || property === null ? document.getElementById(elementId).getAttribute("speed-file-bind") : property;
	$spcontext.clearFileInput(elementId);
	$(customId).remove();
	//delete $spcontext.filesDictionary[property];
	$spcontext.filesDictionary[property].files.splice(index, 1);
	//redraw attachments
	$("div[speed-file-bind='" + elementBindProperty + "']").empty();

	if ($spcontext.filesDictionary[property].files.length !== 0) {
		for (var y = 0; y < $spcontext.filesDictionary[property].files.length; y++) {
			if (typeof $spcontext.filesDictionary[property].files[y] === "string") {
				var splitedLinks = $spcontext.filesDictionary[property].files[y].split("/");
				var pos = splitedLinks.length - 1;
				displayName = splitedLinks[pos];
				var attachmentBlock =
					"<p id='" +
					elementBindProperty +
					"display" +
					y +
					"' style='color : #002c4d'><a href='" +
					$spcontext.filesDictionary[property].files[y] +
					"'>" +
					displayName +
					"<span><a style='color: red; cursor: pointer; padding-left: 5px' class='attachment-inline-delete' onclick='MainApplication.WorkflowsComponent.HRMS.Timesheet.NewRequest.deleteRowAttachment(\"" +
					elementBindProperty +
					'", ' +
					y +
					',"' +
					elementId +
					"\")'>x</a></span></a></p>";
				$("div[speed-file-bind='" + elementBindProperty + "']").append(attachmentBlock);
			} else {
				var attachmentBlock =
					"<p id='" +
					elementBindProperty +
					"display" +
					y +
					"' style='color : #002c4d'>" +
					$spcontext.filesDictionary[property].files[y].dataName +
					"<span><a class='attachment-inline-delete' style='color: red; cursor: pointer; padding-left: 5px' onclick='MainApplication.WorkflowsComponent.HRMS.Timesheet.NewRequest.deleteRowAttachment(\"" +
					elementBindProperty +
					'", ' +
					y +
					',"' +
					elementId +
					"\")'>x</a></span></p>";
				$("div[speed-file-bind='" + elementBindProperty + "']").append(attachmentBlock);
			}
		}
	}
};

MainApplication.ApproveRequestComponent.otherApproversReadOnlyForm = function () {
    var otherApproversForm = `
                    <h2 style="margin-top: 2.2rem" class="text-xl sm:text-2xl font-bold text-navy-900 mb-4 sm:mb-6">5 Whys</h2>
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                        <div class="mt-2">
                            <label class="block text-sm font-medium text-blue-600 mb-2">Why 1</label>
                            <textarea
                                readOnly
                                speed-bind="WhyOne"
                                placeholder="Enter Why 1..."
                                class="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm sm:text-base"
                            ></textarea>
                        </div>
                        <div class="mt-2">
                            <label class="block text-sm font-medium text-blue-600 mb-2">Why 2</label>
                            <textarea
                                readOnly
                                speed-bind="WhyTwo"
                                placeholder="Enter Why 2..."
                                class="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm sm:text-base"
                            ></textarea>
                        </div>
                        <div class="mt-2">
                            <label class="block text-sm font-medium text-blue-600 mb-2">Why 3</label>
                            <textarea
                                readOnly
                                speed-bind="WhyThree"
                                placeholder="Enter Why 3..."
                                class="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm sm:text-base"
                            ></textarea>
                        </div>
                        <div class="mt-2">
                            <label class="block text-sm font-medium text-blue-600 mb-2">Why 4</label>
                            <textarea
                                readOnly
                                speed-bind="WhyFour"
                                placeholder="Enter Why 4..."
                                class="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm sm:text-base"
                            ></textarea>
                        </div>
                        <div class="mt-2">
                            <label class="block text-sm font-medium text-blue-600 mb-2">Why 5</label>
                            <textarea
                                readOnly
                                speed-bind="WhyFive"
                                placeholder="Enter Why 5..."
                                class="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm sm:text-base"
                            ></textarea>
                        </div>
                    </div>

                    <h2 style="margin-top: 2.2rem" class="text-xl sm:text-2xl font-bold text-navy-900 mb-4 sm:mb-6">Root Cause and Corrective Action</h2>
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                        <div class="mt-2">
                            <label class="block text-sm font-medium text-blue-600 mb-2">Name</label>
                            <input
                                readOnly
                                speed-bind="Title"
                                type="text"
                                placeholder="Enter text here..."
                                class="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm sm:text-base"
                            />
                        </div>
                        <div class="mt-2">
                            <label class="block text-sm font-medium text-blue-600 mb-2">Actual Date of Response</label>
                            <input
                                readOnly
                                speed-bind="ActualDateOfResponse"
                                type="text"
                                placeholder="Enter text here..."
                                class="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm sm:text-base"
                            />
                        </div>
                        <div class="mt-2">
                            <label class="block text-sm font-medium text-blue-600 mb-2">Root Cause of Non-Conformance</label>
                            <textarea
                                readOnly
                                speed-bind="RootCause"
                                placeholder="Enter text here..."
                                class="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm sm:text-base"
                            ></textarea>
                        </div>
                        <div class="mt-2">
                            <label class="block text-sm font-medium text-blue-600 mb-2">Correction</label>
                            <textarea
                                readOnly
                                speed-bind="Correction"
                                placeholder="Enter text here..."
                                class="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm sm:text-base"
                            ></textarea>
                        </div>
                        <div class="mt-2">
                            <label class="block text-sm font-medium text-blue-600 mb-2">Corrective Action</label>
                            <textarea
                                readOnly
                                speed-bind="CorrectiveAction"
                                placeholder="Enter text here..."
                                class="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm sm:text-base"
                            ></textarea>
                        </div>
                        <div class="mt-2" id="attachmentFieldContainerReadonly">
                            <label class="block text-sm font-medium text-blue-600 mb-2">Attach File</label>
                            <div speed-file-bind="SupportingDocuments"></div>
                        </div>
                    </div>
                
    `;

    $("#approversReadOnlyContainer").empty();
    $("#approversReadOnlyContainer").append(otherApproversForm);
    $(".approver-btn").text("Approve");
    $(".decline-btn").removeClass("hidden");
    $("#commentBox").show();
    $("#approvercomment").removeAttr("readonly");

}

MainApplication.ApproveRequestComponent.toggleAttachmentField = function (approverCode) {
    var $attachmentContainer = $("#attachmentFieldContainer");
    if (!$attachmentContainer.length) {
        return;
    }
    // Hide attachment only on first Employee stage (AA1)
    if (approverCode === "AA1") {
        $attachmentContainer.hide();
        // Remove required validation on attachment while hidden
        $attachmentContainer.find("input[speed-file-validate]").removeAttr("speed-file-validate");
    } else {
        $attachmentContainer.show();
        // Ensure validation attribute is present when shown (AA3 and beyond for employee)
        var $fileInput = $attachmentContainer.find("input[type='file']");
        if ($fileInput.length && !$fileInput.attr("speed-file-validate")) {
            $fileInput.attr("speed-file-validate", "SupportingDocuments");
        }
    }
}

MainApplication.ApproveRequestComponent.dateHandler = function (actualdate) {

    if (actualdate === "" || actualdate === null){
        const today = $spcontext.serverDate();
        
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const todayStr = `${yyyy}-${mm}-${dd}`;

        // Set Request Date default to today
        $('#actualDateOfResponse').val(todayStr);
        $('#actualDateOfResponse').attr('speed-bind', "ActualDateOfResponse");
    } else {
        $('#actualDateOfResponse').val(actualdate);
        // $('#actualDateOfResponse').attr('speed-bind', "ActualDateOfResponse");
    }
}