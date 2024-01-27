import { sortKey } from "../models/sort";

const optionsContainerSelector = ".sort-options";
const optionsSelector = ".sort-option";
const buttonSelector = "#sortMenuButton";

let onSortCallbackFunction: (value: sortKey) => void;
let isOpen = false;

export function sortSelector(onSort: typeof onSortCallbackFunction) {
  onSortCallbackFunction = onSort;
  // Récupérez la liste des options de tri
  // Ajoutez un gestionnaire d'événement à chaque option de tri
  bindEvents();
}

function open() {
  document
    .querySelector(optionsContainerSelector)
    ?.classList.add("sort-options--open");
}

function close() {
  document
    .querySelector(optionsContainerSelector)
    ?.classList.remove("sort-options--open");
}

function bindEvents() {
  // Event sélection d'un choix
  document.querySelectorAll(optionsSelector).forEach((option) => {
    option.addEventListener("click", () => {
      if (!isOpen) return;

      close();
      const index = Array.from(
        document.querySelectorAll(optionsSelector)
      ).indexOf(option);

      if (index === 0) return;

      document.querySelector(optionsContainerSelector)?.prepend(option);

      // Appelez la fonction de tri avec la valeur sélectionnée
      const selectedValue = option.getAttribute("data-filter-value") as sortKey;
      onSortCallbackFunction(selectedValue);
    });

    // Ajoutez un gestionnaire d'événements pour la touche "Entrée"
    option.addEventListener("keydown", (event) => {
      if ((event as KeyboardEvent).key === "Enter") {
        if (!isOpen) return;

        close();
        const index = Array.from(
          document.querySelectorAll(optionsSelector)
        ).indexOf(option);

        if (index === 0) return;

        document.querySelector(optionsContainerSelector)?.prepend(option);

        // Appelez la fonction de tri avec la valeur sélectionnée
        const selectedValue = option.getAttribute(
          "data-filter-value"
        ) as sortKey;
        onSortCallbackFunction(selectedValue);
      }
    });
  });

  // Event ouverture de la liste
  document.querySelector(buttonSelector)?.addEventListener("click", () => {
    isOpen = !isOpen;

    if (isOpen) open();
    else close();
  });
}
