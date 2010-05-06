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

/*global $, Config, sdata */
var sakai = sakai || {};

sakai.create_group = function(){

    var me = sdata.me;

    var coll_droppable_options = {
            drop: function(event, ui) {

                $("#collection_members_description").hide();

                var $current_collection = $("#collection_members_display").data("current_collection");
                var $current_collection_members = $current_collection.data("collection_members");

                $("#members .small_person_container_selected").each(function(i){
                    $("#collection_members_display").append($(this).clone().removeClass("small_person_container_selected").bind("click", function(){
                        $(this).toggleClass("small_person_container_selected");
                        $(this).addClass("current_collection_highlight");
                    }));
                });

                var $new_members = $($.merge($.merge([],$current_collection_members), $("#members .small_person_container_selected")));
                $current_collection.data("collection_members", $new_members);

                $("#members .small_person_container_selected").removeClass("small_person_container_selected");

            }
        };


    var doInit = function(){

        // Init doc drawer
        sakai.doc_drawer();

        // Init accordion like container
        $(".create_group_container .header").click(function() {
            if ($(this).html() === "Add members") {
                $("#doc_drawer").show();
                $("#group_settings").toggle();
                $(this).css({"margin-top": "10px"});
            }

            $(this).next().toggle();
            return false;
        }).next().hide();
        $("#group_settings").toggle();


        // Wire members click
        $("#members_drag_target .small_person_container").live("click", function(){
            $(this).remove();
        });

        // Wire org cat button
        $("#group_org_cat_button").bind("click", function() {
            $("#group_members").hide();
            $("#group_members_org_cat").show();
            $("#doc_drawer").hide();

            $("#members").append($("#members_drag_target .small_person_container").clone());

            $("#members .small_person_container").bind("click", function(){
                $(this).toggleClass("small_person_container_selected");
            });


            $("#members .small_person_container").draggable({
                helper: function(event, ui) {
                    var sel_elements_html = "";
                    $("#members .small_person_container_selected").each(function(i){
                        sel_elements_html += "<div class='small_person_container_selected_drag'>"+$(this).html()+"</div>";
                    });
                    return $("<div>" + sel_elements_html + "</div>");
                },
                appendTo: "body",
                zIndex: 3000,
                start: function(event, ui) {
                    $(this).addClass("small_person_container_selected");
                }
            });

        });



        $("#collection_members_display").droppable(coll_droppable_options);

        // Wire Add Category button
        $("#group_add_category_button").bind("click", function() {

            var category_title_input = $("#org_cat_name_input").val();

            if (category_title_input !== "") {
                $("#category_title").html(category_title_input);
            } else {
                return;
            }

        });

        // Wire Add collection button
        $("#group_add_collection_button").bind("click", function() {

            $("#add_collection_container").hide();
            $("#add_collection_description").hide();

            var $current_collection = $("#collection_template .t_collection").clone();
            var $current_title = $($current_collection[0]);

            $("#collection_members_display").html("");

            $(".collection_highlight").removeClass("collection_highlight");

            $current_collection.data("collection_members", $("#members .small_person_container_selected"));

            $("#collection_display").append($current_collection.attr("class","collection collection_highlight"));
            $current_title.html($("#collection_name_input").val()+" ");

            if ($("#members .small_person_container_selected").length > 0) {

                $("#collection_members_description").hide();

                $("#members .small_person_container_selected").each(function(i){
                    $("#collection_members_display").append($(this).clone().removeClass("small_person_container_selected").bind("click", function(){
                        $(this).toggleClass("small_person_container_selected");
                    }));

                }).removeClass("small_person_container_selected");
            } else {
                $("#collection_members_display").html("");
            }

            $("#members .small_person_container_selected").removeClass("small_person_container_selected");
            $("#collection_members_display").data("current_collection", $current_collection);

            $current_collection.droppable(coll_droppable_options);

        });

        // Wire up people selection
        $(".small_person_container").bind("click", function() {
            $(this).toggleClass("small_person_container_selected");
        });

        // Wire up add to selection
        $(".collection").live("click", function(e) {

            if (e.shiftKey) {
                $("#collection_members_display").prepend($(this).data("collection_members").clone().bind("click", function(){
                    $(this).toggleClass("small_person_container_selected");
                }));
            } else {
                $("#collection_members_display").html($(this).data("collection_members").clone().bind("click", function(){
                    $(this).toggleClass("small_person_container_selected");
                }));
                $("#members .small_person_container").removeClass("current_collection_highlight");
                $(".collection_highlight").removeClass("collection_highlight");
            }

            $(this).toggleClass("collection_highlight");

            $("#collection_members_display").data("current_collection", $(this));

            $(this).data("collection_members").addClass("current_collection_highlight");

        });

        // Wire add new collection
        $("#add_new_collection").bind("click", function() {
            $("#add_collection_container").show();
        });

        // Wire Create my group
        $("#group_create_button").bind("click", function() {
            if ($("#group_title").val() === "") {
                $("#error_msg").html("Please add a group title first!").show();
                return;
            }

            document.location = "peoplewow_mygroups.html";

        });

        // Collection name input click clear
        $("#collection_name_input").bind("click", function(){
            $(this).val("");
        });

        //Wire select all members
        $("#select_all_members_button").bind("click", function() {
            $("#members .small_person_container").addClass("small_person_container_selected");
        });


        //Wire select none members
        $("#select_none_members_button").bind("click", function() {
            $("#members .small_person_container_selected").removeClass("small_person_container_selected");
        });

        //Collection select all button
        $("#collection_select_all_button").bind("click",function(){

            $("#collection_members_display").html("");

            $("#collection_display .collection").each(function(i) {
                $("#collection_members_display").prepend($(this).data("collection_members").clone().bind("click", function(){
                    $(this).toggleClass("small_person_container_selected");
                }));

                $(this).addClass("collection_highlight");

                $("#collection_members_display").data("current_collection", $.merge($.merge([], $("#collection_members_display").data("current_collection")), $(this)));

                $(this).data("collection_members").addClass("current_collection_highlight");
            });

        });

        // Collection Select none
        $("#collection_select_none_button").bind("click",function(){

            $("#collection_display .collection").removeClass("collection_highlight");
            $("#collection_members_display").html("");
            $("#collection_members_display").data("current_collection", []);

        });

        // Delete selected collection
        $("#collection_delete_selected_button").bind("click", function() {
            $("#collection_members_display").html("");
            $("#collection_display .collection_highlight").data("current_collection", []).remove();
            if ($("#collection_display .collection").size() === 0) {
                $("#add_collection_container").show();
            }
        });


        // Collection members select all
        $("#collection_members_select_all").bind("click", function() {
            $("#collection_members_display .small_person_container").addClass("small_person_container_selected");
        });

        // Collection members select none
        $("#collection_members_select_none").bind("click", function() {
            $("#collection_members_display .small_person_container_selected").removeClass("small_person_container_selected");
        })


        // Collection members delete
        $("#collection_members_delete_selected").bind("click", function() {
            $("#collection_members_display .small_person_container_selected").remove();
            var $current_collection = $("#collection_members_display").data("current_collection");

            $current_collection.data("collection_members", $("#collection_members_display .small_person_container").clone());
        });

        $("#back_to_members_button").bind("click", function() {
            $("#group_members").show();
            $("#group_members_org_cat").hide();
            $("#doc_drawer").show();
        });


    };

    doInit();

};

sdata.container.registerForLoad("sakai.create_group");
