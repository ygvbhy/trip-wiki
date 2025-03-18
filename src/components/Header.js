export default function Header({
  $app,
  initialState,
  handleSortChange,
  handleSearch,
}) {
  this.state = initialState;
  this.handleSortChange = handleSortChange;
  this.handleSearch = handleSearch;
  this.$target = document.createElement("div");
  this.$target.className = "header";

  $app.appendChild(this.$target);

  this.template = () => {
    const { sortBy, searchWord, currentPage } = this.state;

    let temp = `
      <div class="title">
        <a href="/">✈️ Trip Wiki</a>
      </div>
      `;
    if (!currentPage.includes("/city/"))
      temp += `
      <div class="filter-search-container">
        <div class="filter">
          <select id="sortList" class="sort-list">
            <option value="total" 
            ${sortBy === "total" ? "selected" : ""}>
              Total
            </option>
            <option value="cost" 
            ${sortBy === "cost" ? "selected" : ""}>
              Cost
            </option>
            <option value="fun" 
            ${sortBy === "fun" ? "selected" : ""}>
              Fun
            </option>
            <option value="safety" 
            ${sortBy === "safety" ? "selected" : ""}>
              Safety
            </option>
            <option value="internet" 
            ${sortBy === "internet" ? "selected" : ""}>
              Internet
            </option>
            <option value="air" 
            ${sortBy === "air" ? "selected" : ""}>
              Air Quality
            </option>
            <option value="food" 
            ${sortBy === "food" ? "selected" : ""}>
              Food
            </option>
          </select>
        </div>
        <div class="search">
          <input type="text" placeholder="Search by city name" id="search" autocomplete="off" value="${searchWord}" />
        </div>
      </div>
    `;

    return temp;
  };

  this.render = () => {
    this.$target.innerHTML = this.template();
    if (!this.state.currentPage.includes("/city/")) {
      document.getElementById("sortList").addEventListener("change", (e) => {
        this.handleSortChange(e.target.value);
      });

      const $searchInput = document.getElementById("search");
      $searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          this.handleSearch($searchInput.value);
        }
      });
    }
  };

  this.setState = (newState) => {
    this.state = newState;
    this.render();
  };

  this.render();
}
