jQuery(document).ready(function(){
  

var triggerUrl = "http://your.web.site.url/page_slug";
var triggerUrl2 = "http://your.web.site.url/some_another_page";
// var triggerUrl3 = ...
// ...

jQuery(document).ajaxStart(function(){
	jQuery("#ajaxloadergif").show();
});

jQuery(document).ajaxStop(function(){
	jQuery("#ajaxloadergif").hide();
});

/**
* 
* A click on certain trigger url builds dialog boxes and appends it to html body
*/
jQuery("a").click(function(e){

	
	var anchorHref = jQuery(this).attr('href');

	if(anchorHref == triggerUrl || anchorHref == triggerUrl2)
	{
		
		e.preventDefault();
		

		var formTitle = "Access to your awsome product";
		var pitchLine = "Teaser text of your choice eg.:(Enter your e-mail address and start using our product. <br>We will not use your e-mail for anything else but to send you access data.)";
		var buttonPitch = "Send";

		jQuery('body').append('<div id="dialog"  title="'+formTitle+'"><br /><p>'+pitchLine+'</p><div id="form-errors" style="color:#ff0000;font-size:14px;"></div><form id="user-input-form"><label>E-mail: <input type="text" name="emailaddress"></label>&nbsp;<img src="'+dmof_script_vars.pluginDir+'/dmOptinForm/img/ajax-loader.gif" id="ajaxloadergif" style="display:none;"><br /><br /><label>Enter result: <img src="'+dmof_script_vars.pluginDir+'/dmOptinForm/img/cptchimg.php" id="caimg">&nbsp;<input type="text" name="captchaentry" style="width:25px;"></label><br /><br /><input type="button" id="submitbutton" value="'+buttonPitch+'"></form><br /><br /></div>');
		jQuery("#dialog").dialog({height:450,width:450,maxHeight:450, maxWidth:450, modal:true});

		jQuery('body').append('<div id="thankyou-dialog" style="display:none;" title="Thank you"><p>Success message eg.:(Access data has been sent to you e-mail address)</p><button id="closebutton">Close</button></div>');
		
		jQuery("#submitbutton").button();

		jQuery("#thankyou-dialog").dialog({height:200,width:300,maxHeight:200, maxWidth:300, autoOpen:false});
		jQuery("#closebutton").button();

		refreshCaptcha();
		
	}
	
	});


/**
*   
*	Delegates click events to a "Send" button which submits the form by using ajax.
*/
jQuery('body').on('click','#submitbutton',function(){

	
	var userEmail = jQuery("input[name=emailaddress]").val();
	var captchaEntry = jQuery("input[name=captchaentry]").val();
	// ajax ...

	// remove form error messagges and red borders if any
	jQuery("#form-errors").html('');
	jQuery("input[name=emailaddress]").css({'border-style':'solid','border-width':'1px','border-color':'#bbb'});
	jQuery("input[name=captchaentry]").css({'border-style':'solid','border-width':'1px','border-color':'#bbb'});
	

	var postData = {action:'dmof_optinform_handle_ajax_request', user_email:userEmail, captcha_entry:captchaEntry};



	jQuery.post( 'http://your.web.site.url/wp-admin/admin-ajax.php',
		postData, function(responseData){
		
		

		var d = new Date();
		jQuery("#caimg").attr('src',dmof_script_vars.pluginDir+'/dmOptinForm/img/cptchimg.php?'+d.getMilliseconds());
		
		if(responseData['email']!=undefined || responseData['captcha']!=undefined)
		{
			if(responseData['email'])
			{
				jQuery("input[name=emailaddress]").css({'border-style':'solid','border-width':'2px','border-color':'#ff0000'});
				jQuery("#form-errors").append(responseData['email']+'<br />');
			}

			if(responseData['captcha'])
			{
				jQuery("input[name=captchaentry]").css({'border-style':'solid','border-width':'2px','border-color':'#ff0000'});
				jQuery("#form-errors").append(responseData['captcha']+'<br />');
			}
			refreshCaptcha();
		}
		else
		{
			// close dialog
				jQuery("#dialog").remove();

				// show another dialog
				jQuery("#thankyou-dialog").dialog('open');
				jQuery("#thankyou-dialog").show();
		}

			
		},"json");
	
	});

/**
*  Closure. Refreshes session varijables.
*
*/
var refreshCaptcha = function(){
	jQuery.ajax({
			url: 'http://your.web.site.url/wp-admin/admin-ajax.php',
			type: 'POST',
			async: false,
			data: {action:'dmof_refresh_captcha'},
			success: function(data){
         		
			}});
		var d = new Date();
		jQuery("#caimg").attr('src',dmof_script_vars.pluginDir+'/dmOptinForm/img/cptchimg.php?'+d.getMilliseconds());
	
}


/**
* Delegates click event to "Close" dialog button
*/
jQuery('body').on('click','#closebutton',function(){

	var thankYouDialog = jQuery.find("#thankyou-dialog");

	jQuery(thankYouDialog).remove();

	});

/**
* Delegates close event to main dialog box
*/
jQuery('body').on('dialogclose','#dialog',function(){

	var mainDialog = jQuery.find("#dialog");

	jQuery(mainDialog).remove();

	});


});