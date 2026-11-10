loadViewRequestComponent = function () {
    if (MainApplication.cachedState.mode) {
		whenViewRequestDependeciesLoaded();
	}else{
        MainApplication.cachedState.pageStateCall = loadViewRequestComponent;
    }
};



var AppRequest;
var customWorkflowEngine;

MainApplication.ViewRequestComponent.ApplicationDetails = function () {
    this.url = window.location.href;
    this.itemId = null;
    this.requestDetails = {};
    this.Attachments = [];
    this.FileUrls = {};
    this.FolderUrl = "";
    this.AttachmentLoader = {};
    this.messageTemplate = {};
    this.feedback = false;
    this.approverComments = "";
    this.transactionHistory = [];
    this.defaultStage = "AA0";
    this.returned = false;
    this.messageType = "standard";
    this.documentsToUpdate = {};
}

whenViewRequestDependeciesLoaded = function () {
    globalDefinitions.callLoader();
    globalDefinitions.extendStages();
    $spcontext.assignAttributes();

    $spcontext.filesDictionary = {};
    
    AppRequest = new MainApplication.ViewRequestComponent.ApplicationDetails();
    globalDefinitions.extendStages();
    customWorkflowEngine = new WorkflowManagerEngine(CurrentUserProperties);
    globalDefinitions.SetWorkflowRouting(customWorkflowEngine);
    AppRequest.itemId = $spcontext.getParameterByName("itemid", window.location.href);

    $spcontext.filesDictionary = {};

    $spcontext.appliedEvents.attachments = [];
    $spcontext.applyAttachmentEvent({
        o365: true,
        appendFiles: true,
        cancelClear: false,
    }, function (elementName, listOfFiles, fileId) {
        $("div[speed-file-bind='" + elementName + "']").empty();

        if (listOfFiles.files.length !== 0) {
            for (var y = 0; y < listOfFiles.files.length; y++) {
                if (typeof listOfFiles.files[y] === "string") {
                    var splitedLinks = listOfFiles.files[y].split("/");
                    var pos = splitedLinks.length - 1;
                    displayName = splitedLinks[pos];
                    var attachmentBlock = "<p id='" + elementName + "display" + y + "' style='color : #002c4d'><a href='" + listOfFiles.files[y] + "'>" + displayName + "<span><a style='color: red; cursor: pointer; padding-left: 5px' class='attachment-inline-delete' onclick='MainApplication.WorkflowsComponent.BPMS.Onboarding.ApproveRequest.deleteRowAttachment(\"" + elementName + "\", " + y + ",\"" + fileId + "\")'>x</a></span></a></p>";
                    $("div[speed-file-bind='" + elementName + "']").append(attachmentBlock);
                } else {
                    var attachmentBlock = "<p id='" + elementName + "display" + y + "' style='color : #002c4d'>" + listOfFiles.files[y].dataName +
                        "<span><a class='attachment-inline-delete' style='color: red; cursor: pointer; padding-left: 5px' onclick='MainApplication.WorkflowsComponent.BPMS.ProcessInitiation.NewRequest.deleteRowAttachment(\"" + elementName + "\", " + y + ",\"" + fileId + "\")'>x</a></span></p>";
                    $("div[speed-file-bind='" + elementName + "']").append(attachmentBlock);
                }
            }
        }
    }, function (errors) {
        globalDefinitions.HandlerError(errors.msg, false);
    });

    $spcontext.applyValidationEvents();
    // MainApplication.ViewRequestComponent.displayManagementDetails();
    MainApplication.ViewRequestComponent.recoverListData();
    setTimeout(function () {
        globalDefinitions.closeLoader();
    }, 2000);
};


MainApplication.ViewRequestComponent.recoverListData = function() {
    
    if (AppRequest.itemId !== null && AppRequest.itemId !== "") {

        var query = ncRoot.camlBuilder([{
            rowlimit: 1
        },

            {
                operator: 'Eq',
                field: 'WorkflowRequestID',
                type: 'Text',
                val: AppRequest.itemId
            }
        ]);
        
        var extraProperties = [
            "ID", "Title", "WorkflowRequestID", "Current_Approver", "Current_Approver_Code", "Approval_Status",
            "Created", "InitiatorEmailAddress", "InitiatorLogin", "Transaction_History", "ReturnForCorrection",
            "Modified", "PendingUserEmail", "PendingUserLogin", "Attachment_Folder", "AttachmentURL", "Author",
            "NCReferenceID", "ISOClause", "ObjectiveEvidence", "NonConformanceStatement", "TypeOfAudit",
            "Process", "Procedure", "RequestDate", "ExpectedDate", "CorrectiveActionName", "ActualDateOfResponse",
            "RootCause", "Correction", "CorrectiveAction", "HOD", "Employee", "Year", "Requirement", "Comment",
            "WhyOne", "WhyTwo", "WhyThree", "WhyFour", "WhyFive"
        ];

        ncRoot.getListToControl(globalDefinitions.stageDefinitions.listname, query, extraProperties, function (listProperties) {
            if ($.isEmptyObject(listProperties)) {
                MainApplication.notyf.error("Request does not exist...");
                $spcontext.redirect("#/", false);
                globalDefinitions.closeLoader();
                
            }
            else {
                customWorkflowEngine.routeEngine(customWorkflowEngine).updateRoutesinFlow(listProperties, function (resolved) {
                    customWorkflowEngine.routeEngine(customWorkflowEngine).
                    PageSecurity(customWorkflowEngine.stages.securityModeView, listProperties.Current_Approver, listProperties.Approval_Status, function (error) {

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

                            AppRequest.requestDetails = listProperties;
                            
                            // const ArrayOfOtherAuditorsEmail = Array.isArray(listProperties.OtherAuditors)
                            // ? [...new Set(listProperties.OtherAuditors.map(auditors => auditors.email))]
                            // : [];

                            // const ArrayOfAuditeesEmail = Array.isArray(listProperties.Auditees)
                            // ? [...new Set(listProperties.Auditees.map(auditees => auditees.email))]
                            // : [];

                            // PeoplePicker.setDefault("OtherAuditors", ArrayOfOtherAuditorsEmail);
                            // PeoplePicker.setDefault("Auditees", ArrayOfAuditeesEmail);
                            // PeoplePicker.initializePeoplePickers(MainApplication.staffList);
                            // PeoplePicker.disablePicker("OtherAuditors");
                            // PeoplePicker.disablePicker("Auditees");

                            // if (MainApplication.configuredTaskMembers[globalDefinitions.stageDefinitions.management].belongs){
                                // MainApplication.ViewRequestComponent.displayNCRiskAssessment(listProperties.QuestionsDetails);
                            // }

                            // if (MainApplication.configuredTaskMembers[globalDefinitions.stageDefinitions.ceo].belongs){
                            //     MainApplication.ViewRequestComponent.displayNCRiskAssessmentReadOnly(listProperties.RiskAssessment);
                            // }

                            
                            $spcontext.htmlBind(listProperties);
                            $spcontext.attachmentLinkBind(listProperties.AttachmentURL);
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