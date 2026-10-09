// ========================================
// BACKEND URL
// ========================================

const API = "http://localhost:8072";


// ========================================
// SCROLL TO RESERVATION
// ========================================

function scrollToReservation() {

    document.getElementById("reservation").scrollIntoView({
        behavior: "smooth"
    });
}


// ========================================
// RESERVE TABLE
// ========================================

function reserveTable() {

    const customerId =
        document.getElementById("customerId").value;

    const tableId =
        document.getElementById("tableId").value;

    const reservationDate =
        document.getElementById("reservationDate").value;

    const reservationTime =
        document.getElementById("reservationTime").value;

    const message =
        document.getElementById("message");


    // Check input
    if (!customerId ||
        !tableId ||
        !reservationDate ||
        !reservationTime) {

        message.innerText =
            "Please fill in all reservation details.";

        message.style.color = "#c0392b";

        return;
    }


    const url =
        API +
        "/reservations/reserve" +
        "?customerId=" + encodeURIComponent(customerId) +
        "&tableId=" + encodeURIComponent(tableId) +
        "&reservationDate=" + encodeURIComponent(reservationDate) +
        "&reservationTime=" + encodeURIComponent(reservationTime);


    message.innerText = "Processing reservation...";
    message.style.color = "#9b4d20";


    fetch(url, {
        method: "POST"
    })

    .then(response => {

        if (!response.ok) {
            throw new Error("Reservation failed");
        }

        return response.text();
    })

    .then(data => {

        message.innerText = "✓ " + data;
        message.style.color = "#2e8739";


        // Clear form
        document.getElementById("customerId").value = "";
        document.getElementById("tableId").value = "";
        document.getElementById("reservationDate").value = "";
        document.getElementById("reservationTime").value = "";


        // Refresh information
        loadStats();
        loadTables();
        loadReservations();

    })

    .catch(error => {

        console.error(error);

        message.innerText =
            "Unable to reserve the table. Please check table availability.";

        message.style.color = "#c0392b";
    });
}


// ========================================
// LOAD TABLES
// ========================================

function loadTables() {

    const container =
        document.getElementById("tablesContainer");

    container.innerHTML =
        "<p>Loading tables...</p>";


    fetch(API + "/tables")

    .then(response => {

        if (!response.ok) {
            throw new Error("Unable to load tables");
        }

        return response.json();
    })

    .then(data => {

        container.innerHTML = "";


        if (data.length === 0) {

            container.innerHTML =
                "<p>No tables found.</p>";

            return;
        }


        data.forEach(table => {

            const card =
                document.createElement("div");

            card.className = "table-card";


            const available =
                table.availability == 1;


            card.innerHTML = `

                <h3>🪑 Table ${table.tableNumber}</h3>

                <p>
                    <strong>Table ID:</strong>
                    ${table.tableId}
                </p>

                <p>
                    <strong>Capacity:</strong>
                    ${table.capacity} people
                </p>

                <p class="${available ? "available" : "unavailable"}">
                    ${available ? "● Available" : "● Reserved"}
                </p>

                ${
                    available
                    ?
                    `<button
                        class="primary-button"
                        onclick="selectTable(${table.tableId})">
                        Select Table
                    </button>`
                    :
                    ""
                }

            `;


            container.appendChild(card);

        });

    })

    .catch(error => {

        console.error(error);

        container.innerHTML =
            "<p>Unable to load tables.</p>";
    });
}
function releaseTable(tableId) {

    fetch(API + "/tables/release/" + tableId, {
        method: "PUT"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Unable to release table");
        }

        return response.text();
    })
    .then(message => {

        alert(message);

        loadTables();
        loadStats();
    })
    .catch(error => {

        console.error(error);
        alert("Unable to release table");
    });
}


// ========================================
// SELECT TABLE
// ========================================

function selectTable(tableId) {

    document.getElementById("tableId").value = tableId;

    scrollToReservation();

    document.getElementById("message").innerText =
        "Table " + tableId + " selected.";

    document.getElementById("message").style.color =
        "#9b4d20";
}


// ========================================
// LOAD RESERVATIONS
// ========================================

function loadReservations() {

    const table =
        document.getElementById("reservationTable");


    table.innerHTML = `
        <tr>
            <td colspan="5">
                Loading reservations...
            </td>
        </tr>
    `;


    fetch(API + "/reservations")

    .then(response => {

        if (!response.ok) {
            throw new Error("Unable to load reservations");
        }

        return response.json();
    })

    .then(data => {

        table.innerHTML = "";


        if (data.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="5">
                        No reservations found.
                    </td>
                </tr>
            `;

            return;
        }


        data.forEach(reservation => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>${reservation.reservationId}</td>

                <td>${reservation.customerId}</td>

                <td>${reservation.tableId}</td>

                <td>${reservation.reservationDate}</td>

                <td>${reservation.reservationTime}</td>

            `;


            table.appendChild(row);

        });

    })

    .catch(error => {

        console.error(error);

        table.innerHTML = `
            <tr>
                <td colspan="5">
                    Unable to load reservations.
                </td>
            </tr>
        `;
    });
}


// ========================================
// LOAD JOIN DETAILS
// ========================================

function loadReservationDetails() {

    const container =
        document.getElementById("detailsContainer");


    container.innerHTML =
        "<p>Loading reservation details...</p>";


    fetch(API + "/reservations/details")

    .then(response => {

        if (!response.ok) {
            throw new Error("Unable to load details");
        }

        return response.json();
    })

    .then(data => {

        container.innerHTML = "";


        if (data.length === 0) {

            container.innerHTML =
                "<p>No reservation details found.</p>";

            return;
        }


        data.forEach(item => {

            const card =
                document.createElement("div");

            card.className = "detail-card";


            card.innerHTML = `

                <h3>📋 Reservation #${item[0]}</h3>

                <p>
                    <strong>Customer:</strong>
                    ${item[1]}
                </p>

                <p>
                    <strong>Table:</strong>
                    ${item[2]}
                </p>

                <p>
                    <strong>Capacity:</strong>
                    ${item[3]} people
                </p>

                <p>
                    <strong>Date:</strong>
                    ${item[4]}
                </p>

                <p>
                    <strong>Time:</strong>
                    ${item[5]}
                </p>

            `;


            container.appendChild(card);

        });

    })

    .catch(error => {

        console.error(error);

        container.innerHTML =
            "<p>Unable to load reservation details.</p>";
    });
}


// ========================================
// LOAD ABOVE AVERAGE TABLES
// ========================================

function loadAboveAverage() {

    const container =
        document.getElementById("averageContainer");


    container.innerHTML =
        "<p>Analyzing reservation data...</p>";


    fetch(API + "/reservations/above-average")

    .then(response => {

        if (!response.ok) {
            throw new Error("Unable to load analytics");
        }

        return response.json();
    })

    .then(data => {

        container.innerHTML = "";


        if (data.length === 0) {

            container.innerHTML = `
                <div class="table-card">
                    <h3>No Popular Tables</h3>
                    <p>
                        No table has more reservations
                        than the current average.
                    </p>
                </div>
            `;

            return;
        }


        data.forEach(item => {

            const card =
                document.createElement("div");

            card.className = "table-card";


            card.innerHTML = `

                <h3>🔥 Table ${item[1]}</h3>

                <p>
                    <strong>Table ID:</strong>
                    ${item[0]}
                </p>

                <p>
                    <strong>Reservations:</strong>
                    ${item[2]}
                </p>

                <p class="available">
                    Above average
                </p>

            `;


            container.appendChild(card);

        });

    })

    .catch(error => {

        console.error(error);

        container.innerHTML =
            "<p>Unable to load analytics.</p>";
    });
}


// ========================================
// LOAD DASHBOARD COUNTS
// ========================================

function loadStats() {

    // Tables
    fetch(API + "/tables")

    .then(response => response.json())

    .then(data => {

        document.getElementById("tableCount").innerText =
            data.length;

    })

    .catch(error => {

        console.error(error);

        document.getElementById("tableCount").innerText =
            "0";
    });


    // Reservations
    fetch(API + "/reservations/count")

    .then(response => response.json())

    .then(data => {

        document.getElementById("reservationCount").innerText =
            data;

    })

    .catch(error => {

        console.error(error);

        document.getElementById("reservationCount").innerText =
            "0";
    });


    // Customers
    fetch(API + "/customers")

    .then(response => response.json())

    .then(data => {

        document.getElementById("customerCount").innerText =
            data.length;

    })

    .catch(error => {

        console.error(error);

        document.getElementById("customerCount").innerText =
            "0";
    });


    // Restaurants
    fetch(API + "/restaurants")

    .then(response => response.json())

    .then(data => {

        document.getElementById("restaurantCount").innerText =
            data.length;

    })

    .catch(error => {

        console.error(error);

        document.getElementById("restaurantCount").innerText =
            "0";
    });
}


// ========================================
// SET TODAY AS MINIMUM DATE
// ========================================

function setMinimumDate() {

    const dateInput =
        document.getElementById("reservationDate");

    const today =
        new Date().toISOString().split("T")[0];

    dateInput.min = today;
}


// ========================================
// PAGE LOAD
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    loadStats();

    setMinimumDate();

});