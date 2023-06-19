//Example variables - in live loaded from php
const userCHMS = "elvanto_user"
const userSubscription = "free"
let extraDashboards = ""
const sharedDashboardIds = [1171]
const userRoles = ["team_billing"]


//Get data from supabase database
async function getJSONData() {
    const baseurl = "https://rwmbrtwcuogykekepsfg.supabase.co/rest/v1/dashboards_and_tools?"
    const queryString = "select=id,name,elvanto,pco,ccb,fluro,health_category_id1(id,name,css_class),health_category_id2(id,name,css_class),description,info_link,dashboard_link,example_metrics,thumb,additional_setup,wp_post_id,plan&order=plan"
    const myApiKey = "&apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3bWJydHdjdW9neWtla2Vwc2ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODY3OTcyMjQsImV4cCI6MjAwMjM3MzIyNH0.SlxIj9CN17Y36gYD9husbYUZMX1mjTArKwu9mBGxxRQ"
   
    const response = await fetch(baseurl + queryString + myApiKey)
    const jsonData = await response.json();
    //render(jsonData)
    filterData(jsonData)
  }

getJSONData()

//Filter data base to return different arrays
function filterData(data) {

    //allow ourselves to mutate data
    let newData = data;

    //filter data for subscription-type
    if (userSubscription === "free") {
        newData =  data.filter(dashboard => dashboard.plan === "Free")
        extraDashboards = data.filter(dashboard => dashboard.plan !== "Free")
    }

    // Different chMSes
    const elvantoDashboardsData = newData.filter(dashboard => dashboard.elvanto)
    const pcoDashboardsData = newData.filter(dashboard => dashboard.pco)
    const ccbDashboardsData = newData.filter(dashboard => dashboard.ccb)
    const fluroDashboardsData = newData.filter(dashboard => dashboard.fluro)

    // Shared dashboards
    if (userRoles.includes("team_billing")) {
        const sharedDashboards = newData.filter(dashboard => sharedDashboardIds.includes(dashboard.wp_post_id))
        renderShared(sharedDashboards)
    }
   

    // Team dashbaords
    if (userRoles.includes("team_member")) {
        const teamDashboards = newData.filter(dashboard => sharedDashboardIds.includes(dashboard.wp_post_id))
        renderTeam(teamDashboards)
    }

    if (userCHMS == "elvanto_user") {
        renderAvailable(elvantoDashboardsData)
        if (extraDashboards) {
            renderSubscribe(extraDashboards.filter(dashboard => dashboard.elvanto))
        }
    }
    if (userCHMS == "pco_user") {
        renderAvailable(pcoDashboardsData)
        if (extraDashboards) {
            renderSubscribe(extraDashboards.filter(dashboard => dashboard.pco))
        }
    }
    if (userCHMS == "ccb_user") {
        renderAvailable(ccbDashboardsData)
        if (extraDashboards) {
            renderSubscribe(extraDashboards.filter(dashboard => dashboard.ccb))
        }
    }
    if (userCHMS == "ccb_user") {
        renderAvailable(fluroDashboardsData)
        if (extraDashboards) {
            renderSubscribe(extraDashboards.filter(dashboard => dashboard.fluro))
        }
    }
    

}

function renderShared(data) {

    // Hide team dashboards container
    document.getElementById("team-cards").style.display = "none"

    // When no dashboards have been shared
    if (data.length == 0) {
        document.getElementById("admin-cards").innerHTML += `<p>You have not shared any dashboards yet.</p>`
    }

    // Loop through JSON data to return html for dashboard cards
    const cardsHtml = data.map(item => {
        console.log("test")
        return (
            `
            <article class="card">
            <div class="content">
                <h2 class="header">${item.name}</h2>
                <h3>Secondary name if exists</h3>
                <img src="${item.thumb}">
                <div class="extra content">
                    <strong>owner:</strong> mike@tac.church
                </div>
            </div>
            <div class="content">
                <br>
                <a href="${item.dashboard_link}" class="button">Open dashboard</a>
                <br>
                <a href="${item.info_link}">Read the docs</a>
                <ul>
                    <li><a href="#"><span class="dashicons dashicons-update"></span>Refresh data</a></li>
                    <li><a href="#"><span class="dashicons dashicons-dashboard"></span>Sync dashboard with master</a></li>
                    <li><a href="#"><span class="dashicons dashicons-remove"></span>Delete dashboard</a></li>
                </ul> 
                <div class="meta">
                    <span class="tag release">New release available</span>
                </div>
            </div>
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
                    <a href="${item.dashboard_link}" class="button">Open dashboard</a>
                    <a href="https://growinghealthierchurches.com/save-share-link/?share_post_id=${item.wp_post_id}" class="button secondary">Share dashboard</a>
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
                    <a href="https://growinghealthierchurches.com/account/#payments" class="button">Upgrade plan</a>
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
    document.getElementById("available-dashboards").innerHTML += `<h2 class="subtitle">Upgrade to unlock more</h2>`
    document.getElementById("available-dashboards").innerHTML += cardsHtml
}

