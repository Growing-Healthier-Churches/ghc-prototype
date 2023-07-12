/* Copy of onboarding/js with some different data */

const doneBtn = document.querySelectorAll(".done-btn, .skip-btn")
const modalClose = document.getElementById("mymodalClose")
const modalLink = document.querySelectorAll(".modal-link")


// Set states from urls
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString);
const step = urlParams.get('step')
console.log(queryString)
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



let doneItems = document.querySelectorAll(".timeline-item.done")


const helpModalContent = [
    {
        order: 1,
        html: `
        <h2>I can't see the menu!</h2>
        <p>The Looker Studio menu to create a shareable copy on appears when you hover over the top of the dashboard.</p> 
       <p>Add animated gif</p>
        `
    },
    {
        order: 2,
        html: `
        <h2>Why do I need to create a shared copy?</h2>
        <p>The original dashboard is owned by GHC, so when you share with others they will get an authentication failure. To share dashboards successfully you must first make a copy where you are the owner.</p>
        <p>A copied dashboard will not receive automatic updates when improvements are released. However we will notify you in myGHC if there are any updates available and you can make a new copy which will include these updates.</p>

        `
    },
    {
        order: 3,
        html : `
        <h2>Where do I change the data credentials?</h2>
       
        `
    },
    {
        order: 4,
        html : `
        <h2>Help! I’m getting a community connector error!</h2>
        <p>Click Authorize and paste in your Elvanto API key</p>
        <img src="https://growinghealthierchurches.com/wp-content/uploads/2020/11/API-connect.png" />
        `
    },
    {
        order: 5,
        html: `
        <h2>Help! I’m getting an “Empty Table” error!</h2>
        <img src="./ghc-setup-menu.gif" width="300" />
        `
    },
    {
        order: 6,
        html: `
        <h2>Why do I need to reconnect each data source?</h2>
        <p>You may notice this info bubble on the final screen of each data source:</p>
        <p>Data source editors can now refresh fields, edit connections and edit custom SQL.</p>
        <p>This has to do with who owns the data in google studio. To share a dashboard you first need to have permissions over the data sources it contains.</p>

        `
    },
    {
        order: 7,
        html: `
        <h2>Which filters can I customise?</h2>
       
        `
    },
    {
        order: 8,
        html: `
        <h2>Sharing data snapshots</h2>
        <p>I you just want a  static view of your dashboard you can: </p>
        <ul>
        <li>schedule pdf's of your dashboard to be sent via email at regular intervals. Simply open the share button and select "Schedule email delivery"</li>
        <li>download google sheet data from any table. Simply click the 3 dots in any table and select "Export to sheets"</li>
        </ul>
        
        `
    },
    {
        order: 9,
        html: `
        <h2>Why should I save my shared dashboard to GHC?</h2>
        <p>If you save your shared dashboard link to my GHC we can help you keep track of your dahboards</p>
        <ul>
            <li>We can let you know when updates are avilable to dashboards you've shared</li>
            <li>If you have a team account we will manage team members access to dashboards</li>
        </ul>
        <p>We value data too, and sharing your dashboards to your GHC account helps us keep track of how the product is being used. This information helps us to make vauable improvements</p>
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



