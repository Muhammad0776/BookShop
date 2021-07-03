const baseUrl = `https://api.nytimes.com/svc/books/v3`;
const apiKey = `0nG5do2caU59G7F2PT1eRQD0RAsaX5Du`;

const getList = async () => {
    try {
        const res = await axios.get(`${baseUrl}/lists/names.json?api-key=${apiKey}`);

        return { success: true, data: res.data };
    } catch (error) {
        console.error("xatolik sodir bo'ldi: " + error);
        return { success: false };
    }
};

const loading = document.getElementById("loading");
const error = document.getElementById("error");
const list = document.getElementById("list");

let activeLink;

const setList = async () => {
    list.innerHTML = "";

    loading.classList.remove("d-none");
    error.classList.add("d-none");
    list.classList.add("d-none");

    const res = await getList();
    loading.classList.add("d-none");

    if (res.success) {
        list.classList.remove("d-none");

        res.data.results.map((v, i) => {
            const a = document.createElement("a");
            a.href = `#${v.list_name_encoded}`;
            a.className = `list-group-item list-group-item-action`;

            a.onclick = (event) => {



                activeLink?.classList?.remove("active");
                activeLink = event.target;
                event.target.classList.add("active");
                setBooks(v)
            }
            a.innerHTML = `${v.list_name}
            <p class="d-flex justify-content-between align-items-center m-0 mt-2">


                            <span><i class="far me-1 fa-calendar-alt"></i>${v.newest_published_date}</span>
                            <span class="badge bg-warning text-dark ms-3">${v.updated}</span>
                        </p>`



            list.appendChild(a);
        });

        setBooks(res.data.results[0]);
    } else {
        error.classList.remove("d-none");
    }
};

setList();

const getBooks = async (list_name_encoded) => {




    try {
        const res = await axios.get(`${baseUrl}/lists/current/${list_name_encoded}.json?api-key=${apiKey}`);

        return { success: true, data: res.data };
    } catch (error) {
        console.error("xatolik sodir bo'ldi: " + error);
        return { success: false };
    }
};



const loading2 = document.getElementById("loading2");
const error2 = document.getElementById("error2");
const books = document.getElementById("books");
const listName = document.getElementById("list-name");
const modalBody = document.getElementById("modalBody");

var myModal = new bootstrap.Modal(document.getElementById('productDetail'), {
    keyboard: false
});

const getBuyLinks = (links) => {
    let strLinks = ``;
    links.map((v, i) => {
        strLinks += `<a href="${v.url}" class="list-group-item list-group-item-action">
           <i class="fas fa-link"></i> ${v.name}</a>`;
    });



    return strLinks;
}

const showDetail = (book_uri) => {
    let selectedBook;
    for (let i = 0; i < booksArray.length; i++) {
        if (booksArray[i].book_uri === book_uri) {
            selectedBook = booksArray[i];
            break;
        }

    }


    modalBody.innerHTML = `
   <div class="row mb-4">
   <div class="col-md-5">
       <img src="${selectedBook.book_image}"
           class="dddd rounded" alt="Book image">
   </div>
   <div class="col-md-7">
       <h3 class="text-info">Book Title: ${selectedBook.title}</h3>

       <p>Author: <span class="fw-bold">${selectedBook.author}</span></p>

       <p class="text-secondary">${selectedBook.description}
       </p>

       <p>Isbn10: ${selectedBook.primary_isbn10}</p>
       <p>Isbn13: ${selectedBook.primary_isbn13}</p>
       <p>Publisher: ${selectedBook.publisher}</p>
       <p>Price: <span class="text-warning">${selectedBook.price}</span></p>
       <p>Rank last week: ${selectedBook.rank_last_week}</p>
       <p>Weeks on list: ${selectedBook.weeks_on_list}</p>
   </div>
 </div>

 <p class="fw-bold">Buy links: </p>
 <div class="list-group buy-links list-group-horizontal flex-wrap">
    ${getBuyLinks(selectedBook.buy_links)}
   
  </div>
   `;
    myModal.show();
};


const mapBooks = (searchStr) => {

    books.innerHTML = "";

    searchStr = searchStr.toLowerCase();

    const filteredArray = booksArray.filter((v, i) => {
        const title = v.title.toLowerCase().indexOf(searchStr) != -1;
        const author = v.author.toLowerCase().indexOf(searchStr) != -1;
        const price = v.price.toLowerCase().indexOf(searchStr) != -1;


        return title || author || price;
    });

    filteredArray.map((v, i) => {
        const book = document.createElement("div");
        book.href = `#${v.list_name_encoded}`;
        book.className = `col-6 col-md-4 col-lg-3 mb-3`;


        book.innerHTML = `
        <div class="rounded shadow bg-white p-3 h-100 d-flex flex-column justify-content-between">
                            <div>
                                <img src="${v.book_image}" alt=""
                                    class="w-100 rounded">

                                <p class="fw-bold mb-2 mt-4 title">${v.title}</p>
                                <p class="text-secondary">${v.author}</p>
                                <p>Price: <span class="text-warning">${v.price}</span></p>
                            </div>
                            <div class="d-flex">
                                <a href="${v.amazon_product_url}"
                                    class="btn btn-dark d-block w-100 rounded me-1">Buy</a>
                                <button class="btn btn-warning d-block w-100 rounded ms-1" data-bs-toggle="modal"
                                 onclick="showDetail('${v.book_uri}')"   >More</button>
                            </div>







                        </div>`



        books.appendChild(book);
    });
}

let booksArray;

const setBooks = async (obj) => {

    books.innerHTML = "";

    loading2.classList.remove("d-none");
    error2.classList.add("d-none");
    books.classList.add("d-none");



    const res = await getBooks(obj.list_name_encoded);

    if (res.success) {
        booksArray = res.data.results.books;

        listName.innerHTML = `Bo'lim: ${obj.list_name}`;

        books.classList.remove("d-none");


        mapBooks("");




    }
    else {
        error2.classList.remove("d-none");
    }

    loading2.classList.add("d-none");


};

//Qidirish

const searchInput = document.getElementById("searchInput")

const search = () => {



    mapBooks(searchInput.value);
}