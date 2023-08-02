
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
               <p>If you have already copied and shared your dashboard paste its url into the form below. Otherwise follow the instructions to generate your link.</p>
        <p>Since dashboards permissions are connected to your google account <strong>you won’t be able to share dashboards without creating a copy first.</strong></p>

        <form class="sharelink-form" action="test-dashboard" method="get">
            <select name="share_post_id" class="dashboard-select">
                <!-- generated from JS -->
            </select>
			<input type="hidden" name="share_name" value="" />
			<input type="hidden" name="is_tubo" value="false" />
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
                        <form class="sharelink-form standalone-field">
                            <!-- Jumps user to correct step -->
                            <select id="share-select">
                                <option value="2">Create a google group</option>
                                <option value="3">I already have a google group</option>
                                <option value="3">I'm using another sharing method</option>
                            </select>
                        </form>
					        <a href="#" class="btn done-btn" data-step="1" id="step-decision">✓ Next</a>
                            <a href="#" class="btn">Subscribe for assistance</a>
                        </div>
				</div>
                <div class="timeline-help">
                    <h3>Help</h3>
                    <p><a class="modal-link" href="#" data-help="0">How can I check I'm logged into the correct google account?</a></p>
                  
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
                                <input type="hidden" name="step" value="3" />
                                <input type="hidden" name="share_post_id" value="" />
                                <input name="google_group" type="email" required class="wide" placeholder="myuniquename@googlegroups.com" />
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
					<h2>Create a copy</h2>
                    <div class="timeline-content-inner">
					<p>You cannot share the original dashboard, you must first make a copy:</p>
                    <ul>
                        <li><a href="#" id="dashboard-to-share" target="_blank">Open [Dashboard name]</a> or another dashboard that you wish to share</li>
                            <li>Hover your mouse at the top of the dashboard. A three dot (⠇) menu will appear.</li>
                            <li>Click on the menu and select "Make a Copy"</li>
                    </ul>
                    <p>A dialog box will now appear. Leave all the values unchanged. Click Copy Report.</p>
                    <p>You have now created a new copy! Rename it by clicking the "Copy of [dashboard title]" in the top left and name to something that makes sense to you.
                    </p>
					<a href="#" class="btn done-btn" data-step="3">✓ Done</a>
                    <a href="#" class="btn">Subscribe for assistance</a>
                </div>
				</div>
                <div class="timeline-help">
                    <h3>Help</h3>
                    <p><a class="modal-link" href="#" data-help="1">I can't see the menu!</a></p>
                    <p><a class="modal-link" href="#" data-help="2">Why do I need to create a shared copy?</a></p>
                    
                    <h4>Creating a shareable copy</h4>
                    <iframe width="260" height="150" src="https://www.youtube.com/embed/dHTKs7HIbzk?start=210" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                </div>
			</div>

			<div class="timeline-item closed" id="step4">
				<div class="timeline-icon">4</div>
				<div class="timeline-content">
					<h2>Reconnect your data</h2>
                    <div class="timeline-content-inner">
                        <p>From the top menu bar select <strong>Resource > Manage added data sources</strong>. If you cannot see this click the "Edit" button to ensure you are first in edit mode.</p>
                        <p>You will need to repeat the steps for each of the data sources listed so it may be helpful to make a note as you go.</p>
                        <ul>
                            <li>Click <strong>edit in the actions</strong> column</li>
                            <li>Click <strong>RECONNECT</strong> to the top right</li>
                            <li>If a dialog box appears click <strong>Apply</strong> to apply connection changes</li>
                            <li>Click <strong>Data Credentials</strong>  just below the top menu</li>
                            <li>A dialog box will open. Change the radio button to <strong>Owner's Credentials</strong>. Click Update</li>
                            <li>Click <strong>FINISHED</strong> to the top right</li>
                        </ul>
                       <p> Repeat these steps for each of the data sources. Once completed Click “CLOSE” in the top right to return to the dashboard.</p>
                       
                        
                    <a href="#" class="btn done-btn" data-step="4">✓ Done</a>
                    <a href="#" class="btn">Subscribe for assistance</a>
                </div>
                </div>
                <div class="timeline-help">
                    <h3>Help</h3>
                    <p><a class="modal-link" href="#" data-help="3">Where do I manage data sources?</a></p>
                    <p><a class="modal-link" href="#" data-help="4">Where do I change the data credentials?</a></p>
                    <p><a class="modal-link" href="#" data-help="5">Help! I’m getting a community connector error!</a></p>
                    <p><a class="modal-link" href="#" data-help="6">Help! I’m getting an “Empty Table” error!</a></p>
                    <p><a class="modal-link" href="#" data-help="7">Why do I need to reconnect each data source?</a></p>
                    
                    
                    <h4>Creating a shareable copy</h4>
                    <iframe width="260" height="150" src="https://www.youtube.com/embed/dHTKs7HIbzk?start=250" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                </div>
			</div>

            <div class="timeline-item closed" id="step5">
				<div class="timeline-icon">5</div>
				<div class="timeline-content">
					<h2>Customise dashboard filters</h2>
                    <div class="timeline-content-inner">
                        <p>This is an optional step for those who want to share a filtered view of the dashboards. You can skip this step if not required.</p>
                        <a href="#" class="btn skip-btn" data-step="5">Skip step</a>
                        <p>You may wish to set a default filter on your dashboards e.g. Adults of your main congregations.</p>
                        <p>To do this click on either the demographic or location control box. The data panel will open up and you can add "Default selection" values separated by a comma. You will need to enter the exact values.</p>
                        
					<a href="#" class="btn done-btn" data-step="5">✓ Done</a>
                   
                    <a href="#" class="btn">Subscribe for assistance</a>
                </div>
				</div>
                <div class="timeline-help">
                    <h3>Help</h3>
                    <p><a class="modal-link" href="#" data-help="8">Which filters can I customise?</a></p>
                    <h4>Creating a shareable copy</h4>
                    <iframe width="260" height="150" src="https://www.youtube.com/embed/dHTKs7HIbzk?start=499" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
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

                        <div id="accountEmails" class="callout callout-info">
                            <p><span class="dashicons dashicons-info"></span>The following email accounts are associated to your my GHC team: <?php echo(implode(',', $user_emails)); ?></p>
                        </div>
                        
                        <p>Click the "Share" button in the top right to open a dialog box with sharing options.</p>
                        <ul>
                            <li><strong>Use a google group:</strong> paste google group email address into the text field.</li>
                            <li><strong>Share within the same domain:</strong> click on Restricted next to the lock icon (<svg xmlns="http://www.w3.org/2000/svg" height="15" viewBox="0 -960 960 960" width="15"><path d="M220-80q-24.75 0-42.375-17.625T160-140v-434q0-24.75 17.625-42.375T220-634h70v-96q0-78.85 55.606-134.425Q401.212-920 480.106-920T614.5-864.425Q670-808.85 670-730v96h70q24.75 0 42.375 17.625T800-574v434q0 24.75-17.625 42.375T740-80H220Zm0-60h520v-434H220v434Zm260.168-140Q512-280 534.5-302.031T557-355q0-30-22.668-54.5t-54.5-24.5Q448-434 425.5-409.5t-22.5 55q0 30.5 22.668 52.5t54.5 22ZM350-634h260v-96q0-54.167-37.882-92.083-37.883-37.917-92-37.917Q426-860 388-822.083 350-784.167 350-730v96ZM220-140v-434 434Z"/></svg>) under Link Settings. Select your google domain from the list.</li>
                            <li><strong>Add individual emails:</strong> Enter each email address into the text field. </li>
                        </ul>
                        <p>Your copied dashboard is now shared and can be accessed by your team. Copy the url of this dashboard and paste into the form so that it can be viewed by all logged in team members of my GHC</p>
                        <h3>Save my link</h3>
                        <form class="sharelink-form" action="test-dashboard" method="get">
                            <select name="share_post_id" class="dashboard-select">
                                <!-- generated from JS -->
                            </select>
							<input type="hidden" name="share_name" value="" />
							<input type="hidden" name="is_tubo" value="false" />
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
