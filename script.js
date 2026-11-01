// Find the Run checks button in the HTML
const checkButton = document.getElementById("checkButton");

// Find container where translation entries will appear
const stringList = document.getElementById("stringList");

// Find the element that display the number of entries
const stringCount = document.getElementById("stringCount");

// Find the container where checking results will appear
const result = document.getElementById("result");

// Create an empty array to store translation entries
const translations = [];


 // Create a function to read and save the translation fields
function addTranslation() {

    // Get the values from the input fields
    const key = document.getElementById("translationKey").value.trim();
    const english = document.getElementById("english").value.trim();
    const spanish = document.getElementById("spanish").value.trim();
    const indonesian = document.getElementById("indonesian").value.trim();

    // Make sure the key is not empty
    if (key === "") {
        alert("Please enter a translation key.");
        return false;
    }

    // Prevent duplicate translation keys
    if (translations.some(entry => entry.key === key)) {
        alert("This translation key already exists. Please use a different key.");
        return false;
    }

    // Group the translations into one object
    const entry = {
        key: key,
        English: english,
        Spanish: spanish,
        Indonesian: indonesian
    };

    // Add the newest entry to the beginning of the array
    translations.unshift(entry);

    // Update the list shown on the webpage
    displayTranslations();

    // Clear the input fields after saving
    document.getElementById("translationKey").value = "";
    document.getElementById("english").value = "";
    document.getElementById("spanish").value = "";
    document.getElementById("indonesian").value = "";
    // Clear the previous results
    result.innerHTML = "";

    // Tell the caller that the entry was added successfully
    return true;
}


    // Define a function that displays all saved translation entries
    function displayTranslations(){

        // Clear the current list before displaying it again.
        stringList.innerHTML = "";

        // Loop through every translation entry in thr array
        // "entry" represents the current translation object in the loop
        // "index" represents the position of the current entry in the array (from 0)
        translations.forEach((entry, index) => {

        // Create a new div element to hold one translation entry
        const card = document.createElement("div");
        // Give the div a class name for styling
        card.className = "string-card";

        // Create an h3 element for the translation key
        const heading = document.createElement("h3");
        heading.textContent = entry.key; // Put the translation key inside the heading
        card.appendChild(heading); // Add the heading to the card
    

        // Go through the three languages
        for (const language of ["English", "Spanish", "Indonesian"]){

            // Create a paragraph for the current language
            const line = document.createElement("p");
            // Display the translation or "Missing" if it's empty
            line.textContent = language + ": " + (entry[language] || "Missing");
            // Add the paragraph to the translation card
            card.appendChild(line); 
            }

        // Add the completed card to the webpage
        stringList.appendChild(card);

        // Put the results under the newly added entry
        if (index === 0){
            stringList.appendChild(result); // Put the results container under the newest entry
        }

            //Create a divider between the newest entry and older entries
            if(translations.length > 1 && index === 0){
            const divider = document.createElement("hr");
            divider.className = "translation-divider";
            stringList.appendChild(divider);
        }
    });

            // Update the number of saved entries
            // Use singular "string added" for one entry
            // Use plural "strings added" for more than one entry
            stringCount.textContent =
                translations.length + (translations.length === 1 ? " string added" : " strings added");
        }

        // Run the checking function when the Run checks button is clicked
        checkButton.addEventListener("click", function(){

            // Clear previous results
            result.innerHTML = "";

            // Add the current translation
            const added = addTranslation();

            // Stop if the entry could not be added (e.g., due to a duplicate key)
            if (!added) {
                 result.textContent = "Please fix the issues above before running checks.";
                return;
            }

            // Create an empty array to store detected issues
            const issues = [];

            // Check every translation entry
            for (const entry of translations){

                // Check each language for missing text
                for (const language of ["English", "Spanish", "Indonesian"]){
                    if (entry[language] === ""){
                        issues.push({
                            key: entry.key,
                            language: language,
                            message: "Missing translation"
                        });
                    }
                }

                // Warn if the Spanish text exactly matches the English text
                if (entry.Spanish !== "" && entry.Spanish === entry.English){
                    issues.push({
                        key: entry.key,
                        language: "Spanish",
                        message: "Same text as English. Check wether this is intentional."
                    });
                }

                // Warn if the Indonesian text exactly matches the English text
                if(entry.Indonesian !== "" && entry.Indonesian === entry.English){
                    issues.push({
                        key: entry.key,
                        language: "Indonesian",
                        message: "Same text as English. Check wether this is intentional."
                    });
                }
            }

            // Display a message if no issues were detected
            if (issues.length === 0){
                result.textContent = "No issues detected in your translation entries.";
                return;
            }

            // Create a heading showing the total number of issues
            const heading = document.createElement("h2");
            heading.textContent = issues.length + " potential issue(s) found";
            result.appendChild(heading);

            // Display each detected issue
            for (const issue of issues){
                
                // Create a container for this issue
                const card = document.createElement("div");
                card.className = "issue-card";

                // Create a heading showing the key and language
                const title = document.createElement("h3");
                title.textContent = issue.key + " . " + issue.language;
                card.appendChild(title);

                // Create a paragraph explaining the issue
                const message = document.createElement("p");
                message.textContent = issue.message;
                card.appendChild(message);

                // Add the issue card to the results container
                result.appendChild(card);
            }
        });