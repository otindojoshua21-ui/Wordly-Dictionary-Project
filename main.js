
const form = document.getElementById("form");      // this will be the form element that contains the input and submit button
const result = document.getElementById("result");         // this will be the div where we will display the results from the API
const toggleButton = document.getElementById("toggleTheme");  // this will be the button to toggle between light and dark mode


toggleButton.addEventListener("click", function() {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    toggleButton.textContent = "Light Mode ☀️";
  } else {
    toggleButton.textContent = "Dark Mode 🌙";
  }
});


form.addEventListener("submit", function(event) {             // this will listen for the form submission event in html and execute the function when the form is submitted
  event.preventDefault();

  const wordInput = document.getElementById("wordInput");
  const word = wordInput.value.trim();

  result.innerHTML = "Loading...";

  const apiUrl = ` https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

  fetch(apiUrl)
    .then(function(response) {
      if (!response.ok) {
        throw new Error("Word not found");
      }
      return response.json();
    })



    .then(function(data) {
      const firstResult = data[0];
      const firstMeaning = firstResult.meanings[0];
      const firstDefinition = firstMeaning.definitions[0];
      const definition = firstDefinition.definition;
      const partOfSpeech = firstMeaning.partOfSpeech;
      const example = firstDefinition.example;

    

      let audioUrl = "";
      if (firstResult.phonetics && firstResult.phonetics.length > 0) {
        audioUrl = firstResult.phonetics[0].audio;
      }


      result.innerHTML = `
        <div class="card">
          <h2>${word}</h2>
          <p><strong>Part of Speech:</strong> ${partOfSpeech}</p>
          <p><strong>Definition:</strong> ${definition}</p>
          <p><strong>Example:</strong> ${example || "No example available"}</p>


          ${audioUrl
              ? `<button id="playAudio">🔊 Play Pronunciation</button>`
              : `<p>No audio available</p>`
          }
        </div>
      `;



      const playButton = document.getElementById("playAudio");
      if (playButton && audioUrl) {
        playButton.addEventListener("click", function() {
          const audio = new Audio(audioUrl);
          audio.play();
        });
      }

      

      wordInput.value = "";})
    .catch(function(error) {
      result.innerHTML = `<p>${error.message}</p>`;
    });
});