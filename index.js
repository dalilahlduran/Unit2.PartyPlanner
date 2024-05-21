
const COHORT = "2403-ftb-wt-web-pt";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;


const state = {
  events: [],
};


const fetchAllEvents = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    state.events = data.data;

    renderAllEvents();
  } catch (error) {
    console.log(error);
  }
};



const createNewEvents = async (name, description, date, location) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name, 
        description,
        date: new Date(date).toISOString(),
        location
      }),
    });
    await fetchAllEvents();
  } catch (error) {
    console.log(error);
  }
};


const removeEvent = async (id) => {
  try {
    console.log(id)
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    await fetchAllEvents();
  } catch (error) {
    console.log(error);
  }
};


const renderAllEvents = () => {
  const eventsContainer = document.getElementById("events-container");
  const eventList = state.events;

  if (!eventList || eventList.length === 0) {
    eventsContainer.innerHTML = "<h3>No events found</h3>";
    return;
  }


  eventsContainer.innerHTML = "";


  eventList.forEach((event) => {
    const eventElement = document.createElement("div");
    eventElement.classList.add("event-card");
    eventElement.innerHTML = `
            <h4>${event.name}</h4>
            <p>${event.description}</p>
            <p>${event.location}</p>
            <p>${event.date}</p>
            <button class="delete-button" data-id="${event.id}">Remove</button>
        `;
    eventsContainer.appendChild(eventElement);

    const deleteButton = eventElement.querySelector(".delete-button");

    deleteButton.addEventListener("click", () => {
      try {
        console.log(event)
        removeEvent(event.id);
      } catch (error) {
        console.log(error);
      }
    });
  });
};


const addListenerToForm = () => {
  const form = document.querySelector("#new-events-form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    await createNewEvents(
      form.name.value,
      form.description.value,
      form.date.value,
      form.location.value
    );

    form.name.value = "";
    form.description.value = "";
    form.date.value = "";
    form.location.value = "";
  });
};


const init = async () => {
  await fetchAllEvents();
  addListenerToForm();
};

init();