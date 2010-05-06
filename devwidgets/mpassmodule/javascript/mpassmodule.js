/*
 * Licensed to the Sakai Foundation (SF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The SF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */
/*global $, sdata, Config, addBinding */

var sakai = sakai || {};

sakai.mpassmodule = function(tuid, showSettings){
	
	var SHOW_USER_SELECTION_DIALOG = 0;
	
	var json = false; // Variable used to recieve information by json
    var widgetSettings = {}; // Will hold the widget settings.
    var me = sakai.data.me; // Contains information about the current user
    var rootel = $("#" + tuid); // Get the main div used by the widget
    var jsonDisplay = {};
    var currentSite = sakai.site.currentsite.id;
    var store = "/sites/" + currentSite + "/store/";
    var numberReflectionParts = 4;
    var maxNumberElementsPerPart = 2;
    var selectedPeople = [];
    
    var mpass = "#mpass";
    var mpassReflection = mpass + "_reflection";
    var mpassReflectionContainer = mpassReflection + "_container";
    var mpassReflectionContainerTemplate = mpassReflectionContainer + "_template";
    var mpassReflectionContent = mpassReflection + "_content";
    var mpassReflectionBtn = mpassReflection + "_btn_";
    
    var mpassTaskPartTitle = "#task_part_title_";
    var mpassTaskHeaderLink = "#task_header_link_";
    var mpassTaskContentTemplate = mpass + "_task_content_template";
    var mpassTaskMoreBtn = mpass + "_task_more_";
    
    var mpassMainTask = mpass + "_main_task";
    var mpassMainTaskTitlebox = mpassMainTask + "_titlebox";
    var mpassMainTaskContent = mpassMainTask + "_content";
    var mpassMainTaskBtn = mpassMainTask + "_btn";
    var mpassMainTaskBtnRefl = mpassMainTaskBtn + "_reflection";
    var mpassMainTaskBtnAsgn = mpassMainTaskBtn + "_assignment";
	
	var reflection = "#reflection";
	var reflectionDialog = reflection + "_dialog";
	var reflectionDialogContainer = reflectionDialog + "_container";
	var reflectionPartHeader = reflectionDialog + "_partheader";
	var reflectionDialogSubmit = reflectionDialog + "_submit";
	var reflectionDialogCancel = reflectionDialog + "_cancel";
	var reflectionDialogClose = reflectionDialog + "_close";
	var reflectionTypeId = reflection + "_type_id";
	var reflectionTitle = reflection + "_title";
	var reflectionContent = reflection + "_content";
	var reflectionSharedButton = reflection + "_share_options_shared";
	var reflectionPrivateButton = reflection + "_share_options_private";
	
	var sharedusers = "#sharedusers";
	var sharedusersDialog = sharedusers + "_dialog";
	var sharedusersContent = sharedusers + "_content";
	var sharedusersDialogContainer = sharedusersDialog + "_container";
	var sharedusersContentContainer = sharedusersContent + "_container";
	var sharedusersContentContainerTemplate = sharedusersContentContainer + "_template";
	var sharedusersDialogSubmit = sharedusersDialog + "_submit";
	var sharedusersDialogCancel = sharedusersDialog + "_cancel";
	var sharedusersDialogClose = sharedusersDialog + "_close";
	
	
	/**
     * Render the reflection parts
     */
    var renderReflectionParts = function(){
    	jsonDisplay = {
                "reflectionparts": []
            };
    	// set index and title of part
    	for (var i = 0; i < numberReflectionParts; i++) {
    		var part = [];
    		part.index = i;
    		var title_element = $(mpassTaskPartTitle + i, rootel);
    		if (title_element !== null) {
    			part.title = title_element.html();
    		}
    		else {part.title = "";}
    		jsonDisplay.reflectionparts[i] = part;
    	}
    	$(mpassReflectionContainer, rootel).html($.TemplateRenderer(mpassReflectionContainerTemplate, jsonDisplay));
    	// get reflections and render them
    	for (var i = 0; i < numberReflectionParts; i++) {
    		getReflections(i);
    	}
    };
    
    var renderMainTasks = function(typeid){
    	var title = "";
    	var title_element = $(mpassTaskPartTitle + typeid, rootel);
    	if (title_element !== null) {
			title = title_element.html();
		}
    	$(mpassMainTaskTitlebox + " > h4").html(title);
    	if (typeid >= 0 && typeid <= 3) {
    		$(mpassMainTaskBtnRefl, rootel).show();
    		$(mpassMainTaskBtnAsgn, rootel).hide();
    		$(mpassMainTaskBtnRefl + " .reflection_btn", rootel).attr("id", "mpass_main_reflection_btn_" + typeid);
    	}
    	else if (typeid === "assignment") {
    		$(mpassMainTaskBtnRefl, rootel).hide();
    		$(mpassMainTaskBtnAsgn, rootel).show();
    	}
    	else {
    		$(mpassMainTaskBtnRefl, rootel).hide();
    		$(mpassMainTaskBtnAsgn, rootel).hide();
    	}
    	$(mpassMainTaskContent, rootel).html($.TemplateRenderer(mpassTaskContentTemplate, jsonDisplay));

    	$(".task_element_ispublic", mpassMainTaskContent).bind('click', function(){
    		var id = $(this).parents("table:first").attr("id");
    		getTaskById(id, SHOW_USER_SELECTION_DIALOG);
    	});
    };
	
	/**
     * Add a new reflection
     */
    var addReflection = function(){
    	// get id for reflection type
    	var i = $(reflectionTypeId, rootel).val();
        var isLoggedIn = (me.user.anon && me.user.anon === true) ? false : true;
        var allowAdd = true;
        if (!isLoggedIn) {
            // This should not even happen.. Somebody is tinkering with the HTML.
        	allowAdd = false;
            alert("Please register or log in to add your reflection.");
        }
        

        if (allowAdd) {
        	var title = $(reflectionTitle, rootel).val();
            var body = $(reflectionContent, rootel).val();
            var userlist = [];
            for (var j = 0; j < selectedPeople.length; j++) {
            	userlist.push(selectedPeople[j].userid);
            }
            
            $.ajax({
                url: "/_user" + sakai.data.me.profile.path + "/content.create.html",
                type: "POST",
                data: {
		    		"sakai:type": "reflection" + i,
		            "sakai:siteid": sakai.site.currentsite.id,
		            "sakai:marker": tuid,
		            "sakai:title": title,
		            "sakai:body": body,
		            "sakai:sharedusers": userlist,
		            "_charset_":"utf-8"
                },
                success: function(data){
                	alert(data);
                    // Close dialog container.
            		closeReflectionDialog();
                    // Get the reflections.
                    getReflections(i);
                },
                error: function(xhr, textStatus, thrownError){
                    if (xhr.status === 401) {
                        alert("You are not allowed to add reflections.");
                    }
                    else {
                        alert("Failed to save.");
                    }
                }
            });
        }
        else {
            alert("Please fill in all the fields.");
        }
    };
    
    /**
     * Gets the task with the given id from the service.
     */
    var getTaskById = function(id, followingAction){
        var path = "/_user" + sakai.data.me.profile.path + "/content/";
        var url = path + id.substring(0,2) + "/" + id.substring(2,4) + "/" + id.substring(4,6) + "/" + id.substring(6,8) + "/" + id + ".json";
        $.ajax({
            url: url,
            cache: false,
            success: function(data){
                json.currenttask = $.evalJSON(data);
                
                switch(followingAction)
                {
                case SHOW_USER_SELECTION_DIALOG:
                	getAllUsers();
                	break;
                default:
                	break;
                }
            },
            error: function(xhr, textStatus, thrownError){
                alert("Task: An error occured while receiving the task by id (" + xhr.status + ")");
            }
        });
    };
    
    /**
     * Gets the reflections from the service.
     */
    var getReflections = function(i){
        var sortOn = "sakai:modified";
        var sortOrder = "descending";
        var path = "/_user" + sakai.data.me.profile.path + "/content";

        var url = "/var/search/reflections/flat.json?reflectiontypeid=" + i + "&sortOn=" + sortOn + "&sortOrder=" + sortOrder + 
        			"&marker=" + tuid + "&siteid=" + sakai.site.currentsite.id + "&path=" + path;
        $.ajax({
            url: url,
            cache: false,
            success: function(data){
                json.foundReflections = $.evalJSON(data);
                showReflections(i, json.foundReflections);
            },
            error: function(xhr, textStatus, thrownError){
                alert("Reflections: An error occured while receiving the reflections (" + xhr.status + ")");
            }
        });
    };
    
    /**
     * Show the reflections in a paged state or not
     */
    var showReflections = function(i, foundReflections){
        jsonDisplay = {
            "tasks": [],
            "settings": widgetSettings
        };
        if (typeof  foundReflections === "undefined") {
        	foundReflections = [];
        	foundReflections.results = [];
        }
        // Loops through all the reflections and does the necessary changes to render the JSON-object
        // Do not show more than maxNumberElementsPerPart reflections in the task navigation
        var nrRefl = maxNumberElementsPerPart;
        if (foundReflections.results.length < nrRefl) {
        	nrRefl = foundReflections.results.length;
        }
        for (var j = 0; j < nrRefl; j++) {
        	prepareTaskForJson(j);
        }
        $(mpassReflectionContent + "_" + i, rootel).html($.TemplateRenderer(mpassTaskContentTemplate, jsonDisplay));
        // show or hide more button
        if (foundReflections.results.length > maxNumberElementsPerPart) {
        	$(mpassTaskMoreBtn + i, rootel).show();
        	for (var j = nrRefl; j < foundReflections.results.length; j++) {
        		prepareTaskForJson(j);
        	}
        }
        else {
        	$(mpassTaskMoreBtn + i, rootel).hide();
        }
        
    	$(".task_element_ispublic", mpassReflectionContent + "_" + i).bind('click', function(){
    		var id = $(this).parents("table:first").attr("id");
    		getTaskById(id, SHOW_USER_SELECTION_DIALOG);
    	});

        // show tasks in main task container
        renderMainTasks(i);
    };
    
    var prepareTaskForJson = function(j) {
    	jsonDisplay.tasks[j] = {};
        var task = foundReflections.results[j].post;
        // Checks if the date is already parsed to a date object
        // TODO: Get jcr:created
        var tempDate = task["sakai:created"];
        try {
            // if the date is not a string this should generate en exception
        	task.date = parseDate(tempDate);
        }
        catch (ex) {
        	task.date = tempDate;
        }
        task.formatDate = formatDate(task.date);
        task.id = task["sakai:id"];
        task.title = task["sakai:title"];
        task.bodyTxt = task["sakai:body"];
        task.body = tidyInput(task["sakai:body"]);
        task.sharedusers = task["sakai:sharedusers"];
        task.typeid = task["sakai:type"].replace("reflection", "");
        
        jsonDisplay.tasks[j] = task;
    };
    
    var checkReflectionSharedButton = function(){
    	if ($(reflectionSharedButton).is(':visible')) {
    		if (selectedPeople.length == 0) {
    			$(reflectionPrivateButton).attr('checked','checked');
    		}
    	}
    };
    
    /**
     * Show add reflection dialog with title of reflection type
     */
    var showReflectionDialog = function(partId, reflection) {
    	$(reflectionTypeId, rootel).val(partId);
		var title_element = $(mpassTaskPartTitle + partId, rootel);
		if (title_element !== null) {
			$(reflectionPartHeader, rootel).html(title_element.html());
		}
		if (selectedPeople.length == 0) {
			$(reflectionPrivateButton).attr('checked','checked');
		}
		$(reflectionDialogContainer, rootel).show();
    };
    
    /**
     * Close reflection dialog
     */
    var closeReflectionDialog = function(){
    	// Hide the form.
		$(reflectionDialogContainer, rootel).hide();
        // Clear the textboxes.
        $(reflectionTitle, rootel).val("");
        $(reflectionContent, rootel).val("");
    };
    
    /**reflectionDialogContainer
     * Close sharedusers dialog
     */
    var closeSharedusersDialog = function(){
    	// Hide the form.
		$(sharedusersDialogContainer, rootel).hide();
        // Clear the textboxes.

    };
    
    ////////////////////////
    // Utility  functions //
    ////////////////////////

    var getAllUsers = function(){
    	var url = sakai.config.URL.SEARCH_USERS + "?username=*";
        $.ajax({
            cache: false,
            url: url,
            success: function(data) {
        		json.foundPeople = $.evalJSON(data);
                renderPeople(json.foundPeople);
            },
            error: function(xhr, textStatus, thrownError) {
                alert(sakai.api.i18n.Widgets.getValueForKey("__MSG__AN_ERROR_HAS_OCCURED__"));
            }
        });
    }
    
    /**
     * Parse a json string to a valid date
     * @param {String} dateInput String of a date that needs to be parsed
     * @returns {Date}
     */
    var parseDate = function(dateInput){
        /** Get the date with the use of regular expressions */
        if (dateInput !== null) {
            /** Get the date with the use of regular expressions */
            var match = /([0-9]{4})\-([0-9]{2})\-([0-9]{2}).([0-9]{2}):([0-9]{2}):([0-9]{2})/.exec(dateInput); // 2009-08-14T12:18:50
            var d = new Date();
            d.setYear(match[1]);
            d.setMonth(match[2] - 1);
            d.setDate(match[3]);
            d.setHours(match[4]);
            d.setMinutes(match[5]);
            d.setSeconds(match[6]);
            return d;
        }
        return null;
    };
    
    /**
     * Format an input date (used by TrimPath)
     * @param {Date} d Date that needs to be formatted
     * @return {String} returns the date in the following format
     */
    var formatDate = function(d){
        if (d === null) {
            return null;
        }
        var names_of_months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var current_hour = d.getHours();
        var current_minutes = d.getMinutes() + "";
        if (current_minutes.length === 1) {
            current_minutes = "0" + current_minutes;
        }
        return (names_of_months[d.getMonth()].substring(0, 3) + " " + d.getDate() + ", " + d.getFullYear());
    };
    
    /**
     * Converts all HTML to flat text and converts \n to <br />
     * @param {String} str
     */
    var tidyInput = function(str){
        str = str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        str = str.replace(/\n/g, '<br />');
        return str;
    };
    
    /**
     * renders a list of members
     * @param {Object} people
     */
    var renderPeople = function(people) {
    	selectedPeople = [];
    	var selectedUserIds = [];
        if (typeof(people.results) === "undefined") {
            people.results = [];
        }
        if (typeof(json.currenttask) !== "undefined" && typeof(json.currenttask["sakai:sharedusers"]) !== "undefined") {
        	selectedUserIds = json.currenttask["sakai:sharedusers"];
        }
        for (var i = 0; i < people.results.length; i++) {
            if (typeof people.results[i].picture !== "undefined" && typeof people.results[i].picture == "string") {
                people.results[i].picture = $.evalJSON(people.results[i].picture);
            } else {
                people.results[i].picture = {};
            }
            people.results[i].userid = people.results[i]["rep:userId"];
            // TODO change this to jQuery.inArray - function did not work
            for (var j = 0; j < selectedUserIds.length; j++) {
            	if (selectedUserIds[j] == people.results[i].userid) {
            		selectedPeople.push(people.results[i]);
            		people.results[i].selected = true;
            	}
            }
        }
        
        $(sharedusersContentContainer).html($.TemplateRenderer(sharedusersContentContainerTemplate, people));
        $(".userSelect_person").bind("click", function(e, ui) {
            var userindex = parseInt(this.id.replace("userSelect_person", ""), 10);
            selectPerson(userindex, true, false);
        });
        $(sharedusersDialogContainer, rootel).show();
    };
    /**
     * unselects a person
     * @param {Object} person
     */
    var unselectPerson = function(person){
        for (var j = 0; j < json.foundPeople.results.length; j++) {
            if( json.foundPeople.results[j].userid === person.userid){
                json.foundPeople.results[j].selected = false;
                $("#userSelect_person" + j).attr("class", "unselected");
                for (var k = 0; k < selectedPeople.length; k++) {
                	if (selectedPeople[k].userid === json.foundPeople.results[j].userid) {
                		selectedPeople.splice(k,1);
                	}
                }
            }
        }
    };
    /**
     * selects a person
     * @param {Object} personIndex
     * @param {Object} isNewSelection
     */
    var selectPerson = function(personIndex, isNewSelection, selectAll) {

        if (typeof  json.foundPeople === "undefined") {
             json.foundPeople.results = [];
        }
        if (! json.foundPeople.results[personIndex].selected) {
            if(isNewSelection){
                selectedPeople.push(json.foundPeople.results[personIndex]);
            }
            json.foundPeople.results[personIndex].selected = true;
            $("#userSelect_person" +  personIndex , sharedusersContentContainer).attr("class", "selected");
        }
        else if(!selectAll){
           unselectPerson(json.foundPeople.results[personIndex]);
        }
    };
 
	
    /** Bind submit button of reflection dialog */
    $(reflectionDialogSubmit, rootel).bind('click', function(e, ui){
        addReflection();
    });
	
    /** Bind cancel and close button of reflection dialog */
	$(reflectionDialogCancel, rootel).bind('click', function(){
		closeReflectionDialog();
	});
	$(reflectionDialogClose, rootel).bind('click', function(){
		closeReflectionDialog();
	});
	
	/** Bind share reflection button in reflection dialog */
    $(reflectionSharedButton, rootel).bind('click', function(e, ui){
        getAllUsers();
    });
	
    /** Bind submit button of shared users dialog */
    $(sharedusersDialogSubmit, rootel).bind('click', function(e, ui){
    	closeSharedusersDialog();
    	checkReflectionSharedButton();
    });
	
    /** Bind cancel and close button of shared users dialog */
	$(sharedusersDialogCancel, rootel).bind('click', function(){
		closeSharedusersDialog();
	});
	$(sharedusersDialogClose, rootel).bind('click', function(){
		closeSharedusersDialog();
	});
	
	
    /**
     * Function that will be launched if the widget is loaded
     */
    var init = function(){
    	renderReflectionParts();

    	// do binding after rendering when elements exist
    	$(".reflection_btn", rootel).bind('click', function(){
    		// get reflection part/type id and set title of dialog box
    		var i = $(this).attr("id").replace(mpassReflectionBtn.substring(1,mpassReflectionBtn.length), "").replace(
    				"mpass_main_reflection_btn_", "");
    		selectedPeople = [];
        	json.currenttask = [];
        	showReflectionDialog(i, null);
    	});
    	
    	$("a[id^='" + mpassTaskHeaderLink.substring(1,mpassTaskHeaderLink.length) + "']", rootel).bind('click', function(){
    		// get task type id and get the corresponding data
    		var id = $(this).attr("id").replace(mpassTaskHeaderLink.substring(1,mpassTaskHeaderLink.length), "");
    		if (id >= 0 && id <= 3) {
    			getReflections(id);
        	}
        	else if (id === "assignment") {
        		renderMainTasks(id);
        	}
        	else if (id === "feedback") {
        		renderMainTasks(id);
        	}
    	});
    	
        $("#mpassmodule_main_container").show();
    };
    init();
};

sdata.widgets.WidgetLoader.informOnLoad("mpassmodule");