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

/*global $, sdata, Config */

var sakai = sakai || {};

sakai.tasks = function(tuid, placement, showSettings){
	
	var rootel = $("#" + tuid);

	var flactivetab = "fl-activeTab";

	var tasks = "#tasks";
	var tasksContainer = "#tasks_container";
	var tasksContentMainClass = ".tasks_content_main";
	var tasksDropDown = tasks + "_dropdown";
	var $tasksDropDownCourse =  $(tasksDropDown + "_course", rootel);
	var $tasksMainContainer = $(tasks + "_main_container", rootel);

	var tasksTab = "#tasks_tab";
	var $tasksTabToday = $(tasksTab + "_today", rootel);
	var $tasksTabAll = $(tasksTab + "_all", rootel);
	var $tasksTabCourse = $(tasksTab + "_course", rootel);
	
	var showDropDown = function(){
		$(tasksDropDown).show();
	};
	
	var hideDropDown = function(){
		$(tasksDropDown).hide();
	};
	
	var toggleDropDown = function(){
		if($(tasksDropDown).is(":visible")){
			hideDropDown();
		}else{
			showDropDown();
		}
	};
	
	var switchTab = function(ev, target){
		
		hideDropDown();
		
		var tabid = ev.target.id.split("_")[ev.target.id.split("_").length - 1];

		if(!$(tasksContainer + "_" + tabid).is(":visible")){
			$(tasksContentMainClass, rootel).hide();
			
			$("." + flactivetab, rootel).removeClass(flactivetab);
		
			$(tasksTab + "_" + tabid, rootel).parent().addClass(flactivetab);
		
			$(tasksContainer + "_" + tabid, rootel).show();	
		}

	};
	
	var addBinding = function(){
		
		$tasksTabToday.live("click", switchTab);
		$tasksTabAll.live("click", switchTab);
		$tasksDropDownCourse.live("click", switchTab);
		$tasksTabCourse.live("click", toggleDropDown);
	};
	
	/**
	 * Initialise the tipsy library
	 */
	var initialiseTipsy = function(){

		// Set the tipsy tooltip on all the elements with rel="tipsy"
		$('[rel=tipsy]').tipsy({
			gravity: 's'
		});
	};
	
	var init = function(){
		addBinding();
		
		initialiseTipsy();
		
		$tasksMainContainer.show();
	};
	
	init();
};

sdata.widgets.WidgetLoader.informOnLoad("tasks");