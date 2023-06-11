var table, c;
var selectedcell = false;
var dtData;
jQuery(document).ready(function($) {
	
    $(document).on( 'change', "#zzd_sort_forms", function () { 
		var val = $(this).val();	
		
		val = val == 0 ? "" : val;
		// table.column(1).data().search( val ).draw();
		// $("#wpadmin-list").DataTable().data().search( val ).draw();	
		// $(".gss_table").DataTable().column(1).data().search( val ).draw();
		$(".gss_table").DataTable().draw();
	});
	
	
	if( $('.gss_table').length > 0 ) {
		
		var not_found_message = feed = table = tbl_columns = gss_table = "";
		
		$('.gss_table').each(function() {
			
			var $this = $(this);
			
			per_page = $this.data("per_page");
			if(typeof per_page == 'undefined' || per_page == "" || ! Number.isInteger(per_page)) {
				per_page = 10;
			}
			
			not_found_message = $this.data("not_found_message");
			feed = $this.data('feed');
			table = $this.data('table');
			type = typeof $this.data('type') == 'undefined' ? 'subscriptions' : 'transactions';
			
			tbl_columns = $this.data('columns');
			
			var columnDefs = []; var columns_data = []; var i = 0;
			$.each( tbl_columns, function( column_index, column_properties ) {
				var inner_object_for_defs = {};
				var inner_object_for_data = {};
				
				inner_object_for_data.visible = true;
				inner_object_for_defs.searchable = true;
				inner_object_for_data.target = i;
				inner_object_for_data.targets = i;
				
				inner_object_for_data.className = column_index + " " + column_properties.col_class;
				
				if( typeof column_properties.col_visible != "undefined" && column_properties.col_visible == false  ) {
					inner_object_for_data.visible = false;
				}
				
				if( typeof column_properties.col_prioriry != "undefined" && column_properties.col_prioriry != ""  ) {
					inner_object_for_data.responsivePriority = column_properties.col_prioriry;
				}
				
				if( typeof column_properties.col_searchable != "undefined" && column_properties.col_searchable == "true"  ) {
					inner_object_for_data.searchable = true;
				}
				
				if( typeof column_properties.col_key != "undefined" ) {					
					inner_object_for_data.data = column_properties.col_key;					
				}
				
				
				//columnDefs[i] = inner_object_for_defs;
				columns_data[i] = inner_object_for_data;
				i++;
			});
			
			dtData = {
				"responsive": true,
				"pageLength": per_page,
				"order": [[ 0, "desc" ]],
				"ordering": false, "info": false, "bInfo": false, "bLengthChange": false,
				"searching": true,
				"bFilter": false,
				"language": { "emptyTable": not_found_message },	
				"columnDefs" : columns_data,
				"columns" : columns_data,
				"aoColumns" : columns_data,
				"processing": true,
				"serverSide": true,
				"ajax":{	
					url: gss_variables.admin_url,
					data: function(d) {
						d.action = "get_subscription_rows";
						d.table = table;
						d.type = type;
						d.feed = $("#zzd_sort_forms").length ? $("#zzd_sort_forms").val() : feed;
					},
					type:"POST",					
				},
				"createdRow": function( row, data, dataIndex ) {
					
					var tdClass = data.gss_status;
					$(row).find(".status").addClass(tdClass);
					$(row).addClass('gss_item');
				}
			};
			gss_table = $this.DataTable(dtData);
			
		});
	}
	
	if( $('.gss_table_no_ajax').length > 0 ) {
		
		var not_found_message = feed = table = columns = gss_table_no_ajax = "";
		
		$('.gss_table_no_ajax').each(function() {
			
			var $this = $(this);
			
			per_page = $this.data("per_page");
			if(typeof per_page == 'undefined' || per_page == "" || ! Number.isInteger(per_page)) {
				per_page = 10;
			}
			
			not_found_message = $this.data("not_found_message");
			feed = $this.data('feed');
			table = $this.data('table');
			type = typeof $this.data('type') == 'undefined' ? 'subscriptions' : 'transactions';
			
			columns = $this.data('columns');
			
			var columnDefs = []; var columns_data = []; var i = 0;
			$.each( columns, function( column_index, column_properties ) {
				var inner_object_for_defs = {};
				var inner_object_for_data = {};
				
				inner_object_for_data.visible = true;
				inner_object_for_defs.searchable = true;
				inner_object_for_data.target = i;
				inner_object_for_data.targets = i;
				
				inner_object_for_data.className = column_index + " " + column_properties.col_class;
				
				if( typeof column_properties.col_visible != "undefined" && column_properties.col_visible == false  ) {
					inner_object_for_data.visible = false;
				}
				
				if( typeof column_properties.col_prioriry != "undefined" && column_properties.col_prioriry != ""  ) {
					inner_object_for_data.responsivePriority = column_properties.col_prioriry;
				}
				
				if( typeof column_properties.col_searchable != "undefined" && column_properties.col_searchable == "true"  ) {
					//inner_object_for_data.searchable = true;
				}
				
				if( typeof column_properties.col_key != "undefined" ) {					
					inner_object_for_data.data = column_properties.col_key;					
				}
				
				if( column_index != "gss_action" ) {
					inner_object_for_data.searchable = true;
				}
				else {
					inner_object_for_data.searchable = false;
				}
				//columnDefs[i] = inner_object_for_defs;
				columns_data[i] = inner_object_for_data;
				i++;
			});
			
			dtData = {
				"responsive": true,
				"pageLength": 20,
				"order": [[ 0, "desc" ]],
				"ordering": false, "info": false, "bInfo": false, "bLengthChange": false,
				"searching": true,
				"bFilter": false,
				"language": { "emptyTable": not_found_message },	
				"columnDefs" : columns_data,
				"columns" : columns_data,
				"aoColumns" : columns_data,
				"processing": false,
				"serverSide": false,
				/*"ajax":{	
					url: gss_variables.admin_url,
					data:{
						action: "get_subscription_rows",
						table: table,
						feed: $("#zzd_sort_forms").val()
					},
					type:"POST",					
				},
				"createdRow": function( row, data, dataIndex ) {
					
					var tdClass = data.gss_status;
					$(row).find(".status").addClass(tdClass);
					$(row).addClass('gss_item');
				}*/
			};
			
			gss_table_no_ajax = $this.DataTable(dtData);
			
		});
	}
	
	
	$(document).on("click", '.dropdown', function(){
		if($(this).find(".dropdown-content").hasClass("show")) {
			$(this).find(".dropdown-content").removeClass("show");
		}
		else {
			$(".dropdown-content").removeClass("show");
			$(this).find(".dropdown-content").addClass("show");
		}
	});
	
	
	$(document).on("click", '#gss-notice .notice-dismiss', function(){ 
		var notice_id = $( this ).parents('#gss-notice').attr( 'id' ) || '';
		$.ajax({
			url: gss_variables.admin_url,
			type: 'POST',
			data: {
				action            : 'gss-notice-dismiss',
				notice_id         : notice_id,
			},
		});
	});
	
	
	if( $("#toplevel_page_gf_edit_forms .manage-gravity-forms-stripe-subscriptions.pricing.upgrade-mode").length > 0) {
		$("#toplevel_page_gf_edit_forms .manage-gravity-forms-stripe-subscriptions.pricing.upgrade-mode").parent().attr("href", "https://gravitystripe.com").attr("target", "_blank");
	}
	
	
	if( $("#toplevel_page_gf_edit_forms .manage-gravity-forms-stripe-subscriptions.addons").length > 0) {
		$("#toplevel_page_gf_edit_forms .manage-gravity-forms-stripe-subscriptions.addons").parent().attr("href", "https://www.gravitystripe.com/add-ons").attr("target", "_blank");
	}
	
	
	if( $("#gaddon-setting-row-fail_count").length > 0 ) {
		
		if( $("#enable_cancel_fail:checked").val() == "on" ) {
			$("#gaddon-setting-row-fail_count").show();
		}
		else {
			$("#gaddon-setting-row-fail_count").hide();
		}		
	}
	
	
	$(document).on("change", "#enable_cancel_fail", function() {
		var v = $(this).prop("checked");
		if( v == true ) {
			$("#gaddon-setting-row-fail_count").show();
		}
		else {
			$("#gaddon-setting-row-fail_count").hide();
		}
	});
	
	
	if( $("#gaddon-setting-row-upgrade_subscription_page").length > 0 ) {
		
		if( $("#enable_subscription_upgrade:checked").val() == "on" ) {
			$("#gaddon-setting-row-upgrade_subscription_page").show();
		}
		else {
			$("#gaddon-setting-row-upgrade_subscription_page").hide();
		}		
	}
	
	
	$(document).on("change", "#enable_subscription_upgrade", function() {
		var v = $(this).prop("checked");
		if( v == true ) {
			$("#gaddon-setting-row-upgrade_subscription_page").show();
		}
		else {
			$("#gaddon-setting-row-upgrade_subscription_page").hide();
		}
	});
	
	
	if( $("#gaddon-setting-row-downgrade_subscription_page").length > 0 ) {
		
		if( $("#enable_subscription_downgrade:checked").val() == "on" ) {
			$("#gaddon-setting-row-downgrade_subscription_page").show();
		}
		else {
			$("#gaddon-setting-row-downgrade_subscription_page").hide();
		}		
	}
	
	
	$(document).on("change", "#enable_subscription_downgrade", function() {
		var v = $(this).prop("checked");
		if( v == true ) {
			$("#gaddon-setting-row-downgrade_subscription_page").show();
		}
		else {
			$("#gaddon-setting-row-downgrade_subscription_page").hide();
		}
	});
	
	
	if( $("#gaddon-setting-row-downgrade_role").length > 0 ) {
		
		if( $("#enable_downgrade:checked").val() == "on" ) {
			$("#gaddon-setting-row-downgrade_role").show();
		}
		else {
			$("#gaddon-setting-row-downgrade_role").hide();
		}		
	}
	
	
	$(document).on("change", "#enable_downgrade", function() {
		var v = $(this).prop("checked");
		if( v == true ) {
			$("#gaddon-setting-row-downgrade_role").show();
		}
		else {
			$("#gaddon-setting-row-downgrade_role").hide();
		}
	});
	
	
	if( $("#gaddon-setting-row-cancel_ability").length > 0 ) {
		
		var v = $("#cancel_ability").val();
		if( v == "contact_admin" ) {			
			$("#gaddon-setting-row-redirection_page").show();
		}
		else {
			$("#gaddon-setting-row-redirection_page").hide();
		}	
	}
	
	
	$(document).on("change", "#cancel_ability", function() {
		var v = $(this).val();
		if( v == "contact_admin" ) {			
			$("#gaddon-setting-row-redirection_page").show();
		}
		else {
			$("#gaddon-setting-row-redirection_page").hide();
		}
	});
	
	
	$(document).mouseup(function(e) {
		var container = $(".dropdown");

		// if the target of the click isn't the container nor a descendant of the container
		if ( ! container.is(e.target) && container.has(e.target).length == 0) {
			$(".dropdown-content").removeClass("show");
		}
	});
	
	
	$(document).on("click", '.cc_info_change_link', function(){
		/*$("#gss_existing_card span").hide();
		$("#gssModalCCUpdate").modal();
		$("#gss_entry_id").val($(this).data('eid'));
		$("#gss_field_key").val($(this).data('field_key'));
		current_card = $(this).data('current_card');
		if( typeof current_card != "undefined" && current_card != "" ) {
			current_card = gss_add_space(current_card);
			$("#gss_existing_card span").html(current_card).show();
		}
		
		$("#gss_response_msg").html("");*/
	});
	
	
	$(document).on("click", '.refund_link', function(){
		
		var $this = $(this); c = false;
		
		if( confirm(gss_variables.confirm_refund) ) { 			
			
			gss_fn_do_refund($this);
			
		}
		
		
	});
	
	
	if( $("#gss_update_cc").length > 0 ) {
		
		var cardNumber = $('#gss_cardNumber');
		var cardNumberField = $('#gss_card-number-field');
		var CVV = $("#gss_cvv");
		var confirmButton = $('#gss_confirm-purchase');
	
		cardNumber.payform('formatCardNumber');
		CVV.payform('formatCardCVC');


		cardNumber.keyup(function() {

		   
			if ($.payform.validateCardNumber(cardNumber.val()) == false) {
				cardNumberField.addClass('has-error');
			} else {
				cardNumberField.removeClass('has-error');
				cardNumberField.addClass('has-success');
			}
			
			if ($.payform.validateCardCVC(CVV.val()) == false) {
				CVV.parent().addClass('has-error');
			} else {
				CVV.parent().removeClass('has-error');
				CVV.parent().addClass('has-success');
			}
			
			
		});

		confirmButton.click(function(e) {

			e.preventDefault();

			var isCardValid = $.payform.validateCardNumber(cardNumber.val());
			var isCvvValid = $.payform.validateCardCVC(CVV.val());

			if (!isCardValid) {
				alert(gss_variables.wrong_card);
			} else if (!isCvvValid) {
				alert(gss_variables.wrong_cvv);
			} else if ($("#gss_exp_month").val() == "" ) {
				alert(gss_variables.select_expiry_month);
			} else if ($("#gss_exp_year").val() == "" ) {
				alert(gss_variables.select_expiry_year);
			} else {
				var data = {
					action: 'gss_do_cc_update',
					eid: $("#gss_entry_id").val(),
					gss_cc_number: $("#gss_cardNumber").val(),
					gss_exp_month: $("#gss_exp_month").val(),
					gss_exp_year: $("#gss_exp_year").val(),
					gss_cvv: $("#gss_cvv").val(),
					gss_field_key: $("#gss_field_key").val(),
				};
				$("#gss_response_msg").html(gss_variables.please_wait_dots);
				$("#gss_confirm-purchase").attr("disabled", "disabled");
				$.post(gss_variables.admin_url, data, function(response) {
					if( response == 1 ) {
						alert(gss_variables.card_updated);
						$("#gss_confirm-purchase").removeAttr("disabled");
						$("#gss_card-number-field").parent().trigger("reset");
						$("#gssModalCCUpdate").modal('hide');
						$("#gss_existing_card span").html("");
						location.reload(true);
					}
					else {
						$("#gss_response_msg").html(response);
						$("#gss_confirm-purchase").removeAttr("disabled");
						$("#gss_existing_card span").html("");
					}
				});
			}
		});
		
		
	}
		
	
	$(document).on("click", '.cancel_subscription', function(){
		
		var $this = $(this); 
		c = false;
		var go = cancel_at_end = false;
		
		if( $( "#cancelSelectionDialog" ).length > 0 && gss_variables.gss_is_admin == 1 ) {			
			/*$( "#dialog-confirm" ).dialog({
				resizable: false,
				height: "auto",
				width: 400,
				modal: true,
				buttons: {
					"Yes": function() {
						var $force = 0;
						if( $("input[name=gss_cancel_at_end]:checked").val() == 1 ) {
							$force = 1;
						}
						process_cancellation($this, $force);
						$( this ).dialog( "close" );
					},
					"Cancel": function() {
						$( this ).dialog( "close" );
					}
				}
			});*/
			
			$("#cancelSelectionDialog").modal();
			selectedcell = $this;
		}
		else {
			if( confirm(gss_variables.confirm_cancel) ) { 			
				process_cancellation($this, 0);
			}
		}
		
	});
	
		
	$('#cancelSelectionDialog').on('hidden.bs.modal', function () {
		selectedcell = false;
	});
	
	
	$(document).on("click", '.cancel_subscription_admin', function(){
		
		if( selectedcell && typeof selectedcell == "object" ) {
			var $force = 0;
			if( $("input[name=gss_cancel_at_end]:checked").val() == 1 ) {
				$force = 1;
			}
			
			process_cancellation(selectedcell, $force);
			$("#cancelSelectionDialog").modal('hide');
			selectedcell = false;
		}
	});
	
	function process_cancellation($this, $option = false ) {
		
			
		if( $this.hasClass("cancelled") ) {
			return;
		}
		
		var $status_col = $this.parents(".gss_item").find(".status");
		var $status_col2 = $this.parents("tr.child").find(".status");
		var $status_col3 = $this.parents("tr.child").prev().find(".status");
		
		var $parents = $this.parents(".gss_item");
		var $parent = $this.parent();
		//$parent.html("Please wait...");
		
		var data = {
			action: 'gss_cancel_subscription',
			eid: $this.attr('data-eid'),
			
		};
		
		if( gss_variables.gss_is_admin == 1 ) {
			data.cancel_opion = $option
		}
		
		$parents.find(".loader-image").addClass("show");
		$parent.find(".loader-image").addClass("show");
		
		
		jQuery.post(gss_variables.admin_url, data, function(response) {
			jQuery(".resp").html(response);
			if( response == 1 ) {
				$parent.html("");
				$status_col.html(gss_variables.canceled_label).addClass("cancelled").removeClass("active");
				$status_col2.html(gss_variables.canceled_label).addClass("cancelled").removeClass("active");
				$status_col3.html(gss_variables.canceled_label).addClass("cancelled").removeClass("active");
				$parents.find('td.action').html('');
			}
			else if( response != 0 ) {
				$parent.html("");
				$status_col.html(response).addClass("cancelled").removeClass("active");
				$status_col2.html(response).addClass("cancelled").removeClass("active");
				$status_col3.html(response).addClass("cancelled").removeClass("active");
				$parents.find('td.action').html('');
			}
			jQuery(".loader-image").removeClass("show");
		});
	}
	
	
	function gss_fn_do_refund($this) {
	
		var $status_col = $this.parents(".gss_item").find(".status");
		var $parent = $this.parent();
		//$parent.html("Please wait...");
		
		var data = {
			action: 'gss_do_refund',
			eid: $this.attr('data-eid'),
			cancel_at_end : 0
		};
		var $parents = $this.parents(".gss_item");
		$parents.find(".loader-image").addClass("show");
		
		$.post(gss_variables.admin_url, data, function(response) {
			if( response == 1 ) {
				$parent.html("");
				$status_col.html(gss_variables.refunded_cancelled_label).addClass("refund").removeClass("active").removeClass("cancelled");
				$parents.find('td.action').html('');
			}
			$(".loader-image").removeClass("show");
		});
	}

	
	function gss_add_space (ele) {
		ele = ele.split(' ').join('');    // Remove dash (-) if mistakenly entered.

		var finalVal = ele.match(/.{1,4}/g).join(' ');
		return finalVal;
	}
	
	
	
	
	/* NEW VERSION HIDE SHOW */
	
	setTimeout( function(){
		show_hide_management();
	}, 250 );
	
	function show_hide_management() {
		if( $("#enable_cancel_fail").length > 0 ) {
			if( jQuery("#enable_cancel_fail:checked").val() == "on" ) {
				$("#gaddon-setting-row-fail_count").show();
				$("#gform_setting_fail_count").show();
			}
			else {
				$("#gaddon-setting-row-fail_count").hide();
				$("#gform_setting_fail_count").hide();
			}		
		}
		
		jQuery("#enable_cancel_fail").change(function() {
			var v = jQuery(this).prop("checked");
			if( v == true ) {
				$("#gaddon-setting-row-fail_count").show();
				$("#gform_setting_fail_count").show();
			}
			else {
				$("#gaddon-setting-row-fail_count").hide();
				$("#gform_setting_fail_count").hide();
			}
		});
		
		if( $("#enable_subscription_upgrade").length > 0 ) {
			
			if( jQuery("#enable_subscription_upgrade:checked").val() == "on" ) {
				$("#gaddon-setting-row-upgrade_subscription_page").show();
				$("#gform_setting_upgrade_subscription_page").show();
			}
			else {
				$("#gaddon-setting-row-upgrade_subscription_page").hide();
				$("#gform_setting_upgrade_subscription_page").hide();
			}		
		}
		
		jQuery("#enable_subscription_upgrade").change(function() {
			var v = jQuery(this).prop("checked");
			if( v == true ) {
				$("#gaddon-setting-row-upgrade_subscription_page").show();
				$("#gform_setting_upgrade_subscription_page").show();
			}
			else {
				$("#gaddon-setting-row-upgrade_subscription_page").hide();
				$("#gform_setting_upgrade_subscription_page").hide();
			}
		});
		
		if( $("#enable_subscription_downgrade").length > 0 ) {
			
			if( jQuery("#enable_subscription_downgrade:checked").val() == "on" ) {
				$("#gaddon-setting-row-downgrade_subscription_page").show();
				$("#gform_setting_downgrade_subscription_page").show();
			}
			else {
				$("#gaddon-setting-row-downgrade_subscription_page").hide();
				$("#gform_setting_downgrade_subscription_page").hide();
			}		
		}
		
		jQuery("#enable_subscription_downgrade").change(function() {
			var v = jQuery(this).prop("checked");
			if( v == true ) {
				$("#gaddon-setting-row-downgrade_subscription_page").show();
				$("#gform_setting_downgrade_subscription_page").show();
			}
			else {
				$("#gaddon-setting-row-downgrade_subscription_page").hide();
				$("#gform_setting_downgrade_subscription_page").hide();
			}
		});
		
		if( $("#enable_downgrade").length > 0 ) {
			
			if( jQuery("#enable_downgrade:checked").val() == "on" ) {
				$("#gaddon-setting-row-downgrade_role").show();
				$("#gform_setting_downgrade_role").show();
			}
			else {
				$("#gaddon-setting-row-downgrade_role").hide();
				$("#gform_setting_downgrade_role").hide();
			}		
		}
		
		jQuery("#enable_downgrade").change(function() {
			var v = jQuery(this).prop("checked");
			if( v == true ) {
				$("#gaddon-setting-row-downgrade_role").show();
				$("#gform_setting_downgrade_role").show();
			}
			else {
				$("#gaddon-setting-row-downgrade_role").hide();
				$("#gform_setting_downgrade_role").hide();
			}
		});
		
		if( $("#cancel_ability").length > 0 ) {
			
			var v = $("#cancel_ability").val();
			if( v == "contact_admin" ) {			
				$("#gaddon-setting-row-redirection_page").show();
				$("#gform_setting_redirection_page").show();
			}
			else {
				$("#gaddon-setting-row-redirection_page").hide();
				$("#gform_setting_redirection_page").hide();
			}	
		}
		jQuery("#cancel_ability").change(function() {
			var v = jQuery(this).val();
			if( v == "contact_admin" ) {			
				$("#gaddon-setting-row-redirection_page").show();
				$("#gform_setting_redirection_page").show();
			}
			else {
				$("#gaddon-setting-row-redirection_page").hide();
				$("#gform_setting_redirection_page").hide();
			}
		});
		/*if( $("#gaddon-setting-row-enable_cancellation").length > 0 ) {
			
			if( jQuery("#enable_cancellation:checked").val() == "on" ) {
				$("#gaddon-setting-row-cancel_type").show();
				
				if( jQuery("#cancel_type").val() == "redirect_link" ) {
					$("#gaddon-setting-row-redirection_page").show();
				}
				else {
					$("#gaddon-setting-row-redirection_page").hide();
				}
			}
			else {
				$("#gaddon-setting-row-cancel_type").hide();
				$("#gaddon-setting-row-redirection_page").hide();
			}		
		}
		jQuery("#enable_cancellation").change(function() {
			var v = jQuery(this).prop("checked");
			if( v == true ) {
				$("#gaddon-setting-row-cancel_type").show();
			}
			else {
				$("#gaddon-setting-row-cancel_type").hide();
				$("#gaddon-setting-row-redirection_page").hide();
			}
		});
		jQuery("#cancel_type").change(function() {
			var v = jQuery(this).val();
			if( v == "redirect_link" ) {			
				$("#gaddon-setting-row-redirection_page").show();
			}
			else {
				$("#gaddon-setting-row-redirection_page").hide();
			}
		});*/
	}
	
	
	
	
	
	
} );


jQuery(document).ready(function($) {
	
		
	$('.assign_user').click(function(e) {
		
		e.preventDefault();
		
		var form = $(this).parents("#user-list");
		var entry_id = form.find(".entry_id").val();
		var assign_created_by = form.find(".assign_created_by").val();
		
		jQuery.ajax({
			'url':ajaxurl,
			'type':'POST',
			'data':{
				'entry_id':entry_id,
				'assign_created_by':assign_created_by,
				'action':'save_created_by'
			},
			success:function(results){
				if ( results == 1 ) {
					window.location.reload();
				}
			}
		});
	});

	
});