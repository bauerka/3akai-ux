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
	
	var DO_NOTHING = 0;
	var SHOW_USER_SELECTION_DIALOG = 1;
	
	var json = {}; // Variable used to recieve information by json
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
    var mpassmodule = mpass + "module";
    var mpassToggleWidthButton = mpass + "_toggle_width_btn";
    var mpassReflection = mpass + "_reflection";
    var mpassReflectionContainer = mpassReflection + "_container";
    var mpassReflectionContainerTemplate = mpassReflectionContainer + "_template";
    var mpassReflectionContent = mpassReflection + "_content";
    var mpassReflectionBtn = mpassReflection + "_btn_";
    
    var mpassTaskPartTitle = "#task_part_title_";
    var mpassTaskHeaderLink = "#task_header_link_";
    var mpassTaskContentTemplate = mpass + "_task_content_template";
    var mpassTaskMoreBtn = mpass + "_task_more_";
    var mpassTaskCommentsCount = "#task_comments_count_";
    var mpassTaskCommentsClose = "#task_comments_count_close_";
    
    var mpassMainTask = mpass + "_main_task";
    var mpassMainTaskTitlebox = mpassMainTask + "_titlebox";
    var mpassMainTaskContent = mpassMainTask + "_content";
    var mpassMainTaskContentTemplate = mpassMainTaskContent + "_template";
    var mpassMainTaskBtn = mpassMainTask + "_btn";
    var mpassMainTaskBtnRefl = mpassMainTaskBtn + "_reflection";
    var mpassMainTaskBtnAsgn = mpassMainTaskBtn + "_assignment";
    var mpassMainTaskCommentTemplate = mpassMainTask + "_comment_template";
    var mpassMainTaskCommentContent = mpassMainTask + "_comment_content_";
	
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
	
	var comment = "#comment";
	var commentTotal = comment + "_total_";
	var commentUnread = comment + "_unread_";
	var commentMainTotal = comment + "_main_total_";
	var commentMainUnread = comment + "_main_unread_";
	
	var sharedusers = "#sharedusers";
	var sharedusersDialog = sharedusers + "_dialog";
	var sharedusersContent = sharedusers + "_content";
	var sharedusersDialogContainer = sharedusersDialog + "_container";
	var sharedusersContentContainer = sharedusersContent + "_container";
	var sharedusersContentContainerTemplate = sharedusersContentContainer + "_template";
	var sharedusersDialogSubmit = sharedusersDialog + "_submit";
	var sharedusersDialogCancel = sharedusersDialog + "_cancel";
	var sharedusersDialogClose = sharedusersDialog + "_close";
	
	
	var taskSharedText = "<h6>Production(s) attendue(s)</h6><p>(1) Le <b>r&eacute;cit de vie</b> doit faire" +
			" l'objet d'une carte conceptuelle suivie d'un court texte (1000 &agrave;1500 mots) faisant" +
			" &eacute;tat de vos exp&eacute;riences, vos croyances, vos connaissances et vos comp&eacute;tences." +
			" Votre texte devra &ecirc;tre attach&eacute; &agrave; votre carte conceptuelle. Vous aurez &agrave; remettre :" +
			" un fichier CMap Tools et un fichier Word.<br/>(2) Le <b>plan de d&eacute;veloppement p&eacute;dagogique</b>" +
			" doit faire l'objet d'une ligne du temps suivie d'un court texte (1000 &agrave; 1500 mots) expliquant les" +
			" diff&eacute;rentes &eacute;tapes de votre cheminement, vos attentes et ambitions, vos acquis et vos lacunes," +
			" vos besoins d'apprentissage, vos croyances personnelles &agrave; valider ou invalider, vos d&eacute;fis &agrave;" +
			" relever et les moyens envisag&eacute;s pour relever vos d&eacute;fis.</p>"
    
			

/************************************
*	ADD MPASS CONTENT
************************************/	
	
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
                url: "/_user" + me.profile.path + "/content.create.html",
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
                	json.currenttask = $.evalJSON(data).content;
                	// Inform selected users about reflection
                	if (typeof json.currenttask !== "undefined" && userlist.length > 0) {
                		inviteForSharedContent(userlist, json.currenttask);
                	}
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
    
    
    
/************************************
*	GET MPASS CONTENT
************************************/	
    
    /**
     * Gets the task with the given id from the service.
     */
    var getTaskById = function(id, followingAction){
        var path = "/_user" + me.profile.path + "/content/";
        var url = path + id.substring(0,2) + "/" + id.substring(2,4) + "/" + id.substring(4,6) + "/" + id.substring(6,8) + "/" + id + ".json";
        $.ajax({
            url: url,
            cache: false,
            success: function(data){
                json.currenttask = $.evalJSON(data);
                
                switch(followingAction)
                {
                case SHOW_USER_SELECTION_DIALOG:
                	getAllUsers(SHOW_USER_SELECTION_DIALOG);
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
        var path = "/_user" + me.profile.path + "/content";

        var url = "/var/search/reflections/flat.json?reflectiontypeid=" + i + "&sortOn=" + sortOn + "&sortOrder=" + sortOrder + 
        			"&marker=" + tuid + "&siteid=" + sakai.site.currentsite.id + "&path=" + path;
        $.ajax({
            url: url,
            cache: false,
            success: function(data){
                json.foundReflections = $.evalJSON(data);
                showReflections(i);
            },
            error: function(xhr, textStatus, thrownError){
                alert("Reflections: An error occured while receiving the reflections (" + xhr.status + ")");
            }
        });
    };
    
    var getCommentsForTask = function(taskId, i, j){
    	var sortOn = "sakai:created";
        var sortOrder = "descending";
        var path = "/_user" + me.profile.path + "/message";

        var url = "/var/search/comments/categoryflat.json?sortOn=" + sortOn + "&sortOrder=" + sortOrder + "&marker=" + taskId + "&path=" + path;
        $.ajax({
            url: url,
            cache: false,
            success: function(data){
                json.foundComments = $.evalJSON(data).results;
                jsonDisplay.tasks[i][j].comments = [];
                var countUnread = 0;
                for (var k = 0; k < json.foundComments.length; k++) {
                	var comment = json.foundComments[k].post;
                	var tempDate = comment["sakai:created"];
                    try {
                        // if the date is not a string this should generate an exception
                    	comment.date = parseDate(tempDate);
                    }
                    catch (ex) {
                    	comment.date = tempDate;
                    }
                    comment.formatDate = formatDate(comment.date);
                    comment.id = comment["sakai:id"];
                    comment.reflId = comment["sakai:marker"];
                    comment.read = comment["sakai:read"];
                    comment.bodyTxt = comment["sakai:body"];
                    comment.body = tidyInput(comment["sakai:body"]);
                    comment.from = comment["sakai:from"];
                    if (comment.read == false) {
                    	countUnread++;
                    }
                    if (typeof json.foundPeople !== "undefined" && typeof json.foundPeople.results !== "undefined") {
                    	comment.fromUser = json.foundPeople.results[comment.from];
                    }
                	jsonDisplay.tasks[i][j].comments[k] = comment;
                }
                jsonDisplay.tasks[i][j].commentsUnread = countUnread;
                // set comment numbers
                var countTotal = jsonDisplay.tasks[i][j].comments.length;
            	$(commentUnread + taskId).html(countUnread);
            	$(commentTotal + taskId).html(countTotal);
            	$(commentMainUnread + taskId).html(countUnread);
            	$(commentMainTotal + taskId).html(countTotal);
            	if (countTotal > 0) {
	        		var text = (countTotal == 1) ? sakai.api.i18n.Widgets.getValueForKey("mpassmodule", "default", "COMMENT") :
	        			sakai.api.i18n.Widgets.getValueForKey("mpassmodule", "default", "COMMENTS");
	        		$("#task_comments_count_" + taskId).html("<a href=\"javascript:;\">" + countTotal + " " + text + "</a>");
	        		$(mpassMainTaskCommentContent + taskId, rootel).html($.TemplateRenderer(mpassMainTaskCommentTemplate, jsonDisplay.tasks[i][j]));
	        	} else {
	        		$("#task_comments_count_" + taskId).empty();
	        	}
            },
            error: function(xhr, textStatus, thrownError){
                alert("comments: An error occured while receiving the comments (" + xhr.status + ")");
            }
        });
    };
    
    /**
     * Gets all the users from Sakai
     */    
    var getAllUsers = function(followingAction){
    	var url = sakai.config.URL.SEARCH_USERS + "?username=*";
        $.ajax({
            cache: false,
            url: url,
            success: function(data) {
        		json.foundPeople = $.evalJSON(data);
                renderPeople(json.foundPeople);
                switch(followingAction)
                {
                case DO_NOTHING:
                	break;
                case SHOW_USER_SELECTION_DIALOG:
                	showSharedusersDialog();
                	break;
                default:
                	break;
                }
            },
            error: function(xhr, textStatus, thrownError) {
                alert("getAllUsers: An error occured while receiving the users (" + xhr.status + ")");
            }
        });
    }
    
    
/************************************
*	GENERAL RENDERING
************************************/	
	
	/**
     * Render the reflection parts
     */
    var renderReflectionParts = function(){
    	jsonDisplay.reflectionparts = [];
    	jsonDisplay.tasks = [];
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
    	$(mpassMainTaskContent, rootel).html($.TemplateRenderer(mpassMainTaskContentTemplate, jsonDisplay));
    };
    
    /**
     * Show the reflections in a paged state or not
     */
    var showReflections = function(i){
    	if (typeof jsonDisplay.tasks === "undefined") {
    		jsonDisplay.tasks = [];
    		alert("new tasks");
        }
    	if (typeof jsonDisplay.tasks[i] === "undefined") {
    		jsonDisplay.tasks[i] = [];
    	}	
        if (typeof  json.foundReflections === "undefined") {
        	json.foundReflections.results = [];
        }
        // Loops through all the reflections and does the necessary changes to render the JSON-object
        // Do not show more than maxNumberElementsPerPart reflections in the task navigation
        var nrRefl = maxNumberElementsPerPart;
        if (json.foundReflections.results.length < nrRefl) {
        	nrRefl = json.foundReflections.results.length;
        }
        for (var j = 0; j < nrRefl; j++) {
        	prepareTaskForJson(i, j);
        }
        jsonDisplay.currentpart = i;
        jsonDisplay.elementsperpart = maxNumberElementsPerPart;
        $(mpassReflectionContent + "_" + i, rootel).html($.TemplateRenderer(mpassTaskContentTemplate, jsonDisplay));
        // show or hide more button
        if (json.foundReflections.results.length > maxNumberElementsPerPart) {
        	$(mpassTaskMoreBtn + i, rootel).show();
        	for (var j = nrRefl; j < json.foundReflections.results.length; j++) {
        		prepareTaskForJson(i, j);
        	}
        }
        else {
        	$(mpassTaskMoreBtn + i, rootel).hide();
        }
        // show tasks in main task container
        renderMainTasks(i);
    };
    
    
    var prepareTaskForJson = function(i, j) {
    	jsonDisplay.tasks[i][j] = {};
        var task = json.foundReflections.results[j].post;
        // Checks if the date is already parsed to a date object
        // TODO: Get jcr:created
        var tempDate = task["sakai:created"];
        try {
            // if the date is not a string this should generate an exception
        	task.date = parseDate(tempDate);
        }
        catch (ex) {
        	task.date = tempDate;
        }
        task.formatDate = formatDate(task.date);
        task.index = j;
        task.id = task["sakai:id"];
        task.title = task["sakai:title"];
        task.bodyTxt = task["sakai:body"];
        task.body = tidyInput(task["sakai:body"]);
        task.sharedusers = task["sakai:sharedusers"];
        task.typeid = task["sakai:type"].replace("reflection", "");

        jsonDisplay.tasks[i][j] = task;
        
        getCommentsForTask(task.id, i, j);
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
        // get preselected users
        if (typeof(json.currenttask) !== "undefined" && typeof(json.currenttask["sakai:sharedusers"]) !== "undefined") {
        	if (typeof json.currenttask["sakai:sharedusers"] == "string") {
        		selectedUserIds.push(json.currenttask["sakai:sharedusers"]);
        	} else {
        		selectedUserIds = json.currenttask["sakai:sharedusers"];
        	}
        }
        var tempResults = [];
        for (var i = 0; i < people.results.length; i++) {
        	var curUserId = people.results[i]["rep:userId"];
        	// do not add own user or anonymous user
        	if (curUserId !== me.user.userid && curUserId !== "anonymous") {
        		people.results[i].userid = curUserId;
	            if (typeof people.results[i].picture !== "undefined" && typeof people.results[i].picture == "string") {
	                people.results[i].picture = $.evalJSON(people.results[i].picture);
	            } else {
	                people.results[i].picture = {};
	            }
	            people.results[i].userid = curUserId;
	            // TODO change this to jQuery.inArray - function did not work
	            for (var j = 0; j < selectedUserIds.length; j++) {
	            	if (selectedUserIds[j] == people.results[i].userid) {
	            		selectedPeople.push(people.results[i]);
	            		people.results[i].selected = true;
	            	}
	            }
	            tempResults[curUserId] = people.results[i];
            }
        }
        json.foundPeople.results = tempResults;
    };
    
    
/************************************
*	ACTION FUNCTIONS
************************************/
    
    /**
     * invite user of list to comment shared content
     * @param {Array} userlist
     * @param {Object} userlist
     */
    var inviteForSharedContent = function(userlist, content) {
    	var msg = [];
    	if (content["sakai:type"].indexOf("reflection") == 0) {
    		msg = createReflectionMessage(content);
    	}
        if (typeof msg["subject"] !== "undefined" && typeof msg["body"] !== "undefined") {
        	// have to send the message to each selected user separately,
        	// sending a message to an user array or a group is not implemented yet
	        for (var i = 0; i < userlist.length; i++){
	            sakai.api.Communication.sendMessage(userlist[i], msg["subject"], msg["body"], "mpass", null, function(success, data){
//	                alert("sent");
	            });
	        }
        }
    };
    
    var createReflectionMessage = function(content){
    	var msg = [];
    	var username = me.profile.firstName + " " + me.profile.lastName;
    	var reflTitle = content["sakai:title"];
    	var title = sakai.api.i18n.Widgets.getValueForKey("mpassmodule", "default", "SHARE_REFLECTION_TITLE");
    	msg["subject"] = title.replace(/\$\{user\}/gi, username).replace(/\$\{title\}/gi, reflTitle);
    	
    	var reflId = content["sakai:id"];
    	var reflBody = content["sakai:body"];
    	var reflCreated = content["sakai:created"];
    	var reflTypeId = content["sakai:type"].replace("reflection", "");
    	var reflType = sakai.api.i18n.Widgets.getValueForKey("mpassmodule", "default", "REFLECTION_TITLE_" + reflTypeId);
    	
    	if (typeof reflId !== "undefined" && typeof reflTitle !== "undefined" && typeof reflBody !== "undefined") {
    		var body = "<input id=\"inbox-mpass-content-id\" type=\"hidden\" value=\"" + reflId + "\"/>" +
    				"<div class=\"reflection_task\">" + taskSharedText + "</div><div class=\"reflection_msg\">" +
    				"<div class=\"reflection_header\"><div id=\"inbox-mpass-content-title\" class=\"reflection_title\">" 
    				+ reflTitle + "</div>";
    		if (typeof reflCreated !== "undefined") {
    			try {
    	        	var tempDate = parseDate(reflCreated);
    	        	var date = formatDate(tempDate);
    	        	body += "<div class=\"reflection_created\">" + date + "</div>";
    	        } catch (ex) { 
    	        	// do not add date to message	   
    	        }
    		}
    		if (typeof reflType !== "undefined") {
	        	body += "<div class=\"reflection_subtitle\">" + reflType + "</div>";
    		}
    		body += "</div><div class=\"reflection_body\">" + reflBody + "</div></div>";
    		msg["body"] = body;
    	}
    	return msg;
    };
    
    var checkReflectionSharedButton = function(){
    	if ($(reflectionSharedButton).is(':visible')) {
    		if (selectedPeople.length == 0) {
    			$(reflectionPrivateButton).attr('checked','checked');
    		} else {
    			// remember selected users for re-editing
    			json.currenttask["sakai:sharedusers"] = [];
    			for (var i = 0; i < selectedPeople.length; i++) {
    				json.currenttask["sakai:sharedusers"].push(selectedPeople[i].userid);
                }
    		}
    	}
    };
    
    /**
     * unselect a person
     * @param {Object} person
     */
    var unselectPerson = function(person){
        if(typeof json.foundPeople.results[person.userid] !== "undefined"){
            json.foundPeople.results[person.userid].selected = false;
            $("#userSelect_person_" + person.userid).attr("class", "unselected userSelect_person");
            for (var k = 0; k < selectedPeople.length; k++) {
            	if (selectedPeople[k].userid === person.userid) {
            		selectedPeople.splice(k,1);
            	}
            }
        }
    };
    /**
     * selects a person
     * @param {Object} personIndex
     * @param {Object} isNewSelection
     */
    var selectPerson = function(personId, isNewSelection, selectAll) {
        if (typeof  json.foundPeople === "undefined") {
        	json.foundPeople.results = [];
        }
        if (! json.foundPeople.results[personId].selected) {
            if(isNewSelection){
                selectedPeople.push(json.foundPeople.results[personId]);
            }
            json.foundPeople.results[personId].selected = true;
            $("#userSelect_person_" +  personId , sharedusersContentContainer).attr("class", "selected userSelect_person");
        }
        else if(!selectAll){
        	unselectPerson(json.foundPeople.results[personId]);
        }
    };
    
    
/************************************
*	DIALOGS
************************************/	
    
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
        // Clear the text fields.
        $(reflectionTitle, rootel).val("");
        $(reflectionContent, rootel).val("");
    };
    
    var showSharedusersDialog = function(){
        if (typeof json.foundPeople === "undefined") {
        	alert("users should be there already");
        	getAllUsers(SHOW_USER_SELECTION_DIALOG);
        }
        else {
	        $(sharedusersContentContainer).html($.TemplateRenderer(sharedusersContentContainerTemplate, json.foundPeople));
	        $(sharedusersDialogContainer, rootel).show();
        }
    };
    
    /**reflectionDialogContainer
     * Close sharedusers dialog
     */
    var closeSharedusersDialog = function(){
    	// Hide the form.
		$(sharedusersDialogContainer, rootel).hide();
        // Clear the text fields.
    };
    
    
/************************************
*	UTILITY FUNCTIONS
************************************/
    
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
        var names_of_months = ["Jan", "FŽv", "Mars", "Avr", "Mai", "Juin", "Jui", "Aožt", "Sep", "Oct", "Nov", "DŽc"];
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
    
    var toggleContainerWidth = function() {
    	var btn = $(mpassToggleWidthButton);
    	var mpm = $(mpassmodule);
    	var nav = $('#navigation_menu_wrap'); 
    		if (typeof nav === "undefined")
    			nav = $('.page_nav');
    	var con = $('#main_content_container');
    		if (typeof con === "undefined")
    			con = $('.content_container');
    	var s = 300;
    	btn.blur();
    	var ie6 = $.browser.msie && $.browser.version.substr(0,1)<7;
    	if (btn.attr('class') == 'collapse') {
//    		setCookie('mpass_navigation_menu_collapse','false',30,'/','','');
    		if (ie6) {
    			sidemenu_openposition(btn,con,nav,mpm);
    		}else {
    			nav.animate({width:230,opacity:'show'},s);
    			con.animate({marginLeft:221,paddingLeft:10},s);
    			mpm.animate({width:430},s-50);
    		}
    	}else{
//    		setCookie('mpass_navigation_menu_collapse','true',30,'/','','');
    		if (ie6) {
    			sidemenu_closeposition(btn,con,nav,mpm);
    		}else {
    			nav.animate({width:0,opacity:'hide'},s);
    			con.animate({marginLeft:0,paddingLeft:0},s);
    			mpm.animate({width:660},s);
    		}
    	}
    	btn.toggleClass('collapse');
    };
    
    var sidemenu_closeposition = function(btn,con,nav,mpm) {
    	nav.css('display','none').css('width','0px');
    	con.css('margin-left','0px').css('padding-left','0px');
    	mpm.css('width','660px');
    };
    var sidemenu_openposition = function(btn,con,nav,mpm) {
    	nav.css('display','blo').css('width','230px');
    	con.css('margin-left','221px').css('padding-left','10px');
    	mpm.css('width','430px');
    };
    
    
/************************************
*	BINDINGS
************************************/    
    
    /** Bind the task headers */
	$("a[id^='" + mpassTaskHeaderLink.substring(1,mpassTaskHeaderLink.length) + "']", rootel).live('click', function(){
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
	
	/** Bind the more button in the tasks */
	$(".task_more", rootel).live('click', function(){
		var id = $(this).attr("id").replace(mpassTaskMoreBtn.substring(1,mpassTaskMoreBtn.length), "");
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
    
    /** Bind add reflection button to open reflection dialog */
	$(".reflection_btn a", rootel).live('click', function(){
		// get reflection part/type id and set title of dialog box
		var i = $(this).parents(".reflection_btn:first").attr("id").replace(mpassReflectionBtn
				.substring(1,mpassReflectionBtn.length), "")
				.replace("mpass_main_reflection_btn_", "");
		selectedPeople = [];
    	json.currenttask = [];
    	showReflectionDialog(i, null);
	});
	
	/** Bind shared or private button for tasks */
	$(".task_element_ispublic", rootel).live('click', function(){
		var index = $(this).parents("table:first").attr("id").replace("main_", "").replace("taskside_", "").split("_");
		json.currenttask = jsonDisplay.tasks[index[0]][index[1]];
		getAllUsers(SHOW_USER_SELECTION_DIALOG);
	});
	$(".task_element_open_ispublic", rootel).live('click', function(){
		var index = $(this).parents(".task_element_open:first").attr("id").replace("main_open_", "").split("_");
		json.currenttask = jsonDisplay.tasks[index[0]][index[1]];
		getAllUsers(SHOW_USER_SELECTION_DIALOG);
	});
	
	/** Bind title in task side bar*/ 
	$(".taskside_element_title", rootel).live('click', function(){
		alert("scroll to reflection");
	});
	
	/** Bind task title in main container to open and close element */
	$(".main_element_title", rootel).live('click', function(){
		var ids = $(this).parents(".task_element_table:first").attr("id").replace("main_", "");
		$(this).parents("table:first").hide();
		$("#main_open_" + ids).show();
	});
	$(".task_element_open_title", rootel).live('click', function(){
		var ids = $(this).parents(".task_element_open:first").attr("id").replace("main_open_", "");
		$(this).parents(".task_element_open:first").hide();
		$("#main_" + ids).show();
	});
	
	/** Bind open and comments in main container */
	$(".task_element_open_comments_count").live('click', function(){
		var id = $(this).attr("id").replace(mpassTaskCommentsCount.substring(1,mpassTaskCommentsCount.length), "");
		$(this).hide();
		$(mpassTaskCommentsClose + id).show();
		$(mpassMainTaskCommentContent + id).show();
	});
	$(".task_element_open_comments_close").live('click', function(){
		var id = $(this).attr("id").replace(mpassTaskCommentsClose.substring(1,mpassTaskCommentsClose.length), "");
		$(this).hide();
		$(mpassMainTaskCommentContent + id).hide();
		$(mpassTaskCommentsCount + id).show();
	});
	
	/** Bind user entries in shared users dialog */
    $(".userSelect_person", rootel).live("click", function(e, ui) {
        var userid = $(this).attr("id").replace("userSelect_person_", "");
        selectPerson(userid, true, false);
    });
	
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
        getAllUsers(SHOW_USER_SELECTION_DIALOG);
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
	
	/** Bind toggle width and height buttons */
	$(mpassToggleWidthButton).bind('click', function(){
		toggleContainerWidth();
	});
	
	
	
    /**
     * Function that will be launched if the widget is loaded
     */
    var init = function(){
    	getAllUsers(DO_NOTHING);
    	renderReflectionParts();
    	
        $("#mpassmodule_main_container").show();
    };
    
    init();
};

sdata.widgets.WidgetLoader.informOnLoad("mpassmodule");