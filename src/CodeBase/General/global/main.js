var MainApplication = new MainStartPoint();
var customWorkflowEngine;
var CurrentUserProperties = {};

var configProperties = {
  restrictedlinks: [],
};

var configPropertiesRoot = {
    restrictedlinks: [],
};

var speedctxRoot;
var globalDefinitions;
var rsBAContext;

function MainStartPoint() {
  this.url = window.location.href;
  this.notyf = new Notyf({
    duration: 5000,
    //dismissible: true,
    position: {
      x: 'right', // 'left' or 'right'
      y: 'top'   // 'top' or 'bottom'
    },
    types: [
      {
        type: 'black',
        background: 'black',
        icon: {
          className: 'material-icons',
          tagName: 'i',
          text: 'info' // optional icon
        },
        duration: 3000
      }
    ]
  });
  this.profilephoto = `/_layouts/15/userphoto.aspx?size=M&accountname=`;
  this.profilephotoLarge = `/_layouts/15/userphoto.aspx?size=L&accountname=`;
  this.messageTemplate = {};
  this.cachedState = {
    mode: false,
    pageStateCall: null,
    reportAdmin: false,
    isWorkflowActor: false,
    workflowActors: {},
    isAdmin: false,
    isReportAdmin: false,
    ipaddress: "",
    departments: [],
    hods: {},
    currentUserIsHod: {
      auth: false,
      department: ""
    },
  };
  this.staffDetails = {};
  this.staffList = [];

  this.AuditDetails = {};
  this.AuditList = [];

  this.configuredTaskMembers = {};
  this.isUserAnActor = false;



  this.NewRequestComponent = {};
  this.DashboardComponent = {};
  this.ApproveRequestComponent = {};
  this.ViewRequestComponent = {};
  this.ReportComponent = {};

  this.CurrentPageSubmitFunction = null;
  this.auditType = [];
  this.processes = [];
  // this.procedures = [];

  this.auditNavigationClicks = function(clicklocation){
    globalDefinitions.AuditLogManager_SaveLog({
        Action : `Authorized accessed ${clicklocation}`,
        Message : `user visited the ${clicklocation} at ${$spcontext.stringnifyDate({ format : "dd/mm/yy", includeTime : true})}`
    });
  }

}

function whenLayoutLoaded() {
  //load view port to enable page to be mobile responsive
  $("head").append(`<meta name="viewport" content="width=device-width, initial-scale=1">`);
  //============================================================================================
  $spcontext.loadSPDependencies(
    function () {
      var dependenciesCount = 0;
      var expectedDepenciesCount = 10;
      // speedctxRoot = new Speed();
      globalDefinitions = new GlobalDefinitionsManager();

      globalDefinitions.callLoader();

      window.globalProp.getClientIP().then((response)=>{
        MainApplication.cachedState.ipaddress = response;
        checkAppDependency();
      }).catch((error)=>{
         checkAppDependency();
      })

      $spcontext.currentUserDetails((user) => {
        CurrentUserProperties.email = user.get_email();
        CurrentUserProperties.email = CurrentUserProperties.email.toLowerCase();
        CurrentUserProperties.login = CurrentUserProperties.email;
        CurrentUserProperties.title = user.get_title();

        var name = CurrentUserProperties.title.split(" ");
        var initials = "";
        try {
          initials += name[0].charAt(0);
          initials += name[1].charAt(0);
        } catch (e) { }

        $("#currentusername").text(CurrentUserProperties.title);
        //$("#userinitials").attr("title", CurrentUserProperties.title);
        checkAppDependency();
      });

      $spcontext.getItem("Configuration", $spcontext.camlBuilder(), function (configObjects) {
        var listEnumerator = configObjects.getEnumerator();
        while (listEnumerator.moveNext()) {
          var settingType = listEnumerator.get_current().get_item("SettingType");
          var configObj = {};
          configObj.title = listEnumerator.get_current().get_item("Title");
          configObj.setting = listEnumerator.get_current().get_item("Setting");
          if (settingType == "Restricted") {
            configPropertiesRoot.restrictedlinks.push(configObj);
          } else {
            configPropertiesRoot[configObj.title] = configObj;
          }
        }

        rsBAContext = new Speed(configPropertiesRoot.POPCONTEXT.setting);
        popContext = new Speed(configPropertiesRoot.REALPOPCONTEXT.setting);

        speedctxRoot = new Speed(configPropertiesRoot.AUDITMANAGEMENTURL.setting);
        ncRoot = new Speed(configPropertiesRoot.NONCONFORMANCEURL.setting);

        // testContext = new Speed("/sites");
        ncRoot.errorHandler = globalDefinitions.errorHandler;

          ncRoot.getItem("Configuration", ncRoot.camlBuilder(), function (configObjects) {
            var listEnumerator = configObjects.getEnumerator();
            while (listEnumerator.moveNext()) {
              var settingType = listEnumerator.get_current().get_item("SettingType");
              var configObj = {};
              configObj.title = listEnumerator.get_current().get_item("Title");
              configObj.setting = listEnumerator.get_current().get_item("Setting");
              if (settingType == "Restricted") {
                configProperties.restrictedlinks.push(configObj);
              } else {
                configProperties[configObj.title] = configObj;
              }
            }

            globalDefinitions.stageDefinitions.workflowcode = configProperties.WORKFLOWCODE.setting;
            globalDefinitions.stageDefinitions.workflow = configProperties.WORKFLOWNAME.setting;

            $("#auditmanagementversion").text(configProperties.NCVERSION.setting);
            $("#versioneffectivedate").text(configProperties.VERSIONEFFECTIVEDATE.setting);
            $("#auditmanagementversionMobile").text(configProperties.NCVERSION.setting);
            $("#versioneffectivedateMobile").text(configProperties.VERSIONEFFECTIVEDATE.setting);

            checkAppDependency();
          });

          popContext.isUserMemberOfGroup([configPropertiesRoot.MANAGEMENT.setting, configPropertiesRoot.CEO.setting, configPropertiesRoot.REPORTADMIN.setting],
              { email : CurrentUserProperties.email, groupEmails: true },function(isUserMember, groupUserProperties){
                  MainApplication.isUserAnActor = isUserMember || false;
                  MainApplication.configuredTaskMembers = groupUserProperties || {};
                  checkAppDependency();
              })

          popContext.isCurrentUserMemberOfGroup(configPropertiesRoot.REPORTADMIN.setting, function (isAdmin) {
              MainApplication.cachedState.isReportAdmin = isAdmin || false;
              checkAppDependency();
          });


          var basicQuery = [
                {
                    ascending: "TRUE",  //ascending or descending
                    orderby: "Title", //Column Name to order by
                }
            ];

          speedctxRoot.getItem("AuditType", speedctxRoot.camlBuilder(basicQuery), function (_spMeta) {
              var listEnumerator = _spMeta.getEnumerator();
              MainApplication.auditType = [];
              while (listEnumerator.moveNext()) {
                  var title = listEnumerator.get_current().get_item("Title");
                  MainApplication.auditType.push(title);
              }
              checkAppDependency();
          })

          rsBAContext.getItem("ISO CLAUSE", $spcontext.camlBuilder(basicQuery), function (_spMeta) {
              var listEnumerator = _spMeta.getEnumerator();
              MainApplication.isoClause = [];
              MainApplication.occurrence = [];

              while (listEnumerator.moveNext()) {
                  var title = listEnumerator.get_current().get_item("Title");
                  var occurrenceData = $spcontext.checkNull(listEnumerator.get_current().get_item("d65x"));

                  MainApplication.isoClause.push(title);

                  // Only push non-empty strings
                  if (occurrenceData !== "") {
                      MainApplication.occurrence.push(occurrenceData);
                  }
              }

              checkAppDependency();
          });

          var riskQuery = [
                {
                    ascending: "TRUE",  //ascending or descending
                    orderby: "Value", //Column Name to order by
                }
            ];

          speedctxRoot.getItem("RiskImpact", speedctxRoot.camlBuilder(riskQuery), function (_spMeta) {
              var listEnumerator = _spMeta.getEnumerator();
              MainApplication.riskImpact = [];
              while (listEnumerator.moveNext()) {
                  var riskImpactObj = {};
                  riskImpactObj.title = listEnumerator.get_current().get_item("Title");
                  riskImpactObj.value = listEnumerator.get_current().get_item("Value");
                  MainApplication.riskImpact.push(riskImpactObj);
              }
              checkAppDependency();
          })

          speedctxRoot.getItem("NonConformanceRating", speedctxRoot.camlBuilder(riskQuery), function (_spMeta) {
              var listEnumerator = _spMeta.getEnumerator();
              MainApplication.NCRating = [];
              while (listEnumerator.moveNext()) {
                  var ncRatingObj = {};
                  ncRatingObj.title = listEnumerator.get_current().get_item("Title");
                  ncRatingObj.value = listEnumerator.get_current().get_item("Value");
                  MainApplication.NCRating.push(ncRatingObj);
              }
              checkAppDependency();
          })

          var employeeInfoColumns = [
            "ID",
            "Title",
            "EMAIL_x0020_ADDRESS",
            "DESIGNATION",
            "SUPERVISOR",
            "PERSONAL_x0020_NUMBER",
            "DEPARTMENT",
            "EID",
            "D_x002e_O_x002e_E_x0020__x002f__",
            "Job_x0020_Role",
            "Active",
            "HOD",
            "HOD_x0020_EMAIL"
        ];

        rsBAContext.getListToItems(
            "Staff List",
            [{
                orderby: "ID",
                ascending: "FALSE"
              },
              {
              operator: 'Eq',
              field: 'Active',
              type: 'Text',
              val: "Yes"
            }
            ],
            {
                ignoreThreshold: false,
                data: employeeInfoColumns,
                merge: false,
            },
            false,
            function (item) {
                // Transform item to use new field names
                const transformedItem = {
                    ID: item.ID || '',
                    Title: item.Title || '',
                    Email: item.EMAIL_x0020_ADDRESS || '',
                    Designation: item.DESIGNATION || '',
                    Supervisor: item.SUPERVISOR || '',
                    PersonalNumber: item.PERSONAL_x0020_NUMBER || '',
                    Department: item.DEPARTMENT || '',
                    EmployeeId: item.EID || '',
                    DateOfEmployment: item.D_x002e_O_x002e_E_x0020__x002f__ || '',
                    JobRole: item.Job_x0020_Role || '',
                    Active: item.Active || '',
                    Hod: item.HOD || '',
                    HodEmail: item.HOD_x0020_EMAIL || ''
                };

                if (transformedItem.Email !== "") {
                    if (typeof MainApplication.staffDetails[transformedItem.Email.toLowerCase()] === "undefined") {
                        MainApplication.staffDetails[transformedItem.Email.toLowerCase()] = transformedItem;
                        MainApplication.staffList.push(transformedItem);
                    }
                }

                return transformedItem;
            },
            function (items) {
                MainApplication.staffList = items;
                checkAppDependency();
            }
        );

      });

      

      function checkAppDependency() {
        dependenciesCount++;
        if (dependenciesCount === expectedDepenciesCount) {
          
          console.log("Dependency count: ", dependenciesCount);
          console.log("Expected Dependencies: ", expectedDepenciesCount);
          globalDefinitions.AuditLogManager_SaveLog({
            Action: `Logged into/Opened Audit Management application`,
            Message: `user logged in to application at ${$spcontext.stringnifyDate({ format: "dd/mm/yy", includeTime: true })}`
          });
          if (MainApplication.isUserAnActor){
            $(".reportNav").show();
            $(".reportNavMobile").show();

            $(".newNCNav").show();
            $(".newNCNavMobile").show();
          }

          $spcontext.errorHandler = globalDefinitions.errorHandler;
          MainApplication.cachedState.mode = true;
          MainApplication.cachedState.pageStateCall();
        }
      }
    }
  );
}

MainApplication.getNCOnQueue = function () {
    return new Promise((resolve, reject) => {
        var ncRegisterColumns = [
            "ID",
            "Title",
            "NCReferenceID",
            "ISOClause",
            "NonConformanceStatement",
            "Occurrence",
            "NCRating",
            "NCClassification",
            "RiskImpact",
            "OverallRiskExposure",
            "ObjectiveEvidence",
            "TypeOfAudit",
            "Process",
            "Procedure",
            "Status"
        ];

        speedctxRoot.getListToItems(
            "NonConformanceRegister",
            [{
                orderby: "ID",
                ascending: "FALSE"
            },
            {
                operator: 'Eq',
                field: 'Status',
                type: 'Text',
                val: "Not Issued"
            }
            ],
            {
                ignoreThreshold: false,
                data: ncRegisterColumns,
                merge: false,
            },
            false,
            function (item) {
                if (item.NCReferenceID !== "") {
                    if (typeof MainApplication.AuditDetails[item.NCReferenceID] === "undefined") {
                        MainApplication.AuditDetails[item.NCReferenceID] = item;
                        MainApplication.AuditList.push(item);
                    }
                }
                return item;
            },
            function (items) {
                MainApplication.AuditList = items;
                resolve();
            },
            function (error) {
                reject(error);
            }
        );
    });
};


MainApplication.reportSyncSearch = function (keyquery, data) {
  if (!keyquery || keyquery.trim().length < 3) {
    return data;
  }

  keyquery = keyquery.trim().toLowerCase();

  return data.filter(item =>
    item.NCReferenceID?.toLowerCase().includes(keyquery) ||
    item.Title?.toLowerCase().includes(keyquery) ||
    item.EmployeeDivision?.toLowerCase().includes(keyquery) ||
    item.Approval_Status?.toLowerCase().includes(keyquery) ||
    item.Current_Approver?.toLowerCase().includes(keyquery)
  );
};

whenLayoutLoaded();
