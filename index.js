window.onload=()=>{
    añadir=document.getElementById("añadir");
    titulo=document.getElementById("Titulo");
    autor=document.getElementById("Autor");
    genero=document.getElementById("Genero");
    librosSection=document.getElementById("libros");
    actualizar=document.getElementById("actualizar");
    libroDiv=document.getElementById("libro");
    siguiente=document.getElementById("flechaDer");
    anterior=document.getElementById("flechaIzq");
    leer=document.getElementById("leer");
    seleccionar=document.getElementById("seleccionar");
    fecha=document.getElementById("fecha");
    error=document.getElementById("error");
    leidos=document.getElementById("leidos");
    sinleer=document.getElementById("sinleer");
    actual=document.getElementById("actual");

    añadir.addEventListener("click", añadirLibro);
    actualizar.addEventListener("click", mostrarLibroActual);
    siguiente.addEventListener("click", mostrarSiguiente);
    anterior.addEventListener("click", mostrarAnterior);
    leer.addEventListener("click", marcarLeido);
    seleccionar.addEventListener("click", seleccionarActual);

    libros = [
        libro1=new Book("Libro1", "genero", "autor"),
        libro2=new Book("Libro2", "genero", "autor", true, new Date(Date.now())),
        libro3=new Book("Libro3", "genero", "autor"),
        libro4=new Book("Libro4", "genero", "autor", true, new Date(Date.now())),
        libro5=new Book("Libro5", "genero", "autor"),
        libro6=new Book("Libro6", "genero", "autor"),
        libro7=new Book("Libro7", "genero", "autor") ]

    listaLibros=new Booklist(libros);
    indice=listaLibros.getIndex();

    error.style.display="none"
    leidos.innerHTML="Leidos: "+listaLibros.getReadBooks()
    sinleer.innerHTML="No leidos: "+listaLibros.getNotReadBooks()
    actual.innerHTML=listaLibros.getActualBook().getTitle();

    mostrarLibroActual();
}

class Booklist{
    constructor(books=[]){
        this.books=books;
        this.readBooks=(books.filter((book)=>book.read==true)).length;
        this.notReadBooks=(books.filter((book)=>book.read==false)).length;
        this.index=books.indexOf(books.find((book)=>book.read==false));
        this.actualBook=books[this.index];
        this.lastBook=null;
        this.nextBook=this.books.find((book, indice)=>book.read==false && indice!=this.index)
    }

    add(book){
        this.books.push(book);
        if (book.read==false){
            this.notReadBooks+=1;
        } else {
            this.readBooks+=1;
        }
        if (this.books.indexOf(book)==0){
            this.actualBook=book;
        }
    }

    finishCurrentBook(){
        if (this.actualBook.read!=true){
            this.readBooks++;
            this.notReadBooks--;
            this.actualBook.read=true;
            this.actualBook.readDate=new Date(Date.now());
            this.lastBook=this.actualBook;
        } else {
            console.log("Ya te has terminado el libro actual.")
        }
        
        if (this.nextBook==undefined){
            console.log("No hay más libros por leer, añade más libros para seguir leyendo");
        } else {
            this.actualBook=this.nextBook;
            this.index=this.books.indexOf(this.actualBook);
            this.nextBook=this.books.find((book, indice)=>book.read==false && indice!=this.index)
        }
        
    }

    getIndex(){
        return this.index;
    }

    setActual(indice){
        this.index=indice;
        this.actualBook=this.books[indice];
        this.nextBook=this.books.find((book, indice)=>book.read==false && indice!=this.index)
    }

    getActualBook(){
        return this.actualBook;
    }

    getBook(indice){
        return this.books[indice];
    }

    getBooks(){
        return this.books;
    }

    getReadBooks(){
        return this.readBooks
    }

    getNotReadBooks(){
        return this.notReadBooks
    }
}

class Book{

    constructor(title, genre, author, read=false, readDate=null){
        this.title=title;
        this.genre=genre;
        this.author=author;
        this.read=read;
        this.readDate=readDate;
    }

    getTitle(){
        return this.title;
    }

    getGenre(){
        return this.genre;
    }

    getAuthor(){
        return this.author;
    }
    
    getReadDate(){
        return this.readDate.getDate()+"/"+this.readDate.getMonth()+"/"+this.readDate.getFullYear();
    }

    isRead(){
        return this.read;
    }

}


function añadirLibro(){
    if (titulo.value!="" && genero.value!="" && autor.value!=""){
        libro = new Book(titulo.value, genero.value, autor.value);

        listaLibros.add(libro);

        error.style.display="none"
        titulo.value="";
        genero.value="";
        autor.value="";

        leidos.innerHTML="Leidos: "+listaLibros.getReadBooks()
        sinleer.innerHTML="No leidos: "+listaLibros.getNotReadBooks()

        libroActual=listaLibros.getActualBook();
        indice=listaLibros.getIndex();
    

        if(libroActual.isRead()){
            listaLibros.setActual(listaLibros.getBooks().length-1);
        }

    } else {
        error.style.display="block"
    }
    
}

function mostrarLibroActual(){
    libroActual=listaLibros.getActualBook();
    indice=listaLibros.getIndex();
    

    if(!libroActual.isRead()){
        seleccionar.style.display="none"
        leer.style.display="block"
        fecha.style.display="none"
    } else {
        seleccionar.style.display="none"
        leer.style.display="none"
        fecha.style.display="block";
        fecha.innerHTML=libroActual.getReadDate();
    }

    tituloActual=libroActual.getTitle();
    generoActual=libroActual.getGenre();
    autorActual=libroActual.getAuthor();

    libroDiv.innerHTML="<h2>"+tituloActual+"</h2><h4>"+generoActual+"</h4><h4>"+autorActual+"</h4>"
}

function mostrarSiguiente(){
    if(indice!=(listaLibros.getBooks().length-1)) {
        leer.style.display="block"
        indice+=1
        libroSiguiente=listaLibros.getBook(indice);

        if(indice==listaLibros.getIndex()){
            leer.style.display="block"
            fecha.style.display="none"
        } else {
            seleccionar.style.display="block"
            fecha.style.display="none"
        }

        if (libroSiguiente.isRead()==true){
            leer.style.display="none"
            seleccionar.style.display="none"
            fecha.style.display="block";
            fecha.innerHTML=libroSiguiente.getReadDate();
        }

        tituloActual=libroSiguiente.getTitle();
        generoActual=libroSiguiente.getGenre();
        autorActual=libroSiguiente.getAuthor();

        libroDiv.innerHTML="<h2>"+tituloActual+"</h2><h4>"+generoActual+"</h4><h4>"+autorActual+"</h4>"
    }
    
}

function mostrarAnterior(){
    if (indice!=0) {
        fecha.style.display="none"
        indice-=1
        libroAnterior=listaLibros.getBook(indice);

        if(indice==listaLibros.getIndex()){
            leer.style.display="block"
        } else {
            leer.style.display="none"
            seleccionar.style.display="block"
        }

        if (libroAnterior.isRead()==true){
            leer.style.display="none"
            seleccionar.style.display="none"
            fecha.style.display="block";
            fecha.innerHTML=libroAnterior.getReadDate();
        }
    
        tituloActual=libroAnterior.getTitle();
        generoActual=libroAnterior.getGenre();
        autorActual=libroAnterior.getAuthor();
    
        libroDiv.innerHTML="<h2>"+tituloActual+"</h2><h4>"+generoActual+"</h4><h4>"+autorActual+"</h4>"
    }
    
}

function marcarLeido(){
    listaLibros.finishCurrentBook();
    leer.style.display="none"
    seleccionar.style.display="none"
    fecha.style.display="block";
    fecha.innerHTML=listaLibros.getBook(indice).getReadDate();
    leidos.innerHTML="Leidos: "+listaLibros.getReadBooks()
    sinleer.innerHTML="No leidos: "+listaLibros.getNotReadBooks()
    actual.innerHTML=listaLibros.getActualBook().getTitle();
}

function seleccionarActual(){
    listaLibros.setActual(indice);
    mostrarLibroActual()
    actual.innerHTML=listaLibros.getActualBook().getTitle();
}


