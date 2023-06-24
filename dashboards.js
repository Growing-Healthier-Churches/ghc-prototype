

//Example variables - in live loaded from php
const userCHMS = "elvanto_user" //elvanto_user, pco_user
const userSubscription = "free" //free
// const sharedDashboardIds = [1169] //1169 - check-up (elvanto), 1171 - toolkit (elvanto)
const userRoles = ["team_billing"] //team_billing, team_member, team_admin
const ghcNotify = ["active"] //relevant value: active
let extraDashboards = ""
const sharedDashboardInfo = [
    {
        created_by: "GHC007",
        is_turbo: false,
        looker_studio_url: "https://lookerstudio.google.com/u/0/reporting/8a910ffd-96fa-438b-a259-e6b1398e00c7/page/KfARB",
        wp_post_id: 1171, //from post_id to wp_post_id
        save_date: "06/23/2023"
    }
]
const sharedDashboardIds = sharedDashboardInfo.map(dash => dash.wp_post_id) // [1171]


const helpModalContent = [
    {
        order: 1,
        html: `
        <h2>Are you sure you want to delete this dashboard?</h2>
        <p>Deelting this dashboard will remove it from this page but it will still exist inside looker studio.</p>
        <p>View the dashboard inside your <a href="https://lookerstudio.google.com/u/0/navigation/reporting" target="_blank">Looker Studio Reports</a> to delete access to it permanently.</p>
        <a class="button" href="">Yes, delete</a>
        `
    },
    {
        order: 2,
        html: `
        <h2>Placeholder content</h2>
        <p>This will contain all the information about the latest release and a call to action</p>   
        
        `
    }

]

let dashboardModalContent = []

//Get data from supabase database
async function getJSONData() {
    const baseurl = "https://rwmbrtwcuogykekepsfg.supabase.co/rest/v1/dashboards_and_tools?"
    const queryString = "select=id,name,elvanto,pco,ccb,fluro,health_category_id1(id,name,css_class),health_category_id2(id,name,css_class),description,info_link,dashboard_link,example_metrics,thumb,additional_setup,wp_post_id,plan&order=plan"
    const myApiKey = "&apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3bWJydHdjdW9neWtla2Vwc2ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODY3OTcyMjQsImV4cCI6MjAwMjM3MzIyNH0.SlxIj9CN17Y36gYD9husbYUZMX1mjTArKwu9mBGxxRQ"
   
    // piece together url
    const response = await fetch(baseurl + queryString + myApiKey)
    const jsonData = await response.json();
    //render(jsonData)
    filterData(jsonData)

     //versioning info for shared dashboards
     const baseurl2 = "https://rwmbrtwcuogykekepsfg.supabase.co/rest/v1/dashboard_versions?"
     const queryString2 = "select=*"
     // piece together url
     const response2 = await fetch(baseurl2 + queryString2 + myApiKey)
     const jsonData2 = await response2.json();
     filterVersionData(jsonData2, sharedDashboardIds)
 
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
        newData =  data.filter(dashboard => dashboard.plan === "Free")
        extraDashboards = data.filter(dashboard => dashboard.plan !== "Free" )
    } 

    //Handle GHC_notify
    if (ghcNotify.includes("active")) {  
        let additionalDashboards = data.filter(dashboard => dashboard.plan === "Separate subscription")      
        newData.push(additionalDashboards[0])
        extraDashboards = extraDashboards.filter(dashboard => dashboard.plan !== "Separate subscription")
    }
    

    // Different chMSes
    const elvantoDashboardsData = newData.filter(dashboard => dashboard.elvanto)
    const pcoDashboardsData = newData.filter(dashboard => dashboard.pco)
    const ccbDashboardsData = newData.filter(dashboard => dashboard.ccb)
    const fluroDashboardsData = newData.filter(dashboard => dashboard.fluro)

    // Shared dashboards
    if (userRoles.includes("team_billing" || "team_admin")) {
        const sharedDashboards = newData.filter(dashboard => sharedDashboardIds.includes(dashboard.wp_post_id))        
        renderShared(sharedDashboardInfo, sharedDashboards)
    }

    // Team dashbaords
    if (userRoles.includes("team_member")) {   
        const teamDashboards = newData.filter(dashboard => sharedDashboardIds.includes(dashboard.wp_post_id))
        renderTeam(teamDashboards)
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

function renderShared(data, linkedDashboards) {

    let updateNeeded = false;

    // Hide team dashboards container
    document.getElementById("team-cards").style.display = "none"

    // When no dashboards have been shared
    if (data.length == 0) {
        document.getElementById("admin-cards").innerHTML += `<p class="info-msg">You have not shared any dashboards yet. <a href="https://growinghealthierchurches.com/save-share-link/">Follow the instructions</a> to share dashboards with your team.</p>`
    }

    // Loop through JSON data to return html for dashboard cards
    const cardsHtml = data.map(item => {

        
        const thisDash = linkedDashboards.filter(dash => dash.wp_post_id === item.wp_post_id)[0]
        
        console.log("this dash is")
        console.log(thisDash)
       
        return (
            `<article  class="strip">
            <span class="dashicons dashicons-analytics"></span>
            <div>
              <h3>${thisDash.name}
                <span>(Secondary name if exists)</span>
              </h3>
             
            </div>
            <a class="button" href="${item.looker_studio_url}">Open dashboard</a>  
            <nav role="navigation" class="actions tag">
              Actions <span class="dashicons dashicons-arrow-down-alt2"></span>
              <ul>
              <li>${thisDash.is_turbo ? `<a href="#"><span class="dashicons dashicons-update"></span>Refresh data</a>` : `<a href="/account/#payments"><span class="dashicons dashicons-unlock"></span>Unlock turbo</a>`}</li>
                <li><a href="#" class="modal-link" data-modal="1"><span class="dashicons dashicons-remove"></span>Delete dashboard</a></li>
                <li><a href="${thisDash.info_link}"><span class="dashicons dashicons-media-document"></span>Read the docs</a></li>
              </ul>   
            </nav>
            <p>Owner:  ${item.created_by}</p>
            ${updateNeeded ?
                `<a class="tag release modal-link" href="" data-modal="${item.id}">New release available</a>`
            : ``}
        </article>
            `
    )}).join('')


    // Insert HTML into page
    document.getElementById("admin-cards").innerHTML += cardsHtml

}

function renderTeam(data) {

    // Hide admin dashboards container
    document.getElementById("admin-cards").style.display = "none"

    // When no dashboards have been shared
    if (data.length == 0) {
        document.getElementById("admin-cards").innerHTML += `<p>You have no team dashbaords shared. Speak to your team admin</p>`
    }

    // Loop through JSON data to return html for dashboard cards
    const cardsHtml = data.map(item => {
     
        return (
            `
            <article class="card">
            <div class="content">
                <h2 class="header">${item.name}</h2>
                <div class="dimmable image">
                    <div class="dimmer">
                          <a href="${item.dashboard_link}" class="button">Open dashboard</a>
                          <a class="button secondary" href="${item.info_link}">Read docs</a>
                    </div>
                    <img src="${item.thumb}">
                </div>
            </div>
            <div class="content"> 
            <p>${item.description}</p>
              <div class="extra content">
                <strong>measures:</strong> ${item.example_metrics}
                <div class="meta">
                ${item.health_category_id1 ? `<span class="tag ${item.health_category_id1.css_class}">${item.health_category_id1.name}</span>` : ``}
                ${item.health_category_id2 ? `<span class="tag ${item.health_category_id2.css_class}">${item.health_category_id2.name}</span>` : ``}
                </div>
                </div>
            </div>
          </article>
            `
    )}).join('')


    // Insert HTML into page
    document.getElementById("team-cards").innerHTML += cardsHtml

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






function setModals() {

    const modalClose = document.getElementById("mymodalClose")
    const modalLink = document.querySelectorAll(".modal-link")  

    modalLink.forEach(element => {
        
        element.addEventListener("click", function(e){
            e.preventDefault()
            let i = Number(e.target.dataset['modal']) - 1
            document.querySelector(".mymodal-overlay").classList.add("show")
            document.querySelector(".mymodal-content").innerHTML = helpModalContent[i].html
            console.log(helpModalContent[i].html)
        })
    })
    
    modalClose.addEventListener("click", function(e){   
        e.target.closest(".mymodal-overlay").classList.remove("show")
    })
}

