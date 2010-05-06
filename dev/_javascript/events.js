/*
 * Licensed to the Sakai Foundation (SF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The SF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

/*global $, Config, sdata, fluid */

var sakai = sakai || {};
sakai.events = function(){


    /////////////////////////////
    // Configuration variables //
    /////////////////////////////

    var sendValues = {
        limit : 10,
        start_time : [],
        end_time : [],
        seconds_before_today : [],
        seconds_after_today : [],
        term : []
    };

    // CSS Selectors
    var $eventsContainerList = $("#events_container_list");
    var $eventsContainerContentSelect = $("#events_container_content select");
    
    // Form
    var $eventsFormFilter =$("#events_form_filter");
    var $eventsShowTalks = $("#events_show_talks", $eventsFormFilter);
    var $eventsStartDate = $("#events_start_date", $eventsFormFilter);
    var $eventsEndDate = $("#events_end_date", $eventsFormFilter);
    var $eventsLimitSecondsBeforeToday = $("#events_limit_seconds_before_today", $eventsFormFilter);
    var $eventsLimitSecondsAfterToday = $("#events_limit_seconds_after_today", $eventsFormFilter);
    var $eventsOnlyThisTerm = $("#events_only_this_term", $eventsFormFilter);

    // Templates
    var eventsContainerMainTemplate = "events_container_list_template";


    //////////////////////////
    // Render functionality //
    //////////////////////////

    /**
     * Render the talks and show it to the user
     * @param {Object} results The JSON results object
     */
    var renderTalks = function(results){
        $eventsContainerList.html($.Template.render(eventsContainerMainTemplate, results));
    };


    ////////////////////////
    // Date functionality //
    ////////////////////////

    /**
     * Parse the start and end date in an approriate format
     * e.g. Friday 26th February 2010, 17:30-18:30
     * @param {Date} startDate The start date object
     * @param {Date} endDate The end date object
     */
    var parseDate = function(startDate, endDate){
        return dateFormat(startDate, "dddd dS mmmm yyyy, HH:MM") + "-" + dateFormat(endDate, "HH:MM");
    };

    /**
     * Parse a date to a shorter format
     * e.g. Sun 28 Feb 2010
     * @param {Date} date The date you want to shorten
     */
    var parseShortDate = function(date){
        return dateFormat(date, "ddd dd mmm yyyy");
    };

    /**
     * Show shorter date beneath the input field
     */
    var showShortDate = function(){
        var $el = $(this);
        var date = $el.datepicker("getDate");

        if(date){
            $("#" + $el.attr("id") + "_formatted").text(parseShortDate(date));
        }
        else {
            $("#" + $el.attr("id") + "_formatted").text("");
        }
    };

    /**
     * Initialise the datepickers
     */
    var initDatepicker = function(){
        var d = new Date();
        $eventsStartDate.datepicker({
            buttonText: "Please select a start date",
            dateFormat: 'dd/mm/y',
            defaultDate: d,
            onClose: showShortDate
        });

        $eventsEndDate.datepicker({
            buttonText: "Please select an end date",
            dateFormat: 'dd/mm/y',
            // We set the default date for the stop date to a week later
            defaultDate: +7,
            onClose: showShortDate
        });
    };


    ////////////////////////
    // Main functionality //
    ////////////////////////

    /**
     * Parse the talks into a more usable format for the template
     * @param {Object|Boolean} data 
     * If the data is false it means that there was an error.
     * If it is an object then we should parse it to JSON
     */
    var parseTalks = function(data){
        if(data){
            var json = $.evalJSON(data);
            if (json && json.vcalendar && json.vcalendar.vevents){

                var talks = json.vcalendar.vevents, talk;

                for (var i = 0, il = talks.length; i < il; i++) {
                    talk = json.vcalendar.vevents[i];

                    // Parse the dates
                    json.vcalendar.vevents[i].DTPARSE = parseDate($.ParseJCRDate(talk.DTSTART.substring(0, 19)), $.ParseJCRDate(talk.DTEND.substring(0, 19)));

                    // Split the summary since it both contains the name of the speaker + the title of the talk
                    var splitSummary = json.vcalendar.vevents[i].SUMMARY.split(" - ");
                    json.vcalendar.vevents[i].SPEAKER = splitSummary[splitSummary.length - 1];

                    json.vcalendar.vevents[i].TITLE = "";
                    for (var k = 0, kl = splitSummary.length; k < kl -1; k++){
                        if(k === 0){
                            json.vcalendar.vevents[i].TITLE += splitSummary[k];
                        }else{
                            json.vcalendar.vevents[i].TITLE += " - " + splitSummary[k];
                        }
                        
                    }
                }

                renderTalks(json.vcalendar);
            } else {
                fluid.log("No featured talks were found");
            }
        } 
        else {
            fluid.log("Could not get the data from talks.cam.ac.uk");
        }
    };

    /**
     * Get the featured talks from talks.cam.ac.uk
     */
    var getTalks = function(){

        // Send of the Ajax request
        $.ajax({
            data: $.param(sendValues),
            url: "/var/proxy/talks/featured_talks.json",
            success: function(data){
                parseTalks(data);
            },
            error: function(){
                parseTalks(false);
            }
        });
    };


    ////////////////////
    // Binding events //
    ////////////////////

    var changeSendValues = function(){
        newSendValues = {
            limit : $eventsContainerContentSelect.val(),
            start_time : ($eventsStartDate.datepicker("getDate")) ? $eventsStartDate.datepicker("getDate").getTime()/1000 : [],
            end_time : ($eventsEndDate.datepicker("getDate")) ? $eventsEndDate.datepicker("getDate").getTime()/1000 : [],
            seconds_before_today : ($eventsLimitSecondsBeforeToday.val()) ? $eventsLimitSecondsBeforeToday.val() : [],
            seconds_after_today : ($eventsLimitSecondsAfterToday.val()) ? $eventsLimitSecondsAfterToday.val() : [],
            term : ($eventsOnlyThisTerm.is(":checked")) ? "current" : []
        };
        
        if(sendValues !== newSendValues){
            sendValues = newSendValues;
            getTalks();
        }
    };

    /**
     * Add binding to the various elements
     */
    var addBinding = function(){

        /**
         * Bind the change event to the dropdown box where you can
         * select how many items you want
         */
        $eventsContainerContentSelect.change(function(){
            changeSendValues();
        });

        /**
         * Add binding to the submit event
         * This event will be fired if the user hits enter in the form
         * and if you click on the show feed button
         */
        $eventsFormFilter.submit(function(){
            changeSendValues();
        });
    };


    ////////////////////
    // Initialisation //
    ////////////////////

    /**
     * Initialisation function
     */
    var init = function(){
        
        // Get the featured talks
        getTalks();
        
        // Initialise the datepickers
        initDatepicker();
        
        // Add binding to the appropriate elements
        addBinding();
    };
    
    init();
};
sdata.container.registerForLoad("sakai.events");