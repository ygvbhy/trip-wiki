export default function RegionList({ $app, initialState, handleRegion }) {
  this.state = initialState;
  this.handleRegion = handleRegion;
  this.$target = document.createElement("div");
  this.$target.className = "region-list";

  $app.appendChild(this.$target);

  this.template = () => {
    const regionList = [
      "🚀 All",
      "🌏 Asia",
      "🕌 Middle-East",
      "🇪🇺 Europe",
      "💃 Latin-America",
      "🐘 Africa",
      "🏈 North-America",
      "🏄 Oceania",
    ];
    const { region } = this.state;
    let temp = ``;

    regionList.forEach((item) => {
      let regionId = item.split(" ")[1];
      temp += `<div id=${regionId}>${item}</div>`;
    });

    return temp;
  };

  this.render = () => {
    this.$target.innerHTML = this.template();
    if (this.state) {
      let $currentRegion = document.getElementById(this.state);
      $currentRegion && ($currentRegion.className = "clicked");
    } else {
      document.getElementById("All").className = "clicked";
    }

    const $regionList = this.$target.querySelectorAll("div");
    $regionList.forEach((elm) => {
      elm.addEventListener("click", () => {
        this.handleRegion(elm.id);
      });
    });
  };

  this.setState = (newState) => {
    this.state = newState;
    this.render();
  };

  this.render();
}
