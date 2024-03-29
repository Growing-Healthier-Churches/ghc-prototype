
<!-- Notifications -->
<?php

//this whole block is conditional on user role (team billing and not PCQ )
$user = wp_get_current_user();
$central_user = get_billing_user();
$user_id = $user->ID;
$GHC_setup = get_user_meta($user_id, 'GHC_setup' ,true); 
$GHC_onboard_step = substr(get_user_meta($user_id, 'GHC_onboard' ,true),0,1); 

$GHC_ID = get_user_meta($user_id,'GHC_ID',true);
$GHC_team = get_user_meta($user_id,'GHC_team',true);


if (isset($_GET['welcome'])) { 
	echo "<div class='tooltip'><h2>Welcome to the myGHC page</h2><p>Thank you for signing up. This is the main page to access all your dashboards. For the Core Platforms to work full you will need to connect GHC with your church management system first. </p><p>Use the <a href='/setup'>setup page</a> to complete this.</p></div>";
}elseif( isset($_GET["coach"])) {
	echo "<div class='tooltip'><h2>Welcome to myGHC</h2><p>You will be able to view churches that have given you coach access. <b>Note: </b>You may need to wait a short while for the church administrator to add your permission access to each dashboard</div>";

}elseif(( empty($GHC_onboard_step) || $GHC_onboard_step==1 || $GHC_onboard_step==2) && ( $GHC_setup != 'Transfer') ) {
	//this to be displayed when setup is not equal to compelte or trasnfer
	echo "<p class='notification'>It appears your setup (or subscription) is incomplete. Please return to <a href='/onboard'>setup page</a> to review";
}



// when page is navigated to from saving dashboard
if(isset($_GET['share_name']) && isset($_GET['share_url']) && isset($_GET['share_post_id'])) {
	

	if (isset($_GET['is_turbo'])) {
		$turbo_val = true;
	} else {
		$turbo_val = false;
	}
	
	echo("<div class='tooltip'>".$_GET['share_name']." dashboard saved</div>");

	$share_post_id = $_GET['share_post_id'];
	$share_dashboards_data = array(
 		'share_link' =>$_GET['share_url'],
 		'share_date' => date("m/d/Y"),
 		'is_turbo' => $turbo_val,
		'created_by' => $GHC_ID);
	

	update_user_meta($central_user,'share_dashboards_'.$share_post_id,$share_dashboards_data);

}


?>

<!-- JS & Logic -->
<?php
//USER
	$user_id = get_current_user_id();
	$central_user = get_billing_user();

	//delete dashboard
	if (isset($_GET['dash_to_delete'])) {
		$dash_value = 'share_dashboards_' . $_GET['dash_to_delete'];
		//delete_user_meta($user_id, $dash_value);
		delete_user_meta($central_user,$dash_value);
	}

	

	$user_meta = get_user_meta($central_user);
	$roles = wp_get_current_user()->roles;
	$isPCQ = in_array('pcq',$roles);
	$isTeamMember = in_array('team_member',$roles) || in_array('coach',$roles);
	$isTeamBilling = in_array('team_billing',$roles);
	$SSOlogin = get_user_meta( $user_id, 'logged_in_with_SSO',true);

	//GHC_ID and GHC_team moved to Notifications block


	$user_shared = get_user_meta($user_id,'share_post_id');
	$user_sub = get_user_meta($user_id,'ghc_subscription');
	$user_notify = get_user_meta($user_id,'ghc_notify_subscription');
	


 // Loop through each metadata	
$share_dashboards = [];	



if ($user_meta){	
 foreach ($user_meta as $meta_key => $meta_values) {	
	 // Check if the meta key matches the pattern	
	 if (strpos($meta_key, 'share_dashboards_') === 0) {	
		$share_meta_data = unserialize($meta_values[0]);	
		$post_id = (int) substr($meta_key, strlen('share_dashboards_'));	
		 	
		$args = array('meta_query' => array(array('key' => 'GHC_ID','value' => $share_meta_data['created_by'],'compare' => '=')));	
		$created_by = get_users($args)[0];
		 
		$category = get_the_category($post_id);
		if (is_array($category) && !empty($category)){ $category = $category[0];}
		if (isset($share_meta_data['is_turbo'])){
			$is_turbo = $share_meta_data['is_turbo'];
		}else{
			$is_turbo = false;
		}
		 
		
		 $share_dashboards[] = array(	
			 'wp_post_id' => $post_id,	
			 'looker_studio_url' => $share_meta_data['share_link'],	
			 'save_date' =>  date("Y-m-d", strtotime($share_meta_data['share_date'])),	
			 'created_by' => $created_by->user_email,	
			 'is_turbo' => $is_turbo,	
			 'category' => $category
		 );	
		 
		
		 // Extract the 'cat' values into a separate array
		$cat = array_column($share_dashboards, 'category');

		// Sort the $share_dashboards array based on 'wp_post_id' values
		array_multisort($cat, SORT_DESC, $share_dashboards);
	}	
  }	
}


?>



<script>

// To DO:
// update code to display only relevant version histories in modal
// -- currently just ne matching entry
//

//Example variables - in live loaded from php
const userMeta = <?php echo json_encode($user_meta); ?>;
console.log(userMeta)
const userRoles = <?php echo json_encode($roles); ?>; //team_billing, team_member, team_admin
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

const ghcNotify = <?php echo json_encode($user_notify); ?> //relevant value: "active"  -- GHC_notify_subscription

let  extraDashboards =[]
const sharedDashboardInfo = <?php echo json_encode($share_dashboards); ?>;

const sharedDashboardIds = sharedDashboardInfo.map(dash => dash.wp_post_id) // [1171]



// dynamically populated from supabase
// Lists version notes
let dashboardModalContent = []

//Get data from supabase database
async function getJSONData() {

    // This is a little messy and could be done better with a join
    // Limited supabase / postgress knowledge at this point

    // dashboards & tools table
    const baseurl = "https://rwmbrtwcuogykekepsfg.supabase.co/rest/v1/dashboards_and_tools?"
    const queryString = "select=id,name,elvanto,pco,ccb,fluro,health_category_id1(id,name,css_class),health_category_id2(id,name,css_class),description,info_link,dashboard_link,example_metrics,thumb,additional_setup,wp_post_id,plan,turbo_type,turbo_setup_url,published&order=plan&eq(published,true)"
    const myApiKey = "&apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3bWJydHdjdW9neWtla2Vwc2ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODY3OTcyMjQsImV4cCI6MjAwMjM3MzIyNH0.SlxIj9CN17Y36gYD9husbYUZMX1mjTArKwu9mBGxxRQ"
    const response = await fetch(baseurl + queryString + myApiKey)
    const jsonData = await response.json();
    

     // dashboard versions table
     const baseurl2 = "https://rwmbrtwcuogykekepsfg.supabase.co/rest/v1/dashboard_versions?"
     const queryString2 = "select=*"
     const response2 = await fetch(baseurl2 + queryString2 + myApiKey)
     const jsonData2 = await response2.json();

    // filter response and render parts of page
    filterVersionData(jsonData2, sharedDashboardIds)
    filterData(jsonData) 
 
  }

getJSONData()

function filterVersionData(data, sharedDashboardIds) {
    // sharedDashboardIds e.g. [1171]
    let dashboardVersionNotes = data.filter((releaseNote) => sharedDashboardIds.includes(releaseNote.wp_post_id))
    dashboardModalContent = [].concat(dashboardVersionNotes)
    return dashboardModalContent
}



//Filter database to return different arrays
function filterData(data) {

    //allow ourselves to mutate data
    let newData = data;

    //filter data for subscription-type
    if (userSubscription === "free") {
        newData = data.filter(dashboard => dashboard.plan === "Free")
        extraDashboards = data.filter(dashboard => dashboard.plan !== "Free" )
    } 

    //Handle GHC_notify
    if (ghcNotify.includes("active")) {  
        //remove from extraDashbaord
        extraDashboards = extraDashboards.filter(dashboard => dashboard.plan !== "Separate subscription") 
        //add to included in plan dashhboards
        let includedNotify = data.filter(dashboard => dashboard.plan === "Separate subscription")   
        newData.push(includedNotify[0])
    } else {
        newData = newData.filter(dashboard => dashboard.plan !== "Separate subscription") 
        let includedNotify = data.filter(dashboard => dashboard.plan === "Separate subscription") 
        if (userSubscription !== "free") {
            extraDashboards.push(includedNotify[0])  
        }    
    }


    // Shared dashboards info
    if (userRoles.includes("team_member") || userRoles.includes("team_admin") || userRoles.includes("team_billing") || userRoles.includes("coach") ) { 
        console.log("shared dashboards")
        const sharedDashboards = newData.filter(dashboard => sharedDashboardIds.includes(dashboard.wp_post_id))          
        renderShared(sharedDashboardInfo, sharedDashboards)
    }


    // Filter data for CHMS
    filterChms(userCHMS, newData)
    
    setModals() 

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

    renderAvailable(chmsData)
    if (extraDashboards) {
        renderSubscribe(extraDashboards.filter(dashboard => dashboard[chms]))
    }
}

function renderShared(userDataShared, linkedDashboards) {
   
    // When no dashboards have been shared
    if (userDataShared.length == 0) {
        document.getElementById("admin-cards").innerHTML += `<p class="info-msg">You have not shared any dashboards yet. <a href="https://growinghealthierchurches.com/save-share-link/">Follow the instructions</a> to share dashboards with your team.</p>`
        return
    }

    //default container to insert generated html into
    
    if (userRoles.includes("team_admin") || userRoles.includes("team_billing")) {
        containerEl = document.getElementById("admin-cards")
    } else {
        containerEl = document.getElementById("team-cards")
    }

    // Loop through JSON userData to return html for dashboard cards
    const cardsHtml = userDataShared.map(item => {

        // set variable to show new release tag
        let updateNeeded = false;  
        //set turbo type for delete instructions
        let turbotype = ""
        let turboCount = 0

        const thisDash = linkedDashboards.filter(dash => dash.wp_post_id === item.wp_post_id)[0]
        
        linkedDashboards
        .filter(dash => (dash.turbo_type === "associated" || dash.turbo_type === "reusable"))
        .forEach(item => turboCount++ )
        

        // if previously shared dashboard is no longer available on plan
        if (!thisDash) {
            console.log(`dashboard not available ${item.wp_post_id}`)
            return (`<article  class="strip">Previously shared dashboard not available on current plan</article>`)
        }

        // simple display for team members and coaches
        if(userRoles.includes("team_member") || userRoles.includes("coach")) {
            return (
                `<article  class="strip">
                    <span class="dashicons dashicons-analytics"></span>
                    <div class="strip-title">
                    <h3>${thisDash.name}
                        <!-- <span>(Secondary name if exists)</span> -->
                    </h3>
                    </div>
                    <a class="button" href="${item.looker_studio_url}">Open dashboard</a>
                    <a href="${thisDash.info_link}" class="docs-link"><span class="dashicons dashicons-media-document"></span>Read the docs</a>   
                </article>
                `
            )
        } 

        const thisReleaseInfo = dashboardModalContent.filter(dash => dash.dashboard_id === thisDash.id)
        const latestReleaseDate = Date.parse(thisReleaseInfo[0].updated);
        const savedDashboardDate = Date.parse(item.save_date);


        if (latestReleaseDate > savedDashboardDate) {
            updateNeeded = true;
        }

        if (item.is_turbo === false) {
            turbotype = "not-turbo"
        } else {
            turbotype = thisDash.turbo_type  
        }


        return (
            `<article  class="strip">
            <span class="dashicons dashicons-analytics">
                ${item.is_turbo ? `<i>⚡</i>` : ``}
            </span>
            <div class="strip-title">
              <h3>${thisDash.name}
                <!-- <span>(Secondary name if exists)</span> -->
              </h3>
            </div>
            <a class="button" href="${item.looker_studio_url}">Open dashboard</a>  
            ${updateNeeded ?
                `<a class="tag release modal-link" href="" data-modal="${thisDash.id}">New release available</a>`
            : ``}
            <nav role="navigation" class="actions tag">
              More &hellip; <span class="dashicons dashicons-arrow-down-alt2"></span>
              <ul>
              <li>${item.is_turbo ? `<a href="#"><span class="dashicons dashicons-update"></span>Refresh data</a>` : userSubscription !== "large" ? `<a href="/account/#payments"><span class="dashicons dashicons-unlock"></span>Unlock turbo</a>` : ``}</li>
                <li><a href="#" class="modal-link delete" data-modal="1" data-dashid="${thisDash.wp_post_id}" data-dashtype="${turbotype}" data-turbocount="${turboCount}"><span class="dashicons dashicons-remove"></span>Delete dashboard</a></li>
                <li><a href="${thisDash.info_link}"><span class="dashicons dashicons-media-document"></span>Read the docs</a></li>
                <li class="owner">Owner:  ${item.created_by}</li>
                </ul>   
            </nav>   
        </article>
            `
    )}).join('')

    // Insert HTML into page

    containerEl.innerHTML += cardsHtml

}

// change buttons
function renderAvailable(data) {
    
    // Loop through JSON data to return html for dashboard cards
    const cardsHtml = data.map(item => {
        return (
            `
            <article class="card">
                <div class="content"><h2 class="header">${item.name}</h2>
                    <a href="${item.info_link}" class="dashicons dashicons-info"><span class="title-tip title-tip-up" title="Documentation"></span></a>
                </div>
                <div class="dimmable image">
                  <div class="dimmer">
                  ${(item.plan == "Separate subscription" || userRoles.includes("team_member"))
                    /* these dashboards cannot be shared */ 
                    ? ` <a href="${item.info_link}"" class="button">Read docs</a>`
                    : ` <a href="${item.dashboard_link}" class="button">Open dashboard</a>
                        ` 
                    }
                    ${
                        /* logic to display turbo share or ordinary share */
                        (userSubscription === "large" && item.turbo_setup_url && (userRoles.includes("team_billing") || userRoles.includes("team_billing"))) ?  
                            `<a href="${item.turbo_setup_url}" class="button secondary">Share turbo version</a>` :
                        (userRoles.includes("team_billing") && item.plan !== "Separate subscription") && 
                            `<a href="/save-share-link/?share_post_id=${item.wp_post_id}" class="button secondary">Share dashboard</a>`  
                    }  
                  </div>
                  <img src="${item.thumb}">
                </div>
                <div class="content"> 
                  <p>${item.description}</p>
                  ${(item.additional_setup && userRoles.includes("team_billing")) ? `<p class="highlight"><a href="${item.additional_setup}">Additional setup required</a></p>` : `` }
                </div>
                <div class="extra content">
                    <strong>measures:</strong> ${item.example_metrics}
                    <div class="meta">
                        ${item.health_category_id1 ? `<span class="tag ${item.health_category_id1.css_class}">${item.health_category_id1.name}</span>` : ``}
                        ${item.health_category_id2 ? `<span class="tag ${item.health_category_id2.css_class}">${item.health_category_id2.name}</span>` : ``}
                    </div>
                </div>
              </article>
            `
    )}).join('')

    // Insert HTML into page
    document.getElementById("available-dashboards").innerHTML += cardsHtml
}

function renderSubscribe(data) {
    
    // Loop through JSON data to return html for dashboard cards
    const cardsHtml = data.map(item => {
        
        return (
            `
            <article class="card">
                <div class="content"><h2 class="header">${item.name}</h2>
                    <a href="${item.info_link}" class="dashicons dashicons-info"><span class="title-tip title-tip-up" title="Documentation"></span></a>
                </div>
                <div class="dimmable image">
                  <div class="dimmer">
                    ${(item.plan == "Separate subscription") ? ` <a href="https://growinghealthierchurches.com/ghc-notify/#subscribe" class="button">Subscribe</a>`
                    : `<a href="https://growinghealthierchurches.com/account/#payments" class="button">Upgrade plan</a>` }
                  </div>
                  <img src="${item.thumb}">
                </div>
                <div class="content"> 
                  <p>${item.description}</p>
                </div>
                <div class="extra content">
                    <strong>measures:</strong> ${item.example_metrics}
                    <div class="meta">
                        ${item.health_category_id1 ? `<span class="tag ${item.health_category_id1.css_class}">${item.health_category_id1.name}</span>` : ``}
                        ${item.health_category_id2 ? `<span class="tag ${item.health_category_id2.css_class}">${item.health_category_id2.name}</span>` : ``}
                    </div>
                </div>
              </article>
            `
    )}).join('')

    // Insert HTML into page
    document.getElementById("extra-dashboards").innerHTML += `<h2 class="subtitle">Upgrade to unlock more</h2>`
    document.getElementById("extra-dashboards").innerHTML += `<p class="dashboards-description">These are dashboards that are available on other plans</p>`
    document.getElementById("extra-dashboards").innerHTML += cardsHtml
}

// Modal dialogs
function setModals() {

    const modalClose = document.getElementById("mymodalClose")
    const modalLink = document.querySelectorAll(".modal-link")  

    modalLink.forEach(element => {
        
        element.addEventListener("click", function(e){
            e.preventDefault()
            document.querySelector(".mymodal-overlay").classList.add("show")
            //dynamic content modals
            if(e.target.classList.contains("release")) {
                let thisContent = dashboardModalContent.filter(note => note.dashboard_id == e.target.dataset['modal'])       
                document.querySelector(".mymodal-content").innerHTML = `
                <h2>Updates available to dashboard:</h2>
                <p>Last updated: ${thisContent[0].updated}</p>
                <p>${thisContent[0].changes_made}</p>
                <a class="button" href="https://growinghealthierchurches.com/save-share-link/?share_post_id=${thisContent[0].wp_post_id}">Create a new share copy</a>
                `
            } 
            if(e.target.classList.contains("delete")) {
                let lastReusable = false
                let extractedSources = false
                let dashType = e.target.dataset['dashtype']
                let dashToDelete = e.target.dataset['dashid']
                let turboCount = e.target.dataset['turbocount']
                console.log(dashType, dashToDelete, turboCount)
                if (turboCount == 1 && (dashType == "associated" || dashType == "reusable")) {
                    lastReusable = true
                    extractedSources = true
                }
                if (dashType == "embedded") {
                    extractedSources = true
                }
                
                document.querySelector(".mymodal-content").innerHTML = `
                <h2>Are you sure you want to delete this dashboard?</h2>
        
                <p>Deleting this dashboard will remove it from this page but it will still exist inside looker studio.</p>
                ${extractedSources ? `<p>Before you delete the reference to this dashboard in myGHC we advice you also delete the attached turbo sources to stop extracting unneeded data from the church management servers. To do this go to your <a href="https://lookerstudio.google.com/u/0/navigation/datasources" target="_blank">Looker Studio data sources</a> and select the following sources to delete:` : ``}
                <p>View the dashboard inside your <a href="https://lookerstudio.google.com/u/0/navigation/reporting" target="_blank">Looker Studio Reports</a> to delete access to it permanently.</p>
                
                <a id="deleteDashboard" class="button" href="" data-dashid="${dashToDelete}" data-lastReusable="${lastReusable}">Yes, delete</a>
                `

                deleteDashboard()
            } 

           
           
        })

    })

    
    
    modalClose.addEventListener("click", function(e){   
        e.target.closest(".mymodal-overlay").classList.remove("show")
    })

    
}

function deleteDashboard() {
    document.getElementById("deleteDashboard").addEventListener("click", function(e){
        e.preventDefault();
        
    
        // Get the current URL and its search parameters
        const url = new URL(window.location.href);
		
        const searchParams = url.searchParams;
        const dashboardId = e.target.dataset['dashid']
    
        // Update or add parameters
		searchParams.set('dash_to_delete', dashboardId);
		// if come from sharing screen
		searchParams.delete('share_post_id');
		searchParams.delete('share_url');
         
       
        // Create the new URL with updated parameters
        const newURL = url.origin + url.pathname + '?' + searchParams.toString();
    
        // Redirect to the new URL
        window.location.href = newURL;
    })
}
     

</script>

<!-- HTML structure -->
<?php
$roles = wp_get_current_user()->roles;
$isTeamBilling = in_array('team_billing',$roles);
$isTeamAdmin = in_array('team_admin',$roles);
$isTeamMember = in_array('team_member',$roles);
?>

<div id="my-dashboards">
	
    <!-- isTeamBilling -->
	<?php if ($isTeamBilling || $isTeamAdmin) { ?>	  
    <section class="ui cards admin-cards" id="admin-cards">
        <h2 class="subtitle">My Shared Dashboards</h2>
        <p class="dashboards-description">These dashboards have been copied and are sharable with anyone in your team.</p>
          <!-- shared dashboards here -->
    </section>
	<?php } ?>

    <!-- if ($isTeamMember)  -->
	<?php if ($isTeamMember) { ?>	  
    <section class="ui cards admin-cards" id="team-cards">
        <h2 class="subtitle">My Team Dashboards</h2>
        <p class="dashboards-description">These are dashboards that have been shared with me by my team administrator.</p>
        <!-- team dashbaords here -->   
    </section>
	<?php } ?>

    <section class="ui cards" id="available-dashboards">
        <!-- Master dashboards available on current plan/chMS -->
        <h2 class="subtitle">Dashboards &amp; Tools</h2>
        <p class="dashboards-description">These are dashboards that are available on my plan</p>
        <!-- Content here -->

    </section>

    <section class="ui cards" id="extra-dashboards">
        <!-- Additional dashboards available on upgrade plan/chMS -->
        <!-- Content here -->
    </section>
   
</div>


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