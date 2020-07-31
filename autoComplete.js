const createAutoComplete = ({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
  fetchData,
}) => {
  root.innerHTML = `
<label><b>Search</b></label>
<input class="input"/>
<div class="dropdown">
<div class="dropdown-menu">
  <div class="dropdown-content results">
  </div>
</div>
</div>
`;

  const input = root.querySelector("input");
  const dropdown = root.querySelector(".dropdown");
  const resultsWrapper = root.querySelector(".results");

  let onInput = async (event) => {
    const items = await fetchData(event.target.value);
    //Closing Dropdown When no item is there
    if (items.length === 0) {
      dropdown.classList.remove("is-active");
      return;
    }

    resultsWrapper.innerHTML = "";
    dropdown.classList.add("is-active");
    for (let item of items) {
      let option = document.createElement("a");
      option.classList.add("dropdown-item");
      option.innerHTML = renderOption(item);
      resultsWrapper.appendChild(option);
      //Updating Input Area & Closing dropdown when  a specific item is clicked
      option.addEventListener("click", () => {
        dropdown.classList.remove("is-active");
        input.value = inputValue(item);
        onOptionSelect(item);
      });
    }
  };
  input.addEventListener("input", debounce(onInput, 500));

  //Dropdown Disappears on click
  document.addEventListener("click", (event) => {
    if (!root.contains(event.target)) dropdown.classList.remove("is-active");
  });
};
