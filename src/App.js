import Header from "./components/Header.js";
import RegionList from "./components/RegionList.js";
import CityList from "./components/CityList.js";
import CityDetail from "./components/CityDetail.js";
import { request } from "./components/api.js";

export default function App($app) {
  // 주소창에 검색 파라미터가 있는 경우 해당 부분 뽑아서 state 에 설정
  const getSortBy = () => {
    if (window.location.search) {
      return window.location.search.split("sort=")[1].split("&")[0];
    }
    return "total";
  };
  const getSearchWord = () => {
    if (window.location.search && window.location.search.includes("search")) {
      return window.location.search.split("search=")[1];
    }
    return "";
  };

  this.state = {
    startIdx: 0,
    sortBy: getSortBy(),
    searchWord: getSearchWord(),
    region: "",
    cities: "",
    currentPage: window.location.pathname,
  };

  const renderHeader = () =>
    new Header({
      $app,
      initialState: {
        sortBy: this.state.sortBy,
        searchWord: this.state.searchWord,
      },
      // 정렬 기준 바뀌면 리스트 새롭게 불러오기
      handleSortChange: async (sortBy) => {
        const pageUrl = `/${this.state.region}?sort=${sortBy}`;
        history.pushState(
          null,
          null,
          this.state.searchWord
            ? pageUrl + `&search=${this.state.searchWord}`
            : pageUrl
        );
        const cities = await request(
          0,
          this.state.region,
          sortBy,
          this.state.searchWord
        );
        this.setState({
          ...this.state,
          startIdx: 0,
          sortBy,
          cities: cities,
        });
      },
      // 검색 한 키워드가 있다면 리스트 불러오기
      handleSearch: async (searchWord) => {
        history.pushState(
          null,
          null,
          `/${this.state.region}?sort=${this.state.sortBy}&search=${searchWord}`
        );
        const cities = await request(
          0,
          this.state.region,
          this.state.sortBy,
          searchWord
        );
        this.setState({
          ...this.state,
          startIdx: 0,
          searchWord,
          cities: cities,
        });
      },
    });
  const renderRegionList = () =>
    new RegionList({
      $app,
      initialState: this.state.region,
      handleRegion: async (region) => {
        history.pushState(null, null, `/${region}?sort=total`);
        const cities = await request(0, region, "total");
        this.setState({
          ...this.state,
          startIdx: 0,
          sortBy: "total",
          region,
          searchWord: "",
          cities: cities,
        });
      },
    });
  const renderCityList = () =>
    new CityList({
      $app,
      initialState: this.state.cities,
      handleLoadMore: async () => {
        const newStartIdx = this.state.startIdx + 40;
        const newCities = await request(
          newStartIdx,
          this.state.region,
          this.state.sortBy,
          this.state.searchWord
        );
        this.setState({
          ...this.state,
          startIdx: newStartIdx,
          cities: {
            cities: [...this.state.cities.cities, ...newCities.cities],
            isEnd: newCities.isEnd,
          },
        });
      },
      handleItemClick: (id) => {
        history.pushState(null, null, `/city/${id}`);
        this.setState({
          ...this.state,
          currentPage: `/city/${id}`,
        });
      },
    });
  const renderCityDetail = () => new CityDetail();

  this.setState = (newState) => {
    this.state = newState;
    render();
  };

  const render = () => {
    const path = this.state.currentPage;
    $app.innerHTML = "";
    if (path.startsWith("/city/")) {
      renderHeader();
      renderCityDetail();
    } else {
      renderHeader();
      renderRegionList();
      renderCityList();
    }
  };

  // 뒤로 가기, 앞으로 가기 할 경우 실행 할 함수
  window.addEventListener("popstate", async () => {
    const urlPath = window.location.pathname;

    const prevRegion = urlPath.replace("/", "");
    const prevSortBy = getSortBy();
    const prevSearchWord = getSearchWord();
    const prevStartIdx = 0;
    const prevCities = await request(
      prevStartIdx,
      prevRegion,
      prevSortBy,
      prevSearchWord
    );

    this.setState({
      ...this.state,
      startIdx: prevStartIdx,
      region: prevRegion,
      sortBy: prevSortBy,
      searchWord: prevSearchWord,
      cities: prevCities,
      currentPage: urlPath,
    });
  });

  const init = async () => {
    const path = this.state.currentPage;
    $app.innerHTML = "";
    if (path.startsWith("/city/")) {
      render();
    } else {
      const cities = await request(
        this.state.startIdx,
        this.state.region,
        this.state.sortBy,
        this.state.searchWord
      );
      this.setState({
        ...this.state,
        cities: cities,
      });
    }
  };

  init();
}
