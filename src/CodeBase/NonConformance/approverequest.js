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
            // {
            //     operator: 'Eq',
            //     field: 'Approval_Status',
            //     type: 'Text',
            //     val: globalDefinitions.stageDefinitions.pending
            // }
        ]);
        
        var extraProperties = [
            "ID", "Title", "WorkflowRequestID", "Current_Approver", "Current_Approver_Code", "Approval_Status",
            "Created", "InitiatorEmailAddress", "InitiatorLogin", "Transaction_History", "ReturnForCorrection",
            "Modified", "PendingUserEmail", "PendingUserLogin", "Attachment_Folder", "AttachmentURL", "Author",
            "NCReferenceID", "Title", "ISOClause", "ObjectiveEvidence", "NonConformanceStatement", "TypeOfAudit",
            "Process", "Procedure", "RequestDate", "ExpectedDate", "CorrectiveActionName", "ActualDateOfResponse",
            "RootCause", "Correction", "CorrectiveAction", "HOD", "Employee", "Year", "Requirement", "Comment"
        ];

        ncRoot.getListToControl(globalDefinitions.stageDefinitions.listname, query, extraProperties, function (listProperties) {
            if ($.isEmptyObject(listProperties)) {
                MainApplication.notyf.error("Request is not pending approval...");
                $spcontext.redirect("#/", false);
                globalDefinitions.closeLoader();
                
            }
            else {
                customWorkflowEngine.routeEngine(customWorkflowEngine).updateRoutesinFlow(listProperties, function (resolved) {
                    customWorkflowEngine.routeEngine(customWorkflowEngine).
                    PageSecurity(customWorkflowEngine.stages.securityModeTask, listProperties.Current_Approver, listProperties.Approval_Status,
                        function (error) {

                        // if (MainApplication.configuredTaskMembers[listProperties.Current_Approver].belongs) {
                        if (typeof error === "undefined") {
                            
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

                            if(listProperties.Current_Approver !== "Employee" && listProperties.Current_Approver_Code !== "AA1"){
                                MainApplication.ApproveRequestComponent.otherApproversReadOnlyForm();
                            }

                            AppRequest.requestDetails = listProperties;
                            
                            $spcontext.htmlBind(listProperties);


                            if (AppRequest.requestDetails.Current_Approver !== 'Employee'){
                                $spcontext.attachmentLinkBind(listProperties.AttachmentURL);
                            }
                            
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
                    }); //commented here
                    
                }); //commented here
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

        if (CurrentUserProperties.title === AppRequest.requestDetails.Title) {
            var formData = $spcontext.bind({}, "CorrectionData");
        } else{
            var formData = {};
        }


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
        } else if (actionTaken === "Revise") {
            formData.Current_Approver = globalDefinitions.stageDefinitions.employee;
            formData.Current_Approver_Code = AppRequest.defaultStage;
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
                    <div class="mt-2">
                        <label class="block text-sm font-medium text-blue-600 mb-2">Name</label>
                        <input
                            readOnly
                            speed-bind="CorrectiveActionName"
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
                        <input
                            readOnly
                            speed-bind="Correction"
                            type="text"
                            placeholder="Enter text here..."
                            class="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm sm:text-base"
                        />
                    </div>
                    <div class="mt-2">
                        <label class="block text-sm font-medium text-blue-600 mb-2">Corrective Action</label>
                        <input
                            readOnly
                            speed-bind="CorrectiveAction"
                            type="text"
                            placeholder="Enter text here..."
                            class="w-full px-3 sm:px-4 py-2 sm:py-3  placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm sm:text-base"
                        />
                    </div>
                    <div class="mt-2">
                        <label class="block text-sm font-medium text-blue-600 mb-2">Attach File</label>
                        <div speed-file-bind="SupportingDocuments"></div>
                    </div>
                
    `;

    $(".approversReadOnlyContainer").empty();
    $(".approversReadOnlyContainer").append(otherApproversForm);
    $(".approver-btn").text("Approve");
    $("#rtnBtn").show();
    $("#commentBox").show();
    $("#approvercomment").removeAttr("readonly");

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