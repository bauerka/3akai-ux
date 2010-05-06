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

sakai.assignments = function(tuid, placement, showSettings){


    //////////////////////
    // CONFIG VARIABLES //
    //////////////////////

    var rootel = $("#" + tuid);

    var assignments = "#assignments";
    var assignmentsListButtonsDiv = ".assignments .assignments_list .assignments_list_buttons div";
    var assignmentsListHover = "assignements_list_hover";
    var $assignmentsMainContainer = $(assignments + "_main_container");

    /**
     * Initialise the tipsy library
     */
    var initialiseTipsy = function(){

        // Set the tipsy tooltip on all the elements with rel="tipsy"
        $('[rel=tipsy]').tipsy({
            gravity: 's'
        });
    };

    /**
     * Hide the big tooltip
     */
    var hideBigTooltip = function(){
        
        // Hide the big tooltip
        $(".assignments_list_tooltip_big3", rootel).hide();
    };
    var hideBigTooltip1 = function(){
        
        // Hide the big tooltip
        $(".assignments_list_tooltip_big1", rootel).hide();
    };
    
    /** 
     * Hide the assignment settings
     */
    var hideAssignmentSettings = function(){

        // Hide the assignment settings window
        $(".assignments_list_settings", rootel).hide();

        // Remove the selected class
        $(".assignments_list_button_settings_selected").removeClass("assignments_list_button_settings_selected");

    };

    /**
     * Hide the people grading tooltip
     */
    var hideGradingNextActions = function(){
        
        // Hide the grading tooltip
        $(".assignments_people_tooltip_grading", rootel).hide();
    };
    
    /**
     * Hide the people submission tooltip
     */
    var hideSubmissionActions = function(){
    
        // Hide the submission tooltips
        $(".assignments_people_tooltip_submission", rootel).hide();
    };

    /**
     * Add binding to several elements
     */
    var addBinding = function(){

        /**
         * Add a hover function for the buttons
         */
        $(assignmentsListButtonsDiv).hover(function(){
            
            // Check if there is an a tag 
            if($(this).find("a").length > 0){
                $(this).addClass(assignmentsListHover);
            }
        }, function(){
            $(this).removeClass(assignmentsListHover);
        });
        
        /**
         * Show/hide the information about the people when you click the people button
         */
        $(".assignments_list_button_people", rootel).click(function(){

            if($(".assignments_list_button_people_selected").length > 0){
                $(".assignments_list_button_people_selected").removeClass("assignments_list_button_people_selected");
                $(".assignments_list_people_info").hide();

            }else{
                $(this).addClass("assignments_list_button_people_selected");
                $(".assignments_list_people_info", $(this).closest(".assignments_list_item")).show();
            }
        });

        /**
         * Bind the onclick event on every assignment title
         */
        $(".assignments_list_info .assignments_list_info_big3", rootel).click(function(){

            if(!$(".assignments_list_tooltip_big3", rootel).is(":visible")){
                $(".assignments_list_tooltip_big3").show();
            }else{
                hideBigTooltip();
            }

        });
        
        /**
         * Bind the onclick event on every assignment title
         */
        $(".assignments_list_info .assignments_list_info_big1", rootel).click(function(){

            if(!$(".assignments_list_tooltip_big1", rootel).is(":visible")){
                $(".assignments_list_tooltip_big1").show();
            }else{
                hideBigTooltip1();
            }

        });

        /**
         * Show/hide the settings for a specific assignment
         */
        $(".assignments_list_button_settings", rootel).click(function(){

            if(!$(".assignments_list_settings", rootel).is(":visible")){
                $(this).addClass("assignments_list_button_settings_selected");
                $(".assignments_list_settings", $(this).closest(".assignments_list_item")).show();
            }else{
                hideAssignmentSettings();
            }

        });
        
        /**
         * Show the zip icon when you hover over the submission button
         */
        $(".assignments_list_button_submission", rootel).hover(
            function(){
                $(".assignments_zip_overlay", $(this).closest(".assignments_list_item")).show();
            }
        );

        /**
         * When you mouse out the zip overlay, hide it.
         * It was not possible to do this on the mouseout in the hover function for the submission button
         * since that caused the image to flicker
         */
        $(".assignments_zip_overlay").live("mouseout", function(){
            $(this).hide();
        });
        
        /**
         * Show an overlay when you click on the zip button
         */
        $(".assignments_zip_overlay").live("click", function(){
            $("#assignments_downloading").show().fadeOut(3000);
        });

        /**
         * Bind a click handler to the grading item
         */
        $(".assignments_list_people_info_grading", rootel).click(function(){
            $(".assignments_people_tooltip_grading", rootel).show();
        });
        
        /**
         * Bind a click handler to the grading item
         */
        $(".assignments_list_people_info_submissions", rootel).click(function(){
            $(".assignments_people_tooltip_submission", rootel).show();
        });
        
        /**
         * Bind the add assignments button
         */
        $("#assignments_add_button", rootel).click(function(){

            document.location = "/dev/assignments_create_v01.html";
        });

        /**
         * Bind the click function on the window document
         * @param {Object} e
         */
        $(document).click(function(e){
            
            // Get the clicked object
            var $clicked = $(e.target);

            // Check if it is a title link
            if(!$clicked.is(".assignments_list_info .assignments_list_info_big3")){
                hideBigTooltip();
            }
            if(!$clicked.is(".assignments_list_info .assignments_list_info_big1")){
                hideBigTooltip1();
            }

            // Check if the element is the settings button
            if(!$clicked.parents().is(".assignments_list_button_settings") && !$clicked.is(".assignments_list_button_settings") ){
                hideAssignmentSettings();
            }

            // Check if the grading button is clicked
            if(!$clicked.is(".assignments_list_people_info_grading")){
                hideGradingNextActions();
            }
            
            // Check if the submissions button is clicked
            if(!$clicked.is(".assignments_list_people_info_submissions")){
                hideSubmissionActions();
            }
        });

    };

    /**
     * Initialization function
     */
    var init = function(){

        // Show the main container
        $assignmentsMainContainer.show();

        // Add binding to several elements
        addBinding();

        // Initialise the tipsy library
        initialiseTipsy();
    };

    init();
};

sdata.widgets.WidgetLoader.informOnLoad("assignments");