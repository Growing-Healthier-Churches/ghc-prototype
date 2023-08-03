
const doneBtn = document.querySelectorAll(".done-btn, .skip-btn")
const modalClose = document.getElementById("mymodalClose")
const modalLink = document.querySelectorAll(".modal-link")
const dashboardSelects = document.querySelectorAll(".dashboard-select");
const dashboardInput = document.querySelectorAll(".dashboard-paste");

// example variables - loaded from wordpress
// used to populate <select> in form
let userCHMS = "pco_user" //elvanto_user, pco_user
let userSubscription = "large" // free, small, medium, large
let googleGroup = '' // used to determin if google group preference for sharing


// Set states from urls
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString);
let step = urlParams.get('step')
const dashboardSelected = urlParams.get('share_post_id')
if (urlParams.get('google_group')) {
    googleGroup = urlParams.get('google_group')
}

// populated from data but needed for other functions
let masterDashboardUrls


const helpModalContent = [
    {
        order: 0,
        html: `
        <h2>How can I check I'm logged into the correct account?</h2>
        <p><a href="#" target="_blank">Open your dashboard</a>. If you can't see any data take a look at the help section to resolve the issue</p>
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
        html: `
        <h2>Which filters can I customise?</h2>
       <img src="https://growinghealthierchurches.com/wp-content/uploads/2020/12/Default-Locations-1024x829.png" />
        `
    },
    {
        order: 7,
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
        order: 8,
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
        order: 9,
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
}



async function getJSONData() {

    // This is a little messy and could be done better with a join
    // Limited supabase / postgress knowledge at this point

    // dashboards & tools table
    const baseurl = "https://rwmbrtwcuogykekepsfg.supabase.co/rest/v1/dashboards_and_tools?"
    const queryString = "select=id,name,elvanto,pco,ccb,fluro,wp_post_id,plan,turbo_type,published,turbo_link,dashboard_link&order=plan&eq(published,true)"
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
    console.log(masterDashboardUrls)

    //filter data for subscription-type
    if (userSubscription === "free") {
        newData = data.filter(dashboard => dashboard.plan === "Free")
    } 

    // remove non-dashboard tools
    newData = newData.filter(dashboard => dashboard.plan !== "Separate subscription" ) 

    // remove non-turbo dashboards
    newData = newData.filter(dashboard => dashboard.turbo_type !== null ) 
    
    console.log(newData)
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
    } else {
        document.getElementById("dashboard-to-share").replace("Open the dashboard from your my GHC")
    }
    
    //if user has a google group preference
    if (googleGroup !== '') {
        document.getElementById("accountEmails").style.display = "none"
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
            console.log("decision to make")
            step = document.getElementById("share-select").value
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
        thisContent.addEventListener("click", function(e) {
            e.preventDefault()
            e.target.closest(".timeline-item").classList.remove("completed-closed")
        })
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
        //match - disable
        if (masterDashboardUrls.includes(thisInput)) {
            siblingButton.disabled = true
            document.querySelectorAll(".pasted-alert").forEach(
                el => el.style.display = "block"
            )
          
        }
   
    })
})




