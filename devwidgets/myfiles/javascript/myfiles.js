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

/*global $, Config, Querystring, sdata */

var sakai = sakai || {};

sakai.myfiles = function(tuid,placement,showSettings){


    /////////////////////////////
    // Configuration variables //
    /////////////////////////////

    var rootel = $("#" + tuid);
    //var numberFiles = 6; // The number of files that will be shown

    // - ID
    var myfiles = "#myfiles";

    // Error
    //var myfilesError = myfiles + "_error";
    //var myfilesErrorContactserver = myfilesError + "_contactserver";

    // List
    var myfilesList = myfiles + "_list";

    // Templates
    var myfilesListTemplate = "myfiles_list_template";


    ///////////////////////////
    // Get & process files //
    ///////////////////////////

    /**
     * Process the information for each file
     * @param {Object} files JSON object containing all the files the current user
     */
    var doProcessing = function(files){
        var jsonFiles = {};
        
        // Array that will contain a specified number of files of the current user
        jsonFiles.items = [];
        
        /*if (files.results) {
            
            // Run process each file
            for (var i = 0; i < files.results.length; i++) {
                if (i <= numberFiles) {
                    var file = files.results[i];
                    
                    // Set the id of the file
                    file.id = "test file"; //file.target;
                    
                    // Add the file to the array
                    jsonFiles.items.push(file);
                }
            }
        }
        */

        if (files) {
            jsonFiles.items.push("file 1");
            jsonFiles.items.push("file 2");
            jsonFiles.items.push("file 3");
            jsonFiles.items.push("file 4");
            jsonFiles.items.push("file 5");
            jsonFiles.items.push("file 6");
        }

        // Render the template with the files
        $(myfilesList, rootel).html($.Template.render(myfilesListTemplate, jsonFiles));
    };


    /**
     * Get all the files for the current user.
     */
    var getFiles = function(){

        /*$.ajax({
            url: "doc/files.json",
            cache: false,
            success: function(data){
                
                // Parse the data into a JSON object
                var files = $.evalJSON(data);
                
                // Process the files: username, picture, ...
                doProcessing(files);
            },
            error: function(xhr, textStatus, thrownError) {
                
                // Show the contact error
                $(myfilesErrorContactserver, rootel).show();
            }
        });*/

        var qs = new Querystring();
        doProcessing(qs.contains("my_files"));

    };


    /////////////////////////////
    // Initialisation function //
    /////////////////////////////

    var doInit = function() {

        // Get the files for the current user
        getFiles();

    };

    doInit();

};

sdata.widgets.WidgetLoader.informOnLoad("myfiles");