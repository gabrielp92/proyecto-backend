class Usuario
{
    constructor(nombre,apellido)
    {
        this.nombre = nombre
        this.apellido = apellido
        this.libros = []
        this.mascotas = []
    }

    //Retorna el nombre completo del usuario.
    getFullName()
    {
        return `${this.nombre} ${this.apellido}`
    }

    //Recibe un nombre de mascota y lo agrega al array de mascotas.
    addMascota(nombreMascota)
    {
        this.mascotas.push(nombreMascota)
    }

    //Retorna la cantidad de mascotas que tiene el usuario.
    countMascotas()
    {
        return this.mascotas.length
    }

    /**Recibe un string 'nombre' y un string 'autor' y agrega un objeto: { nombre: String, autor: String } 
    al array de libros.*/
    addBook(nombre, autor)
    {
        this.libros.push({nombre,autor})
    }

    //Retorna un array con sólo los nombres del array de libros del usuario.
    getBookNames()
    {
        return this.libros.map( ({nombre}) => { return nombre}) 
    }
}

//----------------------------------------------------------------------------------------

const primerUsuario = new Usuario('gabriel','paez')
console.log('usuario: ' + primerUsuario.getFullName())
primerUsuario.addMascota('perro')
primerUsuario.addMascota('gato')
primerUsuario.addMascota('caballo')
primerUsuario.addMascota('conejo')
console.log('cantidad de mascotas del usuario: ' + primerUsuario.countMascotas())
primerUsuario.addBook('1984','George Orwell')
primerUsuario.addBook('Frankenstein','Mary Shelley')
primerUsuario.addBook('Hamlet','William Shakespeare')
primerUsuario.addBook('Drácula','Bram Stoker')
primerUsuario.addBook('Edipo Rey','Sófocles')
console.log(primerUsuario.getBookNames())