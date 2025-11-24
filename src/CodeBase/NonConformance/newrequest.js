loadNewRequestComponent = function () {
    if (MainApplication.cachedState.mode) {
        whenNewRequestDependeciesLoaded();
    } else {
        setTimeout(function () {
            MainApplication.cachedState.pageStateCall = loadNewRequestComponent;
        }, 1000);

    }
};

var AppRequest;
var customWorkflowEngine;

MainApplication.NewRequestComponent.ApplicationDetails = function () {
    this.url = window.location.href;
    this.itemId = null;
    this.mode = null;
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
    this.returned = null;
    this.sectionArr = [];
    this.sections = {};
    this.finalrating = [];
    this.questionSetCounter = 0;
    this.groupProperties = {};
    this.hodName = "";
    this.hodEmail = "";
    this.ncData = [];
}


function whenNewRequestDependeciesLoaded() {
    MainApplication.getNCOnQueue();
    globalDefinitions.callLoader();
    $spcontext.assignAttributes();
    MainApplication.CurrentPageSubmitFunction = MainApplication.NewRequestComponent.confirmSubmit;
    AppRequest = new MainApplication.NewRequestComponent.ApplicationDetails();
    globalDefinitions.extendStages();

    customWorkflowEngine = new WorkflowManagerEngine(CurrentUserProperties);
    globalDefinitions.SetWorkflowRouting(customWorkflowEngine);
    customWorkflowEngine.routeEngine(customWorkflowEngine).setCurrentUserAsInitiator();

    $spcontext.applyValidationEvents();

    $("#managementRepName").val(MainApplication.staffDetails[CurrentUserProperties.email].Title);
    $("#managementRepId").val(MainApplication.staffDetails[CurrentUserProperties.email].EmployeeId);
    $("#managementRepDivision").val(MainApplication.staffDetails[CurrentUserProperties.email].Department);
    $("#managementRepMail").val(MainApplication.staffDetails[CurrentUserProperties.email].Email);

    PeoplePicker.defaultValues = {};
    PeoplePicker.initializePeoplePickers(MainApplication.staffList);

    for (var i = 0; i < MainApplication.auditType.length; i++) {
        $("#typeOfConformance").append(`<option>${MainApplication.auditType[i]}</option>`);
    }

    MainApplication.getNCOnQueue()
    .then(function () {
        // Assign data and populate the dropdown
        AppRequest.ncData = MainApplication.AuditList;
        $("#availableNCs").text(AppRequest.ncData.length);

        if (AppRequest.ncData && AppRequest.ncData.length > 0) {
            let options = "";
            for (var i = 0; i < AppRequest.ncData.length; i++) {
                const item = AppRequest.ncData[i];
                options += `<option value="${item.NCReferenceID}">${item.NCReferenceID}</option>`;
            }
            $("#ncReferenceID").append(options);
        } else {
            console.warn("No data available in AppRequest.ncData");
        }
    })
    .catch(function (error) {
        console.error("Error fetching NC data:", error);
    });

    $("#ncReferenceID").on("change", function (e) {
        const reference = $(this).val();
        console.log(reference);
        const item = AppRequest.ncData.find(item => item.NCReferenceID === reference);
        if (item) {
            $("#isoClause").val(item.ISOClause);
            $("#nonConformanceStatement").val(item.NonConformanceStatement);
            $("#objectiveEvidence").val(item.ObjectiveEvidence);
            $("#typeOfAudit").val(item.TypeOfAudit);
            $("#process").val(item.Process);
            $("#procedure").val(item.Procedure);
        }

    });

    $("#employee").on("select2:select", function (e) {
        const person = e.params.data;
        const $option = $(person.element);
        const personData = MainApplication.NewRequestComponent.findPersonData($option.val());

        $("#employeeName").val(personData.Title);
        $("#employeeId").val(personData.EmployeeId);
        $("#employeeEmail").val(personData.Email);
        $("#employeeDivision").val(personData.Department);
        AppRequest.hodName = personData.Hod;
        AppRequest.hodEmail = personData.HodEmail;

        if (!AppRequest.hodName || !AppRequest.hodEmail) {
            globalDefinitions.HandlerError("This employee has no HOD");
            $(this).val(null).trigger("change.select2");
            $("#employeeName, #employeeId, #employeeEmail").val("");
        }
    });

    $("#employee").on("select2:unselect", function (e) {
        $("#employeeName, #employeeId, #employeeEmail, #employeeDivision").val("");
    });



    MainApplication.NewRequestComponent.dateHandler();
    $("#requestDate").on("change", function() {
        const dateValue = this.value;

        if (!dateValue) return;

        const selectedDate = new Date(dateValue + 'T00:00:00');
        const tomorrow = new Date(selectedDate);
        tomorrow.setDate(selectedDate.getDate() + 1);

        const minDate = tomorrow.toISOString().slice(0, 10);

        $("#expectedDate").attr("min", minDate);
    });

    if (!MainApplication.isUserAnActor){
        globalDefinitions.HandlerError("You are not authorized to access this page...");
        $spcontext.redirect("#/", false);
        globalDefinitions.closeLoader();
    }
    setTimeout(function () {
        globalDefinitions.closeLoader();
    }, 1000);
}

// Helper function to find person data in MainApplication.staffList
MainApplication.NewRequestComponent.findPersonData = function (email) {
    const person = MainApplication.staffList.find(p => p.Email === email) || {};
    return {
        Email: email,
        Title: person.Title || '',
        ID: person.ID || '',
        EmployeeId: person.EmployeeId || '',
        Department: person.Department || '',
        Designation: person.Designation || '',
        Supervisor: person.Supervisor || '',
        PersonalNumber: person.PersonalNumber || '',
        DateOfEmployment: person.DateOfEmployment || '',
        JobRole: person.JobRole || '',
        Hod: person.Hod || '',
        HodEmail: person.HodEmail || ''
    };
};

// Form submission processes
MainApplication.NewRequestComponent.confirmSubmit = function (action) {
    MainApplication.confirmAction = MainApplication.NewRequestComponent.actionConfirmed;
    $("#confirmModal").modal("show");
}

MainApplication.NewRequestComponent.actionConfirmed = function () {
    MainApplication.NewRequestComponent.saveDataToList();
}


MainApplication.NewRequestComponent.saveDataToList = function () {
    globalDefinitions.onActionClicked();
    var formData = $spcontext.bind({});
    formData.InitiatorLogin = CurrentUserProperties.email;
    formData.InitiatorEmailAddress = CurrentUserProperties.email;
    formData.Title = formData.EmployeeName;

    formData.WorkflowRequestID = formData.NCReferenceID;
    formData.Year = $spcontext.serverDate().getFullYear();

    // formData = Peoplepicker.getValue();
    const pickerValues = PeoplePicker.getValue();


    if ($spcontext.checkPassedValidation()) {
        formData.Employee = pickerValues.Employee;
        formData.HOD = SP.FieldUserValue.fromUser(MainApplication.staffDetails[formData.EmployeeEmail].HodEmail);

        globalDefinitions.callLoader();
        AppRequest.returned = AppRequest.requestDetails.ReturnForCorrection;

        customWorkflowEngine.updateStageByName({
			name: globalDefinitions.stageDefinitions.employee,
			username: formData.Title,
			authenticationValue: formData.EmployeeEmail,
			emails: [formData.EmployeeEmail],
		  });
        
        formData = customWorkflowEngine.routeEngine(customWorkflowEngine).requestHistoryHandler(formData, AppRequest.transactionHistory, { stage: "Management Rep", action: "NC Issued" });
        formData = customWorkflowEngine.routeEngine(customWorkflowEngine).runRouting(formData);


        globalDefinitions.onActionCompleted();
        MainApplication.NewRequestComponent.proceedToList(formData, false);
    }
    else {
        globalDefinitions.HandlerError("", true);
        globalDefinitions.onActionFailed();
    }
}

MainApplication.NewRequestComponent.proceedToList = function (formData, saveMode) {

    ncRoot.createItems([formData], configProperties.NCMANAGEMENTLIST.setting,
        function () {
            var registerItems = {
                ID: MainApplication.AuditDetails[$("#ncReferenceID").val()].ID,
                Status: "Issued"
            }
            MainApplication.NewRequestComponent.updateRegister(registerItems, "NonConformanceRegister",
            function () {},
            function (sender, args) {}
        );
            setTimeout(() => {
                globalDefinitions.closeLoader();
            }, 2000);
            globalDefinitions.HandlerSuccess("NC Submitted Successfully");

            globalDefinitions.AuditLogManager_SaveLog({
                Action: `submitted NC ${formData.WorkflowRequestID}`
            });
            globalDefinitions.onActionCompleted();
            $spcontext.redirect("#/", false);
        });
}


MainApplication.NewRequestComponent.dateHandler = function () {

    // Get today's date

    const today = $spcontext.serverDate();
    
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;

    // Set Request Date default to today
    $('#requestDate').val(todayStr);
    // $('#requestDate').attr('readOnly', true);

    // Set Expected Date min to tomorrow
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

    $('#expectedDate').attr('min', tomorrowStr);

}

MainApplication.NewRequestComponent.updateRegister = function (itemData, listName, successCallback, errorCallback) {
  speedctxRoot.updateItems(
    [itemData],
    listName,
    successCallback,
    errorCallback
  );
};