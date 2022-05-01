let news = [];
let page = 1;
let total_pages = 0;
let menuBtn = document.querySelectorAll('.menus button');
let searchButton = document.getElementById('search-button');
let url;

// url rendering 중복되는 부분 리팩토링
const renderData = async () => {
    try {
        let header = new Headers({'x-api-key': 'ldTppI2IrqmzZ1XRZ2qVZ-WQnQCfNlXwrJq9sSwSYfM'});
        url.searchParams.set('page', page);//&page=
        console.log('url은', url)
        let response = await fetch(url, {headers:header});
        let data = await response.json();
        if(response.status === 200) {
            if(data.total_hits === 0) {
                throw new Error("검색된 결과값이 없습니다.")
            }
            news = data.articles;
            total_pages = data.total_pages;
            page = data.page;
            console.log(news);

            render();
            pageNation();
        }   else {
            throw new Error(data.message);
        }
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

    renderData();
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



const pageNation = () => {
    // page group
    let pageGroup  = Math.ceil(page/5)
//last
    let last = pageGroup*5
//first
    let first = last - 4
    let pagenationHTML = '';
    if(first >= 6) {
        pagenationHTML = `<li class="page-item">
          <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${1})">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li><li class="page-item">
          <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${page-1})">
            <span aria-hidden="true">&lt;</span>
          </a>
        </li>`;
    }
    // if(page === 1) {
    //     pagenationHTML = ''
    // }


    if(page === total_pages) {
        last = total_pages;
    }

    //first~last 페이지 프린트
    for(let i = first; i<=last; i++) {
        pagenationHTML += `<li class="page-item ${page === i ? "active" : ""}"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`
    }
    if(last < total_pages) {
        pagenationHTML += `<li class="page-item">
          <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${page + 1})">
            <span aria-hidden="true">&gt;</span>
          </a>
        </li>
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${total_pages})">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>`;
    }
    document.querySelector('.pagination').innerHTML = pagenationHTML;
}

const moveToPage = (pageNum) => {
    //1. 이동하고 싶은 페이지를 알아야된다.
    page = pageNum;
    //2. 이동하고싶은 페이지를 가지고 api를 다시 호출해주자
    renderData();
}

searchButton.addEventListener('click', getUseByKeyWord);
getLatestNews()