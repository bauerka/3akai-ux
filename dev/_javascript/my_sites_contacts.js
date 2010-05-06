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

/*global $, Config, History, Querystring, sdata, sakai, jQuery */
var sakai = sakai || {};

sakai.my_sites_contacts = function(){
	$(".my_sites_list li").hover(function(e){
		$(this).css("background-color", "#f0f8ff");
		$(".my_sites_list_dropdown", this).css("left", $(this).offset().left - 10 + $(this).width());
		$(".my_sites_list_dropdown", this).css("top", $(this).offset().top + 5);
		$(".my_sites_list_dropdown", this).show();
	}, function(e){
		if (!$("#my_sites_list_dropdown").is(":visible")) {
			$(this).css("background-color", "#fff");
			$(".my_sites_list_dropdown", this).hide();
		}
	});
	
	$(".my_sites_list_dropdown").live("click", function(){
		
		if(!$("#my_sites_list_dropdown_menu").is(":visible")){
			$("#my_sites_list_dropdown_menu").show();
			$("#my_sites_list_dropdown_menu").css("left", $(this).offset().left - 80);
			$("#my_sites_list_dropdown_menu").css("top", $(this).offset().top + 20);
		} else {
			$("#my_sites_list_dropdown_menu").hide();
		}
	});
};
sdata.container.registerForLoad("sakai.my_sites_contacts");