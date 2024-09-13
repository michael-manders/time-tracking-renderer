// const domtoimage = require("./domtoimage");

colors = {
    1: "#000000",
    2: "#a27eff",
    3: "#9eff73",
    4: "#ffff8f",
    5: "#a44eff",
    6: "#ff5aed",
    7: "#ffa74c",
    8: "#8befff",
    9: "#bababa",
    10: "#e798c9",
    11: "#99beff",
    12: "#86e3b7",
    13: "#ff6c6c",
    14: "#f1c232",
};

moodColors = {
    "-2": "#e06666",
    "-1": "#F0A066",
    0: "#ffd966",
    1: "#C9CF72",
    2: "#93c47d",
};

async function query() {
    const LINK =
        "https://docs.google.com/spreadsheets/d/1uNXQx-JghDqjkE0QRH9KnpQS0cbCRv-2Y-KNJojzOmE/export?format=csv&id=1uNXQx-JghDqjkE0QRH9KnpQS0cbCRv-2Y-KNJojzOmE&gid=0";

    let text = await fetch(LINK)
        .then((response) => response.text())
        .then((text) => text);

    let csv_temp = text.split("\n");
    let csv = [];
    csv_temp.forEach((row) => {
        // between 0 and 49
        csv.push(row.split(",").slice(0, 50));
    });

    let headers = csv[0].slice(0, csv[0].length - 1);
    ending = 0;
    let i = 1;
    for (let row of csv.slice(1, csv.length - 1)) {
        if (row[1] == "") {
            ending = i;
            break;
        }
        i++;
    }
    csv = csv.slice(1, i);

    return [csv, headers];
}

async function display(date1, date2) {
    let dat = await query();

    let csv = dat[0];
    let headers = dat[1];

    let table = document.getElementById("chart");
    // document.getElementById("chart").appendChild(table);

    let headRow = document.createElement("tr");
    for (let header of headers) {
        let headElm = document.createElement("th");
        headElm.innerHTML = header;
        headRow.appendChild(headElm);
    }

    table.appendChild(headRow);
    for (let row of csv) {
        let rowElm = document.createElement("tr");

        let lable = document.createElement("td");
        lable.innerHTML = row[0];
        lable.classList += "label";
        lable.style.backgroundColor = moodColors[row[row.length - 1]];

        rowElm.appendChild(lable);

        for (let cell of row.slice(1, row.length - 1)) {
            let cellElm = document.createElement("td");
            cellElm.style.backgroundColor = colors[cell];
            rowElm.appendChild(cellElm);
        }

        table.appendChild(rowElm);
    }

    let info = [
        [1, "Activity", "Description", "Hours", "Average"],
        [1, "Sleep", "", getStat(csv, 1)[0], getStat(csv, 1)[1]],
        [
            2,
            "School",
            "School work, school related events, homework",
            getStat(csv, 2)[0],
            getStat(csv, 2)[1],
        ],
        [3, "Family", "", getStat(csv, 3)[0], getStat(csv, 3)[1]],
        [
            4,
            "Friends",
            "With friends, activities with friends, in person",
            getStat(csv, 4)[0],
            getStat(csv, 4)[1],
        ],
        [5, "Driving", "", getStat(csv, 5)[0], getStat(csv, 5)[1]],
        [
            6,
            "Projects ",
            "Physical computing, practice coding",
            getStat(csv, 6)[0],
            getStat(csv, 6)[1],
        ],
        [
            7,
            "Hobbies",
            "Telescope, radio, reading",
            getStat(csv, 7)[0],
            getStat(csv, 7)[1],
        ],
        [
            8,
            "On call",
            "On call with friends",
            getStat(csv, 8)[0],
            getStat(csv, 8)[1],
        ],
        [
            9,
            "Waste",
            "YouTube, social media, video games",
            getStat(csv, 9)[0],
            getStat(csv, 9)[1],
        ],
        [10, "Exercise", "", getStat(csv, 10)[0], getStat(csv, 10)[1]],
        [11, "Chores", "", getStat(csv, 11)[0], getStat(csv, 11)[1]],
        [
            12,
            "Personal",
            "Hygiene, meals",
            getStat(csv, 12)[0],
            getStat(csv, 12)[1],
        ],
        [
            13,
            "Partner",
            "In person, on call",
            getStat(csv, 13)[0],
            getStat(csv, 13)[1],
        ],
        [
            14,
            "Work",
            "Job, internship, volunteer",
            getStat(csv, 14)[0],
            getStat(csv, 14)[1],
        ],
    ];

    let keyTable = document.getElementById("key");
    for (let row of info) {
        let rowElm = document.createElement("tr");

        let label = document.createElement("td");
        backgroundColor = colors[row[0]];
        label.style.backgroundColor = backgroundColor;
        label.classList += "keylabel";

        let key = document.createElement("td");
        key.classList += "key";
        key.innerHTML = row[1];

        let description = document.createElement("td");
        description.classList += "description";
        description.innerHTML = row[2];

        let count = document.createElement("td");
        count.classList += "count";
        count.innerHTML = row[3];

        let percentage = document.createElement("td");
        percentage.classList += "average";
        percentage.innerHTML = row[4];

        rowElm.appendChild(label);
        rowElm.appendChild(key);
        rowElm.appendChild(description);
        rowElm.appendChild(count);
        rowElm.appendChild(percentage);

        keyTable.appendChild(rowElm);
    }

    let d1 = csv[0][0];
    let d2 = csv[csv.length - 1][0];
    let count = csv.length - 1;

    let p = document.querySelector("#info > p");
    p.innerHTML = p.innerHTML
        .replace("d1", d1)
        .replace("d2", d2)
        .replace("c1", count);
}

function getStat(csv, number) {
    let count = 0;
    for (let row of csv) {
        for (let n of row.slice(1, row.length - 1)) {
            if (n == number) count++;
        }
    }
    return [
        Math.round(count / 2),
        Math.round((count / 2 / csv.length) * 100) / 100,
    ];
}

function download() {
    let elm = document.getElementById("display");

    // download image of elm using html2canvas
    html2canvas(elm).then(function (canvas) {
        console.log("rendered");
        let link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "image.png";
        link.click();
    });
}
