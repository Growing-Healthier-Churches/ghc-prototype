/* Copy of onboarding/js with some different data */




const doneBtn = document.querySelectorAll(".done-btn, .skip-btn")
const modalClose = document.getElementById("mymodalClose")
const modalLink = document.querySelectorAll(".modal-link")


// Set states from urls
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString);
const step = urlParams.get('step')
const dashboardSelected = urlParams.get('share_post_id')

//example variables - loaded from wordpress
// used to populate <select> in form
let userCHMS = "elvanto_user" //elvanto_user, pco_user
let userSubscription = "large" // free, small, medium, large



if (step == "1") {
    // do nothing, default state of page
} else if (step == "2") {
    document.getElementById("step1").classList.add("done")
    document.getElementById("step1").classList.add("completed-closed")
    document.getElementById("step2").classList.remove("closed")
} else if (step == "3") {
    document.getElementById("step1").classList.add("done")
    document.getElementById("step1").classList.add("completed-closed")
    document.getElementById("step2").classList.add("done")
    document.getElementById("step2").classList.add("completed-closed")
    document.getElementById("step2").classList.remove("closed")
    document.getElementById("step3").classList.remove("closed")
} else if (step == "4") {
    document.getElementById("step1").classList.add("done")
    document.getElementById("step1").classList.add("completed-closed")
    document.getElementById("step2").classList.add("done")
    document.getElementById("step2").classList.add("completed-closed")
    document.getElementById("step2").classList.remove("closed")
    document.getElementById("step3").classList.add("done")
    document.getElementById("step3").classList.add("completed-closed")
    document.getElementById("step3").classList.remove("closed")
    document.getElementById("step4").classList.remove("closed")
} else if (step == "5") {
    document.getElementById("step1").classList.add("done")
    document.getElementById("step1").classList.add("completed-closed")
    document.getElementById("step2").classList.add("done")
    document.getElementById("step2").classList.add("completed-closed")
    document.getElementById("step2").classList.remove("closed")
    document.getElementById("step3").classList.add("done")
    document.getElementById("step3").classList.add("completed-closed")
    document.getElementById("step3").classList.remove("closed")
    document.getElementById("step4").classList.add("done")
    document.getElementById("step4").classList.add("completed-closed")
    document.getElementById("step4").classList.remove("closed")
    document.getElementById("step5").classList.remove("closed")
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

  getJSONData()

function filterData(data) {
    
    //allow ourselves to mutate data
    let newData = data;

    //filter data for subscription-type
    if (userSubscription === "free") {
        newData = data.filter(dashboard => dashboard.plan === "Free")
    } 

    // remove non-dashboard tools
    newData = newData.filter(dashboard => dashboard.plan !== "Separate subscription") 

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
    
    // Loop through JSON data to return html for dashboard cards
    const selectHtml = data.map(item => {
        return (
            `
            <option value="${item.wp_post_id}" ${dashboardSelected == item.wp_post_id ? "selected" : ""}>${item.name}</option>
            `
    )}).join('')

    const chosenDashboard = data.filter((item) => dashboardSelected == item.wp_post_id)

    // Insert HTML into page
    const dashboardSelects = document.querySelectorAll(".dashboard-select");
    dashboardSelects.forEach((select) => {
        select.innerHTML += selectHtml;
    });
    document.getElementById("dashboard-to-share").textContent = `Open ${chosenDashboard[0].name} dashboard`
    document.getElementById("dashboard-to-share").href = `${chosenDashboard[0].dashboard_link} `
  
}

let doneItems = document.querySelectorAll(".timeline-item.done")


const helpModalContent = [
    {
        order: 1,
        html: `
        <h2>I can't see the menu!</h2>
        <p>The Looker Studio menu to create a shareable copy on appears when you hover over the top of the dashboard.</p> 
       <img src="dashboard_make_a_copy.gif" "Reveal menu on hover" />
        `
    },
    {
        order: 2,
        html: `
        <h2>Why do I need to create a shared copy?</h2>
        <p>The original dashboard is owned by GHC, so when you share with others they will get an authentication failure. </p>

        <p>To share dashboards successfully you must first make a copy where you are the owner.</p>
        <p>A copied dashboard will not receive automatic updates when improvements are released. However we will notify you in myGHC if there are any updates available and you can make a new copy which will include these updates.</p>

        `
    },
    {
        order: 3,
        html : `
        <h2>Where do I manage data sources?</h2>
       <img src="reauthenticate_sources.gif" alt="process of changing data sources" />
        `
    },
    {
        order: 4,
        html : `
        <h2>Where do I change the data credentials?</h2>
        <img src="data_credentials.gif" alt="process of changing data credentials" />
        `
    },
    {
        order: 5,
        html : `
        <h2>Help! I’m getting a community connector error!</h2>
       <p>This error exists because one/both of your attendance reports is returning "No Results". To get around this create dummy attendance results in a single service or group report. It doesn't matter if you you select no one attends, it's simply that this error occurs when the reports return empty results. No attendance is still a result.</p>
       <img src="https://growinghealthierchurches.com/wp-content/uploads/2021/08/Screen-Shot-2021-08-18-at-1.25.19-pm.png" />
        `
    },
    {
        order: 6,
        html: `
        <h2>Help! I’m getting an “Empty Table” error!</h2>
        <p>Note that in some cases the reconnection will produce an error. In this case a dialogue box will appear, select "OK" and then select "FIELDS →" under the blue "RECONNECT" button.</p>
        `
    },
    {
        order: 7,
        html: `
        <h2>Why do I need to reconnect each data source?</h2>
        <p>You may notice this message on the final screen of each data source:<br/>
        "Data source editors can now refresh fields, edit connections and edit custom SQL."</p>
        <p>This has to do with who owns the data in google studio. To share a dashboard you first need to have permissions over the data sources it contains.</p>

        `
    },
    {
        order: 8,
        html: `
        <h2>Which filters can I customise?</h2>
       <img src="https://growinghealthierchurches.com/wp-content/uploads/2020/12/Default-Locations-1024x829.png" />
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
    }

]



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
        
        console.log(thisItem.classList)
        console.log(document.getElementById("step" + thisStep))
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
        

        // update done items
        doneItems = document.querySelectorAll(".timeline-item.done")
        accordion()
    })

});

modalLink.forEach(element => {
    element.addEventListener("click", function(e){
        e.preventDefault()
        let i = Number(e.target.dataset['help']) - 1
        document.querySelector(".mymodal-overlay").classList.add("show")
        document.querySelector(".mymodal-content").innerHTML = helpModalContent[i].html
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
            console.log(e.target.innerHTML)
            e.target.closest(".timeline-item").classList.remove("completed-closed")
        })
       
    })
}

accordion()



