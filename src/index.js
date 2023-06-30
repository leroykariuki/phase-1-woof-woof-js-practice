document.addEventListener("DOMContentLoaded", () => {
   const div = document.querySelector("#dog-bar");
   fetch(" http://localhost:3000/pups")
      .then((res) => res.json())
      .then((dogsData) => handleDogData(dogsData))
      .catch((error) => console.log(error.message));

   function handleDogData(dogsData) {
      dogsData.forEach((dogs) => {
         const span = document.createElement("span");
         span.textContent = dogs.name;
         span.style.cursor = "pointer";
         div.append(span);

         //  ClickEvent
         span.addEventListener("click", () => {
            const dogInfo = document.getElementById("dog-info");
            dogInfo.innerHTML = `
                        <img src=${dogs.image} />
                        <h2>${dogs.name}</h2>
                        <button id="btn">${dogs.isGoodDog ? "Good Dog!" : "Bad Dog!"}</button>
                        `;
            const button = dogInfo.children[2];
            button.addEventListener("click", () => {
               dogs.isGoodDog = !dogs.isGoodDog;
               const updatedDogInfo = { isGoodDog: dogs.isGoodDog };

               //    Fetch
               fetch(`http://localhost:3000/pups/${dogs.id}`, {
                  method: "PATCH",
                  headers: {
                     "Content-Type": "application/json",
                     Accept: "application/json",
                  },
                  body: JSON.stringify(updatedDogInfo),
               })
                  .then((res) => res.json())
                  .then((dogData) => console.log(dogData))
                  .catch((err) => console.log(err.message));
               dogs.isGoodDog ? (button.textContent = "Good Dog!") : (button.textContent = "Bad Dog!");
            });
         });
      });
   }

   let dogs = [];
   let dogFilter = false;

   const filterBtn = document.getElementById("good-dog-filter");
   filterBtn.style.cursor = "pointer";
   filterBtn.addEventListener("click", () => {
      dogFilter = !dogFilter;
      dogFilter ? (filterBtn.textContent = "Filter good dogs: OFF") : (filterBtn.textContent = "Filter good dogs: ON");

      //   Filter good dogs from bad dogs
      const filteredDogs = dogs.filter((dog) => {
         dogFilter ? dog.isGoodDog : true;
      });

      let dogsList = document.getElementById("dog-bar");
      dogsList.innerHTML = "";
      handleDogData(filteredDogs);
   });
});