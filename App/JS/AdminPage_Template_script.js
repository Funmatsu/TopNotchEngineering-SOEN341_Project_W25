// setTimeout(() => {
//     location.reload();
// }, 5000); // ✅ Reloads every 5 seconds

document.addEventListener('DOMContentLoaded', function() {
    const parentDiv = document.getElementById('friends-icon');
    const childDiv = document.getElementById('menu');

    parentDiv.addEventListener('click', function() {
        if (childDiv.style.visibility === "hidden") {
            childDiv.style.visibility = "visible";
            setTimeout(() => {
                childDiv.style.opacity = 1; // Hide after fade-out completes
            }, 1);

        } else{
            childDiv.style.opacity = 0;
            setTimeout(() => {
                childDiv.style.visibility = "hidden"; // Hide after fade-out completes
            }, 1);
        }
    });
});

const profile_icon_popup = document.querySelector(".profile-icon");
const popup = document.querySelector("#pop-up");
profile_icon_popup.onclick = function(){
    popup.style.display = "block";
    document.querySelector("#inside-pop-up").style.display = "block";
    document.querySelector("#team-addition-form").style.display = "none";
}
const back = document.querySelector("#back");
back.onclick = function() {
    popup.style.display = "none";
}
document.querySelector("#back2").onclick = function() {
    popup.style.display = "none";
}
document.querySelector("#add-teams").onclick = function() {
    popup.style.display = "block";
    document.querySelector("#inside-pop-up").style.display = "none";
    document.querySelector("#team-addition-form").style.display = "block";
}

    document.getElementById("create-team-button").addEventListener("click", async () => {
        generateDiv();
        const team_name = document.getElementById("team-name-input").value;
        const team_desc = document.getElementById("team-desc-input").value;
        
        console.log("📤 Sending Data:", { team_name, team_desc }); // ✅ Debugging
        
        const response = await fetch("http://localhost:3000/teams", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ team_name, team_desc }) // ✅ Correct property names!
        });
    
        const data = await response.json();
        if (data.success) {
            alert("✅ Team created successfully!");
            document.getElementById("team-name").value = "";
            document.getElementById("team-description").value = "";
        } else {
            alert("❌ Error creating team!");
        }
    });

// else alert("It doesnt even exist yet bud!");
function generateDiv() {
    // Create a new div element
    let newDiv = document.createElement("div");
    let newerDiv = document.createElement("div");
    let newerDivText = document.createElement("p");
    let roundDiv = document.createElement('div');

    // Add content to the new div
    newDiv.innerHTML = document.getElementById("team-name").value[0];
    newerDivText.innerHTML = `<strong>${document.getElementById("team-name").value}</strong> | ${document.getElementById("team-desc").value}`;
    roundDiv.innerHTML = document.getElementById("team-name").value[0];

    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);

    var rgbColor = "rgb(" + r + "," + g + "," + b + ")";
    
    newDiv.setAttribute("style", `position: relative;
        text-align: center;
        top: 5px;
        left: 12px;
        width: 25px;
        height: 25px;
        background-color: white;
        padding: 15px;
        padding-top: 12px;
        padding-bottom: 17px;
        background-color: ${rgbColor};
        border-radius: 50px;
        margin-top: 10px;
        margin-bottom: 20px;
        cursor: pointer;
        overflow: hidden;
        font-size: 30px;
        transition: background-color 0.2s ease;
        transition: padding 0.2s ease, left 0.2s ease;`);
    newDiv.addEventListener("mouseover", function() {
        newDiv.setAttribute("style", 
        `text-align: center;
        position: relative;
            top: 5px;
            left: 6px;
            width: 25px;
            height: 25px;
            background-color: white;
            padding: 15px;
            padding-top: 12px;
            padding-bottom: 17px;
            
            border-radius: 50px;
            margin-top: 10px;
            margin-bottom: 20px;
            cursor: pointer;
            overflow: hidden;
            font-size: 30px;
        background-color: ${rgbColor};
        padding: 22px;
        padding-top: 18px;
        padding-bottom: 24px;
        transition: padding 0.2s ease, left 0.2s ease;
        `);
    });
    newDiv.addEventListener("mouseout", function() {
        newDiv.setAttribute("style", `position: relative;
            text-align: center;
            top: 5px;
            left: 12px;
            width: 25px;
            height: 25px;
            background-color: white;
            padding: 15px;
            padding-top: 12px;
            padding-bottom: 17px;
            background-color: ${rgbColor};
            border-radius: 50px;
            margin-top: 10px;
            margin-bottom: 20px;
            cursor: pointer;
            overflow: hidden;
            font-size: 30px;
            transition: padding 0.2s ease, left 0.2s ease;`);
    });
    newDiv.className = "generated";

    // Append the new div to the container
    // var container = document.getElementById("container");
    document.querySelector("#teams-container").appendChild(newDiv);

    newerDiv.setAttribute("style", 
        `margin-top: 10px;
        padding: 15px;
        padding-left: 50px;
        margin-bottom: 10px;
        border-radius: 20px;
        height: 50px;
        cursor: pointer;
        `);

        newerDiv.addEventListener("mouseover", function(){
            newerDiv.setAttribute("style", 
                `margin-top: 10px;
                color: black;
                background-color: rgb(44, 121, 202);
                margin-bottom: 10px;
                padding: 15px;
                padding-left: 50px;
                border-radius: 20px;
                height: 50px;
                cursor: pointer;
                transition: background-color 0.2s ease-in-out;
                `);
        });

        newerDiv.addEventListener("mouseout", function(){
            newerDiv.setAttribute("style", 
                `margin-top: 10px;
                color: black;
                margin-bottom: 10px;
                padding: 15px;
                padding-left: 50px;
                border-radius: 20px;
                height: 50px;
                cursor: pointer;
                transition: background-color 0.2s ease-in-out;
                `);
        });
        
        roundDiv.setAttribute("style", `
            width: 30px;
            text-align: center;
            border-radius: 50px;
            background-color: ${rgbColor};
            padding-top: 3px;
            padding-bottom: 3px;
            left: -50px;
            top: -45px;
            position: relative;
            margin: 10px;
            `);
    
    newerDiv.id = "generatedNew";
    let teamname = document.getElementById("team-name").value;
    newDiv.onclick = function() {
        window.location.href = `../HTML/AdminPage_Template_Teams.html?username=${username}&teamname=${teamname}`;
    }
    newerDiv.onclick = newDiv.onclick;
    newerDiv.appendChild(newerDivText);
    document.getElementById("custom-team-container").appendChild(newerDiv);
    newerDiv.appendChild(roundDiv);    
    back.onclick();
    
}

const adminPageHeader = document.getElementById("admin-page-header");
const params = new URLSearchParams(window.location.search);
const username = params.get("username");

if (username) {
    adminPageHeader.innerText = `Welcome, ${username}!`;
}

function fetchTeams() {
    fetch("http://localhost:3000/teams")
    .then(response => response.json())
    .then(data => {
        console.log("✅ Fetched teams:", data); // ✅ Debugging

        if (!data.teams || !Array.isArray(data.teams)) {
            console.error("❌ Expected an array but got:", data);
            return;
        }

        const teamsContainer = document.querySelector("#teams-container"); // ✅ Ensure your HTML has an element with this ID
        teamsContainer.innerHTML = ""; // ✅ Clear existing teams before updating

        data.teams.forEach(team => {
            document.getElementById("team-name").value = team.name;
            document.getElementById("team-desc").value = team.description;
            generateDiv();
        });
    })
    .catch(error => console.error("❌ Error fetching teams:", error));
}
document.addEventListener("DOMContentLoaded", fetchTeams());
