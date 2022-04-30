let news = [];
let menuBtn = document.querySelectorAll('.menus button');
let searchButton = document.getElementById('search-button');
let url;

// url rendering 중복되는 부분 리팩토링
const renderData = async () => {
    try {
        let header = new Headers({'x-api-key': 'ldTppI2IrqmzZ1XRZ2qVZ-WQnQCfNlXwrJq9sSwSYfM'});
        let response = await fetch(url, {headers:header});
        let data = await response.json();
        if(response.status === 200) {
            if(data.total_hits === 0) {
                throw new Error("검색된 결과값이 없습니다.")
            }
            news = data.articles;
            console.log(news);
        }   else {
            throw new Error(data.message);
        }

        news = data.articles;
        console.log(news);

        render()
    }   catch(error) {
        console.log("잡힌 에러는 ", error.message);
        errorRender(error.message);
    }

}
// 맨처음 디폴트 페이지로 sport topic을 보여준다.
menuBtn.forEach(menu => menu.addEventListener("click", (event) => getNewsByTopic(event)))
const getLatestNews = async() => {
    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=sport&page_size=10`)
    //new URL = url을 분석해줌
    console.log(url);

    renderData()
};

// 검색으로 뉴스 찾기
const getUseByKeyWord = async () => {
    let keyword = document.getElementById('search').value;
    url = new URL(`https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`)

    renderData();
}

// 버튼에 맞는 topic을 찾기
const getNewsByTopic = async (event) => {
    let topic = event.target.textContent.toLowerCase();
    console.log(topic);
    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`)

    renderData();
}

// 랜더할 div부분
const render = () => {
    let newsHTML = ''
    newsHTML = news.map(item => {
        return  `<div class="row news">
                <div class="col-lg-4">
                    <img class="news-img-size" src="${item.media}" />
                </div>
                <div class="col-lg-8">
                    <h2>${item.title}</h2>
                    <p>
                        ${item.summary}
                    </p>
                    <div>
                        ${item.rights} * ${item.published_date}
                    </div>
                </div>
            </div>`
    }).join('') //join은 array를 string으로 변환시켜줌


    document.getElementById("news-board").innerHTML = newsHTML;
}

const errorRender = (message) => {
    let errorHTML = `<div class="alert alert-danger text-center" role="alert">
                        ${message}
                     </div>`
    document.getElementById("news-board").innerHTML = errorHTML;
}
searchButton.addEventListener('click', getUseByKeyWord);
getLatestNews()