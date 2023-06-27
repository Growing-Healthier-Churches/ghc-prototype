
// To DO:
// if user shares dashboard which is no longer available on plan logic fails
// -- consider addition logic inside .map function
// update code to display only relevant version histories in modal
// -- currently just ne matching entry
// Match shared link to open dashboard URL for teams
//

//Example variables - in live loaded from php
const userCHMS = "elvanto_user" //elvanto_user, pco_user
const userSubscription = "large" // free, small, medium, large
const userRoles = ["team_member"] //team_billing, team_member, team_admin
const ghcNotify = ["active"] //relevant value: "active"
let  extraDashboards =[]
const sharedDashboardInfo = [
    // paid: 2858, 756, 1676, 2350, 467, 1823
    // free: 1171, 1169
    {
        "wp_post_id": 756,
        "looker_studio_url": "https://datastudio.google.com/reporting/fc2a47fb-5e96-422e-a970-a6bee320cbb7",
        "save_date": "2022-01-23",
        "created_by": "GHC31861737",
        "is_turbo": true
    },
    {
        "wp_post_id": 467,
        "looker_studio_url": "https://datastudio.google.com/reporting/730b7b5f-21a9-4027-9030-d186088d6565",
        "save_date": "2022-03-21",
        "created_by": "GHC31861737",
        "is_turbo": false
    },
    {
        "wp_post_id": 2002,
        "looker_studio_url": "https://datastudio.google.com/reporting/170b6e6c-b997-45d7-aff1-7d3dbff4746d/page/oN2VC",
        "save_date": "2022-03-21",
        "created_by": "GHC31861737",
        "is_turbo": false
    },
    {
        "wp_post_id": 1171,
        "looker_studio_url": "https://lookerstudio.google.com/u/0/reporting/749acb54-23b6-461c-8b4d-b5434b74f6f1/page/KfARB",
        "save_date": "2023-02-11",
        "created_by": "GHC31861737",
        "is_turbo": true
    },
    {
        "wp_post_id": 2858,
        "looker_studio_url": "https://datastudio.google.com/reporting/3a645319-54bc-4f7e-88f2-08ae07b78d9c/page/xBHMC",
        "save_date": "2019-11-17",
        "created_by": "GHC31861737",
        "is_turbo": true
    }
]
const sharedDashboardIds = sharedDashboardInfo.map(dash => dash.wp_post_id) // [1171]

// Used just for delete functionality
const helpModalContent = [
    {
        order: 1,
        html: `
        <h2>Are you sure you want to delete this dashboard?</h2>
        <p>Deelting this dashboard will remove it from this page but it will still exist inside looker studio.</p>
        <p>View the dashboard inside your <a href="https://lookerstudio.google.com/u/0/navigation/reporting" target="_blank">Looker Studio Reports</a> to delete access to it permanently.</p>
        <a class="button" href="">Yes, delete</a>
        `
    }
]

// dynamically populated from supabase
// Lists version notes
let dashboardModalContent = []

//Get data from supabase database
async function getJSONData() {

    // This is a little messy and could be done better with a join
    // Limited supabase / postgress knowledge at this point

    // dashboards & tools table
    const baseurl = "https://rwmbrtwcuogykekepsfg.supabase.co/rest/v1/dashboards_and_tools?"
    const queryString = "select=id,name,elvanto,pco,ccb,fluro,health_category_id1(id,name,css_class),health_category_id2(id,name,css_class),description,info_link,dashboard_link,example_metrics,thumb,additional_setup,wp_post_id,plan,turbo_type,turbo_setup_url&order=plan"
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
    

    // Different chMSes
    const elvantoDashboardsData = newData.filter(dashboard => dashboard.elvanto)
    const pcoDashboardsData = newData.filter(dashboard => dashboard.pco)
    const ccbDashboardsData = newData.filter(dashboard => dashboard.ccb)
    const fluroDashboardsData = newData.filter(dashboard => dashboard.fluro)

    // Shared dashboards used 
    

    // Shared dashboards info
    if (userRoles.includes("team_member", "team_admin", "team_billing")) { 
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

    //deafault container to insert generated html into
    if (userRoles.includes("team_admin", "team_billing")) {
        let containerEl = document.getElementById("admin-cards")
    } else {
        containerEl = document.getElementById("team-cards")
    }

    // Loop through JSON userData to return html for dashboard cards
    const cardsHtml = userDataShared.map(item => {

        // set variable to show new release tag
        let updateNeeded = false;
        

        
        

        const thisDash = linkedDashboards.filter(dash => dash.wp_post_id === item.wp_post_id)[0]

        // if previously shared dashboard is no longer available on plan
        if (!thisDash) {
            console.log(`dashboard not available ${item.wp_post_id}`)
            return (`<article  class="strip">Previously shared dashboard not available on current plan</article>`)
        }

        // simple display for team members
        if(userRoles.includes("team_member")) {
            return (
                `<article  class="strip">
                    <span class="dashicons dashicons-analytics"></span>
                    <div class="strip-title">
                    <h3>${thisDash.name}
                        <!-- <span>(Secondary name if exists)</span> -->
                    </h3>
                    </div>
                    <a class="button" href="${item.looker_studio_url}">Open dashboard</a>  
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


        return (
            `<article  class="strip">
            <span class="dashicons dashicons-analytics"></span>
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
              <li>${item.is_turbo ? `<a href="#"><span class="dashicons dashicons-update"></span>Refresh data</a>` : `<a href="/account/#payments"><span class="dashicons dashicons-unlock"></span>Unlock turbo</a>`}</li>
                <li><a href="#" class="modal-link" data-modal="1"><span class="dashicons dashicons-remove"></span>Delete dashboard</a></li>
                <li><a href="${thisDash.info_link}"><span class="dashicons dashicons-media-document"></span>Read the docs</a></li>
                <li>Owner:  ${item.created_by}</li>
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
                    ? ` <a href="${item.info_link}"" class="button">Read docs</a>`
                    : ` <a href="${item.dashboard_link}" class="button">Open dashboard</a>
                    <a href="https://growinghealthierchurches.com/save-share-link/?share_post_id=${item.wp_post_id}" class="button secondary">Share dashboard</a>` }
                   
                  </div>
                  <img src="${item.thumb}">
                </div>
                <div class="content"> 
                  <p>${item.description}</p>
                  ${item.additional_setup ? `<p class="highlight"><a href="${item.additional_setup}">Additional setup required</a></p>` : `` }
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
                  ${item.additional_setup ? `<p class="highlight"><a href="${item.additional_setup}">Additional setup required</a></p>` : `` }
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
                console.log(dashboardModalContent)
                let thisContent = dashboardModalContent.filter(note => note.dashboard_id == e.target.dataset['modal'])       
                document.querySelector(".mymodal-content").innerHTML = `
                <h2>Updates available to dashboard:</h2>
                <p>Last updated: ${thisContent[0].updated}</p>
                <p>${thisContent[0].changes_made}</p>
                <a class="button" href="https://growinghealthierchurches.com/save-share-link/?share_post_id=${thisContent[0].wp_post_id}">Create a new share copy</a>
                `
            } 
            // static content modals
            else {
                let i = Number(e.target.dataset['modal']) - 1
                document.querySelector(".mymodal-content").innerHTML = helpModalContent[i].html
            }
        })

    })
    
    modalClose.addEventListener("click", function(e){   
        e.target.closest(".mymodal-overlay").classList.remove("show")
    })
}

     
