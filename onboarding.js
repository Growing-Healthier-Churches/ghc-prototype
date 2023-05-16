const doneBtn = document.querySelectorAll(".done-btn")
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
    document.getElementById("step3").classList.remove("closed")
} else if (step == "4") {
    document.getElementById("step1").classList.add("done")
    document.getElementById("step1").classList.add("completed-closed")
    document.getElementById("step2").classList.add("done")
    document.getElementById("step2").classList.add("completed-closed")
    document.getElementById("step3").classList.add("done")
    document.getElementById("step3").classList.add("completed-closed")
    document.getElementById("step4").classList.remove("closed")
} else if (step == "5") {
    document.getElementById("step1").classList.add("done")
    document.getElementById("step1").classList.add("completed-closed")
    document.getElementById("step2").classList.add("done")
    document.getElementById("step2").classList.add("completed-closed")
    document.getElementById("step3").classList.add("done")
    document.getElementById("step3").classList.add("completed-closed")
    document.getElementById("step4").classList.add("done")
    document.getElementById("step4").classList.add("completed-closed")
    document.getElementById("step5").classList.remove("closed")
}



let doneItems = document.querySelectorAll(".timeline-item.done")


const helpModalContent = [
    {
        order: 1,
        html: `
        <h2>Why do I need to distinguish between new people and members?</h2>
        <p>People categories help map the movement of people from newcomer to members.</p> 
        <p>You might have several people categories that represent newcomers and members but these two broader distinctions are important.</p>
        <p>The goal is that we want newcomers to become members and we want members to express their membership in attending, serving and discipleship (and giving).
        </p>
        <img src="https://growinghealthierchurches.com/wp-content/uploads/2021/10/GHC-On-boarding-infographic.jpg" alt="Infographic showing flow of users" />
        `
    },
    {
        order: 2,
        html: `
        <h2>How do I edit my People and Group categories?</h2>
        <p>Edit your people categories so that members have an underscore</p>
        <img src="https://growinghealthierchurches.com/wp-content/uploads/2023/03/image-7.png" width="300" alt="Elvanto edit people categories"/>
        <p>In a similar way to people categories, demarcate the category of "discipleship groups" with an underscore . Do this by going to Admin > Groups > Categories</p>
        <img src="https://growinghealthierchurches.com/wp-content/uploads/2023/03/image-5.png" width="300" />   `
    },
    {
        order: 3,
        html : `
        <h2>Where do I access my API key?</h2>
        <p>Step 1: In the admin page of your ChMS select settings. Scroll to the bottom and under the Developers heading select API</p>
        <p>Step 2: Next to 'Your Secrete API Key is" click "Show" and copy the key for the next setup step</p>
        <img src="https://growinghealthierchurches.com/wp-content/uploads/2020/11/API-screen-1024x297.png" />
        `
    },
    {
        order: 4,
        html : `
        <h2>First time Looker Studio login</h2>
        <p>Click Authorize and paste in your Elvanto API key</p>
        <img src="https://growinghealthierchurches.com/wp-content/uploads/2020/11/API-connect.png" />
        `
    },
    {
        order: 5,
        html: `
        <h2>Where is the setup checklist?</h2>
        <img src="./ghc-setup-menu.gif" width="300" />
        `
    },
    {
        order: 6,
        html: `
        <h2>Where can I check my data quality?</h2>
        <img src="./ghc-data-quality.gif" width="245" />
        `
    },
    {
        order: 7,
        html: `
        <h2>Understanding graphs</h2>
        <p>We understand that this information can be a lot to take in all at once! This is something you will get better at with practice.</p> 
        <p>Watch this video for an overview of the main dashboards</p>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/JTsoZg-p7wI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        <p>Check out this page for a <a href="https://growinghealthierchurches.com/health-toolkit-elvanto/">detailed breakdown</a> of the charts in our Health Toolkit</p>
        `
    },
    {
        order: 8,
        html: `
        <h2>How can I download a pdf?</h2>
        <p>Hover your mouse over the top of your GHC dashboards and a hidden menu will appear</p>
        <p>In the share dropdown select 'Download report'</p>
        <img src="./ghc-pdf.gif" width="400" />
        
        `
    },
    {
        order: 9,
        html: `
        <h2>How can I share my dashboard?</h2>
        <p>To share dashboards you will need to go through a few steps. <a href="https://growinghealthierchurches.com/save-share-link/">These instructions</a> will guide you through the process.</p>
        <p>You can also watch this video if you prefer</p>
        <iframe width="520" height="300" src="https://www.youtube.com/embed/dHTKs7HIbzk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        
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
        
        // remove closed class from next step
        document.getElementById("step" + thisStep).classList.remove("closed")
        // update done button text and styles
        element.innerHTML = "completed"
        element.classList.remove("done-btn")
        element.classList.add("complete-btn")

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



