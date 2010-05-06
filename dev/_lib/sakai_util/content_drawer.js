/*global $, Config, sdata */

//var sakai = sakai || {};

// Main Document Drawer Function
sakai.doc_drawer = function() {

    // Position of the drawer: "bottom", "right", "left"
    var current_position = "bottom";

    // Context of the doc browser - "default", "mydocuments", "sitedocuments", "contact"
    var current_context = "default";

    var current_document_view = "icon"; // "icon", "list"

    // Drawer size (height or width depending on position)
    var doc_drawer_size_bottom = 300;
    var doc_drawer_size_side = 300;
    var extra_bottom_space = 50;
    var doc_drawer_height = doc_drawer_size_bottom;
    var doc_header_height = {"bottom": 26, "left": 53, "right": 53};
    var doc_content_height = {"bottom": 0, "left": 0, "right": 0};
    var doc_footer_height = {"bottom": 26, "left": 53, "right": 53};

    var view_options_height = {"bottom":28, "left": 56, "right": 56 };

    var fixed_support = false;

    // Object cache
    var $doc_drawer = $("#doc_drawer");

    var $doc_drawer_header = $("#doc_drawer_header");
    var $doc_drawer_content = $("#doc_drawer_content");
    var $doc_drawer_footer = $("#doc_drawer_footer");

    var $doc_drawer_button = $("#doc_drawer_button");
    var $position_bottom_button = $("#position_bottom_button");
    var $position_right_button = $("#position_right_button");
    var $position_left_button = $("#position_left_button");

    var $doc_drawer_search_container = $("#doc_drawer_search_container");
    var $doc_drawer_tags_container = $("#doc_drawer_tags_container");
    var $doc_drawer_extra_tags = $("#doc_drawer_extra_tags");

    // My Content tab
    var $browser_nav = $("#browser_nav");
    var $view_container = $("#view_container");
    var $view_options = $("#view_options");
    var $document_view = $("#document_view");


    // Classes
    var doc_element_selected_class = "small_person_container_selected";


    // Dummy document search results
    var document_search_results = [
        {filename: "Abrakadabra.pdf", filesize: 2546, id: "ce322d2f-030c-4759-bd8f-6bad580c4370", path: "foo/bar/asdasd", type: "application/pdf", description: "Description about the file", tags:["tag1","tag2","tag3"]},
        {filename: "Cosmology notes and scribbles.pdf", filesize: 2546, id: "ce322d2f-030c-4759-bd8f-6bad580c4370", path: "foo/bar/asdasd", type: "application/pdf", description: "Description about the file", tags:["tag1","tag2","tag3"]},
        {filename: "Prof Dubber on Climate Change - audio.mp3", filesize: 2546, id: "ce322d2f-030c-4759-bd8f-6bad580c4370", path: "foo/bar/asdasd", type: "audio/mp3", description: "Description about the file", tags:["tag1","tag2","tag3"]},
        {filename: "Downloaded podcast for Meteorology class.aiff", filesize: 2546, id: "ce322d2f-030c-4759-bd8f-6bad580c4370", path: "foo/bar/asdasd", type: "audio/aiff", description: "Description about the file", tags:["tag1","tag2","tag3"]},
        {filename: "Carls Sagan on dimensions.mp4", filesize: 2546, id: "ce322d2f-030c-4759-bd8f-6bad580c4370", path: "foo/bar/asdasd", type: "video/mp4", description: "Description about the file", tags:["tag1","tag2","tag3"]},
        {filename: "Advanced cloud science - lesson 01.pdf", filesize: 2546, id: "ce322d2f-030c-4759-bd8f-6bad580c4370", path: "foo/bar/asdasd", type: "text/plain", description: "Description about the file", tags:["tag1","tag2","tag3"]},
        {filename: "Advanced cloud science - lesson 02.pdf", filesize: 2546, id: "ce322d2f-030c-4759-bd8f-6bad580c4370", path: "foo/bar/asdasd", type: "text/plain", description: "Description about the file", tags:["tag1","tag2","tag3"]},
        {filename: "Advanced cloud science - lesson 03.pdf", filesize: 2546, id: "ce322d2f-030c-4759-bd8f-6bad580c4370", path: "foo/bar/asdasd", type: "text/plain", description: "Description about the file", tags:["tag1","tag2","tag3"]},
        {filename: "Thermodynamics.doc", filesize: 2546, id: "ce322d2f-030c-4759-bd8f-6bad580c4370", path: "foo/bar/asdasd", type: "text/plain", description: "Description about the file", tags:["tag1","tag2","tag3"]},
        {filename: "Cosmology assignement - first year.odf", filesize: 2546, id: "ce322d2f-030c-4759-bd8f-6bad580c4370", path: "foo/bar/asdasd", type: "text/plain", description: "Description about the file", tags:["tag1","tag2","tag3"]},
        {filename: "Space weather lesson lectures.doc", filesize: 2546, id: "ce322d2f-030c-4759-bd8f-6bad580c4370", path: "foo/bar/asdasd", type: "text/plain", description: "Description about the file", tags:["tag1","tag2","tag3"]},
        {filename: "Space weather lesson lectures2.doc", filesize: 2546, id: "ce322d2f-030c-4759-bd8f-6bad580c4370", path: "foo/bar/asdasd", type: "text/plain", description: "Description about the file", tags:["tag1","tag2","tag3"]},
        {filename: "Lisa dog missing poster.png", filesize: 2546, id: "ce322d2f-030c-4759-bd8f-6bad580c4370", path: "foo/bar/asdasd", type: "text/plain", description: "Description about the file", tags:["tag1","tag2","tag3"]},
        {filename: "Water and the science behind it.odf", filesize: 2546, id: "ce322d2f-030c-4759-bd8f-6bad580c4370", path: "foo/bar/asdasd", type: "text/plain", description: "Description about the file", tags:["tag1","tag2","tag3"]},
        {filename: "Assignement for Cloud Science - work in progress.odf", filesize: 2546, id: "ce322d2f-030c-4759-bd8f-6bad580c4370", path: "foo/bar/asdasd", type: "text/plain", description: "Description about the file", tags:["tag1","tag2","tag3"]},
        {filename: "cool painting.png", filesize: 2546, id: "ce322d2f-030c-4759-bd8f-6bad580c4370", path: "foo/bar/asdasd", type: "text/plain", description: "Description about the file", tags:["tag1","tag2","tag3"]},
        {filename: "Red dot.pdf", filesize: 2546, id: "ce322d2f-030c-4759-bd8f-6bad580c4370", path: "foo/bar/asdasd", type: "text/plain", description: "Description about the file", tags:["tag1","tag2","tag3"]},
        {filename: "Festival video with Jane.avi", filesize: 2546, id: "ce322d2f-030c-4759-bd8f-6bad580c4370", path: "foo/bar/asdasd", type: "text/plain", description: "Description about the file", tags:["tag1","tag2","tag3"]},
        {filename: "Rico.doc", filesize: 2546, id: "ce322d2f-030c-4759-bd8f-6bad580c4370", path: "foo/bar/asdasd", type: "text/plain", description: "Description about the file", tags:["tag1","tag2","tag3"]},
        {filename: "iPad_the_facts.pdf", filesize: 2546, id: "ce322d2f-030c-4759-bd8f-6bad580c4370", path: "foo/bar/asdasd", type: "text/plain", description: "Description about the file", tags:["tag1","tag2","tag3"]},
        {filename: "iPad side view OMG.png", filesize: 2546, id: "ce322d2f-030c-4759-bd8f-6bad580c4370", path: "foo/bar/asdasd", type: "text/plain", description: "Description about the file", tags:["tag1","tag2","tag3"]},
        {filename: "trip down memory lane.avi", filesize: 2546, id: "ce322d2f-030c-4759-bd8f-6bad580c4370", path: "foo/bar/asdasd", type: "text/plain", description: "Description about the file", tags:["tag1","tag2","tag3"]},
        {filename: "youtube funny but educational.mp4", filesize: 2546, id: "ce322d2f-030c-4759-bd8f-6bad580c4370", path: "foo/bar/asdasd", type: "text/plain", description: "Description about the file", tags:["tag1","tag2","tag3"]},
        {filename: "Caren's pets.pdf", filesize: 2546, id: "ce322d2f-030c-4759-bd8f-6bad580c4370", path: "foo/bar/asdasd", type: "text/plain", description: "Description about the file", tags:["tag1","tag2","tag3"]},
        {filename: "Neil Gaiman Biography.pdf", filesize: 2546, id: "ce322d2f-030c-4759-bd8f-6bad580c4370", path: "foo/bar/asdasd", type: "text/plain", description: "Description about the file", tags:["tag1","tag2","tag3"]}

    ];



    var all_people = [
        {name:"Wilhelm Darrell1"},
        {name:"Wilhelm Darrell2"},
        {name:"Wilhelm Darrell3"},
        {name:"Wilhelm Darrell4"},
        {name:"Wilhelm Darrell5"},
        {name:"Wilhelm Darrell6"},
        {name:"Wilhelm Darrell7"},
        {name:"Wilhelm Darrell8"},
        {name:"Wilhelm Darrell9"},
        {name:"Wilhelm Darrell10"},
        {name:"Wilhelm Darrell11"},
        {name:"Kate Martinez1"},
        {name:"Kate Martinez2"},
        {name:"Kate Martinez3"},
        {name:"Kate Martinez4"},
        {name:"Salvatore del Ticio1"},
        {name:"Salvatore del Ticio2"},
        {name:"Salvatore del Ticio3"},
        {name:"Salvatore del Ticio4"},
        {name:"Salvatore del Ticio5"},
        {name:"Salvatore del Ticio6"},
        {name:"Salvatore del Ticio7"},
        {name:"Salvatore del Ticio8"}
    ];

    var mol_biology_people = [
        {name:"Kate Martinez1"},
        {name:"Kate Martinez2"},
        {name:"Kate Martinez3"},
        {name:"Kate Martinez4"}
    ];

    var biomed_people = [
        {name:"Salvatore del Ticio1"},
        {name:"Salvatore del Ticio2"},
        {name:"Salvatore del Ticio3"},
        {name:"Salvatore del Ticio4"},
        {name:"Salvatore del Ticio5"},
        {name:"Salvatore del Ticio6"},
        {name:"Salvatore del Ticio7"},
        {name:"Salvatore del Ticio8"}
    ];

    var courses_people = [
        {name:"Kate Martinez1"},
        {name:"Kate Martinez2"},
        {name:"Kate Martinez3"},
        {name:"Kate Martinez4"},
        {name:"Salvatore del Ticio1"},
        {name:"Salvatore del Ticio2"},
        {name:"Salvatore del Ticio3"},
        {name:"Salvatore del Ticio4"},
        {name:"Salvatore del Ticio5"},
        {name:"Salvatore del Ticio6"},
        {name:"Salvatore del Ticio7"},
        {name:"Salvatore del Ticio8"}
    ];

    var people_search_results = all_people;


    // Drag & Drop init options
    var drag_and_drop_options = {
            selectors: {
                columns: ".dragdrop_container",
                modules: ".small_person_container"
            },
            listeners: {
                onBeginMove: function($item) {

                },

                onMove: function($item) {
                },

                afterMove: function($item, requestedPosition, movables) {
                    var $target = $(requestedPosition.element);
                    $item.attr("id", $target.attr("id") + "_" + ($target.length - 1));
                    render_document_view(current_document_view);
                }
            }
        };

    // jQuery draggable -droppable functionality - HACK
    var draggable_tree_item_options = {
        helper: "clone",
        appendTo: "body",
        zIndex: 3000
    };

    var draggable_person_options = {
        helper: "clone",
        appendTo: "body",
        zIndex: 3000,
        start: function(event, ui) {
            $(this).addClass("small_person_container_selected");
        }
    };

    var droppable_people_options = {
        drop: function(event, ui) {
            if (ui.draggable.is("a.draggable_people_group")) {
                $("#members_drag_target").append($("#document_view").children().clone());
            } else {
                $("#members_drag_target").append($("#document_view .small_person_container_selected").clone().removeClass("small_person_container_selected"));
            }
            $(".small_person_container_selected").removeClass("small_person_container_selected");
        }
    };



    // -------------------------------------------------------------------------



    // Positions drawer to a specified position (bottom, left, right)
    var position_drawer = function(target_position) {

        // Reset style or drawer
        $doc_drawer.css({left: "", right: ""});

        var current_position_method = "absolute";
        var eventlist = "scroll resize";
        if (fixed_support) {
            current_position_method = "fixed";
            eventlist = "resize";
        }

        // Get initial max available space between header and footer (fit content 100%)
        if (target_position === "bottom") {
            doc_content_height[target_position] = doc_drawer_size_bottom - (doc_header_height[target_position] + doc_footer_height[target_position]);
        } else {
            doc_content_height[target_position] = $(window).height() - (doc_header_height[target_position] + doc_footer_height[target_position]);
        }

        // Get initial drawer height
        doc_drawer_height = doc_header_height[target_position] + doc_content_height[target_position] + doc_footer_height[target_position];

        // Reset events
        $(window).unbind("scroll resize");

        // Reset extra tags
        $doc_drawer_extra_tags.hide();

        // Set position flag
        current_position = target_position;

        // Position drawer to bottom
        if (target_position === "bottom") {

            // Set up individual part sizes for layout
            $doc_drawer_header.css({height: doc_header_height[target_position] + "px"});
            $doc_drawer_content.css({height: doc_content_height[target_position] + "px"});
            $doc_drawer_footer.css({height: doc_footer_height[target_position] + "px"});

            // Position and size main drawer object
            if (fixed_support){
                $doc_drawer.css({position: current_position_method, top: ($(window).height() - doc_drawer_height) + "px", height: doc_drawer_height + "px", width: "100%"});
            } else {
                $doc_drawer.css({position: current_position_method, top: ($(window).height() + $(window).scrollTop() - doc_drawer_height) + "px", height: doc_drawer_height + "px", width: "100%"});
            }

            // Set up scroll and resize events - simulate position: fixed essentially
            $(window).bind(eventlist, function() {
                if (fixed_support){
                    $doc_drawer.css({top: ($(window).height() - doc_drawer_height) + "px", height: doc_drawer_height + "px"});
                } else {
                    $doc_drawer.css({top: ($(window).height() + $(window).scrollTop() - doc_drawer_height) + "px", height: doc_drawer_height + "px"});
                }
            });


            // My content tab adjustments
            $browser_nav.css({ width: "", height: doc_content_height[target_position] + "px", float: "left" });
            $view_options.css({ height: view_options_height[target_position] + "px" });
            $document_view.css({ height: (doc_content_height[target_position] - view_options_height[target_position]) + "px" });



            // Render default view for this orientation
            render_document_view("icon");

        }




        // Position drawer to sides
        if ((target_position === "right") || (target_position === "left")) {

            // Set up individual part sizes for layout
            $doc_drawer_header.css({height: doc_header_height[target_position] + "px"});
            $doc_drawer_content.css({height: doc_content_height[target_position] + "px"});
            $doc_drawer_footer.css({height: doc_footer_height[target_position] + "px"});

            // Position and size main drawer object
            $doc_drawer.css({position: current_position_method, top: "0px", height: doc_drawer_height + "px", width: doc_drawer_size_side + "px"});
            $doc_drawer.css(current_position, "0");

            // Set up scroll and resize events - simulate position: fixed essentially
            $(window).bind(eventlist, function() {


                if (fixed_support) {
                    doc_content_height[current_position] = $(window).height() - (doc_header_height[target_position] + doc_footer_height[target_position]);
                    doc_drawer_height = doc_header_height[target_position] + doc_content_height[target_position] + doc_footer_height[target_position];

                    $doc_drawer.css({ height: doc_drawer_height + "px"});
                    $doc_drawer_content.css({height: doc_content_height[target_position] + "px"});
                    $document_view.css({ height: (doc_content_height[target_position] - $browser_nav.height() - view_options_height[target_position]) + "px" });

                } else {
                    doc_content_height[current_position] = $(window).height() - (doc_header_height[target_position] + doc_footer_height[target_position]);
                    doc_drawer_height = doc_header_height[target_position] + doc_content_height[target_position] + doc_footer_height[target_position];

                    $doc_drawer.css({top: ($(window).scrollTop()) + "px", height: doc_drawer_height + "px"});
                    $doc_drawer_content.css({height: doc_content_height[target_position] + "px"});
                    $document_view.css({ height: (doc_content_height[target_position] - $browser_nav.height() - view_options_height[target_position]) + "px" });
                }
            });


            // My content tab adjustments

            $browser_nav.css({ width: doc_drawer_size_side + "px", height: "", float: "none" });
            $view_options.css({ height: view_options_height[target_position] + "px" });
            $document_view.css({ height: (doc_content_height[target_position] - $browser_nav.height() - view_options_height[target_position]) + "px" });


            // Render default view for this orientation
            render_document_view("list");

        }
    };


    var render_document_view = function(view) {

        // Add view type class to container
        $document_view.attr("class", "dragdrop_container");
        $(".hotspot").attr("");

        // Sort serch results
        document_search_results = sakai.util.sortObjectArrayByField(document_search_results, "name");

        // Clear document view
        $document_view.html("");

        switch (view) {

            // Render icon view
            case "icon":

                // Create the HTML now - later this will be replaced with a Trimpath render
                for (var i=0, j=people_search_results.length; i<j; i++) {
                    $document_view.append('<div id="docID_'+i+'" class="small_person_container">'+people_search_results[i]["name"]+'</div>');
                }

                // Add view class to doc view and hotspots
                $document_view.addClass("doc_item_container_icon");
                $(".hotspot").addClass("doc_item_container_icon");

                break;

            // Render list view
            case "list":
                // Create the HTML now - later this will be replaced with a Trimpath render
                for (var i=0, j=people_search_results.length; i<j; i++) {
                    $document_view.append('<div id="docID_'+i+'" class="small_person_container">'+people_search_results[i]["name"]+'</div>');
                }

                $document_view.addClass("doc_item_container_list");
                $(".hotspot").addClass("doc_item_container_list");
                break;
        }

        // Init drag & drop
        //fluid.reorderLayout ("body", drag_and_drop_options);

        // Init tree item d&d - HACK
        $(".draggable_people_group").draggable(draggable_tree_item_options);
        $(".small_person_container").draggable(draggable_person_options);
        $(".hotspot").droppable(droppable_people_options);


        // Mark current state
        current_document_view = view;

        return;
    };




    var show_extra_tags = function() {

        doc_footer_height[current_position] = doc_footer_height[current_position] + extra_bottom_space;
        position_drawer(current_position);
        $doc_drawer_extra_tags.show();
    };


    var hide_extra_tags = function() {

        doc_footer_height[current_position] = doc_footer_height[current_position] - extra_bottom_space;
        position_drawer(current_position);
        $doc_drawer_extra_tags.hide();
    };

    // Select a document list element
    var select_doc_list_element = function(id) {
        // Highlight
        $("#" + id).addClass(doc_element_selected_class);
    };

    // Select a document list element
    var deselect_doc_list_element = function(id) {
        // De- highlight
        $("#" + id).removeClass(doc_element_selected_class);
    }

    // Init function for Doc Drawer
    var init = function() {

        // See if browser has position:fixed support
        if (window.XMLHttpRequest) {
            fixed_support = true;
        }

        // Set up main Doc Drawer button click handler
        $doc_drawer_button.bind("click", function(e){

            // If visible -> hide
            if ($doc_drawer.is(":hidden")) {
                $doc_drawer.show();

            } else {
                // Else guess what...
                $doc_drawer.hide();
            }

        });


        // Set up position button click handlers
        $position_bottom_button.click(function(e){
            position_drawer("bottom");
        });

        $position_right_button.click(function(e){
            position_drawer("right");
        });

        $position_left_button.click(function(e){
            position_drawer("left");
        });



        // Position Doc Drawer to initial position
        position_drawer(current_position);



        // Set up tab click handlers
        $(".tabs a").bind("click", function() {

            var $current_tab = $(".active_tab");
            var $target_tab = $(this).parent();
            var $target_content = $("#" + $(this).parent().attr("id") + "_content");
            var $current_content = $(".active_tab_content");

            $current_tab.removeClass("active_tab");
            $target_tab.addClass("active_tab");

            $current_content.removeClass("active_tab_content");
            $target_content.addClass("active_tab_content");

            $current_content.hide();
            $target_content.show();

        });


        // Set up view button click handlers
        $("#icon_view_button").bind("click", function() {
            render_document_view("icon");
        });

        $("#list_view_button").bind("click", function() {
            render_document_view("list");
        });

        // Set up More tags view button
        $("#doc_drawer_see_more_tags_button").bind("click", function() {

            if ($doc_drawer_extra_tags.is(":visible")) {
                hide_extra_tags();
            } else {
                show_extra_tags();
            }

        });

        // Set up document view click handlers
        $(".doc_item").live("click", function() {
            if ($(this).hasClass(doc_element_selected_class)) {
                deselect_doc_list_element($(this).attr("id"));
            } else {
                select_doc_list_element($(this).attr("id"));
            }
        });

        // Set up select all click handler
        $("#select_all_button").bind("click", function(e) {
            $("#document_view .doc_item").each(function(i) {

                select_doc_list_element($(this).attr("id"));

            });
        });

        // Set up select none click handler
        $("#select_none_button").bind("click", function(e) {
            $("#document_view .doc_item").each(function(i) {

                deselect_doc_list_element($(this).attr("id"));

            });
        });

        // People groups click functionality - HACK
        $("#all_contacts_filter").bind("click", function() {
            people_search_results = all_people;
            render_document_view(current_document_view);
        });
        // People groups click functionality - HACK
        $("#courses_filter").bind("click", function() {
            people_search_results = courses_people;
            render_document_view(current_document_view);
        });
        // People groups click functionality - HACK
        $("#bio_med_filter").bind("click", function() {
            people_search_results = biomed_people;
            render_document_view(current_document_view);
        });
        // People groups click functionality - HACK
        $("#mol_bio_filter").bind("click", function() {
            people_search_results = mol_biology_people;
            render_document_view(current_document_view);
        });


        // Wire up people selection
        $(".small_person_container").live("click", function() {
            $(this).toggleClass("small_person_container_selected");
        });

    };

    // Excute init function at start
    init();

};


// General Util functions
sakai.util = {};

// Sort an array of objects by one of the object keys
sakai.util.sortObjectArrayByField = function(array, field) {
    var sort_function = function(a,b){
        if (a[field] < b[field]) {
            return -1;
        }
        if (a[field] > b[field]) {
            return 1;
        }
        return 0;
    }

    return array.sort(sort_function);
}

sdata.container.registerForLoad("sakai.doc_drawer");
