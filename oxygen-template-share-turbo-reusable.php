<!-- share dashboard REUSABLE TURBO -->$_COOKIE

<script>
<?php 
	$roles = wp_get_current_user()->roles; 
	$user_id = get_current_user_id();
	$central_user = get_billing_user();
	$share_method = get_user_meta($central_user,'google_sharing_preference',true);
	$google_group = get_user_meta($central_user,'google_group_email',true);
	$google_account = wp_get_current_user()->user_email;
	
	global $wpdb;
	$meta_key = 'GHC_team';
	$meta_value = get_user_meta($central_user,'GHC_ID',true);

	$user_emails = $wpdb->get_col(
		$wpdb->prepare("
			SELECT u.user_email
			FROM {$wpdb->prefix}users AS u
			INNER JOIN {$wpdb->prefix}usermeta AS um ON u.ID = um.user_id
			WHERE um.meta_key = %s AND um.meta_value = %s
		", $meta_key, $meta_value)
	);
	
	
	$partialMetaKey = 'share_dashboards_';

    // Define the meta value to match
    $metaValue = get_user_meta($user_id,'GHC_ID',true);

    // Get all user meta data for the specified user
    $user_meta = get_user_meta($user_id);

    // Initialize a counter
    $dashboardCount = 0;
	
    if (isset($google_group)) {
    	echo 'googleGroupEmail = "' . $google_group . '"';
	}
	
	//Save google group email
	if (isset($_GET['google_group'])) {
		update_user_meta($central_user,'google_group_email',$_GET['google_group']);
		update_user_meta($central_user,'google_sharing_preference','google_group');

		$google_group = get_user_meta($central_user,'google_group_email',true);
		
		
		/* code below here removes php error caused by update_user_meta function */
		// Get the current URL
		$current_url = $_SERVER['REQUEST_URI'];

		// URL parameters to remove
		$parameter_to_remove = 'google_group';

		// Parse the query string
		parse_str(parse_url($current_url, PHP_URL_QUERY), $query_params);

		// Remove the specific parameter from the parsed query parameters
		if (isset($query_params[$parameter_to_remove])) {
			
	    }
        // Reconstruct the query string without the removed parameter
        $new_query_string = http_build_query($query_params);

        // Create the new URL
        $new_url = strtok($current_url, '?') . '?' . $new_query_string;

        // Redirect to the new URL
        header('Location: ' . $new_url);
        exit();

        }




?>


const userRoles = <?php echo json_encode($roles); ?>; //team_billing, team_member, team_admin

console.log(userRoles)
let userCHMS = "elvanto_user";

if (userRoles.includes("pco_user")) {
	userCHMS = "pco_user"
}
if (userRoles.includes("ccb_user")) {
	userCHMS = "ccb_user"
}
if (userRoles.includes("fluro_user")) {
	userCHMS = "fluro_user"
}


let userSubscription = "free" // free, small, medium, large

<?php if (returnSubscriptionAccess('medium')) {
	echo 'userSubscription = "medium"';
} ?>

<?php if (returnSubscriptionAccess('large')) {
	echo 'userSubscription = "large"';
} ?>

let googleGroup = <?php echo '"' . $share_method . '"'; ?>

console.log(googleGroupEmail)
</script>

<div class="container">
	
    <div class="intro-content">
		<h1 class="project-name">
    <?php

	$title = get_field('display_title');

	if (empty($title)) {
		echo get_the_title();
	} else {
		echo $title;
	}
	

?>
	</h1>
		
               <p>If you have already copied and shared your dashboard paste its url into the form below. Otherwise follow the instructions to generate your link.</p>
        <p>Since dashboards permissions are connected to your google account <strong>you won’t be able to share dashboards without creating a copy first.</strong></p>

        <form class="sharelink-form" action="myGHC" method="get">
            <select name="share_post_id" class="dashboard-select">
                <!-- generated from JS -->
            </select>
			<input type="hidden" name="share_name" value="" />
			<input type="hidden" name="is_turbo" value="true" />
            <input required name="share_url" type="text" class="wide dashboard-paste" placeholder="https://lookerstudio.google.com/u/0/reporting/8a910ffd-96fa/page/KfARB"  />
            <button type="submit" class="button">Save link</button>
        </form>
        <div class="callout callout-warning pasted-alert" style="display: none">
            <p><span class="dashicons dashicons-remove"></span>This is the master dashboard link. You cannot use this link.</p>
        </div>
        <div class="callout callout-info">
            <p><span class="dashicons dashicons-info"></span>We recommend splitting your screen in half so you can work through these instructions alongside your Looker Studio dashboard.</p>
        </div>
         <div class="callout callout-attention" id="shortcut-step" style="display: none">
            <p><span class="dashicons dashicons-warning"></span>Hey! It looks like you've already created a shared dashboard so we've skipped over the setup for you. If you need to review these again please expand steps 1 and 2.</p>
        </div>
        <div class="callout callout-attention" id="shortcut-step2" style="display: none">
            <p><span class="dashicons dashicons-warning"></span>Hey! It looks like you've already created reusable data sources for another turbo dashboard so we've skipped over these steps for you. If you need to review these again please expand steps 3 and 4.</p>
        </div>
    </div>

		<div id="timeline">
            <div class="timeline-item" id="step1">
				<div class="timeline-icon">1</div>
				<div class="timeline-content">
					<h2>Before you begin</h2>
					    <div class="timeline-content-inner">
                            <div class="callout callout-info">
                                <p><span class="dashicons dashicons-info"></span>You will need to ensure that you are logged into the correct google account.</p>
                                <p>The google account we have on file associated with your GHC dashboards is: <strong><?php echo($google_account); ?></strong></p>
                            </div>
                            <p>Then you will needed to decide  which sharing option is right for you. There are 3 methods to set who can see your dashboards:</p>
                        <ol>
                            <li>
                                <strong>Via a google group</strong><br/>
                                This is the most powerful and flexible but requires some additional setup. We recommend this method of sharing. If a team member needs their access revoked you can do this simply without having to edit each dashboard's share settings separately.
                            </li>
                            <li><strong>Within the same domain</strong><br/>
                                This option is only available for google enterprise email addresses. Choose this if all emails have the same company email address hosted by google e.g. jai@mycompany.com, emma@mycompany.com. 
                            </li>
                            <li><strong>Add individual emails</strong><br/>
                                This option is available for everyone but it has the least control and visibility.
                            </li>
                        </ol>
                        <div class="callout callout-info" id="googlegroupInfo0" style="display: none">
                            <p><span class="dashicons dashicons-info"></span>The google group we have saved for you is: <strong><?php echo $google_group; ?></strong></p>
                        </div>
                        <form class="sharelink-form standalone-field">
                            <!-- Jumps user to correct step -->
                            <select id="share-select">
                                <option value="google">Create a google group</option>
                                <option value="already-google">I already have a google group</option>
                                <option value="other-method">I'm using another sharing method</option>
                            </select>
                        </form>
					        <a href="#" class="btn done-btn" data-step="1" id="step-decision">✓ Next</a>
                        </div>
				</div>
                <div class="timeline-help">
                    <h3>Help</h3>
                    <p><a class="modal-link" href="#" data-help="0">I get an authorization required error</a></p>
                    <p><a class="modal-link" href="#" data-help="1">I get a "complete your account setup" prompt</a></p>
                    
                </div>
			</div>
			<div class="timeline-item closed" id="step2">
				<div class="timeline-icon">2</div>
				<div class="timeline-content">
					<h2>Create a google group for sharing</h2>
					    <div class="timeline-content-inner">
                            <p>This is the most powerful and flexible way of managing permissions in your dashboards. Skip this step if you are not planning to use a google group to share your dashboards or have already created one. </p>
                            <a href="#" class="btn skip-btn" data-step="2">Skip step</a>
                            <ul>
                                <li>First go to <a href="https://groups.google.com" target="_blank">https://groups.google.com</a></li>
                                <li>Click <strong>Create Group</strong> (top left)</li>
                                <li><strong>Name your group</strong>, this will automatically generate an email. <br/>The email must be a unique address, so you may need to add some extra characters to this field otherwise you'll get an error when you try to go to the next step. 
                                    <div class="callout callout-attention">
                                        <p><span class="dashicons dashicons-warning"></span>If you’re on a google domain account be sure to select a googlegroups.com domain rather than your particular church domain.
                                            </p>
                                    </div>
                                    
                                </li>
                                <li><strong>Copy your group email address</strong>. Click Next.</li>
                                <li>Leave <strong>default privacy</strong> settings. Click Next.</li>
                                <li>Leave the Add members <strong>screen blank</strong> (we will do this later). Click Create group</li>
                            </ul>
                            <p>The group you’ve created should now appear in your list.</p>
                            <ul>
                                <li>Click the small <strong>“Add members" icon</strong>, a new dialog box should appear.</li>
                                <li> <strong>Toggle “Directly add members”</strong> to on but leave the invitation field blank</li>
                                <li><strong>Paste each email address</strong> into the group members text field. Click Add members. </li>
                            </ul>
                            <p>Your google group has now been created.</p>
                            <form action="#step3">
                                <input type="hidden" name="share_post_id" value="" />
                                <input name="google_group" type="email" required class="wide" placeholder="myuniquename@googlegroups.com" />
                                <input type="hidden" name="step" value="3" />
                                <button type="submit" class="button">Save google group</button>
                                <a href="#" class="btn skip-btn" data-step="2">Skip step</a>
                            </form>


                        </div>
				</div>
                <div class="timeline-help">
                    <h3>Help</h3>
                    
                    <h4>Creating a google group</h4>
                    <iframe width="260" height="150" src="https://www.youtube.com/embed/33BI5j4i9Eg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                </div>
			</div>

			<div class="timeline-item closed" id="step3">
				<div class="timeline-icon">3</div>
				<div class="timeline-content">
					<h2>Copy turboed sources</h2>
                    <div class="timeline-content-inner">
                    <!-- revealed when google group saved in process -->
					<div class="callout callout-info" id="googlegroupInfo" style="display:none">
                          <p><span class="dashicons dashicons-info"></span>The google group we have saved for you is: <strong><?php echo $google_group; ?></strong></p>
                    </div>
                    <div class="callout callout-info" id="shortcut-step">
                        <p><span class="dashicons dashicons-info"></span>You only need to complete the next two steps the first time you create a turboed dashboard.</p>
                    </div>
					<p>To begin a turbo setup we've created a special setup dashboard that builds the extract sources.</p>
                    <ul>
                        <li><a href="https://lookerstudio.google.com/u/0/reporting/cbc15c21-6b06-4037-b8c8-71310ccd2e15/page/QjZZC" target="_blank">Open turbo data sources</a></li>
                            <li>Hover your mouse at the top of the dashboard. A three dot (⠇) menu will appear.</li>
                            <li>Click on the menu and select "Make a Copy"</li>
                    </ul>
                    <p>When making a copy you'll be asked confirm data sources. Simply hit <strong>Copy Report</strong>.</p>
                    <p>After you make the copy the numbers will change to errors. This is normal, we will fix this in the next step.
                    </p>
					<a href="#" class="btn done-btn" data-step="3">✓ Done</a>
                </div>
				</div>
                <div class="timeline-help">
                    <h3>Help</h3>
                    <p><a class="modal-link" href="#" data-help="2">I can't see the menu!</a></p>
                    <p><a class="modal-link" href="#" data-help="3">Why do I need to create a shared copy?</a></p>
                    <h4>Setting up turbo sources</h4>
                    <iframe width="260" height="150" src="https://www.youtube.com/embed/ogOAL8lPcV8?start=214" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                    
                </div>
			</div>

			<div class="timeline-item closed" id="step4">
				<div class="timeline-icon">4</div>
				<div class="timeline-content">
					<h2>Make reusable data sources</h2>
                    <div class="timeline-content-inner">
                       
                        <p>From the top menu bar select <strong>Resource > Manage added data sources</strong>. If you cannot see this click the <strong><svg xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 24 24" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M20.41 4.94l-1.35-1.35c-.78-.78-2.05-.78-2.83 0L13.4 6.41 3 16.82V21h4.18l10.46-10.46 2.77-2.77c.79-.78.79-2.05 0-2.83zm-14 14.12L5 19v-1.36l9.82-9.82 1.41 1.41-9.82 9.83z"></path></svg>Edit</strong> button to ensure you are first in edit mode.</p>
                        <p>You must first edit the <strong>elvanto API</strong> data source.</p>
                        <ul>
                            <li>Click <strong>edit in the actions</strong> column</li>
                            <li>Click <strong>RECONNECT</strong> in the top right</li>
                            <li>Click on the button in the dialog to <strong>Apply</strong></li>
                            <li>Click <strong>FINISHED</strong>in the top right</li>
                        </ul>
                        <p>You will need to repeat the steps below for <strong>each of the other data sources</strong> so it may be helpful to make a note as you go.</p>
                        <ul>
                            <li>Click <strong><svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                width="15px" height="15px" viewBox="0 0 869.958 869.958" style="enable-background:new 0 0 869.958 869.958;"
                                xml:space="preserve">
                           <g>
                               <path d="M115.132,737.958c13.436,0,26.872-5.126,37.124-15.377c20.502-20.502,20.502-53.744-0.001-74.246
                                   c-30.474-30.474-47.256-70.988-47.256-114.084v-4.32c0-88.963,72.377-161.34,161.34-161.34h423.78l-41.688,42.192
                                   c-20.381,20.625-20.18,53.865,0.445,74.244c10.23,10.11,23.564,15.155,36.896,15.155c13.541,0,27.078-5.207,37.346-15.6
                                   l131.684-133.271c9.787-9.905,15.236-23.291,15.154-37.215c-0.084-13.923-5.693-27.244-15.6-37.03l-131.48-129.912
                                   c-20.623-20.379-53.865-20.18-74.244,0.445s-20.18,53.866,0.445,74.245l42.25,41.747H266.339
                                   c-71.143,0-138.026,27.704-188.332,78.009C27.704,391.903,0,458.788,0,529.93v4.32c0,71.143,27.704,138.026,78.01,188.331
                                   C88.261,732.833,101.697,737.958,115.132,737.958z"/>
                           </g>
                           </svg> MAKE REUSABLE in the actions</strong> column</li>
                            <li>Click the <strong>Make reusable</strong> button in the dialog</li>
                            <li>Click <strong>edit in the actions</strong> column</li>
                            <li>Toggle <strong>Auto Update </strong>so it's active </li>
                            <li> Select a time that's <strong>not 8am</strong> (we encourage our users to diversify their extraction times to reduce load on API servers). </li>
                            <li>Click <strong>SAVE AND EXTRACT</strong>, wait for the data to cache.</li>
                        </ul>
                        <div class="callout callout-info">
                            <p><span class="dashicons dashicons-info"></span>This extraction time is when your data is cached and frozen. So any updates to your database won't be refreshed in our dashboards until the next extraction cycle.</p>
                        </div>
                       <p> Repeat these steps for each of the turboed data sources (indicated by <svg fill="#000000" height="15px" width="15px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 27.793 27.793" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g id="c1_ray"> <polygon points="20.972,0 5.076,15.803 10.972,15.803 6.44,27.793 22.716,11.989 16.819,11.989 "></polygon> </g> <g id="Capa_1_29_"> </g> </g> </g></svg>).</p>
                       <p>Once completed Click <strong>FINISHED</strong> in the top right, then <strong>CLOSE</strong> </p>
                        <p> Click <strong><svg xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 24 24" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M12 7c-2.48 0-4.5 2.02-4.5 4.5S9.52 16 12 16s4.5-2.02 4.5-4.5S14.48 7 12 7zm0 7.2c-1.49 0-2.7-1.21-2.7-2.7 0-1.49 1.21-2.7 2.7-2.7s2.7 1.21 2.7 2.7c0 1.49-1.21 2.7-2.7 2.7z"></path><path d="M12 4C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 13a9.77 9.77 0 0 1-8.82-5.5C4.83 8.13 8.21 6 12 6s7.17 2.13 8.82 5.5A9.77 9.77 0 0 1 12 17z"></path></svg>VIEW</strong> (to exit edit dashboard mode) and you should return to viewing the Turbo Setup with all the Validation Checks green. </p>
                       
                        
                    <a href="#" class="btn done-btn" data-step="4">✓ Done</a>
                   
                </div>
                </div>
                <div class="timeline-help">
                    <h3>Help</h3>
                    <p><a class="modal-link" href="#" data-help="4">Where do I manage data sources?</a></p>
                    <p><a class="modal-link" href="#" data-help="5">How do I edit data extraction sources?</a></p>
                    <p><a class="modal-link" href="#" data-help="6">How do I make sources reusable?</a></p>
                    <p><a class="modal-link" href="#" data-help="7">How can I check I've completed this step successfully?</a></p>
                    <h4>The extract tool</h4>
                    <iframe width="260" height="150" src="https://www.youtube.com/embed/ogOAL8lPcV8?start=260" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                    
                </div>
			</div>

            <div class="timeline-item closed" id="step5">
				<div class="timeline-icon">5</div>
				<div class="timeline-content">
					<h2>Create a turbo copy</h2>
                    <div class="timeline-content-inner">
                        <ul>
                            <li><a href="#" id="dashboard-to-share" target="_blank">Open [Dashboard name]</a></li>
                                <li>Hover your mouse at the top of the dashboard. A three dot (⠇) menu will appear.</li>
                                <li>Click on the menu and select "Make a Copy"</li>
                        </ul>
                        <p>When making a copy you'll be asked confirm data sources. This is where you'll need to select the reusable extraction sources you created earlier.</p>
                        <p>Select the relevant data sources from the list below, noting you'll need to scroll:</p>
                        <ul>
                            <li>elvanto API People — <br/>
                                <strong><svg fill="#000000" height="15px" width="15px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 27.793 27.793" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g id="c1_ray"> <polygon points="20.972,0 5.076,15.803 10.972,15.803 6.44,27.793 22.716,11.989 16.819,11.989 "></polygon> </g> <g id="Capa_1_29_"> </g> </g> </g></svg>
                                    Extract Data People</strong></li>
                            <li>elvanto API Report of Service Individual Attendance — <br/>
                                <strong><svg fill="#000000" height="15px" width="15px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 27.793 27.793" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g id="c1_ray"> <polygon points="20.972,0 5.076,15.803 10.972,15.803 6.44,27.793 22.716,11.989 16.819,11.989 "></polygon> </g> <g id="Capa_1_29_"> </g> </g> </g></svg>
                                    Extract Data Service Attendance</strong></li>
                            <li>elvanto API Report of Group Individual Attendance — <br/>
                                <strong><svg fill="#000000" height="15px" width="15px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 27.793 27.793" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g id="c1_ray"> <polygon points="20.972,0 5.076,15.803 10.972,15.803 6.44,27.793 22.716,11.989 16.819,11.989 "></polygon> </g> <g id="Capa_1_29_"> </g> </g> </g></svg>
                                Extract Data Group Attendance</strong></li>
                            <li>elvanto API Service Volunteers — <br/>
                                <strong><svg fill="#000000" height="15px" width="15px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 27.793 27.793" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g id="c1_ray"> <polygon points="20.972,0 5.076,15.803 10.972,15.803 6.44,27.793 22.716,11.989 16.819,11.989 "></polygon> </g> <g id="Capa_1_29_"> </g> </g> </g></svg>
                                Extract Data Services Volunteers</strong></li>
                            <li>elvanto API Groups — <br/>
                                <strong><svg fill="#000000" height="15px" width="15px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 27.793 27.793" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g id="c1_ray"> <polygon points="20.972,0 5.076,15.803 10.972,15.803 6.44,27.793 22.716,11.989 16.819,11.989 "></polygon> </g> <g id="Capa_1_29_"> </g> </g> </g></svg>Extract Data Groups</strong></li>
                        </ul>
                        <p>Click <strong>Copy Report</strong> </p>
					<a href="#" class="btn done-btn" data-step="5">✓ Done</a>
                
                </div>
				</div>
                <div class="timeline-help">
                    <h3>Help</h3>
                    <p><a class="modal-link" href="#" data-help="8">How do I select extraction sources?</a></p>
                    <h4>Copy dashboard and connect extraction sources</h4>
                    <iframe width="260" height="150" src="https://www.youtube.com/embed/ogOAL8lPcV8?start=473" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                    
                    
                </div>
                
			</div>

            <div class="timeline-item closed" id="step6">
				<div class="timeline-icon">6</div>
				<div class="timeline-content">
					<h2>Sharing settings</h2>
                    <div class="timeline-content-inner">
                        
                        <div class="callout callout-warning">
                            <p><span class="dashicons dashicons-remove"></span>Selecting "anyone with the link" or "anyone on the internet" in this step breaches our terms and conditions since you are not able to control the security of your data.</p>
                        </div>
						<div class="callout callout-info" id="googlegroupInfo">
                            <p><span class="dashicons dashicons-info"></span>The google group we have saved for you is: <strong><?php echo $google_group; ?></strong></p>
                        </div>
						

                        <div id="accountEmails" class="callout callout-info">
                            <p><span class="dashicons dashicons-info"></span>The following email accounts are associated to your my GHC team: <?php echo(implode(', ', $user_emails)); ?></p>
                        </div>
                        
                        <p>Click the "Share" button in the top right to open a dialog box with sharing options.</p>
                        <ul>
                            <li><strong>Use a google group:</strong> paste google group email address into the text field.</li>
                            <li><strong>Share within the same domain:</strong> click on Restricted next to the lock icon (<svg xmlns="http://www.w3.org/2000/svg" height="15" viewBox="0 -960 960 960" width="15"><path d="M220-80q-24.75 0-42.375-17.625T160-140v-434q0-24.75 17.625-42.375T220-634h70v-96q0-78.85 55.606-134.425Q401.212-920 480.106-920T614.5-864.425Q670-808.85 670-730v96h70q24.75 0 42.375 17.625T800-574v434q0 24.75-17.625 42.375T740-80H220Zm0-60h520v-434H220v434Zm260.168-140Q512-280 534.5-302.031T557-355q0-30-22.668-54.5t-54.5-24.5Q448-434 425.5-409.5t-22.5 55q0 30.5 22.668 52.5t54.5 22ZM350-634h260v-96q0-54.167-37.882-92.083-37.883-37.917-92-37.917Q426-860 388-822.083 350-784.167 350-730v96ZM220-140v-434 434Z"/></svg>) under Link Settings. Select your google domain from the list.</li>
                            <li><strong>Add individual emails:</strong> Enter each email address into the text field. </li>
                        </ul>
                        <p>Your copied dashboard is now shared and can be accessed by your team. Copy the url of this dashboard and paste into the form so that it can be viewed by all logged in team members of my GHC</p>
                        <h3>Save my link</h3>
                        <form class="sharelink-form" action="myGHC" method="get">
                            <select name="share_post_id" class="dashboard-select">
                                <!-- generated from JS -->
                            </select>
							<input type="hidden" name="share_name" value="" />
							<input type="hidden" name="is_turbo" value="true" />
                            <input required name="share_url" type="text" class="wide dashboard-paste" placeholder="https://lookerstudio.google.com/u/0/reporting/8a910ffd-96fa/page/KfARB"  />
                            <button type="submit" class="button">Save link</button>
                        </form>
                        <div class="callout callout-warning pasted-alert" style="display: none">
                            <p><span class="dashicons dashicons-remove"></span>This is the master dashboard link. You cannot use this link.</p>
                        </div>
					    
                </div>
				</div>
                <div class="timeline-help">
                    <h3>Help</h3>
                    <p><a class="modal-link" data-help="9" href="">Sharing data snapshots</a></p>
                    <p><a class="modal-link" data-help="10" href="">Why should I save my shared dashboards to GHC?   </a></p>
                    <p><a class="modal-link" data-help="11" href="">I forgot my google group email address </a></p>
                    <h4>Creating a shareable copy</h4>
                    <iframe width="260" height="150" src="https://www.youtube.com/embed/dHTKs7HIbzk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                    <h4>Creating a google group</h4>
                    <iframe width="260" height="150" src="https://www.youtube.com/embed/33BI5j4i9Eg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                </div>
			</div>

		</div>
	</div>

<!-- end timeline -->

<!-- OXYGEN TAB - JavaScript (remove wrapping <script> tags) --> 
    
    
<script>

	
const doneBtn = document.querySelectorAll(".done-btn, .skip-btn")
const modalClose = document.getElementById("mymodalClose")
const modalLink = document.querySelectorAll(".modal-link")
const dashboardSelects = document.querySelectorAll(".dashboard-select");
const dashboardInput = document.querySelectorAll(".dashboard-paste");



// Set states from urls
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString);
let step = urlParams.get('step')
const dashboardSelected = urlParams.get('share_post_id')
document.querySelectorAll('input[name="share_post_id"]')[0].value = dashboardSelected


// populated from data but needed for other functions
let masterDashboardUrls


const helpModalContent = [
    {
        order: 0,
        html: `
        <h2>I get an authorization required error</h2>
        <p>If you see authorization required messages when trying to access your dashboard you are not logged into the correct google account. Open the menu and select the correct google account which is linked to my GHC.</p> 
        <p>Then you will need to select the dashboard you want to view from the list of Looker Studio reports</p>
       <img src="https://growinghealthierchurches.com/wp-content/uploads/2023/07/google-login-looker.gif" "Reveal menu on hover" />
       <p>Alternatively, you can add the correct account from the menu, or select use another account when you click the "Authorize" button. You will need to know your username and password first.</p>
        `
    },
    {
        order: 1,
        html: `
        <h2>I get a "complete your account setup" prompt</h2>
        <p>If you see  a "complete your account setup" prompt when trying to copy your dashboard you are not logged into the correct google account. Open the menu and select the correct google account which is linked to my GHC.</p> 
        <p>Then you will need to select the dashboard you want to view from the list of Looker Studio reports</p>
       <img src="https://growinghealthierchurches.com/wp-content/uploads/2023/07/complete-account-prompt.gif" "Reveal menu on hover" />
        `
    },
    {
        order: 2,
        html: `
        <h2>I can't see the menu!</h2>
        <p>The Looker Studio menu to create a shareable copy on appears when you hover over the top of the dashboard.</p> 
       <img src="dashboard_make_a_copy.gif" "Reveal menu on hover" />
        `
    },
    {
        order: 3,
        html: `
        <h2>Why do I need to create a shared copy?</h2>
        <p>The original dashboard is owned by GHC, so when you share with others they will get an authentication failure. </p>

        <p>To share dashboards successfully you must first make a copy where you are the owner.</p>
        <p>A copied dashboard will not receive automatic updates when improvements are released. However we will notify you in myGHC if there are any updates available and you can make a new copy which will include these updates.</p>

        `
    },
    {
        order: 4,
        html : `
        <h2>Where do I manage data sources?</h2>
       <img src="reauthenticate_sources.gif" alt="process of changing data sources" />
        `
    },
    {
        order: 5,
        html : `
        <h2>How do I edit data extraction sources?</h2>
       <img src="https://growinghealthierchurches.com/wp-content/uploads/2023/07/edit-extraction-sources.gif" alt="process of editing data sources extraction" />
        `
    },
    {
        order: 6,
        html : `
        <h2>How do I make sources reusable?</h2>
        <img src="https://growinghealthierchurches.com/wp-content/uploads/2023/07/make-reusable-sources.gif" alt="process of editing data sources extraction" />
        
        `
    },
    {
        order: 7,
        html : `
        <h2>How can I check I've completed this step successfully?</h2>
       <p>When you're done your added data sources screen will look like this.</p>
       <img src="https://growinghealthierchurches.com/wp-content/uploads/2023/07/Screen-Shot-2023-07-25-at-4.12.29-pm.png" />
       <p>Also, your dashboard numbers will now all be green.</p>
       <img src="https://growinghealthierchurches.com/wp-content/uploads/2023/07/Screen-Shot-2023-07-25-at-4.12.57-pm.png" />
        `
    },
    
    {
        order: 8,
        html: `
        <h2How do I select extraction sources?</h2>
       <p>When you make a copy select the corresponding extraction source from the list.</p>
       <img src="https://growinghealthierchurches.com/wp-content/uploads/2023/07/linking-extraction-sources.gif" alt="selecting extraction sources" />
        `
    },
    {
        order: 9,
        html: `
        <h2>Sharing data snapshots</h2>
        <p>I you just want a  static view of your dashboard you can: </p>
        <ul>
        <li>schedule pdf's of your dashboard to be sent via email at regular intervals. Simply open the share button and select "Schedule email delivery"</li>
        <li>download google sheet data from any table. Simply click the 3 dots in any table and select "Export to sheets"</li>
        </ul>
        <img src="https://growinghealthierchurches.com/wp-content/uploads/2023/05/ghc-pdf.gif" alt="how to reveal share menu" />
        `
    },
    {
        order: 10,
        html: `
        <h2>Why should I save my shared dashboard to GHC?</h2>
        <p>If you save your shared dashboard link to my GHC we can help you keep track of your dashboards</p>
        <ul>
            <li>We can let you know when updates are avilable to dashboards you've shared</li>
            <li>If you have a team account we will manage team members access to dashboards</li>
        </ul>
        <p>We value data too, and sharing your dashboards to your GHC account helps us keep track of how the product is being used. This information helps us to make valuable improvements</p>
        `
    },
    {
        order: 11,
        html: `
        <h2>I forgot my google group email address</h2>
        <p>Go to <a href="https://groups.google.com/my-groups">groups.google.com/my-groups</a> from there you can see all the groups you administer and those of which you are a member.</p>
        <p>If you are group admin you can click on the group and edit its members, or add new ones.</p>
       
        `
    }

]

function renderStep() {
    if (step == "1") {
        // do nothing, default state of page
    } else if (step == "2") {
        document.getElementById("step1").classList.add("done", "completed-closed")
        document.getElementById("step2").classList.remove("closed")
    } else if (step == "3") {
        document.getElementById("step1").classList.add("done", "completed-closed")
        document.getElementById("step2").classList.add("done", "completed-closed")
        document.getElementById("step2").classList.remove("closed")
        document.getElementById("step3").classList.remove("closed")
        //show prompt
        document.getElementById("shortcut-step").style.display = "block"
    } else if (step == "4") {
        document.getElementById("step1").classList.add("done", "completed-closed")
        document.getElementById("step2").classList.add("done", "completed-closed")
        document.getElementById("step3").classList.add("done", "completed-closed")
        document.getElementById("step2").classList.remove("closed")
        document.getElementById("step3").classList.remove("closed")
        document.getElementById("step4").classList.remove("closed")
    } else if (step == "5") {
        document.getElementById("step1").classList.add("done", "completed-closed")
        document.getElementById("step2").classList.add("done", "completed-closed")
        document.getElementById("step3").classList.add("done", "completed-closed")
        document.getElementById("step4").classList.add("done", "completed-closed")
        document.getElementById("step2").classList.remove("closed")
        document.getElementById("step3").classList.remove("closed")
        document.getElementById("step4").classList.remove("closed")
        document.getElementById("step5").classList.remove("closed")
		//show prompt - only for reusable
        if (document.getElementById("shortcut-step2")) {document.getElementById("shortcut-step2").style.display = "block"}
    } else if (step == "6") {
        document.getElementById("step1").classList.add("done", "completed-closed")
        document.getElementById("step2").classList.add("done", "completed-closed")
        document.getElementById("step3").classList.add("done", "completed-closed")
        document.getElementById("step4").classList.add("done", "completed-closed")
        document.getElementById("step5").classList.add("done", "completed-closed")
        document.getElementById("step2").classList.remove("closed")
        document.getElementById("step3").classList.remove("closed")
        document.getElementById("step4").classList.remove("closed")
        document.getElementById("step5").classList.remove("closed")
        document.getElementById("step6").classList.remove("closed")
    }

    //update done items
    doneItems = document.querySelectorAll(".timeline-item.done")
	
	//if user has a google group preference
    if (googleGroup !== '') {
        document.getElementById("accountEmails").style.display = "none"
    }

	// hide google email info box if no google group email stored for user
	if (googleGroupEmail !== '') {
		document.querySelector('#share-select option[value="already-google"]').selected = true
		document.getElementById("googlegroupInfo0").style.display = 'block'
		document.getElementById("googlegroupInfo").style.display = 'block'
		document.getElementById("googlegroupInfo2").style.display = 'block'
		
	}	
	
}



async function getJSONData() {

    // This is a little messy and could be done better with a join
    // Limited supabase / postgress knowledge at this point

    // dashboards & tools table
    const baseurl = "https://rwmbrtwcuogykekepsfg.supabase.co/rest/v1/dashboards_and_tools?"
    const queryString = "select=id,name,elvanto,pco,ccb,fluro,wp_post_id,plan,turbo_type,published,dashboard_link&order=plan&eq(published,true)"
    const myApiKey = "&apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3bWJydHdjdW9neWtla2Vwc2ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODY3OTcyMjQsImV4cCI6MjAwMjM3MzIyNH0.SlxIj9CN17Y36gYD9husbYUZMX1mjTArKwu9mBGxxRQ"
    const response = await fetch(baseurl + queryString + myApiKey)
    const jsonData = await response.json();
    
    filterData(jsonData)
  }



function filterData(data) {
    
    //allow ourselves to mutate data
    let newData = data;

    // create array of all dashboard urls
    // check for pasting into input field
    masterDashboardUrls = newData.map(item => {
        return ([item.dashboard_link, item.turbo_link])
    }).flat()

    //filter data for subscription-type
    if (userSubscription === "free") {
        newData = data.filter(dashboard => dashboard.plan === "Free")
    } 

    // remove non-dashboard tools
    newData = newData.filter(dashboard => dashboard.plan !== "Separate subscription") 

    // remove non-turbo tools
    newData = newData.filter(dashboard => dashboard.turbo_type !== null ) 
	
	// Filter data for CHMS
    filterChms(userCHMS, newData)

}

// Filter data based on CHMS
function filterChms(userType, newData) {
    
    let chmsData
    let chms

    // Different chMSes
    const elvantoDashboardsData = newData.filter(dashboard => dashboard.elvanto)
    const pcoDashboardsData = newData.filter(dashboard => dashboard.pco)
    const ccbDashboardsData = newData.filter(dashboard => dashboard.ccb)
    const fluroDashboardsData = newData.filter(dashboard => dashboard.fluro)

    switch(userType) {
        case "pco_user":
            chmsData = pcoDashboardsData;
            chms = "pco";
            break;
        case "ccb_user":
            chmsData = ccbDashboardsData;
            chms = "ccb";
            break;
        case "fluro_user":
            chmsData = fluroDashboardsData;
            chms = "fluro";
            break;
        case "elvanto_user":
            chmsData = elvantoDashboardsData;
            chms = "elvanto";
    }

    renderData(chmsData)
    
}

function renderData(data) {
    
    // Loop through JSON data to return html for select options
    const selectHtml = data.map(item => {
        return (
            `
            <option value="${item.wp_post_id}" ${dashboardSelected == item.wp_post_id ? "selected" : ""}>${item.name}</option>
            `
    )}).join('')

    const chosenDashboard = data.filter((item) => dashboardSelected == item.wp_post_id)

    // Insert HTML into page
    
    dashboardSelects.forEach((select) => {
        select.innerHTML += selectHtml;
    });
    if (chosenDashboard[0]) {
        document.getElementById("dashboard-to-share").textContent = `Open ${chosenDashboard[0].name} dashboard`
        document.getElementById("dashboard-to-share").href = `${chosenDashboard[0].dashboard_link}`
    	document.querySelectorAll("input[name='share_name']").forEach(el => el.value = chosenDashboard[0].name)
	} else {
        document.getElementById("dashboard-to-share").textContent =  "Open the dashboard from your my GHC"
    }
    
    
    
  
}

let doneItems = document.querySelectorAll(".timeline-item.done")


// Invoke functions
renderStep()
getJSONData()
accordion()


// Event listeners
doneBtn.forEach(element => {
    element.addEventListener("click", function(e){
        e.preventDefault()
        e.stopPropagation()
        let thisItem = e.target
        let thisStep =  Number(thisItem.dataset['step'])
        // add done class to timeline container
        thisItem.closest(".timeline-item").classList.add("done")
        thisItem.closest(".timeline-item").classList.add("completed-closed")
        thisStep ++
        
        // remove closed class from next step
        document.getElementById("step" + thisStep).classList.remove("closed")
        
        
        if (thisItem.classList.contains("done-btn")) {
            // update done button text and styles
            thisItem.innerHTML = "completed"
            thisItem.classList.remove("done-btn")
            thisItem.classList.add("complete-btn")
        } 
        if (thisItem.classList.contains("skip-btn")) {
            thisItem.innerHTML = "skipped"   
        }
        // different logic to jump to correct section
        if (thisItem.id === "step-decision") {
           
            let shareChoice = document.getElementById("share-select").value
            // decision to use google Group
            if (shareChoice == "other-method" || shareChoice == "already-google"  ) {
                step = 3
            }
            if (shareChoice == "google" || shareChoice == "already-google") {
                googleGroup = 'true'
            }
            renderStep()
        }
        

        // update done items
        doneItems = document.querySelectorAll(".timeline-item.done")
        accordion()
    })

});

modalLink.forEach(element => {
    element.addEventListener("click", function(e){
        e.preventDefault()
        let i = Number(e.target.dataset['help'])
        document.querySelector(".mymodal-overlay").classList.add("show")

        let textString = helpModalContent[i].html
        
        if (i === 0) {
            let replaceLink = document.getElementById("dashboard-to-share").href

            let textArray = textString.split('"')
            textArray[1] = replaceLink
            
            textString = textArray.join('')
        }

        document.querySelector(".mymodal-content").innerHTML = textString
 
    })
})

modalClose.addEventListener("click", function(e){   
    e.target.closest(".mymodal-overlay").classList.remove("show")
})

function accordion() {
    doneItems.forEach(el => {
        let thisContent = el.children[1]
        thisContent.addEventListener("click", openItem)
        function openItem(e) {
            e.preventDefault()
            console.log("clicked")
            e.target.closest(".timeline-item").classList.remove("completed-closed")
            thisContent.removeEventListener("click", openItem)
        }
    })
}

dashboardSelects.forEach(element => {
    element.addEventListener("change", function(e){
            
        // Get the current URL and its search parameters
        const url = new URL(window.location.href);
        const searchParams = url.searchParams;
        const dashboardId = e.target.value

        // Update or add parameters
        searchParams.set('share_post_id', dashboardId); 
       
        // Create the new URL with updated parameters
        const newURL = url.origin + url.pathname + '?' + searchParams.toString();

        // Redirect to the new URL
        window.location.href = newURL;
   
    })
})

dashboardInput.forEach(element => {
    
    element.addEventListener("input", function(e){
        const thisInput = e.target.value 
        const siblingButton = e.target.nextElementSibling
        //reset
        siblingButton.disabled = false
        document.querySelectorAll(".pasted-alert").forEach(
            el => el.style.display = "none"
        )
		//disable button for non google urls
        if (!(thisInput.includes(".google.com"))) {
            siblingButton.disabled = true
        }
        //match - disable
        if (masterDashboardUrls.includes(thisInput)) {
            siblingButton.disabled = true
            document.querySelectorAll(".pasted-alert").forEach(
                el => el.style.display = "block"
            )
          
        }
   
    })
})



</script>

<!-- OXYGEN BLOCK --> 

<!-- modal -->
<div class="mymodal-overlay">
    <div class="mymodal-inner">
        <button id="mymodalClose" aria-label="close" class="mymodal-close"><svg width="10" height="10" viewBox="0 0 44 44" aria-hidden="true" focusable="false">
            <path d="M0.549989 4.44999L4.44999 0.549988L43.45 39.55L39.55 43.45L0.549989 4.44999Z" />
            <path d="M39.55 0.549988L43.45 4.44999L4.44999 43.45L0.549988 39.55L39.55 0.549988Z" />
            </svg></button>
            <div class="mymodal-content">   
                <!-- content to go here -->
            </div>
    </div>
  </div>